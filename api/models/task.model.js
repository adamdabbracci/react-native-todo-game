module.exports = class Task {
    id;
    assigned_to;
    assgined_by;
    name;
    description;
    coin_reward = 0;
    category;
    requires_photo_proof = false;
    completed = false;
    deadline;
    
}