
const newPosDTO = function(data) {
    let newPos = {
        id: data.id,
        order: data.unit,
        checkType: data.checkType,
        name: data.name,
        count: 1,
        parent: data.parent,
        station: data.station,
        mods: []
    }
    return newPos
}
const newOrderDTO = function(data) {
    let newO = {
        checkType: data.checkType,
        checkTime: data.checkTime || Math.round(new Date().getTime()/1000)-300,
        order: data.unit || data.order || data.id,
        payed: data.payed || 0,
        ready: data.ready || 0,
        flag: data.flag || "",
        checkNum: data.checkNum || "",
        checkSum: data.checkSum || "",
        code: data.code || "",
        guestName: data.guestName || "",
        positions: []
    }
    return newO
}