/**
 * @file User work manager
 * @author bradnn
 * @version 2.0.1
 * @since 2.0.1
 */

const UserStructure = require("../../models/User");
const UserManager = require("./UserManager");

/**
 * User work manager
 * @extends {UserStructure.user}
 */
class UserWorkManager extends UserStructure.User {
    /**
     * User work manager
     * @param {UserManager} User 
     */
    constructor(User) {
        super(User);
    }

    get pay() {
        var job = this.client.jobs.get(this.model.profile.commands.work.job);
        return job.job.salary;
    }

    get job() {
        return this.model.profile.commands.work.job;
    }

    setJob(job) {
        this.model.profile.commands.work.job = job;
        return;
    }

    get count() {
        return this.model.profile.commands.work.count;
    }

    addCount(amount = 1) {
        this.model.profile.commands.work.count += amount;
        return this.model.profile.commands.work.count;
    }
}

module.exports = UserWorkManager