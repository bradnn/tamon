/**
 * @file Shop module for UserClass.
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
      * @classdesc Shop module for UserClass.
      * 
      * @param {Document} model A user model from MongoDB.
      */
    constructor(model) {
        user = model;
    }

    /**
     * Get the amount of items the user has bought from the shop.
     * 
     * @returns {number} Bought count.
     */
    getBoughtCount() {
        return user.profile.commands.shop.itemsBought;
    }

    /**
     * Add a number to the total amount of items the user has purchased from the shop
     * 
     * @param {number} [amount=1] Number to add to total count.
     * @returns {boolean} Was it succesfully added?
     */
    addBoughtCount(amount = 1) {
        try {
            user.profile.commands.shop.itemsBought += amount;
            return;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Get the amount of items the user has sold to the shop.
     * 
     * @returns {number} Sold count.
     */
    getSoldCount() {
        return user.profile.commands.shop.itemsSold;
    }

    /**
     * Add a number to the total amount of items the user has sold to the shop
     * 
     * @param {number} [amount=1] Number to add to total count.
     * @returns {boolean} Was it succesfully added?
     */
    addSoldCount(amount = 1) {
        try {
            user.profile.commands.shop.itemsSold += amount;
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
 }