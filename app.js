var express = require('express');
var conf = require('./conf');
var app = express();
var logger = require('log4js').getLogger();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ioc = require('socket.io-client')('http://'+conf.ip+':'+conf.port);
var jsonCheck = {};
var jsonPosition = {};
var mssql = require('./mssql');

server.listen(conf.port, conf.ip, function(){
    var addr = server.address();
    logger.debug('listening on '+addr.address+':' + addr.port);
});

app.use(express.static(__dirname+'/public'));


app.use(express.static(__dirname+'/public'));
app.use('/fonts', express.static(__dirname+'/node_modules/uikit/src/fonts/'));

app.get('/socket.io.js', function(req,res){
    res.sendFile(__dirname+'/node_modules/socket.io-client/dist/socket.io.js');
});

app.get('/confIo.js', function(req,res){
    res.sendFile(__dirname+'/confIo.js');
});

app.get('/jquery.js', function(req,res){
    res.sendFile(__dirname+'/node_modules/jquery/dist/jquery.min.js');
});

app.get('/uikit.js', function(req,res){
    res.sendFile(__dirname+'/node_modules/uikit/dist/js/uikit.min.js');
});

app.get('/uikit.css', function(req,res){
    res.sendFile(__dirname+'/node_modules/uikit/dist/css/uikit.almost-flat.min.css');
});

app.get('/animate.css', function(req,res){
    res.sendFile(__dirname+'/node_modules/animate.css/animate.min.css');
});
app.get('/kitchen', function(req,res){
    res.sendFile(__dirname+'/public/smallsbor.html');
});
app.get('/guests', function(req,res){
    res.sendFile(__dirname+'/public/guest.html');
});
app.get('/favicon.ico', function(req,res){
    res.sendFile(__dirname+'/public/data/favicon.ico');
});
app.get('/kitchenNew', function(req,res){
    res.sendFile(__dirname+'/public/kitchen.html');
});
//добавление позиции на кухонный монитор
//
//
app.get('/newCheck', function(req,res){
logger.info(req.query.name+' Get запрос принят ');
// Необходимо следущее
//id
//name
jsonCheck[req.query.id] = {};
logger.info("Name = "+req.query.name);
jsonCheck[req.query.id].name = req.query.name;
logger.info("jsonCheck[req.query.id].name = "+jsonCheck[req.query.id].name);
jsonCheck[req.query.id].id = req.query.id;
jsonCheck[req.query.id].ready = 0;
jsonCheck[req.query.id].payed = 1;
jsonCheck[req.query.id].checkType = req.query.checkType;
ioc.emit('checkAdd_s', req.query, (data) => {
//  console.log(data); // data will be 'woot'
});

res.sendStatus("200");
});

app.get('/delCheck', function(req,res){
// Необходимо следущее
//id
ioc.emit('checkDel_s', req.query, (data) => {
//  console.log(data); // data will be 'woot'
});

res.sendStatus("200");
});

//добавление позиции на кухонный монитор
//
app.get('/new', function(req,res){
// Необходимо следущее
//id
//name
jsonPosition[req.query.id] = {};
jsonPosition[req.query.id].name = req.query.name;
jsonPosition[req.query.id].id = req.query.id;
jsonPosition[req.query.id].unit = req.query.unit;
jsonPosition[req.query.id].station = req.query.station;
jsonPosition[req.query.id].checkType = req.query.checkType;

ioc.emit('test', req.query, (data) => {
  //console.log(data);
});
res.sendStatus("200");
});

app.get('/del', function(req,res){
// Необходимо следущее:
//id
        ioc.emit('del', req.query, (data) => {
        //  console.log(data); // data will be 'woot'
    });
    res.sendStatus("200");
});


io.on('connection', function(socket){

  socket.on('hello', (nameStation, fn) => {
    if (nameStation == "guests"){
        fn(jsonCheck);
    }
    else if (nameStation == "kitchen" ){
        fn(jsonPosition);
    }

    });

    socket.on('test', function(msg){
    socket.broadcast.emit('test', msg);
    });


    socket.on('checkDel_s', function(msg){
        delete jsonCheck[msg.id];
        socket.broadcast.emit('checkDel', msg);
    });

    socket.on('checkAdd_s', function(msg){
        socket.broadcast.emit('checkAdd', msg);
    });


    socket.on('timer', function(timemsg){
        mssql.register(timemsg);
    });

    socket.on('del', function(msg){
      delete jsonPosition[msg.id];
      socket.broadcast.emit('delete', msg);
     });

    socket.on('checkEnd_s', function(msg){
      delete jsonCheck[msg.id];
      socket.broadcast.emit('checkEnd', msg);
     });

    socket.on('checkToReady_s', function(msg){
      if(jsonCheck[msg.id]){
        jsonCheck[msg.id].ready =1;
      if(!msg.checkType){
        msg.checkType = jsonCheck[msg.id].checkType;
      }}

    socket.broadcast.emit('checkToReady', msg);
     });

});
