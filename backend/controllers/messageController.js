const Message = require('../models/Message');

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
