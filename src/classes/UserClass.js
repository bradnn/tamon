const { Client } = require("../bot");
const { error } = require("../modules/Logger");
const { Number } = require("../modules/Number");
const { String } = require("../modules/String");
const { Time } = require("../modules/Time");
const client = Client.get();

cooldowns = {
    work: 3600000
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
            }
        }
        return this.model.profile.balance;
    }

    delCoins(amount = 0) {
        this.model.profile.balance -= amount;
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
            this.model.save();
        } catch(e) {
            error(`Issue saving model. USER ID = ${this.id}\n${e}`);
            return false;
        }
        return true;
    }
}