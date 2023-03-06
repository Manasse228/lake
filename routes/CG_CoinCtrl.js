const mongoConf = require('./../config/mongoDB');
const CG_Coins = require('../models/CG_Coins');
const Utils = require('../config/Utils');
const axios = require('axios');
const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();

module.exports = {

    initCoins: async () => {
        let coinList = await CoinGeckoClient.coins.list();
        coinList = coinList.data;
        for (let i = 0; i < coinList.length; i++) {
            await module.exports.registerCoin(coinList[i].id, coinList[i].symbol, coinList[i].name);
        }
    },
    registerCoin: async (id, symbol, name) => {
        await CG_Coins.getCoinById(id).then(result => {
            if (!result) {
                const coinInstance = new CG_Coins();
                coinInstance._idCG = id;
                coinInstance.name = name;
                coinInstance.symbol = symbol;
                coinInstance.save().then(() => {
                    console.log('Coin ', id, ' is saved');
                })
            }
        })
    }

}


