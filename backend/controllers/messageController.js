const Message = require('../models/Message');
const User = require('../models/User');  // ✅ Add this
const Doctor = require('../models/Doctor'); // if you have this model

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverModel, content } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      senderModel: req.role === 'doctor' ? 'Doctor' : 'User',
      receiver: receiverId,
      receiverModel,
      content
    });

    const io = req.app.get('io');
    io.to(receiverId).emit('receiveMessage', message);

    res.status(201).json(message);
  } catch (err) {
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