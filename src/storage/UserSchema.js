const { Schema, model } = require('mongoose');

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
            fish: {
                rodUses: {
                    type: Number,
                    default: 0
                },
                count: {
                    type: Number,
                    default: 0
                },
                fishCaught: {
                    type: Object,
                    default: {}
                }
            },
            mine: {
                pickUses: {
                    type: Number,
                    default: 0
                },
                count: {
                    type: Number,
                    default: 0
                },
                oresMined: {
                    type: Object,
                    default: {}
                }
            },
            shop: {
                amountSpent: {
                    type: Number,
                    default: 0
                },
                amountEarned: {
                    type: Number,
                    default: 0
                },
                itemsSold: {
                    type: Number,
                    default: 0
                },
                itemsBought: {
                    type: Number,
                    default: 0
                }
            },
            pay: {
                transactionLimit: {
                    type: Number,
                    default: 0
                },
                limitDate: {
                    type: Date,
                    default: 0
                },
                totalSent: {
                    type: Number,
                    default: 0
                },
                totalReceived: {
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
                    },
                    largestWin: {
                        type: Number,
                        default: 0
                    },
                    largestLoss: {
                        type: Number,
                        default: 0
                    }
                },
                flip: {
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
                    },
                    largestWin: {
                        type: Number,
                        default: 0
                    },
                    largestLoss: {
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
        },
        inventory: {
            type: Object,
            default: {}
        },
        pets: {
            active: {
                type: String,
                default: "None"
            },
            storage: {
                type: Object,
                default: {}
            }
        },
        buffs: {
            type: Object,
            default: {}
        }
    }
});

module.exports = model("user", user);