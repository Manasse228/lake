const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoinPlatformSchema = new mongoose.Schema({
    _idCMC: {
        type: String, required: false
    }, _idCG: {
        type: String, required: false
    }, blockchain: {
        type: String, required: false
    }, address: {
        type: String, required: false
    }, decimal: {
        type: String, required: false
    }, name: {
        type: String, required: false
    }, symbol: {
        type: String, required: false
    },

});

const CoinPlatform = mongoose.model('CoinPlatform', CoinPlatformSchema);
module.exports = CoinPlatform;

module.exports.checkExist = (idCG, blockchain) => {
    return new Promise((resolve) => {
        let result = CoinPlatform.findOne({_idCG: idCG, blockchain: blockchain});
        resolve(result);
    })
};



