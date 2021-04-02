const { Client } = require("../bot");
const guildSchema = require("../storage/GuildSchema.js");
const guildClass = require("../classes/GuildClass");
const client = Client.get();

module.exports.Guild = {
    get: async function (guild) {
        if (client.servers.get(guild.id)) {
            return client.servers.get(guild.id);
        }

        let lookup = await guildSchema.findOne({guildID: guild.id}, function (err, res) {
            if (err) throw err;
            if (res) return res;
        });
        if (!lookup) { lookup = await this.create(guild.id) };
        const newGuild = new guildClass(guild, lookup);
        client.servers.set(guild.id, newGuild);
        return newGuild;
    },
    create: async function (id) {
        return await guildSchema.create({
            guildID: id
        });
    }
}