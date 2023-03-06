
module.exports = {

    getErrors: (res, err) => {
        return module.exports.getJsonResponse('error', 400, err.array().filter(function (item) {
            delete item.value;
            delete item.location;
            delete item.param;
            return item;
        })[0].msg, '', res);
    },
    getJsonResponse: (status, errorcode, errortext, data, res) => {
        res.json({
            status: status,
            errorcode: errorcode,
            errortext: errortext,
            data: data,
        });
    },
    getCoinmarketCap_Key: () => {
        //return "3dc0d01b-4d59-4082-88f7-401aed3ec7d2" ;
        return "94aceda3-e6b7-4fe2-a56d-037410cdf8c9" ;
    },
}