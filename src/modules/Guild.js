const { Client } = require("../bot");
const guildSchema = require("../storage/GuildSchema.js");
const guildClass = require("../classes/GuildClass");
const client = Client.get();

module.exports.Guild = {
    get: async function (guild) { // Returns guild class
        if (client.servers.get(guild.id)) { // Does the class already exist in servers collection?
            return client.servers.get(guild.id); // Return class if it does
        }

        let lookup = await guildSchema.findOne({guildID: guild.id}, function (err, res) { // Request guild model from database.
            if (err) throw err;
            if (res) return res;
        });
        if (!lookup) { lookup = await this.create(guild.id) }; // If the guild doesn't exist, create it.
        const newGuild = new guildClass(guild, lookup); // Call the class with guild and model.
        client.servers.set(guild.id, newGuild); // Add the class to the servers collection.
        return newGuild;
    },
    create: async function (id) {
        return await guildSchema.create({ // Creates a new model in the database
            guildID: id
        });
    }
}