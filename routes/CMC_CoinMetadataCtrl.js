const mongoConf = require('./../config/mongoDB');
const CMC_CoinMetadata = require('../models/CMC_CoinMetadata');
const Utils = require('../config/Utils');
const axios = require('axios');
const Coin = require("../models/CMC_Coins");

module.exports = {

    testRemainsCoinToFetch: () => {
        CMC_CoinMetadata.getRemainCoins().then(_result => {
            console.log('Test ', _result);
        })
    },
    fetchOneCoinDetails: async () => {
        let response = null;
        try {
            response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/info', {
                headers: {
                    'X-CMC_PRO_API_KEY': Utils.getCoinmarketCap_Key(),
                },
                params: {
                    id: 21967
                }
            });
        } catch (ex) {
            console.log('ex ', ex)
        }
        if (response) {
            console.log('response ', response);
        } else {
            console.log('response nothing')
        }
    },
    listingLatest: () => {
        return new Promise(async (resolve, reject) => {
            /*
                num_market_pairs
                max_supply
                circulating_supply
                total_supply

             */
            let response = null;
            try {
                response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
                    headers: {
                        'X-CMC_PRO_API_KEY': Utils.getCoinmarketCap_Key(),
                    },
                    params: {
                        start: 1,
                        limit: 100
                    }
                });
            } catch (ex) {
                response = null;
                // error
                console.log(ex);
                reject(ex);
            }
            if (response) {
                console.log('response ', response.data.data);

            } else {
                console.log('There are any response sir');
            }
        })
    },
    fetchCoinDetails: (ids) => {
        return new Promise(async (resolve, reject) => {
            let response = null;
            try {
                response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/info', {
                    headers: {
                        'X-CMC_PRO_API_KEY': Utils.getCoinmarketCap_Key(),
                    },
                    params: {
                        id: ids
                    }
                });
            } catch (ex) {
                response = null;
                // error
                console.log(ex);
                reject(ex);
            }
            if (response) {

                let cmcData = response.data.data;
                const arrayID = ids.split(",");

                arrayID.forEach(function (id) {

                    let coinDetail = {
                        _id: "",
                        website: [],
                        whitepaper: [],
                        twitter: [],
                        medium: [],
                        discord: [],
                        telegram: [],
                        facebook: [],
                        explorer: [],
                        reddit: [],
                        tags: [],
                        tagsGroups: [],
                        source_code_link: [],
                        logo: "",
                        description: "",
                        date_added: new Date(),
                        category: "",
                        bitcointalk: ""
                    }

                    coinDetail._id = id;
                    coinDetail.logo = cmcData[id].logo;
                    coinDetail.description = cmcData[id].description;
                    coinDetail.category = cmcData[id].category;
                    coinDetail.date_added = cmcData[id].date_added;

                    module.exports.addToArray(coinDetail.website, cmcData[id].urls.website).then(_result => {
                        coinDetail.website = _result;
                    });
                    module.exports.addToArray(coinDetail.whitepaper, cmcData[id].urls.technical_doc).then(_result => {
                        coinDetail.whitepaper = _result;
                    });
                    module.exports.addToArray(coinDetail.twitter, cmcData[id].urls.twitter).then(_result => {
                        coinDetail.twitter = _result;
                    });
                    module.exports.addToArray(coinDetail.facebook, cmcData[id].urls.facebook).then(_result => {
                        coinDetail.facebook = _result;
                    });
                    module.exports.addToArray(coinDetail.explorer, cmcData[id].urls.explorer).then(_result => {
                        coinDetail.explorer = _result;
                    });
                    module.exports.addToArray(coinDetail.reddit, cmcData[id].urls.reddit).then(_result => {
                        coinDetail.reddit = _result;
                    });
                    module.exports.addToArray(coinDetail.tags, cmcData[id].tags).then(_result => {
                        coinDetail.tags = _result;
                    });
                    module.exports.addToArray(coinDetail.tagsGroups, cmcData[id]["tag-groups"]).then(_result => {
                        coinDetail.tagsGroups = _result;
                    });
                    module.exports.addToArray(coinDetail.source_code_link, cmcData[id].urls.source_code).then(_result => {
                        coinDetail.source_code_link = _result;
                    });

                    cmcData[id].urls.chat.forEach(function (url) {
                        if (module.exports.isDiscordInviteLink(url)) {
                            coinDetail.discord.push(url);
                        }
                        if (module.exports.isTelegramUrl(url)) {
                            coinDetail.telegram.push(url);
                        }
                    })

                    cmcData[id].urls.message_board.forEach(function (url) {
                        if (module.exports.isMediumUrl(url)) {
                            coinDetail.medium.push(url);
                        }
                    })

                    cmcData[id].urls.announcement.forEach(function (url) {
                        if (module.exports.isBitcointalkUrl(url)) {
                            coinDetail.bitcointalk = url;
                        }
                    })

                    const CMC_CoinMetadataInstance = new CMC_CoinMetadata();
                    CMC_CoinMetadataInstance._id = coinDetail._id;
                    CMC_CoinMetadataInstance.website = coinDetail.website;
                    CMC_CoinMetadataInstance.whitepaper = coinDetail.whitepaper;
                    CMC_CoinMetadataInstance.twitter = coinDetail.twitter;
                    CMC_CoinMetadataInstance.medium = coinDetail.medium;
                    CMC_CoinMetadataInstance.discord = coinDetail.discord;
                    CMC_CoinMetadataInstance.telegram = coinDetail.telegram;
                    CMC_CoinMetadataInstance.facebook = coinDetail.facebook;
                    CMC_CoinMetadataInstance.explorer = coinDetail.explorer;
                    CMC_CoinMetadataInstance.reddit = coinDetail.reddit;
                    CMC_CoinMetadataInstance.source_code_link = coinDetail.source_code_link;
                    CMC_CoinMetadataInstance.tags = coinDetail.tags;
                    CMC_CoinMetadataInstance.tagsGroups = coinDetail.tagsGroups;
                    CMC_CoinMetadataInstance.logo = coinDetail.logo;
                    CMC_CoinMetadataInstance.description = coinDetail.description;
                    CMC_CoinMetadataInstance.date_added = coinDetail.date_added;
                    CMC_CoinMetadataInstance.category = coinDetail.category;
                    CMC_CoinMetadataInstance.bitcointalk = coinDetail.bitcointalk;
                    CMC_CoinMetadataInstance.save()
                        .then((tk) => {
                            console.log('Save of ', id);
                        })
                        .catch(err => {
                            console.log('Error during saving ', CMC_CoinMetadataInstance._id)
                        })
                });

            } else {
                console.log('There are any response sir');
            }
        })
    },
    checkId: async (coin) => {
        return new Promise(async (resolve, reject) => {
            CMC_CoinMetadata.getCoinById(coin._id).then(_result => {
                if (!_result) {
                    resolve(coin._id);
                }
                resolve(0);
            })
        })
    },
    getCoinsData: () => {
        return new Promise(async (resolve, reject) => {
            let allID = '';
            CMC_CoinMetadata.getRemainCoins().then(coins => {

                const promises = coins.map(module.exports.checkId);
                return Promise.all(promises).then((_result) => {

                    let _resultUpdate = _result.filter((num) => num !== 0 || num !== '21967');
                    _resultUpdate = _resultUpdate.filter((item) => Boolean(item));
                    _resultUpdate = [...new Set(_resultUpdate)];

                    let chunkSize = 1;
                    let result = [];
                    for (let i = 0; i < _resultUpdate.length; i += chunkSize) {
                        let chunk = _resultUpdate.slice(i, i + chunkSize);
                        result.push(chunk.join(','));
                    }

                    allID = _resultUpdate.join(',');

                    console.log('result ', result);

                    module.exports.fetchCoinDetails(result[1]).then();

                });


            })

            resolve(allID);
        })
    },
    fetchAllCoinsMetadata: async () => {
        return new Promise(async (resolve, reject) => {
            module.exports.getCoinsData().then(_allIDS => {
            })
        })
    },
    addToArray: (_array, _list) => {
        return new Promise((resolve, reject) => {
            if (_list) {
                _list.forEach(function (info) {
                    _array.push(info);
                })
            }
            resolve(_array)
        })
    },
    isDiscordInviteLink: (url) => {
        let discordRegex = /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9-]+$/;
        return discordRegex.test(url);
    },
    isTelegramUrl: (url) => {
        let telegramRegex = /^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z0-9_]+$/;
        return telegramRegex.test(url);
    },
    isMediumUrl: (url) => {
        let mediumRegex = /^https?:\/\/medium\.com\/@([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)$/;
        return mediumRegex.test(url);
    },
    isBitcointalkUrl: (url) => {
        let bitcointalkRegex = /^https?:\/\/bitcointalk\.org\/index\.php\?topic=\d+$/;
        let bitcointalkRegex2 = /^https?:\/\/bitcointalk\.org\/index.php\?topic=\d+(\.\d+)?$/;
        return (bitcointalkRegex.test(url)) ? true : bitcointalkRegex2.test(url);
    }


}


