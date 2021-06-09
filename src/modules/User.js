const { Client } = require("../bot");
const userSchema = require("../storage/UserSchema.js");
const userClass = require("../classes/UserClass");
const client = Client.get();

const { User } = require("discord.js");
const { Document } = require("mongoose");

module.exports.User = {
    /**
     * @typedef {object} userClass
     */

    /**
     * Gets the user's class.
     * 
     * @param {User} user 
     * @returns {userClass} userClass instance.
     */
    get: async function (user) { // Returns user class.
        if (client.members.get(user.id)) { // Does the class already exist in members collection?
            return client.members.get(user.id); // Return class if it does
        }

        let lookup = await userSchema.findOne({userID: user.id}, function (err, res) { // Request user model from database.
            if (err) throw err;
            if (res) return res;
        });
        if (!lookup) { lookup = await this.create(user.id) }; // If the user doesn't exist, create it.
        const newUser = new userClass(user, lookup); // Call the class with user and model.
        client.members.set(user.id, newUser); // Add the class to the members collection.
        return newUser;
    },

    /**
     * Add the user to the database.
     * 
     * @param {string} id The user's discord ID.
     * @returns {Document} Returns the users MongoDB Document.
     */
    create: async function (id) {
        return await userSchema.create({ // Creates a new model in the database
            userID: id
        });
    }
}