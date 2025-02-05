const mongoose = require('mongoose');

const itemTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: 'active' },
    // permissions: [String], // List of permissions assigned to this role
});

module.exports = mongoose.model('ItemType', itemTypeSchema);
