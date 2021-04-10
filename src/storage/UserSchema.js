const { Schema, model } = require('mongoose');
const { Number } = require('../modules/Number');

const user = Schema({
    userID: String,
    profile: {
        balance: {
            type: Number,
            default: 500
        },
        commands: {
            work: {
                job: {
                    type: String,
                    default: "Voice Actor"
                },
                count: {
                    type: Number,
                    default: 0
                },
                coinsEarned: {
                    type: Number,
                    default: 0
                },
                todaysWorks: {
                    type: Number,
                    default: 0
                },
                lastWorkDay: {
                    type: Date,
                    default: 0
                },
                fires: {
                    type: Object,
                    default: {}
                }
            },
            beg: {
                count: {
                    type: Number,
                    default: 0
                },
                coinsEarned: {
                    type: Number,
                    default: 0
                }
            },
            gambling: {
                roll: {
                    wins: {
                        type: Number,
                        default: 0
                    },
                    amountWon: {
                        type: Number,
                        default: 0
                    },
                    losses: {
                        type: Number,
                        default: 0
                    },
                    amountLost: {
                        type: Number,
                        default: 0
                    }
                }
            },
            cooldowns: {
                type: Object,
                default: {
                    work: 0
                }
            }
        }
    }
});

module.exports = model("user", user);