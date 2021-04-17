CREATE TABLE IF NOT EXISTS `Config` (
    `id`                INTEGER NOT NULL PRIMARY KEY,
    `active_profile`    TEXT DEFAULT 'noop',
    `task_frequency`    TEXT DEFAULT '1000',
    `polling_frequency` TEXT DEFAULT '1000'
);
CREATE TABLE IF NOT EXISTS `Profiles` (
    `id`            INTEGER NOT NULL PRIMARY KEY,
    `profile`       TEXT NOT NULL UNIQUE,
    `status`        TEXT DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS `Profiles_History` (
    `id`                INTEGER NOT NULL PRIMARY KEY,
    `profile`           TEXT NOT NULL,
    `event`             TEXT NOT NULL,
    `info`              TEXT NOT NULL,
    `date`              DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS `Stock_Orders` (
    `id`                INTEGER NOT NULL PRIMARY KEY,
    `uuid`              TEXT NOT NULL,
    `profile`           TEXT NOT NULL,
    `market`            TEXT NOT NULL,
    `status`            TEXT NOT NULL DEFAULT 'Registered',
    `paused`            TEXT NOT NULL DEFAULT 'true',
    `symbol`            TEXT NOT NULL,
    `name`              TEXT NOT NULL,
    `shares`            NUMERIC,
    `price`             NUMERIC,
    `buy_price`         NUMERIC,
    `sell_price`        NUMERIC,
    `cost_basis`        NUMERIC,
    `sale_basis`        NUMERIC,
    `limit_buy`         NUMERIC,
    `limit_sell`        NUMERIC,
    `loss_perc`         NUMERIC,
    `order_date`        DATE,
    `exec_date`         DATE,
    `tasks`             TEXT NOT NULL DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS `Stock_Simulations` (
    `id`                INTEGER NOT NULL PRIMARY KEY,
    `uuid`              TEXT NOT NULL,
    `profile`           TEXT NOT NULL,
    `market`            TEXT NOT NULL,
    `status`            TEXT NOT NULL DEFAULT 'Registered',
    `paused`            TEXT NOT NULL DEFAULT 'true',
    `symbol`            TEXT NOT NULL,
    `name`              TEXT NOT NULL,
    `shares`            NUMERIC,
    `price`             NUMERIC,
    `buy_price`         NUMERIC,
    `sell_price`        NUMERIC,
    `cost_basis`        NUMERIC,
    `sale_basis`        NUMERIC,
    `limit_buy`         NUMERIC,
    `limit_sell`        NUMERIC,
    `loss_perc`         NUMERIC,
    `order_date`        DATE,
    `exec_date`         DATE,
    `tasks`             TEXT NOT NULL DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS `Stock_Orders_History` (
    `id`                INTEGER NOT NULL PRIMARY KEY,
    `uuid`              TEXT NOT NULL,
    `event`             TEXT NOT NULL,
    `info`              TEXT NOT NULL,
    `date`              DATE NOT NULL
);