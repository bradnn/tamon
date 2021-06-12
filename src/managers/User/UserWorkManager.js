/**
 * @file User work manager
 * @author bradnn
 * @version 2.0.2
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

    get successes() {
        return this.model.profile.commands.work.successes;
    }
    
    get fails() {
        return this.model.profile.commands.work.fails;
    }

    addCount(successful = true, amount = 1) {
        if (successful) {
            this.model.profile.commands.work.successes += amount;
        } else {
            this.model.profile.commands.work.fails += amount;
        }
        this.model.profile.commands.work.count += amount;
        return this.model.profile.commands.work.count;
    }

    get earned() {
        return this.model.profile.commands.work.earned;
    }

    addEarned(amount = 1) {
        this.model.profile.commands.work.earned += amount;
        return this.model.profile.commands.work.earned;
    }
}

module.exports = UserWorkManager