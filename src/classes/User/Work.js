/**
 * @file Basic work functions for the UserClass.
 * @author sycles
 * @version 1.1.1
 * @since 1.1.1
 */

const { Document } = require("mongoose");

/** @const {object} Logger A module for easier logging. */
const Logger = require('../../modules/Logger');

/** @type {Document} The MongoDB user model */
var user;
/** @type {Client} The discord client */
var client;

module.exports = class {
    /**
     * Sets the variable user to a user model from MongoDB.
     * 
     * @class
     * @classdesc The work module of the UserClass.
     * 
     * @param {Document} model A user model from MongoDB
     */
    constructor(model, Client) {
        user = model;
        client = Client;
    }

    /**
     * Gives how much the user should be paid for using the work command.
     * 
     * @returns {number} Returns the amount the user should be paid.
     */
    getPay() {
        var job = client.jobs.get(user.profile.commands.work.job);
        const JOB_PAY = job.salary;

        return JOB_PAY;
    }

    /**
     * Gives the users job.
     * 
     * @returns {string} The users job.
     */
    getJob() {
        return user.profile.commands.work.job;
    }

    /**
     * Sets the users job to a string.
     * 
     * @param {string} job The users job.
     * @param {boolean} [fired=false] Was the job set due to firing or a normal job set.
     * @returns {boolean} Was the job set successfully?
     */
    setJob(job, fired = false) {
        if (fired) {
            try {
                user.profile.commands.work.fires[this.getJob()] = new Date();
            } catch (e) {
                Logger.error(`Issue changing job. USER ID = ${user.userID}\n${e}`);
                return false;
            }
        }

        try {
            user.profile.commands.work.job = job;
        } catch (e) {
            Logger.error(`Issue changing job. USER ID = ${user.userID}\n${e}`);
            return false;
        }
        return true;
    }

    /**
     * Gets the amount the user has earned from the work command.
     * 
     * @returns {number} Number of coins the user has earned.
     */
    getAmountEarned() {
        return user.profile.commands.work.coinsEarned;
    }

    /**
     * Gets the amount of times the user has used the work command.
     * 
     * @returns {number} Amount of times the user has worked.
     */
    getCount() {
        return user.profile.commands.work.count;
    }

    /**
     * Adds a number to the users work count (Typically left blank to add 1 work).
     * 
     * @param {number} [amount=1] Amount of times to add to the work count.
     * @returns {boolean} Was the work count added successfully?
     */
    addCount(amount = 1) {
        try {
            user.profile.commands.work.count += amount;
            user.profile.commands.work.lastWork = new Date();
        } catch (e) {
            Logger.error(`Issue changing work count. USER ID = ${user.userID}\n${e}`);
            return false;
        }
        return true;
    }

    /**
     * Set the work count to a number.
     * 
     * @param {number} [amount=0] What should the work count be set to.
     * @returns {boolean} Was the work count set successfully?
     */
    setCount(amount = 0) {
        try {
            user.profile.commands.work.count = amount;
        } catch (e) {
            Logger.error(`Issue changing work count. USER ID = ${user.userID}\n${e}`);
            return false;
        }
        return true;
    }

    /**
     * Check if the user was fired from a job within 24 hours.
     * 
     * @param {object} job A job object within the folder src/storage/Jobs/.
     * @returns {boolean} Was the user fired or can they apply for the job.
     */
    wasFired(job) {
        const keys = Object.keys(user.profile.commands.work.fires);
        if (keys.includes(job.name)) {
            const time = new Date();
            const fireTime = user.profile.commands.work.fires[job.name];
            const timePassed = Math.abs(fireTime - time);
            if (timePassed <= 86400000) {
                return true;
            }
            return false;
        }
        return false;
    }

    /**
     * Check if a user meets the requirements for a job.
     * 
     * @param {object} job A job object within the folder src/storage/Jobs/.
     * @returns {boolean} Is the user able to apply or not.
     */
    canApply(job) {
        if (job.unlockHours > this.getCount()) {
            return false;
        }
        return true;
    }

    /**
     * Checks if the user is able to work or if they lost their streak and need to apply again.
     * 
     * @returns {boolean} Can the user work or not.
     */
    canWork() {
        const lastWorkDay = user.profile.commands.work.lastWorkDay;
        const DAY_LENGTH = 86400000;
        const date = new Date();
        const timeSince = Math.abs(lastWorkDay - date);
        if (lastWorkDay.getTime() === 0) {
            user.profile.commands.work.lastWorkDay = date;
            return true;
        }
        if (timeSince >= DAY_LENGTH) {
            const job = client.jobs.get(this.getJob())
            user.profile.commands.work.todaysWorks = 0;
            user.profile.commands.work.lastWorkDay = date;
            if (timeSince >= (DAY_LENGTH * 2) || user.profile.commands.work.todaysWorks < job.hourRequirement) {
                if (!job.hourRequirement < 1) {
                    this.setJob("None", true);
                    return false;
                }
                return true;
            }
            return true;
        }
        return true;
    }
}