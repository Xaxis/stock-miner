CREATE TABLE IF NOT EXISTS `Profiles` (
    `id`            INTEGER NOT NULL PRIMARY KEY,
    `profile`       TEXT NOT NULL UNIQUE,
    `status`        TEXT DEFAULT 'paused'
);
CREATE TABLE IF NOT EXISTS `Stock_Orders` (
    `id`            INTEGER NOT NULL PRIMARY KEY,
    `uuid`          TEXT NOT NULL,
    `profile`       TEXT NOT NULL,
    `market`        TEXT NOT NULL,
    `status`        TEXT NOT NULL DEFAULT 'Waiting',
    `paused`        TEXT NOT NULL DEFAULT 'true',
    `symbol`        TEXT NOT NULL,
    `name`          TEXT NOT NULL,
    `shares`        NUMERIC,
    `price`         NUMERIC,
    `cost_basis`    NUMERIC,
    `limit_buy`     NUMERIC,
    `limit_sell`    NUMERIC,
    `loss_perc`     NUMERIC,
    `order_date`    DATE,
    `exec_date`     DATE
);
CREATE TABLE IF NOT EXISTS `Stock_Simulations` (
    `id`            INTEGER NOT NULL PRIMARY KEY,
    `uuid`          TEXT NOT NULL,
    `profile`       TEXT NOT NULL,
    `market`        TEXT NOT NULL,
    `status`        TEXT NOT NULL DEFAULT 'Waiting',
    `paused`        TEXT NOT NULL DEFAULT 'true',
    `symbol`        TEXT NOT NULL,
    `name`          TEXT NOT NULL,
    `shares`        NUMERIC,
    `price`         NUMERIC,
    `cost_basis`    NUMERIC,
    `limit_buy`     NUMERIC,
    `limit_sell`    NUMERIC,
    `loss_perc`     NUMERIC,
    `order_date`    DATE,
    `exec_date`     DATE
);
CREATE TABLE IF NOT EXISTS `Stock_Holdings` (
    `id`      	    INTEGER NOT NULL PRIMARY KEY,
    `uuid`  	    TEXT NOT NULL,
    `profile`	    TEXT NOT NULL,
    `market`      	TEXT NOT NULL,
    `symbol`	    TEXT NOT NULL UNIQUE,
    `name`          TEXT NOT NULL UNIQUE,
    `shares`	    NUMERIC NOT NULL,
    `price`         NUMERIC NOT NULL,
    `cost_basis`    NUMERIC NOT NULL,
    `simulated`     INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS `Stock_Records` (
    `id`            INTEGER NOT NULL PRIMARY KEY,
    `market`        TEXT NOT NULL,
    `symbol`        TEXT NOT NULL,
    `name`          TEXT NOT NULL,
    `quote`         INTEGER NOT NULL,
    `timestamp`     DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS `Config` (
    `id`                INTEGER NOT NULL PRIMARY KEY,
    `active_profile`    TEXT DEFAULT 'noop',
    `task_frequency`    TEXT DEFAULT '10000',
    `polling_frequency` TEXT DEFAULT '3000'
);