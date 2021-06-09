/**
 * @file Mine command module for UserClass.
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

 const { Document } = require("mongoose");

 /** @type {Document} The MongoDB user model */
 var user;
 
 module.exports = class {
     /**
      * Sets the variable user to a user model from MongoDB.
      * 
      * @class
      * @classdesc Mine command module for UserClass.
      * 
      * @param {Document} model A user model from MongoDB.
      */
    constructor(model) {
        user = model;
    }

    /**
     * Get the amount mined of a specific ore.
     * 
     * @param {object} ore Ore object.
     * @returns {number} Amount of this ore the user has mined.
     */
    getOreCount(ore) {
        if (!user.profile.commands.mine.oresMined[ore.name]) {
            user.profile.commands.mine.oresMined[ore.name] = 0;
            return 0;
        }
        return user.profile.commands.mine.oresMined[ore.name];
    }

    /**
     * Add to the amount mined of a specified ore.
     * 
     * @param {object} ore Ore object.
     * @param {number} [amount=1] Amount to add to this ore.
     * @returns {number} Final amount.
     */
    addOreCount(ore, amount = 1) {
        if (!user.profile.commands.mine.oresMined[ore.name]) {
            user.profile.commands.mine.oresMined[ore.name] = 0;
        }
        return user.profile.commands.mine.oresMined[ore.name] += amount;
    }

    /**
     * Get how many times a user has mined.
     * 
     * @returns {number} Times mined.
     */
    getCount() {
        return user.profile.commands.mine.count;
    }

    /**
     * Add to the times a user has mined.
     * 
     * @param {number} [amount=1] Amount to add.
     * @returns {number} Final amount.
     */
    addCount(amount = 1) {
        user.profile.commands.mine.pickUses += amount;
        return user.profile.commands.mine.count += amount;
    }
 }