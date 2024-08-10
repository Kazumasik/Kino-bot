const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  _id: { type: String, default: "link" },
  customLink: { type: String, default: "" },
});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;
