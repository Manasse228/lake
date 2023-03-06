const mongoose = require('mongoose');

const CMC_Coins = require('./CMC_Coins');

const CMC_CoinMetadataSchema = new mongoose.Schema({
    _id: {
        type: String, ref: 'CMC_Coins'
    },
    website: [String],
    whitepaper: [String],
    twitter: [String],
    medium: [String],
    discord: [String],
    telegram: [String],
    facebook: [String],
    explorer: [String],
    reddit: [String],


    source_code_link: [String],
    tags: [String],
    tagsGroups: [String],
    logo: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    date_added: {
        type: Date,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    bitcointalk: {
        type: String,
        required: false
    },

});

const CMC_CoinMetadata = mongoose.model('CMC_CoinMetadata', CMC_CoinMetadataSchema);
module.exports = CMC_CoinMetadata;

/* Delete field
CMC_CoinMetadata.updateMany({}, {  $unset: { communityLink: true } }, { multi: true }, function (err, raw) {
    if (err) return console.log(err);
    console.log('The raw response from Mongo was ', raw);
});

//UserFinal.updateMany({}, { alreadyTakeToken : false }, { multi: true }, function (err, raw) {
UserFinal.updateMany({}, { botOpen : true }, { multi: true }, function (err, raw) {
    if (err) return console.log(err);
    console.log('The raw response from Mongo was ', raw);
});
 */

// get Coins which don't have metadata
module.exports.getRemainCoins = () => {
    return new Promise(async (resolve) => {
        const collectionBIds = await CMC_CoinMetadata.find().distinct('_id');
        const collectionAData = await CMC_Coins.find({_id: {$nin: collectionBIds}}).populate('_id');
        resolve(collectionAData);
    })
};

// Get all coins on database
module.exports.getCoinMetadata = () => {
    return new Promise((resolve) => {
        const query = {};
        let result = CMC_CoinMetadata.find(query, {timeout: false});
        resolve(result);
    })
};

// Get Coin by id
module.exports.getCoinById = (id) => {
    return new Promise((resolve) => {
        let result = CMC_CoinMetadata.findOne({_id: id});
        resolve(result);
    })
};


// Get Coin by symbol
module.exports.getCoinBySymbol = (symbol) => {
    return new Promise((resolve) => {
        let result = CMC_CoinMetadata.findOne({symbol: symbol});
        resolve(result);
    })
};