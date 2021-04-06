

module.exports = class {
    constructor() {
        this.name = `Voice Actor`;
        this.description = `Do voice acting for companies that contract you.`;
        this.hourRequirement = 1;
        this.salary = 12500;
        this.unlockHours = 0;
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