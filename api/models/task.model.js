module.exports = class Task {
    id;
    assigned_to;
    assgined_by;
    /**
     * The date the task is assigned to
     *
     */
    assigned_date;
    name;
    description;
    coin_reward = 0;
    category;
    requires_photo_proof = false;
    completed = false;
    
}