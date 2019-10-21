

var app = new Vue({
    el: '#app',
    data:{
        station: station,
        manager: manager,
        flag: flag,
        classes: {
            all: {
                start: "uk-height-90 uk-inline all-start",
                die: "uk-height-90 uk-inline all-die",
                alarm: "uk-height-90 uk-inline all-alarm",
            },
            delivery: {
                start: "uk-height-90 uk-inline all-start",
                payed: "uk-height-90 uk-inline delivery-process",
                ready: "uk-height-90 uk-inline delivery-ready",
            },
            restoran: {
                start: "uk-height-90 uk-inline all-start",
                payed: "uk-height-90 uk-inline kassa-process",
                ready: "uk-height-90 uk-inline kassa-ready",
            },
            app: {
                start: "uk-height-90 uk-inline all-start",
                payed: "uk-height-90 uk-inline app-process",
                ready: "uk-height-90 uk-inline app-ready",
            },


        },
        orders:[
            {
                checkType: 1,
                order: "A-231",
                payed: 1,
                ready: 1,
                flag: "",
                checkNum: "",
                checkSum: "",
                code: "",
                guestName: "",
                positions: [
                    {
                        name: "Гамбургер",
                        station: 1,
                        count: 2,
                        parent: "",
                        mods: ["Без лука", "Без сыра"]
                    },
                    {
                        name: "Гранд Ролл",
                        count: 0,
                        parent: "",
                        station: 1,
                        mods: ["Без лука", "Без сыра"]
                    },
                    {
                        name: "Чизбургер",
                        count: 3,
                        parent: "",
                        station: 1,
                        mods: []
                    },
                    {
                        name: "Фишбургер",
                        count: 0,
                        parent: "",
                        station: 2,
                        mods: []
                    },
                ]
            },
            ]

    },
    computed: {
        ordersList: function(){

            let orders = this.orders.map(ord =>{
                let newPos = []
                let order = JSON.parse(JSON.stringify(ord));
                order.positions = order.positions.map(pos =>{
                    let [poses] = newPos.filter(npos => npos && npos.name == pos.name)
                    if(!poses){
                        newPos.push(pos)
                    }
                    else {
                        newPos = newPos.map(npos => {
                            if(npos.name != pos.name){
                                return npos
                            }
                            npos.count = npos.count + pos.count
                            return npos
                        })
                    }

                    return pos
                })
                if(!station || station != 0){
                    newPos = newPos.filter(pos => pos.station == station)
                }
                order.positions = newPos
                order.positions = skdn(order.positions)
               return order
            })
            return orders
        }
    },
    methods: {
        onlyName: function(name){
            name = name.split("@")
            return name[0]
        },
        checkStation: function(order){
            let [any] = order.positions.filter(pos => pos.station == station)
            if(!any && station != 0) return false
            if(order.hide) return false
            return true
        },
        thistime: function(order){
            let time = Math.round(new Date().getTime()/1000) - Number(order.checkTime)
            let timeDie = Math.round(new Date().getTime()/1000) - Number(order.readyTime)
            if(timeDie > 900 && timeDie < 1800 && !order.die && (order.checkType == 4 || order.checkType == 5)){
                order.alarm = true
            }
            if(timeDie >= 1800 && (order.checkType == 4 || order.checkType == 5)){
                order.die = true
            }
            let timemin = Number((time/60).toString().split(/\./)[0])
            let timesec = time - (timemin*60)
            if(timemin < 10){
                timemin = "0"+timemin
            }
            if(timesec < 10){
                timesec = "0"+timesec
            }
            return timemin+":"+timesec
        },
        thisorderclass: function(order){
            if(!order.ready && !order.payed){
                return this.classes.all.start
            }
            if(order.payed && !order.ready && (order.checkType == 1 || order.checkType == 2)){
                return this.classes.restoran.payed
            }
            if(order.payed && order.ready && (order.checkType == 1 || order.checkType == 2)){
                return this.classes.restoran.ready
            }
            if(order.ready && order.alarm && !order.die){
                return this.classes.all.alarm
            }
            if(order.ready && order.die){
                return this.classes.all.die
            }
            if(order.payed && !order.ready && (order.checkType == 4 || order.checkType == 5)){
                return this.classes.app.payed
            }
            if(order.payed && order.ready && (order.checkType == 4 || order.checkType == 5)){
                return this.classes.app.ready
            }
            if(order.payed && !order.ready && order.checkType == 3){
                return this.classes.delivery.payed
            }
            if(order.payed && order.ready && order.checkType == 3){
                return this.classes.delivery.ready
            }

        },
        newPosition: function(data){
            let [thisorder] = this.orders.filter(order => order && order.order == data.order)
            if(thisorder){
                this.orders = this.orders.map(order => {
                    if(order.order != data.order){
                        return order
                    }
                    let [thispos] = order.positions.filter(pos => pos && pos.id == data.id)
                    if (thispos){
                        order.positions = order.positions.map(pos => {
                            if(pos.id != data.id) return pos
                            return data
                        })
                        return order

                    }else{
                        order.positions.push(data)
                        return order
                    }

                })
            }
            else{
                let newOrder = newOrderDTO(data)
                newOrder.positions.push(data)
                this.orders.push(newOrder)
            }

        },
        deletePos: function(data){
                let toDelete = -1
                this.orders = this.orders.map((order, index) => {
                    let toDeletePos = -1
                    order.positions = order.positions.map(pos => {

                        if(pos.id != data.id) return pos
                        pos.count = Number(pos.count) - Number(data.count)

                        return pos
                    })
                    order.positions = order.positions.filter(pos => {
                        let nameLength = pos.name.split("@").length
                        if(nameLength > 1 && pos.count == 0){
                            return false
                        }
                        return true
                    })
                    const posCountInOrder = order.positions.reduce((sum, pos)=>{
                        return sum + pos.count
                    }, 0)
                    if (posCountInOrder == 0){
                        toDelete = index
                        sendToDie(order)
                    }


                    return order
                })

                if(toDelete != -1){
                    this.orders.splice(toDelete, 1)
                }


        },
        newOrder: function(data){
            this.orders = this.orders.map(order => {
                if(order.order != data.order){
                    return order
                }
                if(data.payed){
                    order.payed = data.payed
                }
                else{
                    order.payed = 1
                }

                if (data.ready) order.ready = data.ready
                if (data.code) order.code = data.code
                if (data.flag) order.flag = data.flag
                if (data.guestName) order.guestName = data.guestName
                if (data.checkSum) order.checkSum = data.checkSum
                if (data.checkType) order.checkType = data.checkType
                if (data.checkNum) order.checkNum = data.checkNum
                if (data.checkTime) order.checkTime = data.checkTime
                return order
            })

        },
        deleteOrder: function(orderId){
            let toDelete = -1
            this.orders.map((order, index) => {
                if(order.order == orderId){
                    toDelete = index
                }
                return order
            })
            if(toDelete != -1){
                this.orders.splice(toDelete, 1)
            }
        },
        readyOrder: function(orderId, readyTime){

            this.orders.map(order => {
                if(order.order == orderId){
                    order.ready = 1
                    order.readyTime = readyTime
                }
                return order
            })
        },
        nextStatus: function(order){
            if(!manager){
                this.orders = this.orders.map(ord =>{
                    if(order.order != ord.order){
                        return ord
                    }
                    ord.hide = true
                    return ord
                })
                return false
            }
            if(!order.payed){
                return false
            }
            if(order.ready){
                if(order.checkType == 4 || order.checkType == 5){
                    deliveryChangeStatus({order_id: order.order, status: "done"})
                }
                sendToDie(order)
                this.deleteOrder(order.order)

            }
            if(!order.ready){
                if(order.checkType == 4 || order.checkType == 5){
                    order.readyTime = Math.round(new Date().getTime()/1000)
                    deliveryChangeStatus({order_id: order.order, status: "cooked"})

                }
                sendToReady(order)
                this.readyOrder(order.order, order.readyTime)


            }

        },
        alertDelete: function(order){
            if(!order.payed){
                console.log(order.pushTimes)
                if(!order.pushTimes){
                    this.orders = this.orders.map((ord)=>{
                        if(ord.order != order.order){
                            return ord
                        }
                        ord.pushTimes = 1
                        return ord
                    })
                }
                if(order.pushTimes){
                    this.orders = this.orders.map((ord)=>{
                    if(ord.order != order.order){
                        return ord
                    }
                    ord.pushTimes++
                    return ord
                })
                }
                if(order.pushTimes > 5){
                    sendToDie(order)
                    this.deleteOrder(order.order)
                }



            }
        },
        parseData: function(data){
            let newData = []
            for (let key in data){
                let [thisorder] = newData.filter(order => order && order.order == data[key].unit)
                if(!thisorder){
                    let newOrder = newOrderDTO(data[key])
                    let newPos = newPosDTO(data[key])
                    newOrder.positions.push(newPos)
                    newData.push(newOrder)
                }else{
                    newData = newData.map(order => {
                        if(order && order.order != data[key].unit){
                            return order
                        }

                        let newPos = newPosDTO(data[key])
                        order.positions.push(newPos)
                        return order


                    })
                }

            }
            this.orders = newData
        },
        parseDataStatuses: function(data){
            for (let key in data) {
                this.orders = this.orders.map(order =>{


                    if(!order || order.order != data[key].id){
                        return order
                    }
                    const newInfo = newOrderDTO(data[key])
                    order.payed = newInfo.payed
                    order.ready = newInfo.ready
                    order.code = newInfo.code
                    order.guestName = newInfo.guestName
                    order.checkSum = newInfo.checkSum
                    order.checkType = newInfo.checkType
                    order.checkTime = newInfo.checkTime || 1569038891
                    order.readyTime = newInfo.readyTime

                    return order

                })
            }
        },
        type: function(data){
            switch (data){
                case "1": return "В зале"
                case "2": return "На вынос"
                case "3": return "Доставка"
                case "4": return "App на вынос"
                case "5": return "App в зале"
                default: return "Не определено"
            }
        },

    }


})
