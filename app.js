var express = require('express');
var conf = require('./conf');
var app = express();
var logger = require('log4js').getLogger();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ioc = require('socket.io-client')('http://'+conf.ip+':'+conf.port);
var jsonCheck = {};
var jsonPosition = {};
let pizzulya = {
    pepper: {
        name: "",
        count: 0
    },
    classic: {
        name: "",
        count: 0
    },
    sirkur: {
        name: "",
        count: 0
    }
};
var mssql = require('./mssql');
const services = require('./services');
const grafFetch = require('./fetch/grafFetch');
const sendPizzulya = function(data){
    ioc.emit('sendPizzulya', data, (answer) => {
    //console.log(answer);
});
}

const pizzulaCheck = function(data, oper){

    if (data.name.indexOf("Кусочек Класс") !== -1){
        if (oper == 1){
            pizzulya.classic.count = pizzulya.classic.count - 1
            sendPizzulya(pizzulya)
            return true}
        if (oper == 0){
            pizzulya.classic.count = pizzulya.classic.count + 1
            sendPizzulya(pizzulya)
            return true }
    }
    if (data.name.indexOf("Кусочек Сырной") !== -1){
        if (oper == 1){
            pizzulya.sirkur.count = pizzulya.sirkur.count - 1
            sendPizzulya(pizzulya)
            return true}
        if (oper == 0){
            pizzulya.sirkur.count = pizzulya.sirkur.count + 1
            sendPizzulya(pizzulya)
            return true }
    }
    if (data.name.indexOf("Кусочек Пепперони") !== -1){
        if (oper == 1){
            pizzulya.pepper.count = pizzulya.pepper.count - 1
            sendPizzulya(pizzulya)
            return true }
        if (oper == 0){
            pizzulya.pepper.count = pizzulya.pepper.count + 1
            sendPizzulya(pizzulya)
            return true }
    }
    return false

}


function synch(){
    let finded = []
for(let key in jsonCheck){
       let checking = false
    for(let item in jsonPosition){

        if(jsonPosition[item].unit == jsonCheck[key].id){
            checking = true
        }
    }
    if(!checking){
        finded.push(key)
    }
}

finded.map(item => {
    ioc.emit('deleteOrder_allVersion', {id: item}, (data) => {
        //  console.log(data); // data will be 'woot'
    });
    return item
})
}

setInterval(synch, 30000)
server.listen(conf.port, conf.ip, function(){
    var addr = server.address();
    logger.debug('listening on '+addr.address+':' + addr.port);
});

app.use(express.static(__dirname+'/public'));


app.use(express.static(__dirname+'/public'));
app.use('/fonts', express.static(__dirname+'/public/data/uikit2/fonts/'));

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
    res.sendFile(__dirname+'/public/data/uikit2/js/uikit.min.js');
});
app.get('/slideshow-fx.js', function(req,res){
    res.sendFile(__dirname+'/public/data/uikit2/js/components/slideshow-fx.js');
});
app.get('/slideshow.js', function(req,res){
    res.sendFile(__dirname+'/public/data/uikit2/js/components/slideshow.js');
});

