const Message = require('../models/Message');
const User = require('../models/User');  // ✅ Add this
const Doctor = require('../models/Doctor'); // if you have this model

exports.sendMessage = async (req, res) => {
  try {
    // Extract the necessary fields from the request body
    const { receiverId, receiverModel, content } = req.body;

    // Ensure content and receiver are provided
    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    // Get sender ID and model (User or Doctor)
    const senderId = req.user._id;
    const senderModel = req.role === 'doctor' ? 'Doctor' : 'User';

    // Determine chatId for the conversation
    const chatId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;

    // Create a new message in the database
    const message = await Message.create({
      sender: senderId,
      senderModel,
      receiver: receiverId,
      receiverModel,
      content,
      chatId,
    });

    // Emit the message to the receiver via WebSocket
    const io = req.app.get('io');
    io.to(receiverId).emit('receiveMessage', message);

    // Respond with the created message
    res.status(201).json(message);
  } catch (err) {
    // Catch and log any errors
    console.error(err);
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
};



exports.getMessages = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $project: {
          sender: 1,
          receiver: 1,
          content: 1,
          createdAt: 1,
          read: 1,
          senderModel: 1,
          receiverModel: 1,
          otherParticipant: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          otherModel: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiverModel',
              '$senderModel'
            ]
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$otherParticipant',
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    // Optionally populate participant data
    const detailedConversations = await Promise.all(
      conversations.map(async (conv) => {
        let participant;

        if (conv.lastMessage.otherModel === 'Doctor') {
          participant = await Doctor.findById(conv._id).select('name email');
        } else {
          participant = await User.findById(conv._id).select('name email');
        }

        return {
          participant,
          lastMessage: conv.lastMessage
        };
      })
    );

    res.json(detailedConversations);
  } catch (err) {
    console.error('❌ Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};