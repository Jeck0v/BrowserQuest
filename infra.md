### Documentation Lancement de l'app via le dockerfile
```shell
docker build -t browserquest .
docker run -p 8080:8080 -p 8000:8000 browserquest
```
Dans notre cas on utilisera notre image dockerhub:

`jeck0v/browserquest:lastest`

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
Si besoin de suppr le cluster:
```bash
minikube delete
```
Activer l'ingress de minikube
```bash
minikube addons enable ingress
```
Activer les metrics-server pour le scalling du cluster
```bash
minikube addons enable metrics-server
```
Pour être sûr que l'image est bien prise en compte par minikube:
```bash
docker build -t jeck0v/browserquest .
minikube image load jeck0v/browserquest:lastest
```
Aller dans le dossier racine:
```bash
kubectl apply -f infra/deployement/
kubectl apply -f infra/services/
kubectl apply -f infra/configmap/
kubectl apply -f infra/ingress/
kubectl apply -f infra/scalling
```
### Vérrification des pods / services / ingress / hpa:

```bash
kubectl get pods
kubectl get hpa
kubectl get services
kubectl get ingress
```

### Tester l'app:
Dans un autre terminal qu'il faudra laisser ouvert: 
via le tunnel aller à `localhost:8080`
```bash
minikube tunnel
```
ou
<br>
```bash
kubectl port-forward svc/browserquest-service 8080:80
```
## Config nginx, configmap et ingress

- un reverse proxy avec **nginx** pour gérer les requêtes HTTP et WebSocket
- un **configmap** pour gérer la config de Nginx
- un **ingress** pour exposer l'app (+ ingress-controller) <br>
Cette partie n'est pas à 100% opérationel, je n'ai pas beaucoup d'xp en K8S donc je pense pas avoir fini ça d'ici le temps imparti

## Infra Kubernetes

- **deployement** : Pour déployer les pods de l'application et de Nginx
- **services** : Pour exposer les pods et permettre la communication entre eux
- **configmap** : Pour fournir des configurations personnalisées à Nginx
- **ingress** : Pour gérer l'accès externe à l'app

### Ce que j'aurais aimé faire de plus
Je n’ai pas énormément d'expérience avec K8S, et c'étais assez complexe pour moi. Cela dit, je me suis beaucoup amusé à apprendre et à tester. Même si le résultat n'est pas incroyable, j'ai tenté de comprendre au mieux chaque éléments, et j’ai pas mal appris.

J’aurais bien aimé :

- Finaliser proprement la partie Ingress + Ingress Controller

- Approfondir Kubernetes Security

- Mettre en place AWS EKS, avec ELB, et potentiellement un déploiement complet en cloud

 Mais avec le temps imparti, ce n'était pas réaliste ahahha :)




