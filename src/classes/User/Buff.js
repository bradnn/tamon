/**
 * @file Buff module for UserClass.
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
      * @classdesc Buff module for UserClass.
      * 
      * @param {Document} model A user model from MongoDB.
      */
    constructor(model) {
        user = model;
    }

    /**
     * Get a buff amount of a certain type.
     * 
     * @param {string} type Buff type.
     * @returns {number} Buff amount.
     */
    get(type) {
        if (!user.profile.buffs[type]) return 1;
        return user.profile.buffs[type];
    }

    /**
     * Add an amount to a user's buff.
     * 
     * @param {string} type Buff type.
     * @param {number} amount Amount to add.
     * @returns {number} Final buff amount.
     */
    add(type, amount) {
        if (!user.profile.buffs[type]) {
            user.profile.buffs[type] = 1;
        }
        return user.profile.buffs[type] += amount;
    }

    /**
     * Remove an amount from a user's buff.
     * 
     * @param {string} type Buff type.
     * @param {number} amount Amount to remove.
     * @returns {number} Final buff amount.
     */
    remove(type, amount) {
        if (!user.profile.buffs[type]) {
            user.profile.buffs[type] = 1;
        }
        return user.profile.buffs[type] -= amount;
    }

 }