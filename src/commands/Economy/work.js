const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");

module.exports = class {
    constructor() {
        this.cmd = 'work',
        this.aliases = ['ork']
    }

    async run(client, msg, args, options) {
        var user = await User.get(msg.author);

        switch (args[0]?.toLowerCase()) {
            case "jobs":
            case "list": {
                var jobString = ``;
                const jobs = client.jobs.array().sort((a, b) => {return a.unlockHours - b.unlockHours});
                
                for (var job in jobs) {
                    job = jobs[job];
                    if (job.isUnlocked(user)) {
                        jobString += `🟢 `;
                    } else {
                        jobString += `🔴 `;
                    }

                    jobString += `**${job.name}** **-** Hours per day: \`${job.hourRequirement}\` Salary: \`${Number.comma(job.salary)}\`\n${job.description}\n\n`
                }


                var embed = {
                    description: `Jobs with 🔴 next to them are locked.`,
                    fields: [
                        {
                            name: `Jobs`,
                            value: jobString
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: `Do ${options.prefix}work <job> to apply for a job`
                    },
                    color: client.colors.default
                }

                msg.channel.send({ embed });
                break;
            }
            case "view":
            case "stats":
            case "info": {
                if (args[1]) {
                    let user2 = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
                    if (!user2) {
                        args.shift();
                        for (var arg in args) {
                            args[arg] = String.capitalize(args[arg].toLowerCase());
                        }

                        const job = client.jobs.get(args.join(" "));
                        if (job) {
                            msg.channel.send({ embed: {
                                author: {
                                    name: `${job.name} Information`,
                                    icon_url: user.user.avatarURL()
                                },
                                description: `${job.description}\n\nHours Worked Required: **\`${job.unlockHours}\`**
Hours Worked Per Day: **\`${job.hourRequirement}\`**
Salary: **\`${Number.comma(job.salary)} coins\`**`,
                                timestamp: new Date(),
                                color: client.colors.default
                            }});
                            break;
                        }
                    } else {
                        user = await User.get(user2);
                    }
                }
                msg.channel.send({ embed: {
                    author: {
                        name: `${user.user.username}'s stats`,
                        icon_url: user.user.avatarURL()
                    },
                    description: `Job: **\`${user.getJob()}\`**\nHours Worked: **\`${user.getWorkCount()}\`**\nAmount Earned: **\`${Number.comma(user.getWorkAmountEarned())} coins\`**`,
                    timestamp: new Date(),
                    color: client.colors.default
                }});
                break;
            }
            default: {
                if (args[0]) {
                    for (var arg in args) {
                        args[arg] = String.capitalize(args[arg].toLowerCase());
                    }
                    const job = client.jobs.get(args.join(" "));
                    if (job) {
                        if (user.wasFired(job)) {
                            msg.channel.send({ embed: {
                                title: `❌ Error`,
                                description: `You were fired from this job within the last 24 Hours.`,
                                timestamp: Date.now(),
                                footer: {
                                    text: `${user.user.username}'s application`,
                                    icon_url: user.user.avatarURL()
                                }, 
                                color: client.colors.invalid
                            }});
                            break;
                        }
                        if (!user.canApply(job)) {
                            msg.channel.send({ embed: {
                                title: `❌ Error`,
                                description: `You don't meet the requirements for this job. Check \`${options.prefix}work view ${job.name}\`.`,
                                timestamp: Date.now(),
                                footer: {
                                    text: `${user.user.username}'s application`,
                                    icon_url: user.user.avatarURL()
                                }, 
                                color: client.colors.invalid
                            }});
                            break;
                        }
                        user.setJob(job.name);
                        msg.channel.send({ embed: {
                            title: `${job.name} Application`,
                            description: `You were accepted as ${job.name}. Your salary is now ${Number.comma(job.salary)} coins.`,
                            timestamp: Date.now(),
                            footer: {
                                text: `${user.user.username}'s application`,
                                icon_url: user.user.avatarURL()
                            },
                            color: client.colors.invalid
                        }});
                        break;
                    }
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You didn't include valid arguments.`,
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s work`,
                            icon_url: user.user.avatarURL()
                        }, 
                        color: client.colors.success
                    }});
                    break;
                }

                if (user.getJob() === "None") {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You don't have a job. Apply for one with \`${options.prefix}work <Job Name>\``,
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s work`,
                            icon_url: user.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }

                if (!user.canWork()) {
                    msg.channel.send({ embed: {
                        title: `❌ Error`,
                        description: `You didn't meet the required hours yesterday. Apply for a job with \`${options.prefix}work <Job Name>\``,
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s work`,
                            icon_url: user.user.avatarURL()
                        }, 
                        color: client.colors.invalid
                    }});
                    break;
                }

                if (user.getCooldown("work", true, msg).response) return;

                const job = client.jobs.get(user.getJob());

                const challengeTypes = Object.keys(Challenge);
                const challengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

                const results = await Challenge[challengeType](msg, `${job.name} Work`, `${user.user.username}'s work`);
                if (results.correct) {
                    user.addCoins(user.getPay(), "work");
                    msg.channel.send({ embed: {
                        title: `${job.name} Work`,
                        description: job.getMessage().replace("%p", Number.comma(user.getPay()) + " coins"),
                        timestamp: Date.now(),
                        footer: {
                            text: `${user.user.username}'s work`,
                            icon_url: user.user.avatarURL()
                        },
                        color: client.colors.success
                    }});
                    break;
                }
                const payout = Math.floor((user.getPay() / 100) * 50 + (Math.random() * 100));
                user.addCoins(payout, "work");
                switch (results.error) {
                    case "MISTYPE": {
                        msg.channel.send({ embed: {
                            title: `${job.name} Work`,
                            description: job.getMessage(false).replace("%p", Number.comma(payout) + " coins").replace("%a", results.word),
                            timestamp: Date.now(),
                            footer: {
                                text: `${user.user.username}'s work`,
                                icon_url: user.user.avatarURL()
                            },
                            color: client.colors.invalid
                        }});
                        break;
                    }
                    case "TIME": {
                        msg.channel.send({ embed: {
                            title: `${job.name} Work`,
                            description: job.getMessage(false).replace("%p", Number.comma(payout) + " coins").replace("%a", results.word),
                            timestamp: Date.now(),
                            footer: {
                                text: `${user.user.username}'s work`,
                                icon_url: user.user.avatarURL()
                            },
                            color: client.colors.invalid
                        }});
                        break;
                    }
                }
                break;
            }
        }
        
        user.save();
        return;

    }
}