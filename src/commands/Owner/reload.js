const Command = require("../../models/Command");
const { Message } = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "Reload",
            description: "Test Command",
            category: "Owner",
            cooldown: 0,
            aliases: ["ReloadCMD"],
            ownerOnly: true,
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
        if (this.isAdmin(msg.author)) {
            const command = args[0]?.toLowerCase();
            const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
            if(!cmd){
                msg.channel.send(`Couldn't find ${command}`);
                return;
            }
            console.log(cmd.command.dirname)
            const unload = await this.client.unloadCommand(cmd.command.dirname);
            if (unload) {
                console.log(unload);
            }
            await this.client.loadCommand(cmd.command.dirname);
            msg.channel.send(`reloaded`);
        }
    }
}