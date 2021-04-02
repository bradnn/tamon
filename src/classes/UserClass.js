module.exports = class {
    constructor(guild, model) {
        this.id = guild.id;
        this.guild = guild;
        this.model = model;
    }
}