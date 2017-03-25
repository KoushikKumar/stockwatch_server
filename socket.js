const StockController = require("./controllers/stock_controller");

module.exports = function(io) {
  io.on('connection', socket => {
    StockController.emitAvaialbleStocks(socket);  
    socket.on('addStock', stock => {
        StockController.addStockOnlyIfValid(stock, socket);
    });
    socket.on('removeStock', stock => {
        StockController.removeAndEmitStock(stock, socket);
    });
  });
};