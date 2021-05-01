/**
 * @file Flip module for the Gambling Container.
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
      * @classdesc Flip module for the Gambling Container.
      * 
      * @param {Document} model A user model from MongoDB.
      */
     constructor(model) {
         user = model;
     }
 
     /**
      * Returns the total amount a user has won from using the flip command.
      * 
      * @returns {number} Total coins won.
      */
     getAmountWon() {
         return user.profile.commands.gambling.flip.amountWon;
     }
 
     /**
      * Returns the total amount a user has lost from using the flip command.
      * 
      * @returns {number} Total coins lost.
      */
     getAmountLost() {
         return user.profile.commands.gambling.flip.amountLost;
     }
 
     /**
      * Returns the total times a user has won.
      * 
      * @returns {number} Total times won.
      */
     getWins() {
         return user.profile.commands.gambling.flip.wins;
     }
 
     /**
      * Add to the total times a user has won.
      * 
      * @param {number} [amount=1] Amount of wins to add, default 1 
      * @returns {number} Final amount of wins the user has.
      */
     addWins(amount = 1) {
         user.profile.commands.gambling.flip.wins += amount;
         return user.profile.commands.gambling.flip.wins;
     }
 
     /**
      * Returns the total times a user has lost.
      * 
      * @returns {number} Total times lost.
      */
     getLosses() {
         return user.profile.commands.gambling.flip.losses;
     }
 
     /**
      * Add to the total times a user has lost.
      * 
      * @param {number} [amount=1] Amount of losses to add, default 1 
      * @returns {number} Final amount of losses the user has.
      */
     addLoss(amount = 1) {
         user.profile.commands.gambling.flip.losses += amount;
         return user.profile.commands.gambling.flip.losses;
     }
 
     /**
      * Gets the largest amount a user has won from a single bet.
      * 
      * @returns {number} Largest win.
      */
     getLargestWin() {
         return user.profile.commands.gambling.flip.largestWin;
     }
 
     /**
      * Sets the largest amount a user has won from a single bet.
      * 
      * @param {number} [amount=1] Number to set the largest win to. 
      * @returns {number} New largest win.
      */
     setLargestWin(amount = 1) {
         user.profile.commands.gambling.flip.largestWin = amount;
         return user.profile.commands.gambling.flip.largestWin;
     }
 
     /**
      * Gets the largest amount a user has lost from a single bet.
      * 
      * @returns {number} Largest loss.
      */
     getLargestLoss() {
         return user.profile.commands.gambling.flip.largestWin;
     }
 
     /**
      * Sets the largest amount a user has lost from a single bet.
      * 
      * @param {number} [amount=1] Number to set the largest loss to. 
      * @returns {number} New largest loss.
      */
     setLargestLoss(amount = 1) {
         user.profile.commands.gambling.flip.largestLoss = amount;
         return true;
     }
 }