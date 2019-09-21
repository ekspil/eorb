
function updateTimers(){
    app.orders = app.orders.map(order=>{
        order.checkTime = order.checkTime
        return order
    })
}

setInterval(updateTimers, 1000)