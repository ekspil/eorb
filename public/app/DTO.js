
const newPosDTO = function(data) {
    let newPos = {
        id: data.id,
        order: data.unit,
        checkType: data.checkType,
        name: data.name,
        count: data.count || 1,
        parent: data.parent,
        station: data.station,
        mods: []
    }
    if(newPos.name){
        let mods = newPos.name.split("@")
        if(mods.length > 1){
            mods.shift()
            newPos.mods.push(...mods)
        }
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
        die: data.die || false,
        alarm: data.alarm || false,
        readyTime: data.readyTime || 0,
        flag: data.flag || "",
        checkNum: data.checkNum || "",
        checkSum: data.checkSum || "",
        code: data.code || "",
        guestName: data.guestName || "",
        extId: data.extId || "",
        positions: [],
        takeOut: data.takeOut,
        text: data.text || ""
    }
    return newO
}