const mongoose = require('mongoose');
const CG_Coins = require("./CG_Coins");
const Schema = mongoose.Schema;

const CG_CoinMetadataSchema = new mongoose.Schema({
    _idCMC: {
        type: String, required: false
    },
    _idCG: {
        type: String, required: false
    },
    name: {
        type: String, required: false
    },
    symbol: {
        type: String, required: false
    },
    asset_platform_id: {
        type: String, required: false
    },
    description: {
        type: String, required: false
    },
    country_origin: {
        type: String, required: false
    },
    logo: {
        type: String, required: false
    },
    add_at: {
        type: Date, required: false
    },
    add_at_timestamp: {
        type: String, required: false
    },
    categories: [String],
    website: [String],
    official_forum_url: [String],
    telegram: [String],
    twitter: [String],
    medium: [String],
    discord: [String],
    facebook: [String],
    reddit: [String],
    github: [String],
    bitbucket: [String],

});

const CG_CoinMetadata = mongoose.model('CG_CoinMetadata', CG_CoinMetadataSchema);
module.exports = CG_CoinMetadata;

/*
CG_Coin.updateMany({}, { bitbucket : coinDetail. }, { multi: true }, function (err, raw) {
    if (err) return console.log(err);
    console.log('The raw response from Mongo was ', raw);
});*/

// Get all coins on database
module.exports.getAllCoinMetadata = () => {
    return new Promise((resolve) => {
        const query = {};
        let result = CG_CoinMetadata.find(query, {timeout: false});
        resolve(result);
    })
};

// get Coins which don't have metadata
module.exports.getRemainCoins = () => {
    return new Promise(async (resolve) => {
        const collectionBIds = await CG_CoinMetadata.find().distinct('_idCG');
        const collectionAData = await CG_Coins.find({_id: {$nin: collectionBIds}}).populate('_idCG');
        resolve(collectionAData);
    })
};

// Get Coin by id
module.exports.getCoinMetadataById = (id) => {
    return new Promise((resolve) => {
        let result = CG_CoinMetadata.findOne({_idCG: id});
        resolve(result);
    })
};


// Get Coin by symbol
module.exports.getCoinMetadataBySymbol = (symbol) => {
    return new Promise((resolve) => {
        let result = CG_CoinMetadata.findOne({symbol: symbol});
        resolve(result);
    })
};

module.exports.addDate = (id, add_at, add_at_timestamp, callback) => {
    const query = {_idCG: id};
    const newValues = {$set: {add_at: add_at, add_at_timestamp: add_at_timestamp}};
    CG_CoinMetadata.updateOne(query, newValues, callback);
};
