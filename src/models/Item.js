const UserManager = require("../managers/User/UserManager");

class Item {
    constructor(client, {
        name = null,
        aliases = new Array(),
        emoji = null,
        description = null,
        category = null,
        tier = null,
        display = false,
        buyPrice = false,
        sellPrice = false,
        worth = 0,
        maxAmount = 999,
        usable = false,
        uses = null
    })
    {
        this.client = client;
        this.item = {
            name,
            aliases,
            description,
            emoji,
            category,
            tier
        }
        this.meta = {
            display,
            worth,
            maxAmount,
            usable,
            uses,
            sellPrice,
            buyPrice
        }
    }
    
    /**
     * 
     * @param {UserManager} user 
     */
    async getUses(user) {
        if (!this.meta.usable) return null;
        if (!user.model.profile.inventory.meta.uses[this.item.name]) {
            user.model.profile.iinventory.meta.uses[this.item.name] = 0
        }
        await user.save();
        return user.model.profile.inventory.meta.uses[this.item.name];
    }
    
    /**
     * 
     * @param {UserManager} user 
     * @param {number} [amount=1]
     */
    async addUses(user, amount = 1) {
        if (!this.meta.usable) return null;
        if (!user.model.profile.inventory.meta.uses[this.item.name]) {
            user.model.profile.inventory.meta.uses[this.item.name] = 0
        }
        if (user.model.profile.inventory.meta.uses[this.item.name] + amount > this.meta.uses) {
            await this.remove(user, 1);
            user.model.profile.inventory.meta.uses[this.item.name] = 0
            await user.save();
            return -1;
        }
        user.model.profile.inventory.meta.uses[this.item.name] += amount;
        await user.save();
        return user.model.profile.inventory.meta.uses[this.item.name];
    }
    
    /**
     * 
     * @param {UserManager} user 
     * @param {number} [amount=1]
     */
    async setUses(user, amount = 0) {
        if (!this.meta.usable) return null;
        if (!user.model.profile.inventory.meta.uses[this.item.name]) {
            user.model.profile.inventory.meta.uses[this.item.name] = 0
        }
        user.model.profile.inventory.meta.uses[this.item.name] = amount;
        await user.save();
        return user.model.profile.inventory.meta.uses[this.item.name];
    }

    async count(user) {
        if (!user.model.profile.inventory.storage[this.item.name]) {
            return 0;
        }
        return user.model.profile.inventory.storage[this.item.name];
    }

    /**
     * 
     * @param {UserManager} user 
     * @param {number} [amount=1]
     */
    async add(user, amount = 1) {
        if (!user.model.profile.inventory.storage[this.item.name]) {
            user.model.profile.inventory.storage[this.item.name] = 0
        }
        if (user.model.profile.inventory.storage[this.item.name] + amount > this.meta.maxAmount) {
            return false; // max reached
        }
        user.model.profile.inventory.storage[this.item.name] += amount;
        await user.save();
        return true;
    }

    /**
     * 
     * @param {UserManager} user 
     * @param {number} [amount=1]
     */
    async remove(user, amount = 1) {
        if (!user.model.profile.inventory.storage[this.item.name]) {
            user.model.profile.inventory.storage[this.item.name] = 0
        }
        if (user.model.profile.inventory.storage[this.item.name] - amount < 0) {
            return false; // min reached
        }
        user.model.profile.inventory.storage[this.item.name] -= amount;
        await user.save();
        return true;
    }

}

module.exports = Item;