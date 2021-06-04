/**
 * @file Beg command functions for the UserClass.
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

const { Document } = require("mongoose");

const { Number } = require("../../modules/Number");

/** @type {Document} The MongoDB user model */
var user;

module.exports = class {
    /**
     * Sets the variable user to a user model from MongoDB.
     * 
     * @class
     * @classdesc The beg command module of the UserClass.
     * 
     * @param {Document} model A user model from MongoDB.
     */
    constructor(model) {
        user = model; // Sets the user to the model from MongoDB
    }

    /**
     * Gives the amount of times the beg command has been successfully used.
     * 
     * @param {boolean} [format=false] Should the return be a number or a formatted number as a string.
     * @returns {(number|string)} The users balance as a number or a string.
     */
    getCount(format = false) {
        if (format) { return Number.comma(user.profile.commands.beg.count); }
        return user.profile.commands.beg.count;
    }

    /**
     * Add a number to the times the beg command has been successfully used.
     * 
     * @param {number} [amount=1] Amount of counts of beg to add to the users stats.
     * @returns {number} Returns the final count of beg uses.
     */
    addCount(amount = 1) {
        user.profile.commands.beg.count += amount;
        return user.profile.commands.beg.count;
    }

    /**
     * Get the amount of coins a user has earned from 
     * 
     * @returns {number} Amount of coins the user has earned.
     */
    getEarned() {
        return user.profile.commands.beg.coinsEarned;
    }
}