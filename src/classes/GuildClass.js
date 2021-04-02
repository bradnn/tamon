module.exports = class {
    constructor(user, model) {
        this.id = user.id;
        this.user = user;
        this.model = model;
    }

    getPrefix() {
        return this.model.prefix;
    }
}