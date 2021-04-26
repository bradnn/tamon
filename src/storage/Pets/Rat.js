module.exports = class {
    constructor() {
        this.name = `Rat`;
        this.emoji = `🐀`;
        this.description = `A useless rat... But it gives 10% mining profit boost!`;
        this.tier = `uncommon`;
    }

    equipPet(user) {
        user.addBuff('mineAmount', 0.10);
    }

    unequipPet(user) {
        user.delBuff('mineAmount', 0.10);
    }
}