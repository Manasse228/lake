const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoConf = require('./config/mongoDB');
const CoinGecko = require('coingecko-api');
const CoinCtrl = require('./routes/CoinCtrl');
const ExchangeCtrl = require('./routes/ExchangeCtrl');
const CoinDetailCtrl = require('./routes/CoinDetailCtrl');
const CMC_CoinCtrl = require('./routes/CMC_CoinCtrl');
const CMC_CoinMetadataCtrl = require('./routes/CMC_CoinMetadataCtrl');
const CG_CoinCtrl = require('./routes/CG_CoinCtrl');
//const TokenERC20Ctrl        = require('./routes/TokenERC20Ctrl');
const CoinDetail = require('./models/CoinDetails');
const locks = require('locks');

//const mutex   = locks.createMutex();
//const CoinGeckoClient = new CoinGecko();

//CMC_CoinMetadataCtrl.fetchAllCoinsMetadata().then();

//CMC_CoinMetadataCtrl.testRemainsCoinToFetch();

CG_CoinCtrl.initCoins().then();

//CG_CoinCtrl.getCoinDetailsSlowly("matic-network", "matic", 'Polygon').then();
//CG_CoinCtrl.fetchCoinDetail();

const app = express();

//CMC_CoinCtrl.getAllCoinsFromCMC(1, 5000).then();
//CMC_CoinCtrl.getAllCoinsFromCMC(5000, 5000).then();

// Save all coins on database
/*
const initiateCoinDB = async() => {
    let coinList = await CoinGeckoClient.coins.list();
    coinList = coinList.data;
    for (let i=0; i< coinList.length; i++) {
        await CoinCtrl.registerCoin(coinList[i].id, coinList[i].symbol, coinList[i].name);
    }
};
*/

// Save coin details like name
/*
const fetchCoinDetail =  () => {
    CoinCtrl.getAllCoins().then( async (result) => {
        for (let i=0; i< result.length; i++) {
            await CoinDetail.getCoinDetailById(result[i]._id, async (err, _result) => {
                if (!_result) {
                    try {
                        mutex.lock( async () => {
                            await getCoinDetailsSlowly(result[i]._id).then();
                            mutex.unlock();
                        });
                    } catch (e) {
                       console.log('error ', e)
                    }
                }
            })
        }
        CoinDetailCtrl.setCoingecko_Add_Date().then();
    })
} ;
*/


// Save coin detail one by one
/*
const getCoinDetailsSlowly = async (id) => {
    let data = await CoinGeckoClient.coins.fetch(encodeURI(id));
    await CoinDetailCtrl.register(id, data.data);
};
*/


// Save all exchanges
/*
const getAllExchanges = async () => {
    let data = await CoinGeckoClient.exchanges.all();
    for (let i=0; i<data.data.length; i++) {
        await ExchangeCtrl.register(data.data[i]);
    }
};
*/

//              CoinDetailCtrl.getNewCoins();

//getAllExchanges().then();

//initiateCoinDB().then( async () => {
/*let coinList = await CoinGeckoClient.coins.list();
coinList = coinList.data;
CoinCtrl.setDeleteCoin(coinList);*/
//fetchCoinDetail();
//} );

//fetchCoinDetail();

//TokenERC20Ctrl.registerTokenERC20().then();
//CoinDetailCtrl.updatePairNumber().then();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
