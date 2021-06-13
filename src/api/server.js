const express = require('express');
const Tamon = require('../client/Tamon');
const { promisify } = require('util'),
    glob = promisify(require('glob'));

class Server {
    /**
     * 
     * @param {Tamon} client 
     */
    constructor(client) {
        this.bot = client;
        this.config = this.bot.config;

        this.app = express();
    }

    loadRoutes() {
        glob (`${process.cwd()}/src/api/routes/**/*.js`).then(routes => {
            for (const routeFile of routes) {
                const error = this.loadRoute(routeFile);
                if (error) {
                    this.bot.logger.error(error);
                }
            }
        });
    }

    loadRoute(filePath) {
        try {
            const route = new (require(filePath))(this);
            this.bot.logger.route(`Loading route: ${route.route}`);
            this.app.use(`/${route.route}`, route.router);
            return false;
        } catch (e) {
            return `Couldn't load route at ${filePath}: ${e}`;
        }
    }

    listen() {

        this.loadRoutes();

        this.app.listen(this.config.port, () => {
            this.bot.logger.ready(`API Is now listening on port ${this.config.port}`);
        })
    }

}

module.exports = Server;