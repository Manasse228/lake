const mongoConf = require('./../config/mongoDB');
const Coin = require('../models/CMC_Coins');
const Utils = require('../config/Utils');
const axios = require('axios');

module.exports = {
    // Get all cryptocurrency on Coinmarketcap
    getAllCoinsFromCMC: async (_start, _limit) => {

        return new Promise(async (resolve, reject) => {

            let response = null;
            try {
                response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', {
                    headers: {
                        'X-CMC_PRO_API_KEY': Utils.getCoinmarketCap_Key(),
                    },
                    params: {
                        start: _start,
                        limit: _limit
                    }
                });
            } catch (ex) {
                response = null;
                // error
                console.log(ex);
                reject(ex);
            }
            if (response) {
                // success
                const cmcData = response.data;

                let i = 1;
                cmcData.data.forEach(function (coin) {
                    Coin.getCoinById(coin.id).then(_result => {
                        if (!_result) {
                            const CoinInstance = new Coin();
                            CoinInstance._id = coin.id;
                            CoinInstance.name = coin.name;
                            CoinInstance.symbol = coin.symbol;
                            CoinInstance.slug = coin.slug;
                            CoinInstance.save()
                                .then((tk) => {
                                })
                                .catch(err => {
                                    console.log('Error during saving ', coin.id)
                                })
                        } else {
                            console.log(coin.id, 'already exist');
                        }
                    }).catch()


                    //console.log(coin.name, coin.id, i);
                    i++;
                });
                //console.log("Data ", cmcData);
                resolve(cmcData);
            } else {
                console.log('There are any response sir');
            }

        })

    },

    /*
    DAWG 4999
    GNOME 5000


     */

};