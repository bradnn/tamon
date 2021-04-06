

module.exports = class {
    constructor() {
        this.name = `Dish Washer`;
        this.description = `What are you? A woman???`;
        this.hourRequirement = 6;
        this.salary = 50000;
        this.unlockHours = 50;
    }
    
    getMessage(type = "question") {
        return "u did work tings and got %p moners";
    }

    isUnlocked(user) {
        var workCount = user.getWorkCount();
        if (workCount >= this.unlockHours) {
            return true;
        }
        return false;
    }
}