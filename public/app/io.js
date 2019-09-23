//Зарпос всех позиций

socket.emit('hello', 'kitchen', (data) => {
    console.log("Запрос данных с сервера(hello):");
    console.log(data);
    app.parseData(data);
});


//Запрос всех чеков
socket.emit('hello', 'guests', (data) => {
    console.log("Запрос статусов заказов(hello):");
    console.log(data);
    app.parseDataStatuses(data);
});


//Новая позиция
socket.on('test', function (userData) {
   let newPos = newPosDTO(userData)
   app.newPosition(newPos)

});

//Удаление позиции

socket.on('delete', function (userData) {
    let deletedPos = newPosDTO(userData)
    app.deletePos(deletedPos)
});

//Прилетела информация чека
socket.on('checkAdd', function (userData) {
    let newOrder = newOrderDTO(userData)
    app.newOrder(newOrder)
    });

//Удаление по номеру чека

socket.on('checkDel', function (msg) {
    app.deleteOrder(msg.id)
});

socket.on('checkEnd', function (msg) {
    app.deleteOrder(msg.id)
});

//В готовку, не знаю зачем, но добавлю
socket.on('checkToReady', function (msg) {
    app.readyOrder(msg.id)

});


//Отправка данных
function sendToReady(order){
    let msg = {
        id: order.order,
        name: order.order,
        flag: order.flag,
        guestName: order.guestName,
        restoran: conf.restoran,
        checkNumber: order.order,
        checkNum: order.checkNum,
    }
    socket.emit('checkToReady_s', msg, (data) => {
        //console.log(data);
    });
}
function sendToDie(order){
    let msg = {
        id: order.order,
        name: order.order,
        flag: order.flag,
        guestName: order.guestName,
        restoran: conf.restoran,
        checkNumber: order.order,
        checkNum: order.checkNum,

    }

    socket.emit('deleteOrder_allVersion', msg, (data) => {
        //console.log(data);
    });
}

function deliveryChangeStatus(msg){
    console.log("io")
    socket.emit('deliveryStatus', msg, (data) => {
        console.log("Статус заказа "+msg.order_id+" сменен: "+ data);
    });
}
