
var port = window.location.port;
var server = window.location.hostname;
var socket = io.connect(server + ':' + port);
var messagesBox = $('#re-list');
var userLogin = new String;
var free = 0;
userLogin ='admin';
var massageAlert = "Не стоит работать в гостевом режиме";
var urlArray = window.location.pathname.split( '/' );
//Ресторан в котором работает ЭО, необходимо для аналитики
var restoran = 16;
//
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}



var station = getUrlVars()["station"];  //Определяем значение станции 0 - все, 1 - бургеры, 2 - фри, 3 - прочее
var manager = getUrlVars()["manager"];  //Для менеджера необходимо показать развернутую информацию если равно 1
var positions = {};


function changeColor(th){

var elem = $(th);
if (manager == 1){

  var changeid = elem[0].id;
  if (positions[changeid].payed == 1){


  elem.removeClass('uk-panel-box-sborkasmall').addClass('uk-panel-box-sborkasmall-ready');
  elem.removeClass('uk-panel-box-sborkasmall-payed').addClass('uk-panel-box-sborkasmall-ready');
if( positions[changeid].ready != 1 ){
    removeFromNotReady(elem);
    positions[changeid].ready = 1;
    socket.emit('timer', timemsg[changeid], (data) => {
      //console.log(data);
      delete timemsg[changeid];
    } );
  }
  else if ( positions[changeid].ready == 1){

    var changeid = elem[0].id;


    removeFromReady(th);

    for (var key in positions[changeid].string){

      for (var key2 in positions[changeid].string[key].id){
        var elemmsg = {};
        elemmsg = positions[changeid].string[key].id[key2];
        socket.emit('del', elemmsg, (data) => {
          console.log(data);
        } );
      }





    }


    elem.remove();


  }

 }
}
else {
elem.remove();

}



}

function changeColorById(data){

  var elem = $('#'+data.id);
  var changeid = data.id;
  elem.removeClass('uk-panel-box-sborkasmall').addClass('uk-panel-box-sborkasmall-ready');
  elem.removeClass('uk-panel-box-sborkasmall-payed').addClass('uk-panel-box-sborkasmall-ready');
  if (!positions[data.id]){

    if(manager == 1 && station == 0){
      deleteCheckOnAll(data.id);
    }

  }else{
    positions[changeid].ready = 1;
  }




}

function changeColorDel(th){
  var elem = $(th);
  var elemmsgdel = {};
  elemmsgdel.id = elem[0].id;
    var changeid = elem[0].id;
  if (manager ==1){

    socket.emit('checkDel_s', elemmsgdel, (data) => {
      //console.log(data);
    } );
    for (var key in positions[changeid].string){

      for (var key2 in positions[changeid].string[key].id){
        var elemmsg = {};
        elemmsg = positions[changeid].string[key].id[key2];
        socket.emit('del', elemmsg, (data) => {
          //console.log(data);
        } );
      }





    }


    elem.remove();

}
else{
elem.remove();

}

}


// TEST



function deleteCheckOnAll(id){
  var elemmsgdel = {};
  elemmsgdel.id = id;
  socket.emit('checkDel_s', elemmsgdel, (data) => {
    //console.log(data);
  } );
}


function checkPayed(data){
var checkTypeText;
  if (data.checkType){
    if(data.checkType == 1){checkTypeText = "В зале";}
    if(data.checkType == 2){checkTypeText = "На вынос";}
    if(data.checkType == 3){checkTypeText = "Доставка";}
  }
  else{
    checkTypeText = "Не передано";
  }

  var elem = $('#'+data.id);

  elem.removeClass('uk-panel-box-sborkasmall').addClass('uk-panel-box-sborkasmall-payed');
  //console.log(data.id);
  if (!positions[data.id]){

    if(manager == 1 && station == 0){
      deleteCheckOnAll(data.id);
    }

  }else{
    positions[data.id].payed = 1;
  }

  var elemCheckType = $('#checkType'+data.id);
  elemCheckType.empty();
  elemCheckType.append(checkTypeText);
}


