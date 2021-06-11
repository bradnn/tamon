const Event = require("../../structures/Event");

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            event: "message"
        });
    }

    async run(msg) {
        if (msg.channel.type == 1 || msg.author.bot) { return; } // Disable Dm commands and bot executing.
        
        const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
        if (msg.content.match(mentionRegex)) msg.channel.send(`My prefix is \`${guild.getPrefix()}\`.`);

        const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);
        const prefix = msg.content.match(mentionRegexPrefix) ? msg.content.match(mentionRegexPrefix)[0] : "!";
        if (!msg.content.startsWith(prefix)) return;
        if(prefix.match(mentionRegexPrefix)) {
            msg.mentions.splice(0,1);
        }


        const data = {};

        const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        if (command) {
            try {
                this.client.logger.command(`Command ${prefix}${cmd} ran by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`);
                await command.run(msg, args, data);
            } catch (e) {
                msg.channel.send({
                    embed: {
                        title: `There was an error running ${command}.`,
                        description: `If this error presists please join our discord server [here](https://discord.gg/yJt6kgNmjg).`
                    }
                });
                this.client.logger.error(`Command ${prefix}${cmd} ran by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\n${e.message}\n${e.stack}`);
            }
        }
    }
}