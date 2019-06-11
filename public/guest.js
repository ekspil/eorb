
var port = conf.ioPort;
var server = conf.ioIp;//window.location.hostname;
var socket = io.connect(server + ':' + port);
var messagesBox = $('#re-list');
var userLogin = new String;
var free = 0;
userLogin ='admin';
var massageAlert = "Не стоит работать в гостевом режиме";
var urlArray = window.location.pathname.split( '/' );
console.log(window);










var sound = new Audio();
sound.src = "Sound.mp3";
sound.preload = "auto";
sound.autoplay = true;
function playSound(){
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}



var station = getUrlVars()["station"];  //Определяем значение станции 0 - все, 1 - бургеры, 2 - фри, 3 - прочее
var manager = getUrlVars()["manager"];  //Для менеджера необходимо показать развернутую информацию если равно 1
let flag =  getUrlVars()["flag"] || "";


setInterval(function(){
console.log("reload");
window.location.reload();

}, 21600000);

//
//  Ефремов А.В.  Запрос - приветствие, запрос текущих чеков и отображение
//


    socket.on('reconnect', (reconnect) => {
        console.log(reconnect);
        window.location.reload();
    });
    socket.on('reconnecting', (reconnect) => {
        console.log(reconnect);
    });
    socket.on('disconnect', (disconnect) => {
        console.log(disconnect);
    });



socket.emit('hello', urlArray[1], (data) => {
  console.log(data);
if(urlArray[1] == "guests"){

  for (var key in data){
      data.sound = "on";
    if (data[key].ready == 0){
      //Неготовые чеки надо отправить в раздел готовится
       if(flag == data[key].flag || flag == "ADMIN"){
           addCheckToNotReady(data[key]);
       }

    }
    else if (data[key].ready == 1) {
      //Готовые чеки надо отправить в раздел готово
        if(flag == data[key].flag || flag == "ADMIN"){
      data[key].sound = "off";
      addCheckToReady(data[key]);
        }
    }}}
else if(urlArray[1] == "kitchen"){
    for (var key in data){
      //Возвращаем при запуске все блюда на место
      if(data[key].station == station || station == 0){
      addUserToList(data[key]);
    }}}
});


//
//  Ефремов А.В.   Функция добавления в ЭО целых чеков
//
socket.on('checkAdd', function(userData){
    if(flag == userData.flag || flag == "ADMIN"){
        userData.sound = "on"
    console.log('Добавлена позиция | ' + userData.Name);
    addCheckToNotReady(userData);

    messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
}});

//
//  Ефремов А.В.   Функция перевода чеков в разряд готовых
//
socket.on('checkToReady', function(msgf){
    if(flag == msgf.flag || flag == "ADMIN"){
        msgf.sound = "on"
    console.log('checkToReady ' + msgf.id);
    removeAllFromNotReady(msgf);


    messagesBox.scrollTop(messagesBox.prop('scrollHeight'));


}});

socket.on('checkEnd', function(userData){
    console.log('checkEnd ' + userData.id);

    removeAllFromReady(userData);

    messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
});

//Удаление чека отовсюду
socket.on('checkDel', function(msg){
    console.log('checkDel ' + msg.id);
    removeAll(msg);

    //messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
});


var color = new Array;
color[0] = 'red';
color[1] = 'blue';
color[2] = 'green';
color[3] = 'black';
var iii = 0;

function startHranitel(w, d) {

    var wp = d.querySelector('.wrapper'),
        colors = ['red', 'grey', 'blue', 'grey', 'green', 'black', 'grey', 'white' ],
        ln = colors.length;
iii = 0;

var changeColor = function (dest) {
  if (iii < ln) {

      $('div').each(function(){
        var elem1 = $(this);
        elem1.addClass('uk-animation-shake');
        elem1.addClass('uk-animation-15');


      });
      wp.style.cssText = "background: " + colors[iii] +";";
      iii++;


  } else {
    $('div').each(function(){
      var elem1 = $(this);
      elem1.removeClass('uk-animation-shake');
      elem1.removeClass('uk-animation-15');


    });
    window.clearInterval(dest);
    return;
  }
};


var timedestriyer = setInterval(function () {

changeColor(timedestriyer);

}, 2000);


};





setInterval(function(){
console.log("Запуск хранителя");
startHranitel(window, document);

},7200000);


   socket.on('delete', function(userData){
     removeUserFromList(userData);
     messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
});

