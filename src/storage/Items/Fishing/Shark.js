module.exports = class {
    constructor() {
        this.name = `Shark`;
        this.emoji = `🦈`;
        this.description = `A fish found from fishing! *(duh)*`;
        this.category = `Fishing`;
        this.tier = `uncommon`;

        this.display = false

        this.price = {
            buy: false,
            sell: 800,
            worth: 800
        }

        this.maxAmount = 0;
    }
}