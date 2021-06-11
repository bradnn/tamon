const Command = require("../structures/Command");


module.exports = class extends Command {
    constructor(client) {
        super (client, {
            name: "Test",
            description: "Test Command",
            category: "Other",
            cooldown: 5000,
            aliases: ["Test2", "Haha"],
            ownerOnly: false,
            dirname: __filename
        });
    }

    async run (msg, args, data) {

        if((await this.getCooldown(msg.author, true, msg)).response) return;

        const authorData = await this.client.getMember(msg.author);


        console.log(authorData.economy.balance);
        console.log(authorData.economy.addPocket(500));
        console.log(await authorData.save());

        msg.channel.send('dfghfdgh' + args);
    }
}