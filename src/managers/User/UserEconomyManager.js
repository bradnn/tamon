const UserStructure = require("../../models/User");
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

    get pocketMax() {
        return this.model.profile.pocket.max;
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
        this.client.logger.economy(`Added ${amount} coins to ${this.user.username} (${this.user.id}), new balance: $${this.model.profile.pocket.amount}`);
        return this.model.profile.pocket.amount;
    }

    /**
     * 
     * @param {number} amount 
     * @returns {?number} Users new balance
     */
    delPocket(amount = 1) {
        if (typeof amount != Number) {
            amount = parseInt(amount);
        }
        if (isNaN(amount)) {
            return null;
        }
        this.model.profile.pocket.amount -= amount;
        this.client.logger.economy(`Removed ${amount} coins from ${this.user.username} (${this.user.id}), new balance: $${this.model.profile.pocket.amount}`);
        return this.model.profile.pocket.amount;
    }

    /**
     * @type {number}
     */
    get bank() {
        return this.model.profile.bank.amount;
    }

    /**
     * @type {number}
     */
    get bankMax() {
        return this.model.profile.bank.max;
    }

    /**
     * 
     * @param {number} amount 
     * @returns {?number} Users new bank balance
     */
    addBank(amount = 1) {
        if (typeof amount != Number) {
            amount = parseInt(amount);
        }
        if (isNaN(amount)) {
            return null;
        }
        this.model.profile.bank.amount += amount;
        this.client.logger.economy(`Added ${amount} coins to ${this.user.username} (${this.user.id})'s bank, new balance: $${this.model.profile.bank.amount}`);
        return this.model.profile.bank.amount;
    }

    /**
     * 
     * @param {number} amount 
     * @returns {?number} Users new bank balance
     */
    delBank(amount = 1) {
        if (typeof amount != Number) {
            amount = parseInt(amount);
        }
        if (isNaN(amount)) {
            return null;
        }
        this.model.profile.bank.amount -= amount;
        this.client.logger.economy(`Removed ${amount} coins from ${this.user.username} (${this.user.id})'s bank, new balance: $${this.model.profile.bank.amount}`);
        return this.model.profile.bank.amount;
    }
}

module.exports = UserEconomyManager