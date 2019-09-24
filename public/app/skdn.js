const skdn = function(positions){


    //СКДН по названиям (a, СТРОКА ПОИСКА, ПОЗИЦИЯ ПО АЛФАВИТУ)
    function listCheck(a){

        a = check(a, "картоф", "е")
        a = check(a, "наггетс", "е")
        a = check(a, "пельмен", "е")
        a = check(a, "баскет", "е")
        a = check(a, "крыл", "е")
        a = check(a, "кольца", "е")
        a = check(a, "ролл", "д")
        a = check(a, "бургер", "д")
        a = check(a, "спайси", "д")
        a = check(a, "Мистер ", "д")
        a = check(a, "донна", "д")
        a = check(a, "граф", "д")
        a = check(a, "мадам", "д")
        a = check(a, "пицца", "д")
        a = check(a, "чизкейк", "ж")
        a = check(a, "маффин", "ж")
        a = check(a, "пирожок", "ж")
        a = check(a, "любимый", "б")
        a = check(a, "бутылк", "б")
        a = check(a, "lipton", "б")
        a = check(a, "Minerale", "б")
        a = check(a, "Балтика", "б")
        a = check(a, "Соус", "г")
        return a
    }
    //СКДН по РОДИТЕЛЮ (a, СТРОКА ПОИСКА, ПОЗИЦИЯ ПО АЛФАВИТУ) - в приоритете
    function listCheckParent(a){

        a = checkParent(a, "Большие порции", "е")
        a = checkParent(a, "Пиво", "в")
        a = checkParent(a, "2. Картофель и наггетсы", "е")
        a = checkParent(a, "3. Соусы", "г")
        a = checkParent(a, "4. Горячие напитки", "а")
        a = checkParent(a, "5. Холодные напитки", "б")
        a = checkParent(a, "7. Дессерты", "ж")
        a = checkParent(a, "6. Салаты", "б")
        a = checkParent(a, "1. Сэндвичи", "д")
        return a
    }

    function check(a, str, skdnnum){

        if(a && !a.parent){
            const string =  a.name.toUpperCase()
            str = str.toUpperCase()
            if (~string.indexOf(str)) {
                a.parent = skdnnum
            }
        }
        else if(a && a.parent && a.parent.length > 1){
            a.parent = a.parent
            console.log(a.parent)
            const string =  String(a.parent).toUpperCase()
            str = str.toUpperCase()
            if (~string.indexOf(str)) {
                a.parent = skdnnum + a.parent
            }
        }
        return a
    }
    function checkParent(a, str, skdnnum){

        if(a && a.parent){
            const string =  a.parent.toUpperCase()
            str = str.toUpperCase()
            if (~string.indexOf(str)) {
                a.parent = skdnnum + a.parent
            }
        }
        return a
    }

    function compare(a, b) {
        a = listCheck(a)
        b = listCheck(b)
        a = listCheckParent(a)
        b = listCheckParent(b)
        let compA = a.parent + a.name
        let compB = b.parent + b.name
        if (compA > compB) return 1; // если первое значение больше второго
        if (compA == compB) return 0; // если равны
        if (compA < compB) return -1; // если первое значение меньше второго
    }


    positions.sort(compare)
    return positions
}