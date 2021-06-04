/**
 * @file Fish command module for UserClass.
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
      * @classdesc Fish command module for UserClass.
      * 
      * @param {Document} model A user model from MongoDB.
      */
    constructor(model) {
        user = model;
    }

    /**
     *  Amount of this type of fish the user has caught.
     * 
     * @param {object} fish Fish object.
     * @returns {number} Catch count.
     */
    getCaught(fish) {
        if (!user.profile.commands.fish.fishCaught[fish.name]) {
            user.profile.commands.fish.fishCaught[fish.name] = 0;
            return 0;
        }
        return user.profile.commands.fish.fishCaught[fish.name];
    }

    /**
     * Add to the amount of this fish that the user has caught.
     * 
     * @param {object} fish Fish object.
     * @param {*} [amount=1] Amount of catches to add.
     * @returns {number} Amount of total catches.
     */
    addCaught(fish, amount = 1) {
        if (!user.profile.commands.fish.fishCaught[fish.name]) {
            user.profile.commands.fish.fishCaught[fish.name] = 0;
        }
        return user.profile.commands.fish.fishCaught[fish.name] += amount;
    }

    /**
     * Get the amount of times the user has fished.
     * 
     * @returns {number} Times fished.
     */
    getCount() {
        return user.profile.commands.fish.count;
    }

    /**
     * Add to the amount of times a user has fished.
     * 
     * @param {number} [amount=1] Amount to add
     * @returns {number} Times fished.
     */
    addCount(amount = 1) {
        user.profile.commands.fish.rodUses += amount;
        return user.profile.commands.fish.count += amount;
    }
 }