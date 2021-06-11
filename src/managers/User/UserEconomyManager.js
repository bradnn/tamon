/**
 * @file User economy manager
 * @author bradnn
 * @version 2.0.0
 * @since 2.0.0
 */

const UserStructure = require("../../structures/User");
const UserManager = require("./UserManager");

/**
 * User economy manager
 * @extends {UserStructure.User}
 */
class UserEconomyManager extends UserStructure.User {
    /**
     * User economy manager
     * @param {UserManager} User The main user manager
     */
    constructor(User) {
        super(User);
    }

    /**
     * The user's balance
     * @type {number}
     */
    get balance() {
        return this.model.profile.pocket.amount;
    }

    /**
     * 
     * @param {number} amount 
     * @returns {?number} Users new balance
     */
    addPocket(amount = 1) {
        if (typeof amount != Number) {
            amount = parseInt(amount);
        }
        if (isNaN(amount)) {
            return null;
        }
        this.model.profile.pocket.amount += amount;
        return this.model.profile.pocket.amount;
    }
}

module.exports = UserEconomyManager