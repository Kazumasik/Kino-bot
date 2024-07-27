const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    admin_id: { type: Number, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