function addUserToList(userData){
    $('#clients-list').append('<a href="javascript://" onclick="removeThisUserFromList(this)"  class="uk-panel uk-width-1-1 uk-panel-box uk-panel-box-primary uk-width-4-5 uk-margin-top-remove uk-align-center animated flipInX" pid="got-prod" id="'+userData.id+'"><div class="uk-badge uk-badge-notification" id="user-name">'+userData.unit+'</div> <b>'+userData.name+'</b></a>');
}
//В неготовые!
function addCheckToNotReady(userData){
if(!userData.name){
  userData.name = "Вы пользуете устаревшей версией сборщика";

}  if (manager == 1){
    $('#notready-list').append('<a href="javascript://" onclick="removeFromNotReady(this)" class="uk-panel uk-width-1-1  uk-panel-box uk-panel-box-primary  uk-align-center uk-margin-top-remove animated flipInX"  id='+userData.id+'><div class="uk-badge uk-badge-notification" id="user-name"><div class="uk-h3  uk-text-center">'+userData.id+'</div></div><div id="text">'+userData.name+'</div> </a>');

  }
  else if (userData.checkType == 3){

  }
  else {
    $('#notready-list').append('<a href="javascript://" onclick="alert(massageAlert);" class="uk-panel uk-width-1-2   uk-panel-box-hidden-left   uk-margin-top-remove animated flipInX"  id='+userData.id+'><div class="uk-text-center"><b>'+userData.id+'</b></div></a>');
}
}
//В готовые!
function addCheckToReady(userData){
if (!userData.name){
  var elem = $(userData);
userData.name = "Вы пользуетесь устаревшей версией сборщика";

}

if (manager == 1){
  $('#ready-list').append('<a href="javascript://" onclick="removeFromReady(this)" class="uk-panel uk-width-1-1 uk-panel-box uk-panel-box-success  uk-align-center uk-margin-top-remove animated flipInX" id='+userData.id+'><div class="uk-badge uk-badge-success uk-badge-notification" id="user-name"><div class="uk-h3  uk-text-center">'+userData.id+'</div></div><div id="text">'+userData.name+'</div></a>');

}
else if (userData.checkType == 3){

}
  else {
    if(userData.sound != "off"){
        playSound();
    }
    $('#ready-list').append('<a href="javascript://" onclick="alert(massageAlert);" class="uk-panel uk-width-1-1  uk-panel-box-hidden-right   uk-margin-top-remove animated flipInX" id='+userData.id+'><div class="uk-text-center"><b>'+userData.id+'</b></div></a>');
}
}
function removeAll(element){
    $('#ready-list').find('#'+element.id).each(function(){
        var elem = $(this);
        elem.remove();
    });

    $('#notready-list').find('#'+element.id).each(function(){
        var elem = $(this);
        elem.remove();

    });
}

function removeAllFromReady(element){
    $('#ready-list').find('#'+element.id).each(function(){
        var elem = $(this);
        //console.log(elem);
        elem.removeClass('flipInX').addClass('flipOutX');
        setTimeout(function(){
            elem.remove();
        }, 1000);
    });

}


function removeAllFromNotReady(element){

    $('#notready-list').find('#'+element.id).each(function(){
        var elem = $(this);
        elem.removeClass('flipInX').addClass('flipOutX');
        setTimeout(function(){
            elem.remove();
        }, 1000);

    });
addCheckToReady(element);
}

//Удаление из готовых!
function removeFromReady(element){
  var elem = $(element);
  var elemmsg = {};
  elemmsg.id = elem[0].id;
//  console.log(elemmsg.id);
  socket.emit('checkEnd_s', elemmsg, (data) => {
  //  console.log(data);
  } );

  var elem = $(element);
  elem.removeClass('flipInX').addClass('flipOutX');
  setTimeout(function(){
      elem.remove();
  }, 1000);
}


//Удаление позиции на ЭО и перенос в готовые
function removeFromNotReady(element){
  var elem = $(element);
  var elemmsg = {};
  elemmsg.id = elem[0].id;
  elemmsg.name = elem["0"].children.text.innerHTML;
//  console.log("Proverka elem");
//  console.log(elemmsg.name);
  socket.emit('checkToReady_s', elemmsg, (data) => {
    //console.log(data);
  } );

  var elem = $(element);
  elem.removeClass('flipInX').addClass('flipOutX');
  setTimeout(function(){
      elem.remove();
  }, 1000);

addCheckToReady(element);

}

