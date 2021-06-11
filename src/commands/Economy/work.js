const { Message } = require("discord.js");
const Command = require("../../models/Command");
const { comma } = require("../../utils/Number");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "Work",
            description: "Work for money",
            category: "Economy",
            cooldown: 3600000,
            aliases: ["ork"],
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

        switch(args[0]?.toLowerCase()) {
            default: {
                if((await this.getCooldown(msg.author, true, msg)).response) return;
                
                const job = this.client.jobs.get(userData.work.job);

                const challenge = this.client.challenges.random();

                const result = await challenge.execute(msg, `${job.job.name} Work`, `${userData.user.username}'s work`);
                if (result.correct) {
                    userData.economy.addPocket(userData.work.pay);
                    userData.work.addCount();
                    var embed = {
                        title: `${job.job.name} Work`,
                        description: job.message.replace("%p", comma(userData.work.pay) + " coins"),
                        fields: [],
                        timestamp: Date.now(),
                        footer: {
                            text: `${userData.user.username}'s work`,
                            icon_url: userData.user.avatarURL()
                        },
                        color: this.client.colors.default
                    }
                    msg.channel.send({ embed });
                    break;
                }
            }
        }
        userData.save();
        return;
    }
}