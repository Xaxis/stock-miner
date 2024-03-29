# Stock Miner Data Base Overview

Stock Miner in its development stages is using SQLite. The below attempts to depict the purpose of 
its tables and their fields.

### Table: `Config`

The `Config` table contains values related to the global configuration of the app.

```
id                      # Primary key
active_profile          # The name of the currently active profile
task_frequency          # The rate at which backend attempts to process tasks
polling_frequency       # The rate at which the frontend receives data updates
rh_username             # Users Robinhood username
rh_password             # Users Robinhood password
```

### Table: `Profiles`

The `Profiles` table contains the complete list of profiles a user has created.

```
id                      # Primary key
profile                 # Name of a profile
status                  # Profile's operating status: 'active' or 'paused'
```

### Table: `Profiles_History`

The `Profiles_History` table contains history entries of all global app events.

```
id                      # Primary key
profile                 # Name of profile a history entry correlates to
event                   # The name of the history entry event
info                    # Extra information or a description of the event
date                    # A Unix timestamp in ms of when the event occured
```

### Table: `Stock_Orders`

The `Stock_Orders` table contains real orders that are in some state of processing.

```
id                      # Primary key
uuid                    # A unique order identifier
profile                 # Name of profile an order entry correlates to
market                  # The type of exchange (ie crypto, stock, forex, etc)
status                  # The state of the order being processed
paused                  # Whether or not a given order has been interrupted or 'paused'
symbol                  # The symbol of the stock/security
name                    # The name of the stock/security
shares                  # The approx. number of shares owned
price                   # The most current evaluation of the stock/security
buy_price               # The intended price to buy a stock/security at
sell_price              # The intended price to sell a stock/security at
cost_basis              # The actual amount a stock/security to buy/was bought
sale_basis              # The actual amount a stock/security to sell/was sold
limit_buy               # The amount to buy at with a limit order
limit_sell              # The amount to sell at with a limit order
loss_perc               # The maximum percent a stock/security price can lose before auto selling
order_date              # A Unix timestamp representing the time an order was created
exec_date               # A Unix timestamp representing the last time an order task executed
simulated               # Flag used by Order Processor indicating NOT simulated. Default 0
rh_order_id             # The unique Robinhood idnetifier pertaining to a specific order.
tasks                   # A JSON string containing an order's tasks and those tasks states
```

### Table: `Stock_Simulations`

The `Stock_Orders` table contains simulated orders that are in some state of processing.

```
id                      # Primary key
uuid                    # A unique order identifier
profile                 # Name of profile an order entry correlates to
market                  # The type of exchange (ie crypto, stock, forex, etc)
status                  # The state of the order being processed
paused                  # Whether or not a given order has been interrupted or 'paused'
symbol                  # The symbol of the stock/security
name                    # The name of the stock/security
shares                  # The approx. number of shares owned
price                   # The most current evaluation of the stock/security
buy_price               # The intended price to buy a stock/security at
sell_price              # The intended price to sell a stock/security at
cost_basis              # The actual amount a stock/security to buy/was bought
sale_basis              # The actual amount a stock/security to sell/was sold
limit_buy               # The amount to buy at with a limit order
limit_sell              # The amount to sell at with a limit order
loss_perc               # The maximum percent a stock/security price can lose before auto selling
order_date              # A Unix timestamp representing the time an order was created
exec_date               # A Unix timestamp representing the last time an order task executed
simulated               # Flag used by Order Processor indicating IS simulated. Default: 1
tasks                   # A JSON string containing an order's tasks and those tasks states
```

### Table: `Stock_Orders_History`

The `Profiles_History` table contains history entries for all order events.

```
id                      # Primary key
uuid                    # A unique order identifier
event                   # The name of the history entry event
info                    # Extra information or a description of the event
date                    # A Unix timestamp in ms of when the event occured
```