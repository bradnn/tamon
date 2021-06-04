/**
 * @file Pay module for UserClass.
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
      * @classdesc Pay module for UserClass.
      * 
      * @param {Document} model A user model from MongoDB.
      */
    constructor(model) {
        user = model;
    }

    /**
     * Check if the user can pay a specified amount.
     * 
     * @param {number} amount Amount to check.
     * @returns {object} Object containing details on if the user can pay or not (.canPay == true | false)
     */
    canPay(amount) {
        const USER_LIMIT = 500000;
        const previousPay = user.profile.commands.pay.limitDate;
        const time = new Date();
        const timePassed = Math.abs(previousPay - time);
        if (user.profile.commands.pay.transactionLimit + amount > USER_LIMIT) {
            if (timePassed > 86400000) {
                user.profile.commands.pay.limitDate = time;
                userprofile.commands.pay.transactionLimit = 0
                return {
                    canPay: true,
                    limit: USER_LIMIT
                }
            }
            return {
                canPay: false,
                limit: USER_LIMIT
            }
        }
        if (timePassed > 86400000) {
            user.profile.commands.pay.limitDate = time;
            user.profile.commands.pay.transactionLimit = 0
        }

        return {
            canPay: true,
            limit: USER_LIMIT
        }
    }

    /**
     * Gets the total amount paid.
     * 
     * @returns {number} Amount sent.
     */
    getPaySent() {
        return user.profile.commands.pay.totalSent;
    }

    /**
     * Gets the total amount recieved.
     * 
     * @returns {number} Amount recieved.
     */
    getPayRecieved() {
        return user.profile.commands.pay.totalReceived;
    }

 }