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