//Удаление позиции на экране кухонном
function removeUserFromList(userData){
    $('#clients-list').find('#'+userData.id).each(function(){
        var elem = $(this);
        elem.removeClass('animated flipInX').addClass('uk-padding-vertical-remove');
        setTimeout(function(){
            elem.remove();
        }, 300);
    });
}


function removeFirstUserFromList(){
    $('a[pid]:first').each(function(){
        var elem = $(this);
        var elemmsg = {};
        elemmsg.id = elem[0].id;
        //console.log(elemmsg.id);

        socket.emit('del', elemmsg, (data) => {
          //console.log(data);
        } );
        elem.removeClass('animated flipInX').addClass('uk-padding-vertical-remove');
        setTimeout(function(){
            elem.remove();
        }, 300);
    });
}


function removeThisUserFromList(element){

        var elem = $(element);
        var elemmsg = {};
        elemmsg.id = elem[0].id;
        //console.log(elemmsg.id);
        //console.log(elem);
        elem["0"].innerHTML = " ";
        socket.emit('del', elemmsg, (data) => {
          //console.log(data);
        } );
        elem.removeClass('animated flipInX').addClass('uk-padding-vertical-remove');
        setTimeout(function(){
            elem.remove();
        }, 300);
    };






$( document ).ready(function(){



	  $( "body" ).keydown(function( event ){ // задаем функцию при нажатиии любой клавиши клавиатуры на элементе Q = 81 код
	    //console.log( event.which );
      if (event.which == '81'){
        //console.log("Сама функция срабатывает");
          removeFirstUserFromList();

      }

       // выводим код нажатой клавиши
	  });




$('a[pid]').click(function(){

  var elem = $(this);
  var elemmsg = {};
  elemmsg.id = elem[0].id;
  console.log(elemmsg.id);

  socket.emit('del', elemmsg, (data) => {
    console.log(data);
  } );
  elem.removeClass('flipInX').addClass('flipOutX');
  setTimeout(function(){
      elem.remove();
  }, 1000);

	});

});

if (urlArray[1] == "guests"){
$(document).ready(function(){
if (!manager){
//   var videonum = 1;
//   setInterval(function(){
//
//     if(videonum > 5){
//       videonum =1;
//     }
//     $('#bg-img').empty();
//     $('#bg-img').append(
//       `
//       <video autoplay loop muted playsinline uk-cover>
//
//           <source src="/video/`+videonum+`234.mp4" type="video/mp4" autostart="true">
//
//       </video>
//
//       `
//     );
//   videonum++;
// }, 10000);

    $('#bg-img').empty();
         $('#bg-img').append(
      `
        <video autoplay loop muted playsinline uk-cover>
          
           <source src="/video/1234.mp4" type="video/mp4" autostart="true">

       </video>

       `
     );

  $('#client-box').append(`


    <div class="uk-width-4-10 " >  <!--   "uk-width-1-5 uk-hidden-small uk-hidden-mini"      -->
        <div class="uk-panel uk-panel-space"><div class="uk-panel-teaser">
    <img onclick="playSound()" class ="uk-align-center" src="/data/notready.png" alt="">
    </div></div><br>
<div class="uk-grid uk-flex uk-flex-wrap uk-flex-column" id="notready-list"></div>

        </div>
    <div class="uk-width-2-10 " >
      <div class="uk-panel uk-panel-space "><div class="uk-panel-teaser " id="panelTeaser">
    <img class ="uk-align-center" src="/data/ready.png" alt="">
    </div></div><br>
<div class="uk-grid" id="ready-list"></div>
    </div>
    <div class="uk-width-4-10 uk-cover-container"  id="bg-img">

    <video autoplay loop muted playsinline uk-cover>
        <source src="/video/1234.mp4" type="video/mp4" autostart="true">

    </video>


    </div>
    </div>


    `);



}else {



  $('#client-box').append(`


    <div class="uk-width-2-4 " >  <!--   "uk-width-1-5 uk-hidden-small uk-hidden-mini"      -->
        <div class="uk-panel uk-panel-space"><div class="uk-panel-teaser">
    <img class ="uk-align-center" src="/data/notready.png" alt="">
    </div></div><br>
<div class="uk-grid" id="notready-list"></div>
        </div>
    <div class="uk-width-2-4 " >
      <div class="uk-panel uk-panel-space "><div class="uk-panel-teaser ">
    <img class ="uk-align-center" src="/data/ready.png" alt="">
    </div></div><br>
<div class="uk-grid" id="ready-list"></div>
    </div>



    `);

}

});
}

