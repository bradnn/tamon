/**
 * @file Gambling container for gambling related functions
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

const { User } = require("discord.js");
const { Document } = require("mongoose");

const RollClass = require('./Roll.js');
const FlipClass = require('./Flip.js');

/**
 * @typedef {object} RollClass
 * @typedef {object} FlipClass
 */

/** @type {User} The user's discord object. */
var user;

module.exports = class {
    /**
     * Gambling container.
     * 
     * @class
     * @classdesc Contains gambling related functions.
     * 
     * @param {Document} model A user model from MongoDB.
     */
    constructor(model) {
        user = model;
    }

    roll() {
        return new RollClass(user);
    }

    flip() {
        return new FlipClass(user);
    }
}