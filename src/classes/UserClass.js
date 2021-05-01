const EconomyClass = require('./User/Economy.js');
const WorkClass = require('./User/Work.js');
const BegClass = require('./User/Beg.js');
const CooldownClass = require('./User/Cooldown.js');
const GamblingClass = require('./User/Gambling/Main.js');
const InventoryClass = require('./User/Inventory.js');
const ShopClass = require('./User/Shop.js');
const FishClass = require('./User/Fish.js');
const MineClass = require('./User/Mine.js');

/**
 * @typedef {object} EconomyClass
 * @typedef {object} WorkClass
 * @typedef {object} BegClass
 * @typedef {object} CooldownClass
 * @typedef {object} GamblingClass
 * @typedef {object} InventoryClass
 * @typedef {object} ShopClass
 * @typedef {object} FishClass
 * @typedef {object} MineClass
 */

/*
 * THE BOTS CLIENT
 */
const { User } = require("discord.js");
const { Document } = require("mongoose");
const { Client } = require("../bot");
const client = Client.get();

/*
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
        this.cooldown = new CooldownClass(model, client, user);

        /** @type {GamblingClass} */
        this.gambling = new GamblingClass(model);

        /** @type {InventoryClass} */
        this.inventory = new InventoryClass(model);

        /** @type {ShopClass} */
        this.shop = new ShopClass(model);

        /** @type {FishClass} */
        this.fish = new FishClass(model);

        /** @type {MineClass} */
        this.mine = new MineClass(model);
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