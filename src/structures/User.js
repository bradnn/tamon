const { Schema, model } = require('mongoose');

class User {
    constructor({client, user, model}) {
        this.client = client;
        this.user = user;
        this.model = model;
    }

    async save() {
        this.model.markModified('profile.commands.cooldowns');
        await this.model.save();
        return;
    }
}

const UserSchema = Schema({
    id: String,
    profile: {
        pocket: {
            amount: {
                type: Number,
                default: 500
            },
            max: {
                type: Number,
                default: 5000000
            }
        },
        commands: {
            beg: {
                count: {
                    type: Number,
                    default: 0
                },
                earned: {
                    type: Number,
                    default: 0
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

module.exports = {
    User,
    UserSchema: model("UserSchema", UserSchema)
}