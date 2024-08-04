const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    id: Number,
    title: String,
    url: String,
    isAdmin: Boolean,
  });

  const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
