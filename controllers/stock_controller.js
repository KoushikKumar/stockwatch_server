const Stock = require("../models/stocks");

exports.emitAvaialbleStocks = function(socket) {
    Stock.findOne({}, function(err, stockData) {
       if(err) {
           console.error("unable to find the stocks");
           return;
       } 
       socket.emit('availableStocks', {
            availableStocks:stockData.stocks   
       });
    });
};

exports.addStock = function(stock) {
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
           });
       }
       Stock.findOneAndUpdate({}, stockData, function(err, stockData){
           if(err) {
               console.error("unable to update the stocks");
               return;
           }
       });     
    });
};

exports.removeStock = function(stock) {
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
       });  
    });
};