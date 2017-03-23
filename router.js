const yahooFinance = require("yahoo-finance");

module.exports = function(app) {
    app.get('/', function(req, res, next){
       yahooFinance.historical({
          symbols: ['AAPL', 'GOOGL', 'YHOO', 'B', 'C'],
          from: '2016-03-16',
          to: '2017-03-16'
        }, function (err, result) {
            if(err){
                console.error(err);
            }
            res.json(result);
            
        });      
    });
    
    app.get('/hello', function(req, res, next){
      res.json({"Helo":"fggbfh"});    
    });
};