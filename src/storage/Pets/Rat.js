module.exports = class {
    constructor() {
        this.name = `Rat`;
        this.emoji = `🐀`;
        this.description = `A useless rat... But it gives 10% mining profit boost!`;
        this.tier = `uncommon`;
    }

    equipPet(user) {
        user.buff().add('mineAmount', 0.10);
    }

    unequipPet(user) {
        user.buff().add('mineAmount', 0.10);
    }
}