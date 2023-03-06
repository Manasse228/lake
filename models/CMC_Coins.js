const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CMC_CoinsSchema = new mongoose.Schema({
    _id: {
        type: String, required: true
    }, name: {
        type: String, required: true
    }, symbol: {
        type: String, required: true
    }, slug: {
        type: String, required: true
    }, communityLink: {
        type: String, required: false
    }
});

const CMC_Coin = mongoose.model('CMC_Coin', CMC_CoinsSchema);
module.exports = CMC_Coin;

/*
CMC_Coin.updateMany(
    {},
    [
        {
            $set: {
                communityLink: {
                    $concat: [
                        {$toString: 'https://coinmarketcap.com/community/search/top/'},
                        {$toString: '$slug'},
                    ],
                },
            },
        },
    ]
)
    .then((result) => {
        console.log( result + " documents updated");
    })
    .catch((error) => {
        console.error('Error updating documents:', error);
    });
*/

// Get all users on database
module.exports.getAllCoins = () => {
    return new Promise((resolve) => {
        const query = {};
        let result = CMC_Coin.find(query, {timeout: false});
        resolve(result);
    })
};

// Get Coin by id
module.exports.getCoinById = (id) => {
    return new Promise((resolve) => {
        let result = CMC_Coin.findOne({_id: id});
        resolve(result);
    })
};


// Get Coin by symbol
module.exports.getCoinBySymbol = (symbol) => {
    return new Promise((resolve) => {
        let result = CMC_Coin.findOne({symbol: symbol});
        resolve(result);
    })
};