const mongoConf = require('./../config/mongoDB');
const CG_CoinMetadata = require('../models/CG_CoinMetadata');
const axios = require('axios');
const CoinGecko = require('coingecko-api');
const locks = require('locks');
const CoinPlatform = require("../models/CoinPlatform");
const mutex = locks.createMutex();

const CoinGeckoClient = new CoinGecko();

module.exports = {

    fetchCoinDetail: () => {
        CG_CoinMetadata.getRemainCoins().then(async (result) => {
            for (let i = 0; i < result.length; i++) {
                try {
                    mutex.lock(() => {
                        setTimeout(async () => {
                            let data = await CoinGeckoClient.coins.fetch(encodeURI(result[i]._idCG));
                            module.exports.getCoinDetailsSlowly(result[i]._idCG, result[i].symbol, result[i].name, data).then(_ => {
                                mutex.unlock();
                            });
                        }, 15000);
                    });
                } catch (e) {
                    console.log('error ', e)
                }
            }
        })
    },
    getCoinDetailsSlowly: async (id, symbol, name, data) => {
        return new Promise(async (resolve, reject) => {

            module.exports.addCoinPlatform(id, symbol, name, data.data).then(async _ => {
                await module.exports.updateCoin(id, symbol, name, data.data);
                resolve();
            });
        })
    },
    addCoinPlatform: async (id, symbol, name, data) => {
        return new Promise(async (resolve, reject) => {
            if (data && data.detail_platforms) {
                for (const platform in data.detail_platforms) {
                    await CoinPlatform.checkExist(id, platform).then(_result => {
                        if (!_result) {
                            const coinPlatformInstance = new CoinPlatform();
                            coinPlatformInstance._idCG = id;
                            coinPlatformInstance.name = name;
                            coinPlatformInstance.symbol = symbol;
                            coinPlatformInstance.blockchain = platform;
                            coinPlatformInstance.address = data.detail_platforms[platform].contract_address ? data.detail_platforms[platform].contract_address : "";
                            coinPlatformInstance.decimal = data.detail_platforms[platform].decimal_place ? data.detail_platforms[platform].decimal_place : "";
                            coinPlatformInstance.save().then(result => {
                                console.log('saved of ', id, ' plateform');
                            })
                        }
                    })
                }
            } else {
                console.log('data ', data)
            }
            resolve();
        })
    },
    updateCoin: async (id, symbol, name, data) => {
        let coinDetail = {
            _idCG: "",
            asset_platform_id: "",
            description: "",
            country_origin: "",
            logo: "",
            categories: [],
            bitcointalk: "",
            website: [],
            official_forum_url: [],
            telegram: [],
            twitter: [],
            medium: [],
            discord: [],
            facebook: [],
            reddit: [],
            github: [],
            bitbucket: []
        }

        coinDetail._idCG = id;
        coinDetail.asset_platform_id = data.asset_platform_id;

        for (const language in data.description) {
            if (language === 'en') {
                coinDetail.description = data.description[language] ? data.description[language] : "";
            }
        }

        for (const img in data.image) {
            if (img === 'small') {
                coinDetail.logo = data.image[img] ? data.image[img] : "";
            }
        }

        coinDetail.country_origin = data.country_origin ? data.country_origin : "";
        coinDetail.bitcointalk = data.bitcointalk_thread_identifier ? data.bitcointalk_thread_identifier : "";

        module.exports.addToArray(coinDetail.categories, data.categories).then(_result => {
            coinDetail.categories = _result;
        });

        for (const item in data.links) {
            if (item === 'homepage') {
                module.exports.addToArray(coinDetail.website, data.links[item]).then(_result => {
                    coinDetail.website = _result;
                });
            }

            if (item === 'official_forum_url') {
                data.links[item].forEach(function (url) {
                    console.log('official_forum_url ', url)
                })
            }

            if (item === 'announcement_url') {
                data.links[item].forEach(function (url) {
                    console.log('announcement_url ', url)
                })
            }

            if (item === 'facebook_username') {
                coinDetail.facebook.push((data.links[item]) ? "https://www.facebook.com/" + data.links[item] : "");
            }

            if (item === 'chat_url') {
                data.links[item].forEach(function (url) {
                    if (module.exports.isDiscordInviteLink(url)) {
                        coinDetail.discord.push(url);
                    }
                    if (module.exports.isTelegramUrl(url)) {
                        coinDetail.telegram.push(url);
                    }
                })
            }

            if (item === 'twitter_screen_name') {
                coinDetail.twitter.push((data.links[item]) ? "https://twitter.com/" + data.links[item] : "");
            }

            if (item === 'telegram_channel_identifier') {
                coinDetail.telegram.push((data.links[item]) ? "https://t.me/" + data.links[item] : "");
            }

            if (item === 'subreddit_url') {
                coinDetail.reddit.push((data.links[item]) ? data.links[item] : "");
            }

        }

        if ((data.links && data.links.repos_url.github)) {
            module.exports.addToArray(coinDetail.github, data.links.repos_url.github).then(_result => {
                coinDetail.github = _result;
            });
        }

        if ((data.links && data.links.repos_url.bitbucket)) {
            module.exports.addToArray(coinDetail.bitbucket, data.links.repos_url.bitbucket).then(_result => {
                coinDetail.bitbucket = _result;
            });
        }

        const CG_CoinMetadataInstance = new CG_CoinMetadata();
        CG_CoinMetadataInstance._idCG = coinDetail._idCG;
        CG_CoinMetadataInstance.asset_platform_id = coinDetail.asset_platform_id;
        CG_CoinMetadataInstance.description = coinDetail.description;
        CG_CoinMetadataInstance.country_origin = coinDetail.country_origin;
        CG_CoinMetadataInstance.logo = coinDetail.logo;
        CG_CoinMetadataInstance.categories = coinDetail.categories;
        CG_CoinMetadataInstance.bitcointalk = coinDetail.bitcointalk;
        CG_CoinMetadataInstance.website = coinDetail.website;
        CG_CoinMetadataInstance.official_forum_url = coinDetail.official_forum_url;
        CG_CoinMetadataInstance.telegram = coinDetail.telegram;
        CG_CoinMetadataInstance.twitter = coinDetail.twitter;
        CG_CoinMetadataInstance.medium = coinDetail.medium;
        CG_CoinMetadataInstance.discord = coinDetail.discord;
        CG_CoinMetadataInstance.facebook = coinDetail.facebook;
        CG_CoinMetadataInstance.reddit = coinDetail.reddit;
        CG_CoinMetadataInstance.github = coinDetail.github;
        CG_CoinMetadataInstance.bitbucket = coinDetail.bitbucket;
        CG_CoinMetadataInstance.save()
            .then((tk) => {
                console.log('Save of ', id);
            })
            .catch(err => {
                console.log('Error during saving ', CG_CoinMetadataInstance._idCG)
            })

    },
    set_Add_Date: async () => {
        await CG_CoinMetadata.getAllCoinMetadata(async result => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].image && result[i].image.startsWith("https://assets.coingecko.com/coins/images/") && !result[i].add_at) {

                    let break_img_link = result[i].image.split("https://assets.coingecko.com/coins/images/");
                    let img_number = break_img_link[1].split("/");
                    img_number = Number(img_number[0]);

                    await axios.get('https://www.coingecko.com/price_charts/' + img_number + '/usd/max.json')
                        .then(async response => {

                            if (!response.data.error) {
                                let _date = Number(response.data.stats[0][0]);
                                _date = new Date(_date * 1000);
                                await CG_CoinMetadata.addDate(result[i]._id, _date, response.data.stats[0][0], (err, _result) => {
                                    console.log("Coin ", result[i]._id, " ", _date, response.data.stats[0][0]);
                                })
                            }

                        })
                        .catch(error => {
                            //console.log(error);
                        });

                }
            }
        })
    },
    addToArray: (_array, _list) => {
        return new Promise((resolve, reject) => {
            if (_list) {
                _list.forEach(function (info) {
                    if (info) {
                        _array.push(info);
                    }
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


