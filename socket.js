const StockController = require("./controllers/stock_controller");

module.exports = function(io) {
  io.on('connection', socket => {
    StockController.emitAvaialbleStocks(socket);  
    socket.on('addStock', stock => {
        StockController.addStock(stock);
        socket.broadcast.emit('newlyReceivedStock', {
          stockName:stock
        });
    });
    socket.on('removeStock', stock => {
        StockController.removeStock(stock);
        socket.broadcast.emit('newlyRemovedStock', {
            stockName:stock 
        });
    });
  });
};