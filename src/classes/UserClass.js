const { Client } = require("../bot");
const { error } = require("../modules/Logger");
const { Number } = require("../modules/Number");
const { String } = require("../modules/String");
const { Time } = require("../modules/Time");
const client = Client.get();

cooldowns = {
    work: 3600000,
    beg: 30000
}

module.exports = class {
    constructor(user, model) {
        this.id = user.id;
        this.user = user;
        this.model = model;
    }

    // ==================================================================================
    // COIN MANAGEMENT
    // ==================================================================================

    getCoins(format = false) {
        if (format) { return Number.comma(this.model.profile.balance); };
        return this.model.profile.balance;
    }

    addCoins(amount = 0, cmd) {
        this.model.profile.balance += amount;
        if (cmd) {
            switch (cmd) {
                case "work": {
                    this.model.profile.commands.work.coinsEarned += amount;
                    break;
                }
                case "beg": {
                    this.model.profile.commands.beg.coinsEarned += amount;
                    break;
                }
                case "roll": {
                    this.model.profile.commands.gambling.roll.amountWon += amount;
                    break;
                }
                case "sell": {
                    this.model.profile.commands.shop.amountEarned += amount;
                    break;
                }
            }
        }
        return this.model.profile.balance;
    }

    delCoins(amount = 0, cmd) {
        this.model.profile.balance -= amount;
        if (cmd) {
            switch (cmd) {
                case "roll": {
                    this.model.profile.commands.gambling.roll.amountLost += amount;
                    break;
                }
                case "buy": {
                    this.model.profile.commands.shop.amountSpent += amount;
                    break;
                }
            }
        }
        return this.model.profile.balance;
    }

    // ==================================================================================
    // WORK MANAGEMENT
    // ==================================================================================

    getPay() {
        var job = client.jobs.get(this.getJob());
        const JOB_PAY = job.salary;

        return JOB_PAY;
    }

    getJob() {
        return this.model.profile.commands.work.job;
    }

    setJob(job, fired = false) {
        if (fired) {
            try {
                this.model.profile.commands.work.fires[this.getJob()] = new Date();
            } catch (e) {
                error(`Issue changing job. USER ID = ${this.id}\n${e}`);
                return false;
            }
        }

        try {
            this.model.profile.commands.work.job = job;
        } catch (e) {
            error(`Issue changing job. USER ID = ${this.id}\n${e}`);
            return false;
        }
        return true;
    }

    getWorkAmountEarned() {
        return this.model.profile.commands.work.coinsEarned;
    }

    getWorkCount() {
        return this.model.profile.commands.work.count;
    }

    addWorkCount(amount = 1) {
        try {
            this.model.profile.commands.work.count += amount;
            this.model.profile.commands.work.lastWork = new Date();
        } catch (e) {
            error(`Issue changing work count. USER ID = ${this.id}\n${e}`);
            return false;
        }
        return true;
    }
    
    setWorkCount(amount = 0) {
        try {
            this.model.profile.commands.work.count = amount;
        } catch (e) {
            error(`Issue changing work count. USER ID = ${this.id}\n${e}`);
            return false;
        }
        return true;
    }

    wasFired(job) {
        const keys = Object.keys(this.model.profile.commands.work.fires);
        if (keys.includes(job.name)) {
            const time = new Date();
            const fireTime = this.model.profile.commands.work.fires[job.name];
            const timePassed = Math.abs(fireTime - time);
            if (timePassed <= 86400000) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    canApply(job) {
        if (job.unlockHours > this.getWorkCount()) {
            return false;
        }
        return true;
    }

    canWork() {
        const lastWorkDay = this.model.profile.commands.work.lastWorkDay;
        const DAY_LENGTH = 86400000;
        const date = new Date();
        const timeSince = Math.abs(lastWorkDay - date);
        if (lastWorkDay.getTime() === 0) {
            this.model.profile.commands.work.lastWorkDay = date;
            return true;
        }
        if (timeSince >= DAY_LENGTH) {
            const job = client.jobs.get(this.getJob())
            this.model.profile.commands.work.todaysWorks = 0;
            this.model.profile.commands.work.lastWorkDay = date;
            if (timeSince >= (DAY_LENGTH * 2) || this.model.profile.commands.work.todaysWorks < job.hourRequirement) {
                if (!job.hourRequirement < 1) {
                    this.setJob("None", true);
                }
                return false;
            }
            return true;
        }
        return true;
    }

    // ==================================================================================
    // BEG MANAGEMENT
    // ==================================================================================

    getBegCount() {
        return this.model.profile.commands.beg.count;
    }

    addBegCount(amount = 1) {
        try {
            this.model.profile.commands.beg.count += amount;
        } catch (e) {
            error(`Issue changing beg count. USER ID = ${this.id}\n${e}`);
            return false;
        }
        return true;
    }

    getBegAmountEarned() {
        return this.model.profile.commands.beg.coinsEarned;
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
    // COOLDOWN MANAGEMENT
    // ==================================================================================

    getCooldown(type, set = true, msg) {
        const previousTime = this.model.profile.commands.cooldowns[type]; // When command was last used
        const nowTime = new Date(); // Current Date
        const timePassed = Math.abs(previousTime - nowTime); // How long its been since the command was used

        var cooldown = cooldowns[type];

        if (timePassed <= cooldown) {
            const timeLeftMilli = Math.ceil(cooldown - timePassed)
            const timeLeftSec = (timeLeftMilli / 1000);
            const timeLeftFormatted = Time.format(timeLeftMilli);

            if (msg) msg.channel.send(this.generateCooldownEmbed(this.user, type, timeLeftFormatted));

            return {
                response: true,
                timeLeftSec,
                timeLeftMilli,
                timeLeftFormatted,
                message: `You need to wait ${timeLeftFormatted} before you can use ${type} again.`,
                embed: this.generateCooldownEmbed(this.user, type, timeLeftFormatted)
            }
        }

        if (set) this.model.profile.commands.cooldowns[type] = new Date();
        return {
            response: false
        }
    }

    generateCooldownEmbed(user, type, remaining) {
        const embed = {
            embed: {
                title: `Slow down ${user.username} ⏱`,
                description: `You need to wait ${remaining} before you can use ${type} again.`,
                color: client.colors.invalid
            }
        }

        return embed;
    }

    // ==================================================================================
    // DB MANAGEMENT
    // ==================================================================================

    save() {
        try {
            this.model.markModified('profile.commands.work.fires');
            this.model.markModified('profile.commands.cooldowns');
            this.model.markModified('profile.inventory');
            this.model.save();
        } catch(e) {
            error(`Issue saving model. USER ID = ${this.id}\n${e}`);
            return false;
        }
        return true;
    }
}