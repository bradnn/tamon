/**
 * @file Inventory module for UserClass.
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

 const { Client } = require("discord.js");
const { Document } = require("mongoose");

 /** @type {Document} The MongoDB user model */
 var user; 
 /** @type {Client} */
 var client;
 
 module.exports = class {
     /**
      * Sets the variable user to a user model from MongoDB.
      * 
      * @class
      * @classdesc Inventory module for UserClass.
      * 
      * @param {Document} model A user model from MongoDB.
      */
    constructor(model, Client) {
        user = model;
        client = Client;
    }

    /**
     * Add an item to a users inventory.
     * 
     * @param {object} item Item object.
     * @param {number} [amount=1] How many items to add.
     * @returns {boolean} Was the job successful or not.
     */
    add(item, amount = 1) {
        try {
            if (!user.profile.inventory[item.category]) {
                user.profile.inventory[item.category] = {};
            }
            if (!user.profile.inventory[item.category][item.name]) {
                user.profile.inventory[item.category][item.name] = 0;
            }
            user.profile.inventory[item.category][item.name] += amount;
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Remove an item from a users inventory.
     * 
     * @param {object} item Item object.
     * @param {number} [amount=1] How many items to remove.
     * @returns {boolean} Was the job successful or not.
     */
    remove(item, amount = 1) {
        try {
            if (!user.profile.inventory[item.category]) {
                user.profile.inventory[item.category] = {};
            }
            if (!user.profile.inventory[item.category][item.name]) {
                user.profile.inventory[item.category][item.name] = 0;
                return false;
            }
            user.profile.inventory[item.category][item.name] -= amount;
            return;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Get how many of an item a user has.
     * 
     * @param {object} item Item object.
     * @returns {number} Item amount.
     */
    getCount(item) {
        if (!user.profile.inventory[item.category]) {
            user.profile.inventory[item.category] = {};
        }
        if (!user.profile.inventory[item.category][item.name]) {
            user.profile.inventory[item.category][item.name] = 0;
            return 0;
        }
        return user.profile.inventory[item.category][item.name];
    }

    /**
     * Get how many total items a user has.
     * 
     * @returns {number} Item count.
     */
    getTotalCount() {
        var count = 0;
        for (var category in user.profile.inventory) {
            for (var item in user.profile.inventory[category]) {
                count += user.profile.inventory[category][item];
            }
        }
        return count;
    }

    /**
     * Get the worth of a users inventory.
     * 
     * @returns {number}
     */
    getWorth() {
        var count = 0;
        for (var category in user.profile.inventory) {
            for (var item in user.profile.inventory[category]) {
                item = client.items.get(item.toLowerCase());
                if (item.price.worth) {
                    count += item.price.worth;
                }
            }
        }
        return count;
    }
 }