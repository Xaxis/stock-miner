const request = require('request')

class SymbolProvider {

    constructor() {
        this.FINRA_REQ_URL = 'http://oatsreportable.finra.org/OATSReportableSecurities-SOD.txt'
    }

    /**
     * Returns a Promise that returns parsed Finra symbols on success.
     */
    get_all_finra_symbols = () => {
        let self = this
        return new Promise(function (resolve, reject) {
            request.get(self.FINRA_REQ_URL, function (error, response, body) {
                if (error) {
                    return reject(error)
                }
                if (!error && response.statusCode == 200) {
                    let result = []
                    let lines = body.split("\n")
                    let lines_len = lines.length
                    for (let idx in lines) {
                        if (idx != 0 && idx != lines_len - 1) {
                            let line = lines[idx]
                            let values = line.split("|")
                            let obj = {}
                            obj['s'] = values[0]
                            obj['n'] = values[1]
                            obj['e'] = values[2]
                            obj['t'] = 'stock'
                            result.push(obj)
                        }
                    }
                    resolve(result)
                }
            })
        })
    }

    /**
     * Returns a list of all Crypto symbols.
     */
    get_all_crypto_symbols = () => {
        let result = []
        let cryptos = [
            ['DOGE', 'Dogecoin'],
            ['LTC', 'Litecoin'],
            ['ETC', 'Ethereum Classic'],
            ['ETH', 'Ethereum'],
            ['BSV', 'Bitcoin SV'],
            ['BCH', 'Bitcoin Cash'],
            ['BTC', 'Bitcoin'],
            ['BTG', 'Bitcoin Gold']
        ]
        for (let idx in cryptos) {
            let crypto = cryptos[idx]
            result.push({s: crypto[0], n: crypto[1], t: 'crypto'})
        }
        return result
    }

    /**
     * Returns a list of all FOREX symbols.
     */
    get_all_forex_symbols = () => {
        let result = []
        let forex = [
            ['EUR', 'Euro'],
            ['GBP', 'Great British Pound'],
            ['JPY', 'Japanese Yen'],
            ['CHF', 'Swiss Franc'],
            ['CAD', 'Canadian Dollar'],
            ['AUD', 'Australian Dollar'],
            ['NZD', 'New Zealand Dollar']
        ]
        for (let idx in forex) {
            let f = forex[idx]
            result.push({s: f[0], n: f[1], t: 'forex'})
        }
        return result
    }

    /**
     * Returns a list of symbol objects that match a character string.
     */
    get_symbols_matching = (symbols, chars, limit) => {
        let chars_uppercase = chars.toUpperCase()
        let exp = `^${chars_uppercase}`
        let regex = new RegExp(exp)
        let result = symbols.filter((obj) => {
            return regex.test(obj.s)
        })
        return result.slice(0, limit)
    }
}

module.exports = {
    SymbolProvider: SymbolProvider
}