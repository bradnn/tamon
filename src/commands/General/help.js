module.exports = class {
    constructor() {
        this.cmd = 'help',
        this.aliases = ['what', 'whatis']
    }

    async run(client, msg, args, options) {
        msg.channel.send({ embed: {
            title: `Tamon Help Menu`,
            description: `Quickstart guide [here](https://docs.bradn.dev/tamon/)`,
            color: client.colors.default,
            fields: [
                {
                    name: `Pet Information`,
                    value: `[View info here](https://docs.bradn.dev/tamon/pets)`
                }
            ]
        }});
    }
}