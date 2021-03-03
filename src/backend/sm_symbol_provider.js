const fs = require('fs')
const request = require('request')
const symbol_file_path = __dirname + '/../data/symbol_list.txt'

const symbol_file_exists = function () {
    try {
        if (fs.existsSync(symbol_file_path)) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.log(err)
    }
}

const is_symbol_file_over_a_day_old = function () {
    let file_stats = fs.statSync(symbol_file_path)
    let age = Date.now() - file_stats.mtimeMs
    let age_in_minutes = (age / 1000) / 60
    if (age_in_minutes >= 1440) {
        return true
    } else {
        return false
    }
}

const get_all_finra_symbols_object = function () {
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

const get_crypto_symbols = function () {

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
    get_all_finra_symbols_object: get_all_finra_symbols_object,
    get_symbols_matching: get_symbols_matching
}