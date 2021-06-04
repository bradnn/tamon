module.exports = class {
    constructor() {
        this.name = `Cat`;
        this.emoji = `🐈`;
        this.description = `A cat that enjoys fish. 15% fishing profit boost!`;
        this.tier = `rare`;
    }

    equipPet(user) {
        user.buff().add('fishAmount', 0.15);
    }

    unequipPet(user) {
        user.buff().add('fishAmount', 0.15);
    }
}