
///////////////Settings///////////////////

console.log("Клиент запущен с натройками:");
console.log(conf);
console.log("----------------------------");
var port = conf.ioPort;
var server = conf.ioIp;
var socket = io.connect(server + ':' + port);
var messagesBox = $('#re-list');
var massageAlert = "Не стоит работать в гостевом режиме";
var urlArray = window.location.pathname.split('/');
var restoran = conf.restoran;

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}


var station = getUrlVars()["station"];  //Определяем значение станции 0 - все, 1 - бургеры, 2 - фри, 3 - прочее
var extras = getUrlVars()["extras"];  //1 есть панель дополнительных кнопок.
var manager = getUrlVars()["manager"];  //Для менеджера необходимо показать развернутую информацию если равно 1
let flag =  getUrlVars()["flag"] || "";
var positions = {};

///////////////Settings///////////////////