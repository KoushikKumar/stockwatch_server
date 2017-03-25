const StockController = require("./controllers/stock_controller");

module.exports = function(app) {
    app.get('/get-stock-data', StockController.availableStocks);
    
    app.get('/hello', function(req, res, next){
      res.json({"Helo":"fggbfh"});    
    });
};