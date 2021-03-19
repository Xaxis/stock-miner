from time import sleep
import robin_stocks as robin

rob = robin.login(user, passw)

trading = 'BTC'
quantity = 0.0
limitPercent = 1.0
movingPercent = 0.5
askPrice = float(robin.get_crypto_quote(trading, info='ask_price'))
bidPrice = float(robin.get_crypto_quote(trading, info='bid_price'))
buying = False

# Get crypto positions to find quantity available to sell for currency being traded
cp = robin.get_crypto_positions()
for i in cp:
    if i['currency']['code'] == trading:
        quantity = float(i['quantity_available'])
avail = float(robin.load_account_profile(info='crypto_buying_power'))

# if shares available to sell we're selling
if quantity > 0.0:
    buying = False
    print(format(quantity, '.10f'), ' shares available to sell')
else:
    buying = True
    print("$", avail, ' buying power available')

# Main loop
while 1:

    # Find our current buying power
    avail = float(robin.load_account_profile(info='crypto_buying_power'))

    # Get crypto positions to find quantity available to sell for currency being traded
    cp = robin.get_crypto_positions()
    for i in cp:
        if i['currency']['code'] == trading:
            quantity = float(i['quantity_available'])

    print(trading, ' currently available to trade: ', format(quantity, '.10f'), '. Current buying power: ', avail)

    # Trailing limit buy
    if buying:
        print('We are buying.')
        askPrice = float(robin.get_crypto_quote(trading, info='ask_price'))
        initialPrice = askPrice
        limitPrice = askPrice+(askPrice*(limitPercent/100))

        # Place initial limit buy order
        robin.order_buy_crypto_limit(trading, avail, limitPrice, timeInForce='gtc')
        print('Placing initial limit buy order for ', avail, ' at ', limitPrice)

        # a polling loop for simplicity's sake
        while 1:
            askPrice = float(robin.get_crypto_quote(trading, info='ask_price'))
            print('Current Price: ', askPrice, ', Buy Limit: ', limitPrice)

            # If price is below moving limit percentage, we'll update our buy order
            if askPrice < limitPrice-(limitPrice*(movingPercent/100)):
                limitPrice = limitPrice-(limitPrice*(movingPercent/100))
                print('Price down, adjusting limit to ', limitPrice)

                # Cancel all open crypto orders for simplicity's sake. We can add logic for specific order by id later.
                robin.cancel_all_crypto_orders()

                # Update available buying power, place new order then exit loop
                avail = float(robin.load_account_profile(info='crypto_buying_power'))
                robin.order_buy_crypto_limit(trading, avail, limitPrice, timeInForce='gtc')
                print('Placing updated limit buy order for ', avail, ' at ', limitPrice)
                # Update side
                buying = False
                break

            sleep(10)

    # Trailing limit sell
    else:
        print('We are selling')
        # Update shares available to sell
        cp = robin.get_crypto_positions()
        for i in cp:
            if i['currency']['code'] == trading:
                quantity = float(i['quantity_available'])

        # Update prices
        bidPrice = float(robin.get_crypto_quote(trading, info='bid_price'))
        initialPrice = bidPrice
        limitPrice = bidPrice+(bidPrice*movingPercent/100)

        # Place initial limit sell order
        robin.order_sell_crypto_limit(trading, quantity, limitPrice)
        print('Placing initial limit sell order for ', format(quantity, '.10f',), '~ at ', limitPrice,
              '. Stop-loss at ', initialPrice-(initialPrice*(limitPercent/100)))

        # A polling loop for simplicity's sake
        while 1:
            bidPrice = float(robin.get_crypto_quote(trading, info='bid_price'))
            sleep(10)

            # If Panic, sell now!
            if bidPrice <= initialPrice-(initialPrice*(limitPercent/100)):
                robin.cancel_all_crypto_orders()
                robin.order_sell_crypto_by_quantity(trading, quantity)
                print('Price fell below threshold, selling to stop loss')
                break

            # If price goes up by movingPercent, adjust limit up
            if bidPrice > limitPrice+(limitPrice*(movingPercent/100)):
                limitPrice = limitPrice+(limitPrice*(movingPercent/100))

                # Cancel all open crypto orders for simplicity's sake. We can add logic for specific order by id later.
                robin.cancel_all_crypto_orders()

                # Update quantity available to sell, place new limit sell order then exit loop
                cp = robin.get_crypto_positions()
                for i in cp:
                    if i['currency']['code'] == trading:
                        quantity = float(i['quantity_available'])
                robin.order_sell_crypto_limit(trading, quantity, limitPrice)
                print('Placing updated limit sell order for ', format(quantity, '.10f'), '~ at ', limitPrice,
                    '. Stop-loss at ', initialPrice-(initialPrice*limitPercent))
                # Update side
                buying = True
                break

        sleep(10)
    sleep(60)
