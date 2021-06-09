class Command {
    constructor(client, {
        name = null,
        description = null,
        category = null,
        aliases = new Array(),
        ownerOnly = false
    }) 
    {
        this.client = client;
        this.command = {name, description, category, aliases, ownerOnly}
    }
}

module.exports = Command;