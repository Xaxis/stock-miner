from time import sleep
import robin_stocks as robin

user = 'walkrjp79@gmail.com'
passw = 'Rfr3tn0gH!'
rob = robin.login(user, passw)

trading = 'BTC'
quantity = 0.0
limitPercent = 2.0
movingPercent = 1.0
askPrice = float(robin.get_crypto_quote(trading, info='ask_price'))
bidPrice = float(robin.get_crypto_quote(trading, info='bid_price'))
buying = False

# Get crypto positions to find quantity available to sell for currency being traded
cp = robin.get_crypto_positions()
for i in cp:
    if i['currency']['code'] == trading:
        quantity = float(i['quantity_available'])

# if shares available to sell we're selling
if quantity > 0:
    buying = False

# Main loop
while 1:

    # Find our current buying power
    avail = float(robin.load_account_profile(info='buying_power'))

    # Get crypto positions to find quantity available to sell for currency being traded
    cp = robin.get_crypto_positions()
    for i in cp:
        if i['currency']['code'] == trading:
            quantity = float(i['quantity_available'])

    print(trading, ' currently available to trade: ', quantity, '. Current buying power: ', avail)

    # Trailing limit buy
    if buying:
        askPrice = float(robin.get_crypto_quote(trading, info='ask_price'))
        initialPrice = askPrice
        limitPrice = (askPrice*limitPercent)

        # Place initial limit buy order
        # robin.order_buy_crypto_limit(trading, avail, limitPrice, timeInForce='gtc')
        print('Placing initial limit buy order for ', avail, ' at ', limitPrice)

        # a polling loop for simplicity's sake
        while 1:
            askPrice = float(robin.get_crypto_quote(trading, info='ask_price'))
            print('Current Price: ', askPrice, ', Buy Limit: ', limitPrice)

            # If price is below moving limit percentage, we'll update our buy order
            if askPrice <= limitPrice*movingPercent:
                limitPrice = limitPrice*movingPercent
                print('Price down, adjusting limit to ', limitPrice)

                # Cancel all open crypto orders for simplicity's sake. We can add logic for specific order by id later.
                # robin.cancel_all_crypto_orders()

                # Update available buying power, place new order then exit loop
                avail = float(robin.load_account_profile(info='buying_power'))
                # robin.order_buy_crypto_limit(trading, avail, limitPrice, timeInForce='gtc')
                print('Placing updated limit buy order for ', avail, ' at ', limitPrice)
                break

            sleep(10)

        # Update side
        buying = False

    # Trailing limit sell
    else:
        # Update shares available to sell
        cp = robin.get_crypto_positions()
        for i in cp:
            if i['currency']['code'] == trading:
                quantity = float(i['quantity_available'])

        # Update prices
        bidPrice = float(robin.get_crypto_quote(trading, info='bid_price'))
        initialPrice = bidPrice
        limitPrice = bidPrice*limitPercent

        # Place initial limit sell order
        # robin.order_sell_crypto_by_quantity(trading, quantity, limitPrice, timeInForce='gtc')
        print('Placing initial limit sell order for ', quantity, ' at ', limitPrice)

        # A polling loop for simplicity's sake
        while 1:
            bidPrice = float(robin.get_crypto_quote(trading, info='bid_price'))
            sleep(10)

            if bidPrice > limitPrice+(limitPrice*(limitPrice/100)):
                limitPrice = limitPrice+(limitPrice*(limitPrice/100))

                # Cancel all open crypto orders for simplicity's sake. We can add logic for specific order by id later.
                # robin.cancel_all_crypto_orders()

                # Update quantity available to sell, place new limit sell order then exit loop
                cp = robin.get_crypto_positions()
                for i in cp:
                    if i['currency']['code'] == trading:
                        quantity = float(i['quantity_available'])
                # robin.order_sell_crypto_by_quantity(trading, quantity, limitPrice, timeInForce='gtc')
                print('Placing updated limit sell order for ', quantity, ' at ', limitPrice)
                break

        # Update side
        buying = True
        sleep(10)
    sleep(60)
