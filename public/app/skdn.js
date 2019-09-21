const skdn = function(positions){


    //СКДН по названиям (a, СТРОКА ПОИСКА, ПОЗИЦИЯ ПО АЛФАВИТУ)
    function listCheck(a){

        a = check(a, "0.", 1)
        a = check(a, "0мл", 1)
        a = check(a, "5мл", 1)
        a = check(a, "соус", 2)
        a = check(a, "фри", 2)
        a = check(a, "картоф", 2)
        a = check(a, "ургер", "б")
        a = check(a, "морож", "я")
        a = check(a, "мафин", "б")
        a = check(a, "кейк", "б")
        return a
    }

    function check(a, str, skdnnum){
        const string =  a.name.toUpperCase()
        str = str.toUpperCase()
        if(a && !a.parent){

            if (~string.indexOf(str)) {
                a.parent = skdnnum
            }
        }
        return a
    }

    function compare(a, b) {
        a = listCheck(a)
        b = listCheck(b)
        let compA = a.parent + a.name
        let compB = b.parent + b.name
        if (compA > compB) return 1; // если первое значение больше второго
        if (compA == compB) return 0; // если равны
        if (compA < compB) return -1; // если первое значение меньше второго
    }


    positions.sort(compare)
    return positions
}