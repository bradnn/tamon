const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User");
const UserSchema = require("../../storage/UserSchema");

module.exports = class {
    constructor() {
        this.cmd = 'baltop',
        this.aliases = ['balancetop', 'moneytop']
    }

    async run(client, msg, args, options) {

        async function getUser(ID) {
            return await client.users.fetch(ID);
        }

        await UserSchema.find({}).sort([['profile.balance', -1]]).exec(async function (err, docs) {
            if (err) throw err;
            var user1, user2, user3, user4, user5;
            user1 = await getUser(docs[0].userID);
            user2 = await getUser(docs[1].userID);
            user3 = await getUser(docs[2].userID);
            user4 = await getUser(docs[3].userID);
            user5 = await getUser(docs[4].userID);

            msg.channel.send({ embed: {
                title: `Top Balances`,
                description: `**#1** ${user1.username} 🪙 ${Number.comma(docs[0].profile.balance)}
**#2** ${user2.username} 🪙 ${Number.comma(docs[1].profile.balance)}
**#3** ${user3.username} 🪙 ${Number.comma(docs[2].profile.balance)}
**#4** ${user4.username} 🪙 ${Number.comma(docs[3].profile.balance)}
**#5** ${user5.username} 🪙 ${Number.comma(docs[4].profile.balance)}`,
                color: client.colors.default
            }});
            return;
        });
        return;
    }
}