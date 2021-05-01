const EconomyClass = require('./User/Economy.js');
const WorkClass = require('./User/Work.js');
const BegClass = require('./User/Beg.js');
const CooldownClass = require('./User/Cooldown.js');

/**
 * @typedef {object} EconomyClass
 * @typedef {object} WorkClass
 * @typedef {object} BegClass
 * @typedef {object} CooldownClass
 */

/**
 * THE BOTS CLIENT
 */
const { User } = require("discord.js");
const { Document } = require("mongoose");
const { Client } = require("../bot");
const client = Client.get();

/**
 * MODULES USED
 */
const { error } = require("../modules/Logger");
const { Time } = require("../modules/Time");

module.exports = class {
    /**
     * @class
     * @classdesc The user class used to easily modify the database.
     * 
     * @param {User} user 
     * @param {Document} model 
     */
    constructor(user, model) {
        this.id = user.id;
        this.user = user;
        this.model = model;

        /** @type {EconomyClass} */
        this.economy = new EconomyClass(model);
        /** @type {WorkClass} */
        this.work = new WorkClass(model, client);
        /** @type {BegClass} */
        this.beg = new BegClass(model);
        /** @type {CooldownClass} */
        this.cooldown = new CooldownClass(model, user);
    }

    // ==================================================================================
    // GAMBLING MANAGEMENT
    // ==================================================================================

    // ROLL COMMAND
    getRollAmountWon() {
        return this.model.profile.commands.gambling.roll.amountWon;
    }

    getRollAmountLost() {
        return this.model.profile.commands.gambling.roll.amountLost;
    }

    getRollWins() {
        return this.model.profile.commands.gambling.roll.wins;
    }

    addRollWin(amount = 1) {
        this.model.profile.commands.gambling.roll.wins += amount;
        return true;
    }

    getRollLosses() {
        return this.model.profile.commands.gambling.roll.losses;
    }

    addRollLoss(amount = 1) {
        this.model.profile.commands.gambling.roll.losses += amount;
        return true;
    }

    setRollLargestWin(amount = 1) {
        this.model.profile.commands.gambling.roll.largestWin = amount;
        return true;
    }

    getRollLargestWin() {
        return this.model.profile.commands.gambling.roll.largestWin;
    }

    setRollLargestLoss(amount = 1) {
        this.model.profile.commands.gambling.roll.largestLoss = amount;
        return true;
    }

    getRollLargestLoss() {
        return this.model.profile.commands.gambling.roll.largestLoss;
    }

    // FLIP COMMAND
    getFlipAmountWon() {
        return this.model.profile.commands.gambling.flip.amountWon;
    }
    
    getFlipAmountLost() {
        return this.model.profile.commands.gambling.flip.amountLost;
    }

    getFlipWins() {
        return this.model.profile.commands.gambling.flip.wins;
    }

    addFlipWin(amount = 1) {
        this.model.profile.commands.gambling.flip.wins += amount;
        return true;
    }

    getFlipLosses() {
        return this.model.profile.commands.gambling.flip.losses;
    }

    addFlipLoss(amount = 1) {
        this.model.profile.commands.gambling.flip.losses += amount;
        return true;
    }

    setFlipLargestWin(amount = 1) {
        this.model.profile.commands.gambling.flip.largestWin = amount;
        return true;
    }

    getFlipLargestWin() {
        return this.model.profile.commands.gambling.flip.largestWin;
    }

    setFlipLargestLoss(amount = 1) {
        this.model.profile.commands.gambling.flip.largestLoss = amount;
        return true;
    }

    getFlipLargestLoss() {
        return this.model.profile.commands.gambling.flip.largestLoss;
    }

    // ==================================================================================
    // INVENTORY MANAGEMENT
    // ==================================================================================

    addItem(item, amount = 1) {
        // MAKE SURE ITEM'S CATEGORY EXISTS IN USERS INVENTORY
        if (!this.model.profile.inventory[item.category]) {
            this.model.profile.inventory[item.category] = {};
        }
        // MAKE SURE THE ITEM EXISTS IN THE CATEGORY
        if (!this.model.profile.inventory[item.category][item.name]) {
            this.model.profile.inventory[item.category][item.name] = 0;
        }
        // ADD THE ITEM TO THE USER
        this.model.profile.inventory[item.category][item.name] += amount;
        return;
    }

    delItem(item, amount = 1) {
        // MAKE SURE ITEM'S CATEGORY EXISTS IN USERS INVENTORY
        if (!this.model.profile.inventory[item.category]) {
            this.model.profile.inventory[item.category] = {};
        }
        // MAKE SURE THE ITEM EXISTS IN THE CATEGORY
        if (!this.model.profile.inventory[item.category][item.name]) {
            this.model.profile.inventory[item.category][item.name] = 0;
            return false;
        }
        // REMOVE THE ITEM FROM THE USER
        this.model.profile.inventory[item.category][item.name] -= amount;
        return;
    }

    getItemCount(item) {
        // MAKE SURE ITEM'S CATEGORY EXISTS IN USERS INVENTORY
        if (!this.model.profile.inventory[item.category]) {
            this.model.profile.inventory[item.category] = {};
        }
        // MAKE SURE THE ITEM EXISTS IN THE CATEGORY
        if (!this.model.profile.inventory[item.category][item.name]) {
            this.model.profile.inventory[item.category][item.name] = 0;
            return 0;
        }
        // RETURN THE AMOUNT THE USER HAS
        return this.model.profile.inventory[item.category][item.name];
    }

    getTotalItemCount() {
        var count = 0;
        
        for (var category in this.model.profile.inventory) {
            for (var item in this.model.profile.inventory[category]) {
                count += this.model.profile.inventory[category][item];
            }
        }
        return count;
    }

    getTotalItemWorth() {
        var count = 0;
        
        for (var category in this.model.profile.inventory) {
            for (var item in this.model.profile.inventory[category]) {
                item = client.items.get(item.toLowerCase());
                if (item.price.worth) {
                    count += item.price.worth;
                }
            }
        }
        return count;
    }

    // ==================================================================================
    // SHOP MANAGEMENT
    // ==================================================================================

    getShopItemsBought() {
        return this.model.profile.commands.shop.itemsBought;
    }

    addShopItemsBought(amount = 0) {
        this.model.profile.commands.shop.itemsBought += amount;
        return;
    }

    getShopItemsSold() {
        return this.model.profile.commands.shop.itemsSold;
    }

    addShopItemsSold(amount = 0) {
        this.model.profile.commands.shop.itemsSold += amount;
        return;
    }

    // ==================================================================================
    // FISHING MANAGEMENT
    // ==================================================================================

    getFishCaught(fish) {
        // MAKE SURE ITEM'S CATEGORY EXISTS IN USERS INVENTORY
        // MAKE SURE THE ITEM EXISTS IN THE CATEGORY
        if (!this.model.profile.commands.fish.fishCaught[fish.name]) {
            this.model.profile.commands.fish.fishCaught[fish.name] = 0;
            return 0;
        }
        // RETURN THE AMOUNT THE USER HAS
        return this.model.profile.commands.fish.fishCaught[fish.name];
    }

    addFishCaught(fish, amount = 1) {
        // MAKE SURE ITEM'S CATEGORY EXISTS IN USERS INVENTORY
        // MAKE SURE THE ITEM EXISTS IN THE CATEGORY
        if (!this.model.profile.commands.fish.fishCaught[fish.name]) {
            this.model.profile.commands.fish.fishCaught[fish.name] = 0;
        }
        // RETURN THE AMOUNT THE USER HAS
        return this.model.profile.commands.fish.fishCaught[fish.name] += amount;
    }

    getTimesFished() {
        return this.model.profile.commands.fish.count;
    }

    addTimesFished(amount = 1) {
        this.model.profile.commands.fish.rodUses += amount;
        return this.model.profile.commands.fish.count += amount;
    }

    // ==================================================================================
    // MINING MANAGEMENT
    // ==================================================================================

    getOresMined(ore) {
        // MAKE SURE ITEM'S CATEGORY EXISTS IN USERS INVENTORY
        // MAKE SURE THE ITEM EXISTS IN THE CATEGORY
        if (!this.model.profile.commands.mine.oresMined[ore.name]) {
            this.model.profile.commands.mine.oresMined[ore.name] = 0;
            return 0;
        }
        // RETURN THE AMOUNT THE USER HAS
        return this.model.profile.commands.mine.oresMined[ore.name];
    }

    addOresMined(ore, amount = 1) {
        // MAKE SURE ITEM'S CATEGORY EXISTS IN USERS INVENTORY
        // MAKE SURE THE ITEM EXISTS IN THE CATEGORY
        if (!this.model.profile.commands.mine.oresMined[ore.name]) {
            this.model.profile.commands.mine.oresMined[ore.name] = 0;
        }
        // RETURN THE AMOUNT THE USER HAS
        return this.model.profile.commands.mine.oresMined[ore.name] += amount;
    }

    getTimesMined() {
        return this.model.profile.commands.mine.count;
    }

    addTimesMined(amount = 1) {
        this.model.profile.commands.mine.pickUses += amount;
        return this.model.profile.commands.mine.count += amount;
    }

    // ==================================================================================
    // PAY MANAGEMENT
    // ==================================================================================

    canPay(amount) {
        const USER_LIMIT = 500000;
        const previousPay = this.model.profile.commands.pay.limitDate;
        const time = new Date();
        const timePassed = Math.abs(previousPay - time);
        if (this.model.profile.commands.pay.transactionLimit + amount > USER_LIMIT) {
            if (timePassed > 86400000) {
                this.model.profile.commands.pay.limitDate = time;
                this.model.profile.commands.pay.transactionLimit = 0
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
            this.model.profile.commands.pay.limitDate = time;
            this.model.profile.commands.pay.transactionLimit = 0
        }

        return {
            canPay: true,
            limit: USER_LIMIT
        }
    }

    getPaySent() {
        return this.model.profile.commands.pay.totalSent;
    }

    getPayRecieved() {
        return this.model.profile.commands.pay.totalReceived;
    }

    // ==================================================================================
    // PET MANAGEMENT
    // ==================================================================================

    addPet(name) {
        var pet = client.pets.get(name);
        if (!pet) return "NO_PET";

        if (!this.model.profile.pets.storage[pet.name]) this.model.profile.pets.storage[pet.name] = 0;
        this.model.profile.pets.storage[pet.name] += 1;
    }

    delPet(name) {
        var pet = client.pets.get(name);
        if (!pet) return "NO_PET";

        if (!this.model.profile.pets.storage[pet.name]) return "NO_PET";
        this.model.profile.pets.storage[pet.name] -= 1;
    }

    getActivePet() {
        return this.model.profile.pets.active;
    }

    setActivePet(pet) {
        if (!this.model.profile.pets.storage[pet.name]) return "NO_PET";
        if (this.model.profile.pets.active != "None") {
            const oldPet = client.pets.get(this.model.profile.pets.active.toLowerCase());
            if (oldPet) {
                oldPet.unequipPet(this);
            }
        }
        pet.equipPet(this);
        this.model.profile.pets.active = pet.name;
        return pet;
    }

    // ==================================================================================
    // BUFF MANAGEMENT
    // ==================================================================================

    getBuff(type) {
        if (!this.model.profile.buffs[type]) return 1;
        return this.model.profile.buffs[type];
    }

    addBuff(type, amount) {
        if (!this.model.profile.buffs[type]) {
            this.model.profile.buffs[type] = 1;
        }
        return this.model.profile.buffs[type] += amount;
    }

    delBuff(type, amount) {
        if (!this.model.profile.buffs[type]) {
            this.model.profile.buffs[type] = 1;
        }
        return this.model.profile.buffs[type] -= amount;
    }

    // ==================================================================================
    // DB MANAGEMENT
    // ==================================================================================

    /**
     * Save to the database.
     * 
     * @returns {boolean} Was it successfully saved?
     */
    save() {
        try {
            this.model.markModified('profile.commands.work.fires');
            this.model.markModified('profile.commands.fish.fishCaught');
            this.model.markModified('profile.commands.ores.oresMined');
            this.model.markModified('profile.commands.cooldowns');
            this.model.markModified('profile.inventory');
            this.model.markModified('profile.pets');
            this.model.markModified('profile.buffs');
            this.model.save();
        } catch(e) {
            error(`Issue saving model. USER ID = ${this.id}\n${e}`);
            return false;
        }
        return true;
    }
}