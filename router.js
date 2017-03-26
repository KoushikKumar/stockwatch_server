const StockController = require("./controllers/stock_controller");

module.exports = function(app) {
    app.get('/get-stock-data', StockController.availableStocks);
    
    app.get('/', function(req, res, next){
      res.send("server started successfully");    
    });
};