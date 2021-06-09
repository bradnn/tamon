module.exports = class {
    async run(client) {
        client.logger.ready(`Successfully started ${client.user.username}`); // Log to console that the bot is online
        client.user.setActivity(`t!help`, { type: 'PLAYING' }); // Set bot status
    }
}