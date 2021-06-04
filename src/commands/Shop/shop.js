const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");

module.exports = class {
    constructor() {
        this.cmd = 'shop',
        this.aliases = ['market', 'store']
    }

    async run(client, msg, args, options) {

        switch (args[0]) {
            case "stats":
            case "info": {
                
                break;
            }
            default: {
                const itemList = client.items.array();
                const items = [];
                for (var item in itemList) {
                    if (itemList[item].display === true) {
                        items.push(itemList[item]);
                    }
                }
        
                const itemAmount = items.length;
                const pageCount = Math.ceil(itemAmount / 5);
                var shopString = ``;
        
                var pageChosen = parseInt(args[0]);
        
                if (!pageChosen || isNaN(pageChosen) || pageChosen < 1) {
                    pageChosen = 1;
                }
                if (pageChosen > pageCount) {
                    pageChosen = pageCount;
                }
        
                for (var i = 1; i <= 5; i++) {
                    const index = i + (pageChosen * 5) - 6;
                    const displayItem = items[index];
        
                    if(displayItem) {
                        shopString += `${displayItem.emoji} **${displayItem.name}**: **\`${Number.comma(displayItem.price.buy)} coins\`**\nTier: ${String.capitalize(displayItem.tier)} **-** ${displayItem.category} item\n${displayItem.description}\n\n`;
                    }
                }
        
                msg.channel.send({ embed: {
                    title: `Shop **-** Page ${pageChosen}`,
                    description: shopString,
                    timestamp: new Date(),
                    footer: {
                        text: `${msg.author.username}'s shop • ${options.prefix}shop 1-${pageCount}`,
                        icon_url: msg.author.avatarURL()
                    },
                    color: client.colors.default
                }});
                break;
            }
        }
        return;
    }
}