function addPositions(data, del){

var checkInList = 1;


//string - название продукта переведенное в годный для идентификатора вид

if (del == 0){
    if (data.name){

    var string = data.name.replace(/[^A-Za-zА-Яа-я0-9Ёё]/g, "");

    }
    else{
    var string = "Не_передано_имя" ;
    }
    if (!positions[data.unit]){
    positions[data.unit] = {};
    positions[data.unit].string = {};
    positions[data.unit].string[string] = {};
    positions[data.unit].string[string].string = string;
    positions[data.unit].string[string].id = {};
    positions[data.unit].string[string].id[data.id] = data;
    positions[data.unit].string[string].id[data.id].string = string;

    addBlock(positions[data.unit].string[string].id[data.id]);
    }
    else if(positions[data.unit]){


    if (!positions[data.unit].string[string]){
      positions[data.unit].string[string] = {};
      positions[data.unit].string[string].string = string;
      checkInList = 0;

    }
    if (typeof positions[data.unit].string[string].id != "object") {
      positions[data.unit].string[string].id = {};


    }
    positions[data.unit].string[string].id[data.id] = data;
    positions[data.unit].string[string].id[data.id].string = string;
    var counter = 0;

    for (var key in positions[data.unit].string[string].id) {
      counter++;
    }

    if(counter == 1){
      if (checkInList == 0){
      var elemSpisok = $('#list'+data.unit);
      $('#list'+data.unit).append(`<span id="`+string+`"><p class="line size2" id="pline"><span id="num">1 x </span><span id="position">`+data.name+`</span></p></span>`);
      if(elemSpisok["0"]){
        if (elemSpisok["0"].offsetHeight < elemSpisok["0"].scrollHeight) {
            elemSpisok.addClass("bg-overflow");// your element have overflow
        }
        else {
            // your element doesn't have overflow
          }}



    }
    else if (checkInList == 1){

      $('#'+data.unit).find('#'+string).each(function(){

        $(this).find('#pline').each(function(){

          element = $(this);
          element.removeClass('error');

        });

          $(this).find('#num').each(function(){

            element = $(this);
            element.empty();
            element.append(counter + " x ");

          });


        //  elem.append(counter+" x ");
    //["0"].children["0"].children["0"]
      });

    }


    }
    else if (counter >1){

      $('#'+data.unit).find('#'+string).each(function(){
          $(this).find('#num').each(function(){

            element = $(this);
            element.empty();
            element.append(counter + " x ");

          });


        //  elem.append(counter+" x ");
//["0"].children["0"].children["0"]
      });

    }

    }
  }

else if (del ==1){
var fPanelKey;
var fPosition;
var fUnit;
var fString;
var fCount =0;
for (var keyunit in positions){
  for (var keystr in positions[keyunit].string){
      for (var key in positions[keyunit].string[keystr].id) {

        if (positions[keyunit].string[keystr].id[key].id == data.id){
          fPanelKey = keyunit;
          fPosition = positions[keyunit].string[keystr].id;
          fUnit = positions[keyunit].string[keystr].id[key].unit;
          fString = positions[keyunit].string[keystr].id[key].string;
          delete positions[keyunit].string[keystr].id[key];
        }
      }
    }
  }

    if(positions[fPanelKey]){
      for (var keystr1 in positions[fPanelKey].string){
        for (var key1 in positions[fPanelKey].string[keystr1].id) {
          fCount++;
          }
        }}




  var counter = 0;

  for (var key in fPosition) {
    counter++;
  }

  if (counter >=1){


    $('#'+fUnit).find('#'+fString).each(function(){
        $(this).find('#num').each(function(){

          element = $(this);
          element.empty();
          element.append(counter + " x ");

        });


      //  elem.append(counter+" x ");
  //["0"].children["0"].children["0"]
    });

  }
else if (counter < 1){

  if (fCount == 0){
    data.unit = fUnit;
    removeAll(data);
    delete positions[fPanelKey];
  }
  $('#'+fUnit).find('#'+fString).each(function(){

    $(this).find('#pline').each(function(){

      element = $(this);
      element.addClass('error');

    });

      $(this).find('#num').each(function(){

        element = $(this);
        element.empty();
        element.append(counter + " x ");

      });


    //  elem.append(counter+" x ");
//["0"].children["0"].children["0"]
  });
}









}

}


function addBlock(data){
//<i class="uk-icon-truck"></i> Доставка


  $('#sborka').append(`<a href="javascript://" ondblclick="changeColorDel(this);" onclick="changeColor(this);" class="uk-panel uk-width-1-5 uk-panel-box  uk-panel-box-sborka uk-animation-shake"  id="`+data.unit+`"><div class="uk-panel uk-grid uk-grid-collapse uk-panel-teaser uk-panel-teaser-sbor uk-text-bold "><div class ="uk-width-1-4 uk-text-right" >`+data.unit+` </div><div class="uk-width-2-4 uk-text-center" id="checkType`+data.unit+`">Не оплачен</div> <div class="uk-width-1-4 uk-text-left" id="timer`+data.unit+`">00:00</div></div><div class="list-of-products" id="list`+data.unit+`">
  <span uk-panel uk-grid uk-grid-collapse id="`+data.string+`"><p class="line size2" id="pline"><span id="num">1 x </span><span id="position">`+data.name+`</span></p></span>
  </div>
  </a>`);

  timer(data);
}


