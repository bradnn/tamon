/**
 * @file UserClass for easy database manipulation
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

const EconomyClass = require('./User/Economy.js');
const WorkClass = require('./User/Work.js');
const BegClass = require('./User/Beg.js');
const CooldownClass = require('./User/Cooldown.js');
const GamblingClass = require('./User/Gambling/Main.js');
const InventoryClass = require('./User/Inventory.js');
const ShopClass = require('./User/Shop.js');
const FishClass = require('./User/Fish.js');
const MineClass = require('./User/Mine.js');
const PayClass = require('./User/Pay.js');
const PetClass = require('./User/Pet.js');
const BuffClass = require('./User/Buff.js');

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
 * @typedef {object} PayClass
 * @typedef {object} PetClass
 * @typedef {object} BuffClass
 */

const { User } = require("discord.js");
const { Document } = require("mongoose");

/*
 * THE BOTS CLIENT
 */
const { Client } = require("../bot");
const client = Client.get();

/*
 * MODULES USED
 */
const { error } = require("../modules/Logger");

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
    }
    
    /**
     * 
     * @returns {EconomyClass}
     */
    economy() {
        return new EconomyClass(this.model);
    }

    /**
     * 
     * @returns {WorkClass}
     */
    work() {
        return new WorkClass(this.model, client);
    }

    /**
     * 
     * @returns {BegClass}
     */
    beg() {
        return new BegClass(this.model);
    }

    /**
     * 
     * @returns {CooldownClass}
     */
    cooldown() {
        return new CooldownClass(this.model, client, this.user);
    }

    /**
     * 
     * @returns {GamblingClass}
     */
    gambling() {
        return new GamblingClass(this.model);
    }

    /**
     * 
     * @returns {InventoryClass}
     */
    inventory() {
        return new InventoryClass(this.model, client);
    }

    /**
     * 
     * @returns {ShopClass}
     */
    shop() {
        return new ShopClass(this.model);
    }

    /**
     * 
     * @returns {FishClass}
     */
    fish() {
        return new FishClass(this.model);
    }

    /**
     * 
     * @returns {MineClass}
     */
    mine() {
        return new MineClass(this.model);
    }

    /**
     * 
     * @returns {PayClass}
     */
    pay() {
        return new PayClass(this.model);
    }

    /**
     * 
     * @returns {PetClass}
     */
    pet() {
        return new PetClass(this.model, client);
    }

    /**
     * 
     * @returns {BuffClass}
     */
    buff() {
        return new BuffClass(this.model);
    }

    get() {
                /** @type {EconomyClass} */
        this.economy = new EconomyClass(this.model);

        /** @type {WorkClass} */
        this.work = new WorkClass(this.model, client);

        /** @type {BegClass} */
        this.beg = new BegClass(this.model);

        /** @type {CooldownClass} */
        this.cooldown = new CooldownClass(this.model, client, this.user);

        /** @type {GamblingClass} */
        this.gambling = new GamblingClass(this.model);

        /** @type {InventoryClass} */
        this.inventory = new InventoryClass(this.model, client);

        /** @type {ShopClass} */
        this.shop = new ShopClass(this.model);

        /** @type {FishClass} */
        this.fish = new FishClass(this.model);

        /** @type {MineClass} */
        this.mine = new MineClass(this.model);

        /** @type {PayClass} */
        this.pay = new PayClass(this.model);

        /** @type {PetClass} */
        this.pet = new PetClass(this.model, client);

        /** @type {BuffClass} */
        this.buff = new BuffClass(this.model);
        return {
            economy: new EconomyClass(this.model),
            work: new WorkClass(this.model, client),
            beg: new BegClass(this.model),
            cooldown: new CooldownClass(this.model, client, this.user),
            gambling: new GamblingClass(this.model),
            inventory: new InventoryClass(this.model, client),
            shop: new ShopClass(this.model),
            fish: new FishClass(this.model),
            mine: new MineClass(this.model),
            pay: new PayClass(this.model),
            pet: new PetClass(this.model),
            buff: new BuffClass(this.model),
        }
    }

    // economy = new EconomyClass(this.model);
    // work = new WorkClass(this.model, client);
    // beg = new BegClass(this.model);
    // cooldown = new CooldownClass(this.model, client, this.user);
    // gambling = new GamblingClass(this.model);
    // inventory = new InventoryClass(this.model, client);
    // shop = new ShopClass(this.model);
    // fish = new FishClass(this.model);
    // mine = new MineClass(this.model);
    // pay = new PayClass(this.model);
    // pet = new PetClass(this.model);
    // buff = new BuffClass(this.model);

    // DATABASE MANIPULATION 

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