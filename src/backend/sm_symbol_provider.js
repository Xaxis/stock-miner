const fs = require('fs')
const request = require('request')

const get_all_finra_symbols = function () {
    return new Promise(function (resolve, reject) {
        let req_url = 'http://oatsreportable.finra.org/OATSReportableSecurities-SOD.txt'
        request.get(req_url, function (error, response, body) {
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
                        result.push(obj)
                    }
                }
                resolve(result)
            }
        })
    })
}

const get_all_crypto_symbols = function () {
    let result = []
    let cryptos = [
        ['DOGE', 'Dogecoin'],
        ['LTC', 'Litecoin'],
        ['ETC', 'Ethereum Classic'],
        ['ETH', 'Ethereum'],
        ['BSV', 'Bitcoin SV'],
        ['BCH', 'Bitcoin Cash'],
        ['BTC', 'Bitcoin']
    ]
    for (let idx in cryptos) {
        let crypto = cryptos[idx]
        result.push({s: crypto[0], n: crypto[1], e: 'crypto'})
    }
    return result
}

const get_symbols_matching = function (symbols, chars, limit) {
    let chars_uppercase = chars.toUpperCase()
    let exp = `^${chars_uppercase}`
    let regex = new RegExp(exp)
    let result = symbols.filter((obj) => {
        return regex.test(obj.s)
    })
    return result.slice(0, limit)
}

module.exports = {
    get_all_finra_symbols: get_all_finra_symbols,
    get_all_crypto_symbols: get_all_crypto_symbols,
    get_symbols_matching: get_symbols_matching
}