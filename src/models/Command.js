const Tamon = require("../client/Tamon");
const Time = require("../utils/Time");

/**
 * @typedef {object} Tamon
 */

class Command {
    /**
     * 
     * @param {Tamon} client 
     * @param {*} param1 
     */
    constructor(client, {
        name = null,
        description = null,
        category = null,
        cooldown = 0,
        aliases = new Array(),
        ownerOnly = false,
        dirname = null
    }) 
    {
        this.client = client;
        this.command = {name, description, category, cooldown, aliases, ownerOnly, dirname}
    }

    isAdmin({ id }) {
        const adminIDs = this.client.adminIDs;
        if (adminIDs.includes(id)) {
            return true;
        }
        return false;
    }

    async getCooldown(user, set = true, msg) {
        const User = await this.client.getMember(user);

        const previousTime = User.model.profile.commands.cooldowns[this.command.name];
        const nowTime = new Date();
        const cooldown = this.command.cooldown;
        const timePassed = Math.abs(previousTime - nowTime);

        if (timePassed <= cooldown) {
            const timeLeft = {
                Milliseconds: Math.ceil(cooldown - timePassed),
                Seconds: (Math.ceil(cooldown - timePassed)) / 1000,
                Formatted: Time.format(Math.ceil(cooldown - timePassed))
            }

            if (msg) msg.channel.send(this.getCooldownEmbed(user, timeLeft));

            return {
                response: true,
                timeLeft,
                message: `You need to wait ${timeLeft.Formatted} before you can use ${this.command.name} again.`,
                embed: this.getCooldownEmbed(user, timeLeft)
            }
        }

        if (set) User.model.profile.commands.cooldowns[this.command.name] = new Date();
        return {
            response: false
        }
    }

    getCooldownEmbed(user, { Formatted }) {
        const embed = {
            embed: {
                title: `Slow down ${user.username} ⏱`,
                description: `You need to wait ${Formatted} before you can use ${this.command.name} again.`,
                color: this.client.colors.invalid
            }
        }
        return embed;
    }
}

module.exports = Command;