//













var timemsg = {};
function timer(element){
var hou = 0;
var sec = 0;
var time = 0;
timemsg[element.unit] = {};
var date = new Date();
timemsg[element.unit].restoran = restoran;

timemsg[element.unit].dateYear = date.getFullYear();
timemsg[element.unit].dateMonth = date.getMonth();
timemsg[element.unit].dateDay = date.getDate();
timemsg[element.unit].dateTime = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
console.log(timemsg[element.unit].dateTime);
var timerId = setInterval(function(){
  if(!positions[element.unit] || positions[element.unit].ready == 1){
    console.log("Затраченное на чек "+element.unit+" время: "+time+" сек.");
    timemsg[element.unit].timerValue = time;
    window.clearInterval(timerId);

    return;
  }
  if (sec < 10){
    sec = "0"+sec;

  }
  if (hou < 10){
    hou = "0"+hou;
  }
  if(positions[element.unit].ready != 1){
  var timerelem = document.getElementById("timer"+element.unit);
  if (timerelem){
    timerelem.innerHTML = hou +":" + sec ;
  }
  sec = +sec;
  hou = +hou;
  timemsg[element.unit].timerValue = time;
  time++;
  sec++;

  if(sec == 60)
  {
    hou++;
    sec = 0;
    if (hou == 60)
    {
       hou = 0;
    }
  }}
},1000);
}






























// Создание экземпляра класса Tts.

/**
 if(!manager && urlArray[1] == "guests"){
var tts =new ya.speechkit.Tts(
      // Настройки синтеза. Список доступных настроек см. в справочнике.
      {
        // API-ключ. Может быть задан глобально через объект ya.speechkit.settings.
        apikey: 'a7ab2b7a-eb67-475b-a6ab-b3bd58297d05',
        // Эмоциональная окраска: добрый голос.
        emotion: 'good',
        // Скорость речи.
        speed: 1,
        // Имя диктора.
        //jane
        speaker: 'jane'
      }
    );
}
*
*/
//
//  Ефремов А.В.  Запрос - приветствие, запрос текущих чеков и отображение
//


socket.emit('hello', 'kitchen', (data) => {
  console.log(data);

    for (var key in data){
      //Возвращаем при запуске все блюда на место
      if(data[key].station == station || station == 0){
      addPositions(data[key], 0);
        }
    }

  });

  socket.emit('hello', 'guests', (data) => {
    console.log(data);

      for (var key in data){
        //Возвращаем при запуске все блюда на место
        if (data[key].payed == 1){
          checkPayed(data[key]);
        }
        if (data[key].ready == 1){
          changeColorById(data[key]);
        }



      }

    });

//
//  Ефремов А.В.   Функция добавления в ЭО целых чеков
//
socket.on('checkAdd', function(userData){
    console.log('Оплачен чек | ' + userData.id);
    checkPayed(userData);
    addCheckToNotReady(userData);

});

//
//  Ефремов А.В.   Функция перевода чеков в разряд готовых
//
socket.on('checkToReady', function(msgf){
    console.log('Чек готов к выдаче | ' + msgf.id);
    removeAllFromNotReady(msgf);
    changeColorById(msgf);

/**
 if (!manager){

  tts.speak(
    // Текст для озвучивания.
    'Заказ номер '+msgf.id+' готов!',
    // Переопределяем настройки синтеза.
    {
      // Имя диктора.
      //zahar
      speaker: 'zahar',
      // Эмоции в голосе. neutral
      emotion: 'good',
      // Функция-обработчик, которая будет вызвана по завершении озвучивания.
      stopCallback: function () {
        console.log("Озвучивание текста завершено.");
      }
    }
  );

}
*
*/

  //  if (window.speechSynthesis){
  //  if (window.speechSynthesis != 'undefined') {
  //  var msgv = new SpeechSynthesisUtterance();
  //  var voices = window.speechSynthesis.getVoices();
  //  msgv.voice = voices[17]; // Note: some voices don't support altering params
  //  console.log(voices);
  //  msgv.voiceURI = '16';
  //  msgv.volume = 1; // 0 to 1
  //  msgv.rate = 1; // 0.1 to 10
  //  msgv.pitch = 1; //0 to 2
  //  msgv.text = "Заказ "+msgf.id+" готов!";
  //  msgv.lang = 'ru-RU';
  //  msgv.onend = function(e) {
  //  console.log('Finished in ' + event.elapsedTime + ' seconds.');
  //  console.log(msgv);
  //  };
  //  speechSynthesis.speak(msgv);
  //  };
  //  };


    messagesBox.scrollTop(messagesBox.prop('scrollHeight'));


});