app.get('/uikit.css', function(req,res){
    res.sendFile(__dirname+'/public/data/uikit2/css/uikit.almost-flat.min.css');
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
app.get('/guests_vert', function(req,res){
    res.sendFile(__dirname+'/public/guest_vert.html');
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
app.get('/newCheck', async function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
//logger.info(req.query.name+' Get запрос принят ');
// Необходимо следущее
//id
//name
jsonCheck[req.query.id] = {};
//logger.info("Name = "+req.query.name);
jsonCheck[req.query.id].name = req.query.name;
//logger.info("jsonCheck[req.query.id].name = "+jsonCheck[req.query.id].name);
jsonCheck[req.query.id].id = req.query.id;
jsonCheck[req.query.id].ready = 0;
jsonCheck[req.query.id].payed = 1;
jsonCheck[req.query.id].checkType = req.query.checkType;
jsonCheck[req.query.id].checkSum = req.query.checkSum;
jsonCheck[req.query.id].checkNum = req.query.checkNum;
jsonCheck[req.query.id].checkTime = Math.round(new Date().getTime()/1000);
req.query.checkTime = jsonCheck[req.query.id].checkTime;
if(req.query.code){
    jsonCheck[req.query.id].code = req.query.code;
}else {
    jsonCheck[req.query.id].code = "";
}
if(req.query.guestName){
    jsonCheck[req.query.id].guestName = req.query.guestName;
}else{
    jsonCheck[req.query.id].guestName = ""
}

    let date = new Date()
    let dateTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("\n \r "+dateTime + " - newCheck: "+ req.query.id + ", ip: "+ ip)

jsonCheck[req.query.id].flag = req.query.flag;
ioc.emit('checkAdd_s', req.query, (data) => {
//  console.log(data); // data will be 'woot'
});

res.sendStatus("200");
});

app.get('/delCheck', function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

// Необходимо следущее
//id
    let date = new Date()
    let dateTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("\n \r "+dateTime + " - delCheck: "+ req.query.id + ", ip: "+ ip)
ioc.emit('checkDel_s', req.query, (data) => {
//  console.log(data); // data will be 'woot'
});

res.sendStatus("200");
});

//добавление позиции на кухонный монитор
//
app.get('/new', function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

// Необходимо следущее
//id
//name
pizzulaCheck(req.query, 1)
jsonPosition[req.query.id] = {};
jsonPosition[req.query.id].name = req.query.name;
jsonPosition[req.query.id].id = req.query.id;
jsonPosition[req.query.id].unit = req.query.unit;
jsonPosition[req.query.id].station = req.query.station;
jsonPosition[req.query.id].checkType = req.query.checkType;
jsonPosition[req.query.id].flag = req.query.flag;

ioc.emit('test', req.query, (data) => {
  //console.log(data);
});
res.sendStatus("200");
});

app.get('/del', function(req,res){
// Необходимо следущее:
//id
    if(jsonPosition[req.query.id]){
        pizzulaCheck(jsonPosition[req.query.id], 0)
    }

        ioc.emit('del', req.query, (data) => {
        //  console.log(data); // data will be 'woot'
    });
    res.sendStatus("200");
});
app.use(require('body-parser').json());
app.post('/fullCheck', function (req, res) {
    io.sockets.emit('fullCheck', req.body);
    res.sendStatus("200")
})


io.on('connection', async function(socket){




  socket.on('hello', (nameStation, fn) => {
    if (nameStation == "guests"){
        fn(jsonCheck);
    }
    else if (nameStation == "kitchen" ){
        fn(jsonPosition);
    }
    else if (nameStation == "pizzulya" ){
        fn(pizzulya);
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
    })

    socket.on('newPizzulya', function(msg){
       pizzulya = msg
    });

    socket.on('sendPizzulya', function(msg){
        socket.broadcast.emit('sendPizzulya', msg);
    });

    socket.on('del', function(msg){
      delete jsonPosition[msg.id];
      socket.broadcast.emit('delete', msg);
     });

    socket.on('deliveryStatus', async function(msg, fn){

        let result = await services.sendStatus(msg)
        fn(result)

     });
    socket.on('getFullChecks', async function(msg, fn){

        let result = await grafFetch.getActiveSales(msg)
        fn(result)

     });
    socket.on('changeSaleStatus', async function(msg, fn){

        let result = await grafFetch.changeSaleStatus(msg)
        fn(result)

     });

    socket.on('checkEnd_s', function(msg){
      delete jsonCheck[msg.id];
      socket.broadcast.emit('checkEnd', msg);
     });

    socket.on('deleteOrder_allVersion', function(msg){
        if(jsonCheck[msg.id]) delete jsonCheck[msg.id];

        for(let key in jsonPosition){
            if(jsonPosition[key].unit == msg.id){
                socket.broadcast.emit('delete', jsonPosition[key]);
                delete jsonPosition[key]
            }

        }

        socket.broadcast.emit('checkEnd', msg);
        socket.broadcast.emit('checkDel', msg);
    });

    socket.on('checkToReady_s', function(msg){
        if(msg.checkTime && msg.checkType != '3'){
            let date = new Date()
            let time = Math.round(date.getTime()/1000);
            msg.timerValue = Number(time) - Number(msg.checkTime)
            msg.dateYear = date.getFullYear()
            msg.dateMonth = date.getMonth()
            msg.dateDay = date.getDate()
            msg.dateTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            mssql.register(msg)
        }





      if(jsonCheck[msg.id]){
        jsonCheck[msg.id].readyTime = msg.readyTime;
        jsonCheck[msg.id].ready =1;
        msg.checkType = jsonCheck[msg.id].checkType;
        msg.guestName = jsonCheck[msg.id].guestName;
      }

    socket.broadcast.emit('checkToReady', msg);
     });

});
