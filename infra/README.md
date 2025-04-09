Le temps que l'app fonctionne pas je vais utiliser une image docker valide pour pouvoir construire l'infra
l'image docker viens de: https://hub.docker.com/r/coloradostark/browserquest


### Documentation Docker Image
To run the program on a local machine with Docker type:
```bash
docker container run -it -p 80:80 -p 8000:8000 coloradostark/browserquest bash
```
You will see a command prompt, type the following:
```bash
node server/js/main.js &
```

The server is now running. Now Open a new command prompt session and then type the following:

```bash
docker container exec -it YOUR-CONTAINER-ID-NUMBER bash
```
```bash
nvm use 10.23.0

cd /

http-server -p 80 ./BrowserQuest/client
```
That is all you need to do. It should be running and you can test it by typing 127.0.0.1 in the browser.

More documentation on getting a production server running is located in client and server directories.

### Documentation lancement Minikube 

#### Installer Minikube et Kubectl sur windows:
On utilise Chocolatery, donc si pas installer => dans powershell admin
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
Minikube:
```bash
choco install minikube
```
Kubectl:
```bash
choco install kubernetes-cli
```
#### Lancement Minikube:
```bash
minikube start --driver=docker --kubernetes-version=v1.32.0
```
Si erreur du style :
<br>
`
❗  L'image n'a pas été construite pour la version actuelle de minikube. Pour résoudre ce problème, vous pouvez supprimer et recréer votre cluster minikube en utilisant les dernières images. Version de minikube attendue : v1.33..1 -> Version de minikube actuelle : v1.35.0
`
<br>
Il faut delete le cluster puis refaire le minikube start
```bash
minikube delete
```
Activer l'ingress de minikube
```bash
minikube addons enable ingress
```
Dans ton windows host:
```bash
echo "$(minikube ip) browserquest.local" | sudo tee -a /etc/hosts
```
Aller dans le dossier racine:
```bash
kubectl apply -f infra/nginx/nginx-configmap.yaml
kubectl apply -f infra/deployement/nginx-deployement.yaml
kubectl apply -f infra/deployement/server-deployement.yaml
kubectl apply -f infra/deployement/client-deployement.yaml
kubectl apply -f infra/services/nginx-services.yaml
kubectl apply -f infra/services/server-services.yaml
kubectl apply -f infra/services/client-services.yaml
kubectl apply -f infra/ingress/ingress.yaml
kubectl apply -f infra/scalling/hpa-server.yaml
kubectl apply -f infra/scalling/hpa-client.yaml


```
### Vérrification des pods / services / ingress:
```bash
kubectl get pods
```
```bash
kubectl get services
kubectl get ingress
```
### Tester l'app
Go to =>
http://browserquest.local








