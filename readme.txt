Запуск как сервис windows


Сперва ставим:

npm install -g qckwinsvc
Затем выполняем следующие команды:

> qckwinsvc
prompt: Service name: [name for your service]
prompt: Service description: [description for it]
prompt: Node script path: [path of your node script]
Service installed


Удаление сервиса:

> qckwinsvc --uninstall
prompt: Service name: [name of your service]
prompt: Node script path: [path of your node script]
Service stopped
Service uninstalled


qckwinsvc --name "eo" --description "EO" --script "C:\eo\app.js" --startImmediately

//Пояснения

conf.js - настройки backend
confIo.js - настройки front

mainSmallSbor.js - основная логика фронта
app.js - основная логика бэка
mssql.js - отправка данных по времени сбора
