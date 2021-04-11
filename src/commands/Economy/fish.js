const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'fish',
        this.aliases = ['gofish']
    }

    async run(client, msg, args, options) {
        const user = await User.get(msg.author);

        switch(args[0]?.toLowerCase()) {
            case "inven":
            case "net":
            case "inventory":
            case "bag": {
                const freshwaterItem = client.items.get(`fish`);
                const tropicalItem = client.items.get(`tropical fish`);


            }
            default: {

            }
        }
    }
}