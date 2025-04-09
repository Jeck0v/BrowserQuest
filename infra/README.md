Le temps que l'app fonctionne pas je vais utiliser une image docker valide pour pouvoir construire l'infra
l'image docker viens de: https://hub.docker.com/r/coloradostark/browserquest


### Documentation Docker Image
To run the program on a local machine with Docker type:

docker container run -it -p 80:80 -p 8000:8000 coloradostark/browserquest bash

You will see a command prompt, type the following:

node server/js/main.js &

The server is now running. Now Open a new command prompt session and then type the following:

docker container exec -it YOUR-CONTAINER-ID-NUMBER bash

nvm use 10.23.0

cd /

http-server -p 80 ./BrowserQuest/client

That is all you need to do. It should be running and you can test it by typing 127.0.0.1 in the browser.

More documentation on getting a production server running is located in client and server directories.

### Documentation lancement Minikube 

