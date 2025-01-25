const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    permissions: [String], // List of permissions assigned to this role
});

module.exports = mongoose.model('Role', roleSchema);
