module.exports = class {
    async run(client) {
        client.logger.ready(`Successfully started ${client.user.username}`);
        client.user.setActivity(`t!help`, { type: 'PLAYING' });
    }
}