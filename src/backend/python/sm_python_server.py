from flask import Flask, request, json
from flask_restful import Resource, Api
import robin_stocks.robinhood as r
import pyotp

app = Flask(__name__)
api = Api(app)


class rh_login(Resource):
    def get(self, username, password):
        login = r.login(username, password)
        if login['access_token']:
            return {'success': True}
        else:
            return {'success': False}


class rh_login_mfa(Resource):
    def get(self, username, password, token):
        totp = pyotp.TOTP(token).now()
        login = r.login(username, password, mfa_code=totp)
        if login['access_token']:
            return {'success': True}
        else:
            return {'success': False}


class rh_logout(Resource):
    def get(self):
        return {'hello': 'world'}


class rh_buy_stock(Resource):
    def get(self):
        return {'hello': 'world'}


class rh_buy_crypto(Resource):
    def get(self):
        return {'hello': 'world'}


class rh_buy_stock_limit(Resource):
    def get(self):
        return {'hello': 'world'}


class rh_buy_crypto_limit(Resource):
    def get(self):
        return {'hello': 'world'}


api.add_resource(rh_login, '/app/rh/login/<username>/<password>')
api.add_resource(rh_login, '/app/rh/login/mfa/<username>/<password>/<token>')
api.add_resource(rh_logout, '/app/rh/logout/<username>')

if __name__ == '__main__':
    app.run(debug=True)
