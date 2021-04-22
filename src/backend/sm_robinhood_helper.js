const Request = require('request')
const {DBManager} = require('./sm_db_manager.js')

/**
 * RobinhoodHelper contains helper methods for more easily interacting with the
 * SM Robinhood Flask REST server and managing state in regard to the robin_stocks/
 * Robinhood API in general.
 */
class RobinhoodHelper {

    constructor(DBManager) {
        this.DB = DBManager
        this.RH_SERVER_PREFIX = 'http://127.0.0.1:5000/app/rh/'
        this.RH_LOGIN_OBJ = null
        this.RH_LOGIN_EXPIRES_AT = null
    }

    /**
     * Method uses the Stock Miner Flask server to perform REST requests to Robinhood. Returns
     * a Promise with result on success.
     */
    rh_request = (url) => {
        let self = this
        return new Promise(function (resolve, reject) {
            Request(`${self.RH_SERVER_PREFIX}${url}`, {json: true}, (err, res, body) => {
                if (err) {
                    console.log('SMOP: Error: ', err)
                    reject(err)
                }
                let result = (typeof body === 'object') ? body : ""
                resolve(result)
            })
        })
    }

    /**
     * Returns a Promise that resolves the Robinhood login object on login success. Additionally
     * sets the RH_LOGIN_EXPIRES_AT timestamp with the time in milliseconds at which point the
     * login session will expire.
     */
    rh_login = () => {
        let self = this
        return new Promise(function (resolve, reject) {
            self.DB.get_config()
                .then((config) => {
                    if (config) {
                        if (config.rh_username !== 'noop' && config.rh_password !== 'noop') {
                            self.rh_request(`login/${config.rh_username}/${config.rh_password}`)
                                .then((login) => {
                                    if (login.success === true) {
                                        self.RH_LOGIN_OBJ = login
                                        self.RH_LOGIN_EXPIRES_AT = Date.now() + (login.expires_in * 1000)
                                        resolve(true)
                                    } else {
                                        resolve(false)
                                    }
                                })
                        }
                    }
                })
        })
    }

    /**
     * Returns true when the RH_LOGIN_EXPIRES_AT timestamp is surpassed by the current time.
     */
    rh_is_login_expired = () => {
        if (!this.RH_LOGIN_EXPIRES_AT) return true
        if (this.RH_LOGIN_EXPIRES_AT) {
            if (Date.now() >= this.RH_LOGIN_EXPIRES_AT) {
                this.RH_LOGIN_EXPIRES_AT = null
                return true
            }
        }
        return false
    }

    /**
     * Returns a Promise that returns a boolean indicating whether or not a crypto order's
     * state property is 'filled', indicating that the Robinhood order has been executed.
     */
    rh_is_crypto_order_filled = (id) => {
        let self = this
        return new Promise(function (resolve, reject) {
            self.rh_request(`get/crypto/order/${id}`)
                .then((result) => {
                    if (result) {
                        if (result.order.state === 'filled') {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    }
                    resolve(false)
                })
        })
    }

    /**
     * Returns a Promise that returns a Robinhood quote object that contains the most
     * recent price quote for a stock/crypto/security.
     */
    rh_get_quote = (symbol, market) => {
        let self = this
        return new Promise(function (resolve, reject) {
            self.rh_request(`get/${market.toLowerCase()}/quote/${symbol.toUpperCase()}`)
                .then((result) => {
                    resolve(result)
                })
        })
    }
}

// let RH = new RobinhoodHelper(new DBManager())

// RH.rh_request('login/william.neeley@gmail.com/u8%5E2kjHsd<mD7')
//     .then((result) => {
//         console.log(result)
//     })
// RH.rh_request('get/crypto/order/6080905c-4310-4ac6-b333-b6f9652eddc2')
//     .then((result) => {
//         console.log(result)
//     })

module.exports = {
    RobinhoodHelper: RobinhoodHelper
}