socket.on('checkEnd', function(userData){
    console.log('checkEnd ' + userData.id);

    removeAllFromReady(userData);

    messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
});

//Удаление чека отовсюду
socket.on('checkDel', function(msg){
    console.log('checkDel ' + msg.id);
    removeAll(msg);

    messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
});


//
//  Ефремов А.В.   Функция добавления в ЭО отдельных позиций для монитора кухни
//
socket.on('test', function(userData){
  //  console.log('Добавлена позиция на кухонный монитор');
//    console.log(userData.name);
  //  $('#messages').append('<div class="uk-panel uk-panel-box uk-panel-box-success uk-width-4-5 uk-align-left uk-margin-top-remove animated flipInX" id="info-message">Пользователь <b>'+userData.userName+'</b> присоединился к чату!</div>');
var st = userData.station;  // Задаем соотвествие станции готовки и блюдам

if (station == st || station== 0){
    addPositions(userData, 0);

  }
  //  $('input[name="message"]').focus();
});
/*
socket.on('clientsList', function(clientsList){
    console.log(clientsList);
    for(var key in clientsList){
        if($('#'+key).length == 0){
            addUserToList(clientsList[key]);
        }
    }
});

socket.on('messageToClients', function(msg, name){
    console.log(name + ' | => ' + msg);
     $('#messages').append('<div class="uk-panel uk-panel-box  uk-panel-box-secondary uk-width-4-5 uk-align-right uk-margin-top-remove animated flipInX" id="user-message"><div class="uk-badge uk-badge-success uk-badge-notification" id="this-user-name">'+name+'</div>'+msg+'</div>');
    messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
});

socket.on('messageFromClients', function(msg, name){
    console.log(name + ' | => ' + msg);
     $('#messages').append('<div class="uk-panel uk-panel-box uk-panel-box-primary uk-width-4-5 uk-align-left uk-margin-top-remove  animated flipInX"><div class="uk-badge uk-badge-notification" id="user-name">'+name+'</div>'+msg+'</div>');
     messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
});
*/


   socket.on('delete', function(userData){
    console.log("Элемент удален");
  //   $('#messages').append('<div class="uk-panel uk-panel-box uk-panel-box-warning uk-width-4-5 uk-align-left uk-margin-top-remove animated flipInX" id="info-message">Пользователь <b>'+userData.userName+'</b> покинул чат!</div>');
     removeUserFromList(userData);
     addPositions(userData, 1);
     messagesBox.scrollTop(messagesBox.prop('scrollHeight'));
});

