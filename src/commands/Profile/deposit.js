const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "Deposit",
            description: "Deposit money to your bank",
            category: "Profile",
            cooldown: 0,
            aliases: ["dep"],
            ownerOnly: false,
            dirname: __filename
        });
    }

    /**
     * Execute the commmand.
     * 
     * @param {Message} msg Discord message object
     * @param {Array} args Array of arguments
     * @param {object} data Extra data provided by the message event
     * @returns {undefined}
     */
    async run (msg, args, data) {
        const userData = await this.client.getMember(msg.author);
        var amount = args[0];
        if (isNaN(parseInt(amount)) || parseInt(amount) < 0) { // If amount supplied is not a number
            msg.channel.send({
                embed: {
                    title: `${userData.user.username}'s Bank`,
                    description: `You didn't supply a valid amount to deposit`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${userData.user.username}'s bank`,
                        icon_url: userData.user.avatarURL()
                    },
                    color: this.client.colors.invalid
                }
            });
            return;
        }
        amount = parseInt(amount);
        if (amount > userData.economy.balance) { // If they don't have enough money
            msg.channel.send({
                embed: {
                    title: `${userData.user.username}'s Bank`,
                    description: `You don't have ${comma(amount)} coins to deposit`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${userData.user.username}'s bank`,
                        icon_url: userData.user.avatarURL()
                    },
                    color: this.client.colors.invalid
                }
            });
            return;
        }

        if (userData.economy.balance + amount > userData.economy.bankMax) { // If this would exceed the bank cap
            msg.channel.send({
                embed: {
                    title: `${userData.user.username}'s Bank`,
                    description: `Depositing ${comma(amount)} coins would exceed the max of ${comma(userData.economy.bankMax)}`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${userData.user.username}'s bank`,
                        icon_url: userData.user.avatarURL()
                    },
                    color: this.client.colors.invalid
                }
            });
            return;
        }

        userData.economy.delPocket(amount);
        userData.economy.addBank(amount);
        userData.save();
        msg.channel.send({
            embed: {
                title: `${userData.user.username}'s Bank`,
                description: `You have deposited **${comma(amount)} coins** and now have **${comma(userData.economy.bank)} coins** in your bank`,
                timestamp: Date.now(),
                footer: {
                    text: `${userData.user.username}'s bank`,
                    icon_url: userData.user.avatarURL()
                },
                color: this.client.colors.success
            }
        });
        return;
    }
}