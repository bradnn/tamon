/**
 * @file Basic economy functions for the UserClass.
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

const { Document } = require("mongoose");

/** @const {object} Number A module containing number formatting functions */
const { Number } = require("../../modules/Number");

/** @type {Document} The MongoDB user model */
var user;

module.exports = class {
    /**
     * Sets the variable user to a user model from MongoDB.
     * 
     * @class
     * @classdesc The economy module of the UserClass.
     * 
     * @param {Document} model A user model from MongoDB
     */
    constructor(model) {
        user = model; // Sets the user to the model from MongoDB
    }

    /**
     * Returns the users balance as a number or string.
     * 
     * @param {boolean} [format=false] Should the number be formatted into a string?
     * @returns {(number|string)} The users balance or a string of the users balance formatted with commas.
     */
    get(format = false) {
        if (format) { return Number.comma(user.profile.balance); }
        return user.profile.balance;
    }

    /**
     * Adds a number of coins to a users balance.
     * 
     * @param {number} [amount=0] Amount of coins to add to the user.
     * @param {string} [cmd]      What command is adding the coins, could modify other values if needed.
     * @returns {number} The users final balance.
     */
    add(amount = 0, cmd) {
        user.profile.balance += amount;
        if (cmd) {
            switch (cmd) {
                case "work": {
                    user.profile.commands.work.coinsEarned += amount;
                    break;
                }
                case "beg": {
                    user.profile.commands.beg.coinsEarned += amount;
                    break;
                }
                case "roll": {
                    user.profile.commands.gambling.roll.amountWon += amount;
                    if (user.profile.commands.gambling.roll.largestWin < amount) {
                        user.profile.commands.gambling.roll.largestWin = amount;
                    }
                    break;
                }
                case "flip": {
                    user.profile.commands.gambling.flip.amountWon += amount;
                    if (user.profile.commands.gambling.flip.largestWin < amount) {
                        user.profile.commands.gambling.flip.largestWin = amount;
                    }
                    break;
                }
                case "sell": {
                    user.profile.commands.shop.amountEarned += amount;
                    break;
                }
                case "pay": {
                    user.profile.commands.pay.transactionLimit += amount;
                    user.profile.commands.pay.totalReceived += amount;
                    break;
                }
            }
        }
        return user.profile.balance;
    }


    /**
     * Removes a number of coins from a users balance.
     * 
     * @param {number} [amount=0] Amount of coins to remove from the user
     * @param {string} [cmd]      What command is removing the coins, could modify other values if needed.
     * @returns {number} The users final balance.
     */
    remove(amount = 0, cmd) {
        user.profile.balance -= amount;
        if (cmd) {
            switch (cmd) {
                case "roll": {
                    user.profile.commands.gambling.roll.amountLost += amount;
                    if (user.profile.commands.gambling.roll.largestLoss < amount) {
                        user.profile.commands.gambling.roll.largestLoss = amount;
                    }
                    break;
                }
                case "flip": {
                    user.profile.commands.gambling.flip.amountLost += amount;
                    if (user.profile.commands.gambling.flip.largestLoss < amount) {
                        user.profile.commands.gambling.flip.largestLoss = amount;
                    }
                    break;
                }
                case "buy": {
                    user.profile.commands.shop.amountSpent += amount;
                    break;
                }
                case "pay": {
                    user.profile.commands.pay.transactionLimit += amount;
                    user.profile.commands.pay.totalSent += amount;
                    break;
                }
            }
        }
        return user.profile.balance;
    }
}