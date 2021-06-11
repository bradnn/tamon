/**
 * @file User beg stats manager
 * @author bradnn
 * @version 2.0.0
 * @since 2.0.0
 */

const UserStructure = require("../../models/User");
const UserManager = require("./UserManager");

/**
 * User beg stats manager
 * @extends {UserStructure.user}
 */
class UserBegManager extends UserStructure.User {
    /**
     * User beg stats manager
     * @param {UserManager} User 
     */
    constructor(User) {
        super(User);
    }

    /**
     * Gives the amount of times the beg command has been successfully used.
     * @type {number}
     */
    get count() {
        return this.model.profile.commands.beg.count;
    }

    /**
     * Add a number to the times the beg command has been successfully used.
     * @param {number} [amount=1] Amount of counts of beg to add to the users stats.
     * @returns {number} Returns the final count of beg uses.
     */
    addCount(amount = 1) {
        this.model.profile.commands.beg.count += amount;
        return this.model.profile.commands.beg.count
    }

    /**
     * Get the amount of coins a user has earned from the beg command.
     * @type {number}
     */
    get earned() {
        return this.model.profile.commands.beg.earned;
    }

    /**
     * Adds to the amount of coins a user has earned from the beg command.
     * @param {number} [amount=1] Amount of coins to add to coins earned.
     * @returns {number} Returns the final amount of coins earned.
     */
    addEarned(amount = 1) {
        this.model.profile.commands.beg.earned += amount;
        return this.model.profile.commands.beg.earned
    }
}

module.exports = UserBegManager