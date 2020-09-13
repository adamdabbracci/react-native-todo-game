-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/mZr4Lm
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

DROP SCHEMA IF EXISTS lvlup;

CREATE SCHEMA IF NOT EXISTS lvlup;
USE lvlup;

CREATE TABLE `User` (
    `id` VARCHAR(255)  NOT NULL ,
    `name` VARCHAR(255)  NOT NULL ,
    `email_address` VARCHAR(255)  NOT NULL ,
    `coins` int  NOT NULL ,
    `created_at` DATE,
    `updated_at` DATE,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `Task` (
    `id` int  NOT NULL ,
    `name` VARCHAR(255)  NOT NULL ,
    `description` VARCHAR(255) ,
    `coin_reward` int  NOT NULL ,
    `schedule_id` int  NOT NULL ,
    `assigned_to` VARCHAR(255)  NOT NULL ,
    `status` VARCHAR(255)  NOT NULL ,
    `assigned_at` Date  NOT NULL ,
    `completed_at` Date  NOT NULL ,
     `created_at` DATE,
    `updated_at` DATE,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `Schedule` (
    `id` int  NOT NULL ,
    `active` bool  NOT NULL DEFAULT true,
    `rrule` VARCHAR(255)  NOT NULL ,
    `frequency` VARCHAR(255)  NOT NULL ,
    `start_date` Date  NOT NULL ,
    `end_date` Date  NOT NULL ,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255)  NOT NULL ,
    `coin_reward` int  NOT NULL ,
    `assigned_to` VARCHAR(255)  NOT NULL ,
    `created_by` VARCHAR(255)  NOT NULL ,
    `created_at` DATE,
    `updated_at` DATE,
    PRIMARY KEY (
        `id`
    )
);


/* CREATE TABLE `TaskTemplate` (
    `id` int  NOT NULL ,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255)  NOT NULL ,
    `coin_reward` int  NOT NULL ,
    `schedule_id` int  NOT NULL ,
    `created_at` DATE,
    `updated_at` DATE,
    PRIMARY KEY (
        `id`
    )
); */

ALTER TABLE `Task` ADD CONSTRAINT `fk_Task_assigned_to` FOREIGN KEY(`assigned_to`)
REFERENCES `User` (`id`);

ALTER TABLE `Schedule` ADD CONSTRAINT `fk_Schedule_created_by` FOREIGN KEY(`created_by`)
REFERENCES `User` (`id`);


ALTER TABLE `Schedule` ADD CONSTRAINT `fk_Schedule_assigned_to` FOREIGN KEY(`assigned_to`)
REFERENCES `User` (`id`);

/* ALTER TABLE `Schedule` ADD CONSTRAINT `fk_Schedule_task_template_id` FOREIGN KEY(`task_template_id`)
REFERENCES `TaskTemplate` (`id`);

ALTER TABLE `TaskTemplate` ADD CONSTRAINT `fk_TaskTemplate_schedule_id` FOREIGN KEY(`schedule_id`)
REFERENCES `Schedule` (`id`); */

ALTER TABLE `Task` ADD CONSTRAINT `fk_Task_schedule_id` FOREIGN KEY(`schedule_id`)
REFERENCES `Schedule` (`id`);



