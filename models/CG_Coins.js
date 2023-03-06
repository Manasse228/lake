const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CG_CoinSchema = new mongoose.Schema({
    _idCG: {
        type: String, required: false
    },
    name: {
        type: String, required: false
    },
    symbol: {
        type: String, required: false
    }
});

const CG_Coin = mongoose.model('CG_Coin', CG_CoinSchema);
module.exports = CG_Coin;

/*
CG_Coin.updateMany({}, { bitbucket : coinDetail. }, { multi: true }, function (err, raw) {
    if (err) return console.log(err);
    console.log('The raw response from Mongo was ', raw);
});
*/

// Get all coins on database
module.exports.getAllCoins = () => {
    return new Promise((resolve) => {
        const query = {};
        let result = CG_Coin.find(query, {timeout: false});
        resolve(result);
    })
};

// Get Coin by id
module.exports.getCoinById = (id) => {
    return new Promise((resolve) => {
        let result = CG_Coin.findOne({_idCG: id});
        resolve(result);
    })
};


// Get Coin by symbol
module.exports.getCoinBySymbol = (symbol) => {
    return new Promise((resolve) => {
        let result = CG_Coin.findOne({symbol: symbol});
        resolve(result);
    })
};