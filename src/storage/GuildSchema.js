const { Schema, model } = require('mongoose');

const guild = Schema({
    guildID: String,
    prefix: {
        type: String,
        default: "t!"
    }
});

module.exports = model("guild", guild);