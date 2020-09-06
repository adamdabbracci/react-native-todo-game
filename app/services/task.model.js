export class Task {
    id;
    assigned_to;
    assgined_by;
    name;
    description;
    coin_reward = 0;
    category;
    requires_photo_proof = false;
    completed = false;
    /**
     * Timestamp when this task expires
     *
     * @memberof Task
     */
    deadline;
    
}

export class TaskSchedule {
    id;

    /**
     * The date the task is assigned to
     *
     * @memberof TaskSchedule
     */
    assigned_date;

    /**
     * The user ID of the creator
     *
     * @type {string}
     */
    created_by;

    /**
     * The bones of the task object that will be created
     *
     * @memberof TaskSchedule
     */
    task;

    /**
     * Start date of the schedule
     *
     * @memberof TaskSchedule
     */
    start_date;

    /**
     * OPTIONAL: End date of the schedule 
     *
     * @memberof TaskSchedule
     */
    end_date;

    /**
     * 
    YEARLY
    MONTHLY
    WEEKLY
    DAILY
    HOURLY
    MINUTELY
    SECONDLY

     * FROM: https://github.com/jakubroztocil/rrule#api
     *
     * @memberof TaskSchedule
     */
    frequency;

    
    
}