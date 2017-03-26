const Stock = require("../models/stocks");
const yahooFinance = require("yahoo-finance");

exports.emitAvaialbleStocks = function(socket) {
    Stock.findOne({}, function(err, stockData) {
       if(err) {
           console.error("unable to find the stocks");
           return;
       } 
       if(stockData) {
           socket.emit('availableStocks', {
                availableStocks:stockData.stocks   
           });
       }
    });
};

exports.availableStocks = function(req, res, next) {
    Stock.findOne({}, function(err, stockData) {
       if(err) {
           console.error("unable to find the stocks");
           return;
       }
       if(stockData && stockData.stocks && stockData.stocks.length) {
            yahooFinance.historical({
              symbols: stockData.stocks,
              from: getFromDate(),
              to: getToDate()
            }, function (err, result) {
                if(err){
                    console.error(err);
                }
                var resultJson = {};
                stockData.stocks.forEach((stock) => {
                    resultJson[stock] = [];
                    result[stock].forEach((d) => {
                        var stockInfo = {};
                        stockInfo["date"] = d["date"];
                        stockInfo["close"] = d["close"];
                        resultJson[stock].push(stockInfo);
                    });
                });
                res.json(resultJson);
            });   
       } else {
           res.json({});
       }
    });
};

exports.addStockOnlyIfValid = function(stock, socket) {
    yahooFinance.historical({
      symbols: [stock],
      from: "2017-03-05",
      to: "201703-06"
    }, function (err, result) {
        if(err){
            console.err("error while getting stock data");
        }
        if(result[stock].length) {
            addAndEmitStock(stock, socket);
        } else {
            socket.emit('errorMessage', "can not be added");
        }
    });  
};

exports.removeAndEmitStock = function(stock, socket) {
    Stock.findOne({}, function(err, stockData) {
       if(err) {
           console.error("unable to find the stocks");
           return;
       } 
       stockData.stocks.splice(stockData.stocks.indexOf(stock), 1);
       Stock.findOneAndUpdate({}, stockData, function(err, stockData){
           if(err) {
               console.error("unable to update the stocks");
               return;
           }
           socket.broadcast.emit('newlyRemovedStock', {
                stockName:stock 
           });
       });  
    });
};

function addAndEmitStock(stock, socket) {
    Stock.findOne({}, function(err, stockData) {
       if(err) {
           console.error("unable to find the stocks");
           return;
       } 
       
       if(stockData) {
           stockData.stocks.unshift(stock);
       } else {
           stockData = new Stock({stocks:stock});
           stockData.save(function(err){
                if(err) {
                   console.error("unable to save new stock");
                   return;
                }
                socket.emit('newlyReceivedStock', {
                  stockName:stock
                });
                socket.broadcast.emit('newlyReceivedStock', {
                  stockName:stock
                });
           });
       }
       Stock.findOneAndUpdate({}, stockData, function(err, stockData){
            if(err) {
               console.error("unable to update the stocks");
               return;
            }
            socket.emit('newlyReceivedStock', {
              stockName:stock
            });
            socket.broadcast.emit('newlyReceivedStock', {
              stockName:stock
            });
       });     
    });
}

function getFromDate() {
    var date = new Date();
    date.setDate(date.getDate()-365);
    return  date.getFullYear()  + "-" + (Number(date.getMonth()) + 1) + "-" + date.getDate();
}

function getToDate() {
    var date = new Date();
    return  date.getFullYear()  + "-" + (Number(date.getMonth()) + 1) + "-" + date.getDate();
}