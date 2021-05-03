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

        /** @type {PayClass} */
        this.pay = new PayClass(model);

        /** @type {PetClass} */
        this.pet = new PetClass(model);

        /** @type {BuffClass} */
        this.buff = new BuffClass(model);
    }

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