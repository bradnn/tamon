const Route = require("../../models/Route");
const Server = require('../server');
const express = require('express');

class UserRouter extends Route {
    /**
     * 
     * @param {Server} server 
     */
    constructor(server) {
        super(express.Router());
        this.route = "user";
        this.server = server;

        this.registerRoutes();
    }

    registerRoutes() {

        this.router.get('/', async (req, res) => {
            res.send(`u didnt supply anything r u dumb`)
        });

        this.router.use('/:userid', async (req, res) => {
            req.userData = await this.server.bot.getMemberByID(req.params.userid);
        });

        this.router.get('/:userid', async (req, res) => {
            console.log(req.userData);
            const userData = await this.server.bot.getMemberByID(req.params.userid);
            if (!userData) {
                res.send(`no user found L`);
                return;
            }
            res.send(userData.model);
        });
    }
}

module.exports = UserRouter;