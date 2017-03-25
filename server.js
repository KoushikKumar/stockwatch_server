const http = require('http');
const socketio = require('socket.io');
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose =  require("mongoose");
const dotenv = require("dotenv");


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const router = require("./router");
const socket = require("./socket");
dotenv.load();

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type:'*/*'}));
socket(io);
router(app);

mongoose.connect(process.env.MONGO_URI, function(db){
  server.listen(process.env.PORT || 8080);  
});