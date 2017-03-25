const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    stocks:[String]
}, { minimize: false });

const ModelClass = mongoose.model('stock', stockSchema);
module.exports = ModelClass;