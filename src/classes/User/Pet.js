/**
 * @file Pet module for UserClass.
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

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
      * @classdesc Pet module for UserClass.
      * 
      * @param {Document} model A user model from MongoDB.
      */
    constructor(model, Client) {
        user = model;
        client = Client;
    }

    /**
     * Add a pet to the user.
     * 
     * @param {string} name Pet name.
     * @returns {string} Result code.
     */
    add(name) {
        var pet = client.pets.get(name);
        if (!pet) return "NO_PET";

        if (!user.profile.pets.storage[pet.name]) user.profile.pets.storage[pet.name] = 0;
        user.profile.pets.storage[pet.name] += 1;
        return "ADDED_PET";
    }

    /**
     * Remove a pet from the user.
     * 
     * @param {string} name Pet name.
     * @returns {string} Result code.
     */
    del(name) {
        var pet = client.pets.get(name);
        if (!pet) return "NO_PET";

        if (!user.profile.pets.storage[pet.name]) return "NO_PET";
        user.profile.pets.storage[pet.name] -= 1;
        return "REMOVED_PET";
    }

    /**
     * Get the user's current active pet.
     * 
     * @returns {string} Pet name.
     */
    getActive() {
        return user.profile.pets.active;
    }

    /**
     * Sets the user's current active pet.
     * 
     * @param {string} pet Pet name
     * @returns {string} Result code.
     */
    setActive(pet) {
        if (!user.profile.pets.storage[pet.name]) return "NO_PET";
        if (user.profile.pets.active != "None") {
            const oldPet = client.pets.get(user.profile.pets.active.toLowerCase());
            if (oldPet) {
                oldPet.unequipPet(this);
            }
        }
        pet.equipPet(this);
        user.profile.pets.active = pet.name;
        return "SET_PET";
    }

 }