const http = require('http');
const socketio = require('socket.io');
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const router = require("./router");

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type:'*/*'}));
router(app);

var stocks = [];

io.on('connection', socket => {
    socket.emit('availableStocks', {
        availableStocks:stocks   
    });
    socket.on('addStock', stock => {
        stocks.unshift(stock);
        socket.broadcast.emit('newlyReceivedStock', {
          stockName:stock
        });
    });
    socket.on('removeStock', stock => {
        stocks.splice(stocks.indexOf(stock), 1);
        socket.broadcast.emit('newlyRemovedStock', {
            stockName:stock 
        });
    });
});

server.listen(process.env.PORT || 8080);