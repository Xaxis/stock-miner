CREATE TABLE IF NOT EXISTS `Profiles` (
    `id`      	    INTEGER NOT NULL PRIMARY KEY,
    `profile_name`	TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS `Stock_Orders` (
    `id`      	    INTEGER NOT NULL PRIMARY KEY,
    `uuid`  	    TEXT NOT NULL UNIQUE,
    `profile`	    TEXT NOT NULL,
    `market`      	TEXT NOT NULL,
    `order_type`   	TEXT NOT NULL,
    `symbol`	    TEXT NOT NULL,
    `shares`	    NUMERIC NOT NULL,
    `cost_basis`    NUMERIC NOT NULL,
    `limit_buy`     NUMERIC,
    `limit_sell`    NUMERIC,
    `order_date`    DATE NOT NULL,
    `exec_date`     DATE,
    FOREIGN KEY (profile) REFERENCES Profiles(profile_name)
);
CREATE TABLE IF NOT EXISTS `Stock_Simulations` (
    `id`      	    INTEGER NOT NULL PRIMARY KEY,
    `uuid`  	    TEXT NOT NULL UNIQUE,
    `profile`	    TEXT NOT NULL,
    `market`      	TEXT NOT NULL,
    `order_type`   	TEXT NOT NULL,
    `symbol`	    TEXT NOT NULL,
    `shares`	    NUMERIC NOT NULL,
    `cost_basis`    NUMERIC NOT NULL,
    `limit_buy`     NUMERIC,
    `limit_sell`    NUMERIC,
    `order_date`    DATE NOT NULL,
    `exec_date`     DATE,
    FOREIGN KEY (profile) REFERENCES Profiles(profile_name)
);
CREATE TABLE IF NOT EXISTS `Stock_Holdings` (
    `id`      	    INTEGER NOT NULL PRIMARY KEY,
    `uuid`  	    TEXT NOT NULL UNIQUE,
    `profile`	    TEXT NOT NULL,
    `market`      	TEXT NOT NULL,
    `symbol`	    TEXT NOT NULL UNIQUE,
    `shares`	    NUMERIC NOT NULL,
    `cost_basis`    NUMERIC NOT NULL,
    `simulated`     INTEGER NOT NULL,
    FOREIGN KEY (profile) REFERENCES Profiles(profile_name)
);
CREATE TABLE IF NOT EXISTS `Stock_Records` (
    `id`      	    INTEGER NOT NULL PRIMARY KEY,
    `market`      	TEXT NOT NULL,
    `symbol`	    TEXT NOT NULL,
    `quote`	        INTEGER NOT NULL,
    `date`	        DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS `Config` (
    `open_pref`	        TEXT DEFAULT 'last',
    `last_profile`	    TEXT DEFAULT 'Profile 1',
    `default_profile`	TEXT DEFAULT 'Profile 1'
);