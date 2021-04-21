from flask import Flask, request, json
from flask_restful import Resource, Api
import robin_stocks.robinhood as r
import robin_stocks
import pyotp

app = Flask(__name__)
api = Api(app)


class rh_login(Resource):
    def get(self, username, password):
        login = r.login(username, password)
        if login['access_token']:
            return dict(list({'success': True}.items()) + list(login.items()))
        else:
            return {'success': False}


class rh_login_mfa(Resource):
    def get(self, username, password, token):
        totp = pyotp.TOTP(token).now()
        login = r.login(username, password, mfa_code=totp)
        if login['access_token']:
            return dict(list({'success': True}.items()) + list(login.items()))
        else:
            return {'success': False}


class rh_logout(Resource):
    def get(self):
        try:
            r.logout()
            return {'success': True}
        except:
            return {'success': False}


class rh_buy_crypto(Resource):
    def get(self, symbol, amount):
        clean_amount = float(amount)

        # DOGE returns an error unless purchased by quantity. The below is a temporary
        # ordering solution until another is found.
        if (symbol == 'DOGE'):
            price = float(robin_stocks.robinhood.crypto.get_crypto_quote('DOGE').get('ask_price'))
            shares = round(clean_amount/price, 0)
            rh_result = robin_stocks.robinhood.order_buy_crypto_by_quantity('DOGE', shares, timeInForce='gtc')
            result = dict(list({'success': True}.items()) + list(rh_result.items()))
            return result

        # Order all other cryptos with '..._by_price'
        else:
            rh_result = robin_stocks.robinhood.order_buy_crypto_by_price(symbol, int(amount), timeInForce='gtc')
            result = dict(list({'success': True}.items()) + list(rh_result.items()))
            return result


api.add_resource(rh_login, '/app/rh/login/<username>/<password>')
api.add_resource(rh_login_mfa, '/app/rh/login/mfa/<username>/<password>/<token>')
api.add_resource(rh_logout, '/app/rh/logout')
api.add_resource(rh_buy_crypto, '/app/rh/buy/crypto/<symbol>/<amount>')

if __name__ == '__main__':
    app.run(debug=True)
