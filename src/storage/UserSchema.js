const { Schema, model } = require('mongoose');

const user = Schema({
    userID: String,
});

module.exports = model("user", user);