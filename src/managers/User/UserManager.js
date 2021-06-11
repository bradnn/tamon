/**
 * @file Main user manager
 * @author bradnn
 * @version 2.0.0
 * @since 2.0.0
 */

const { User } = require("discord.js");
const { Document } = require("mongoose");
const UserStructure = require("../../models/User");

const Tamon = require("../../client/Tamon");
const UserEconomyManager = require("./UserEconomyManager");
const UserWorkManager = require("./UserWorkManager");
const UserBegManager = require("./UserBegManager");

/**
 * @typedef {object} Tamon
 * @typedef {object} UserEconomyManager
 * @typedef {object} UserWorkManager
 * @typedef {object} UserBegManager
 */


/**
 * The manager for Tamon user's
 * @extends {UserStructure.User}
 */
class UserManager extends UserStructure.User {
    /**
     * Main user manager
     * @param {Tamon} client Tamon client
     * @param {User} user Discord user object
     * @param {Document} model 
     */
    constructor(client, user, model) {
        super({client, user, model});
    }

    /**
     * The user economy manager
     * @type {UserEconomyManager}
     */
    get economy() {
        return new UserEconomyManager(this);
    }

    /**
     * The user work manager
     * @type {UserWorkManager}
     */
    get work() {
        return new UserWorkManager(this);
    }

    /**
     * The beg command manager
     * @type {UserBegManager}
     */
    get beg() {
        return new UserBegManager(this);
    }
}

module.exports = UserManager;