function addUserToList(userData){
    $('#clients-list').append('<a href="javascript://" onclick="removeThisUserFromList(this)"  class="uk-panel uk-width-1-1 uk-panel-box uk-panel-box-primary uk-width-4-5 uk-margin-top-remove uk-align-center animated flipInX" pid="got-prod" id="'+userData.id+'"><div class="uk-badge uk-badge-notification" id="user-name">'+userData.unit+'</div> <b>'+userData.name+'</b></a>');
}
//В неготовые!
function addCheckToNotReady(userData){
if(userData.name){  if (manager == 1){
    $('#notready-list').append('<a href="javascript://" onclick="removeFromNotReady(this)" class="uk-panel uk-width-1-1  uk-panel-box uk-panel-box-primary  uk-align-center uk-margin-top-remove animated flipInX"  id='+userData.id+'><div class="uk-badge uk-badge-notification" id="user-name"><div class="uk-h3  uk-text-center">'+userData.id+'</div></div><div id="text">'+userData.name+'</div> </a>');

  }
  else {
    $('#notready-list').append('<a href="javascript://" onclick="alert(massageAlert);" class="uk-panel uk-width-1-2   uk-panel-box-hidden-left   uk-margin-top-remove animated flipInX"  id='+userData.id+'><div class="uk-text-center"><b>'+userData.id+'</b></div></a>');
}}
}
//В готовые!
function addCheckToReady(userData){
if (!userData.name){
  var elem = $(userData);
userData.name = "Вы пользуетесь устаревшей версией сборщика, связитесь с ИТ службой для обновления версии";

}

if (manager == 1){
  $('#ready-list').append('<a href="javascript://" onclick="removeFromReady(this)" class="uk-panel uk-width-1-1 uk-panel-box uk-panel-box-success  uk-align-center uk-margin-top-remove animated flipInX" id='+userData.id+'><div class="uk-badge uk-badge-success uk-badge-notification" id="user-name"><div class="uk-h3  uk-text-center">'+userData.id+'</div></div><div id="text">'+userData.name+'</div></a>');

}
  else {
    $('#ready-list').append('<a href="javascript://" onclick="alert(massageAlert);" class="uk-panel uk-width-1-2  uk-panel-box-hidden-right   uk-margin-top-remove animated flipInX" id='+userData.id+'><div class="uk-text-center"><b>'+userData.id+'</b></div></a>');
}
}
function removeAll(data){
  var elem = $('#'+data.unit);
  var changeid = data.unit;
  elem.remove();


}

function removeAllFromReady(element){
    $('#ready-list').find('#'+element.id).each(function(){
        var elem = $(this);
        console.log(elem);
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
  socket.emit('checkEnd_s', elemmsg, (data) => {
    //console.log(data);
  } );

}


//Удаление позиции на ЭО и перенос в готовые
function removeFromNotReady(element){
  var elem = $(element);
  var elemmsg = {};
  elemmsg.id = elem[0].id;
  elemmsg.name = "Вы пользуетесь устаревшей версией сборщика, свяжитесь с ИТ службой для обновления";
  //console.log("Proverka elem");
  //console.log(elemmsg.name);
  socket.emit('checkToReady_s', elemmsg, (data) => {
    //console.log(data);
  } );

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
        console.log(elemmsg.id);

        socket.emit('del', elemmsg, (data) => {
          console.log(data);
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
        console.log(elemmsg.id);
        console.log(elem);
        elem["0"].innerHTML = " ";
        socket.emit('del', elemmsg, (data) => {
          console.log(data);
        } );
        elem.removeClass('animated flipInX').addClass('uk-padding-vertical-remove');
        setTimeout(function(){
            elem.remove();
        }, 300);
    };






$( document ).ready(function(){



	  $( "body" ).keydown(function( event ){ // задаем функцию при нажатиии любой клавиши клавиатуры на элементе Q = 81 код
	    console.log( event.which );
      if (event.which == '81'){
        console.log("Сама функция срабатывает");
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

  $('#client-box').append(`


    <div class="uk-width-2-5 " >  <!--   "uk-width-1-5 uk-hidden-small uk-hidden-mini"      -->
        <div class="uk-panel uk-panel-space"><div class="uk-panel-teaser">
    <img class ="uk-align-center" src="/notready.png" alt="">
    </div></div><br>
<div class="uk-grid" id="notready-list"></div>

        </div>
    <div class="uk-width-2-5 " >
      <div class="uk-panel uk-panel-space "><div class="uk-panel-teaser ">
    <img class ="uk-align-center" src="/ready.png" alt="">
    </div></div><br>
<div class="uk-grid" id="ready-list"></div>
    </div>
    <div class="uk-width-1-5 uk-cover-background uk-position-relative" id="bg-img">

    <img class ="uk-align-right uk-responsive-width" src="/bg.png" alt="">
    <div class="uk-position-cover uk-flex uk-flex-right uk-flex-middle">...</div>

    </div>
    </div>


    `);



}else {



  $('#client-box').append(`


    <div class="uk-width-2-4 " >  <!--   "uk-width-1-5 uk-hidden-small uk-hidden-mini"      -->
        <div class="uk-panel uk-panel-space"><div class="uk-panel-teaser">
    <img class ="uk-align-center" src="/notready.png" alt="">
    </div></div><br>
<div class="uk-grid" id="notready-list"></div>
        </div>
    <div class="uk-width-2-4 " >
      <div class="uk-panel uk-panel-space "><div class="uk-panel-teaser ">
    <img class ="uk-align-center" src="/ready.png" alt="">
    </div></div><br>
<div class="uk-grid" id="ready-list"></div>
    </div>



    `);

}

});
}
