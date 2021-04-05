# Stock Miner

Stock Miner is a predictive analysis and stock market trading application. Its core
intent is to provide the maximal experience for executing high velocity and guided 
automation trades while providing loss prevention.

## Authors

- Wil Neeley ([william.neeley@gmail.com](mailto:william.neeley@gmail.com))
- Justin Walker ([concretefeet@gmail.com](mailto:concretefeet@gmail.com))

## Requirements

- Node >= v13
- [Robinhood](https://robinhood.com) Credentials 

## Installation

1) Make sure you have Node >= v10 installed

``` bash
node --version
```

2) Install all dependencies

``` bash
npm run init
```
3) Add the database file `sm.db` to `/src/backend/db`

``` bash
touch src/backend/db/sm.db
```

4) Build the database tables

``` bash
npm run rebuild:db
```


## Usage

To launch the application:

``` bash
npm run dev
```
