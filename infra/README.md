### Documentation Lancement de l'app via le dockerfile
```shell
docker build -t browserquest .
docker run -p 8080:8080 -p 8000:8000 browserquest
```
Dans notre cas on utilise une image dockerhub:

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
kubectl apply -f infra/deployement/
kubectl apply -f infra/services/
kubectl apply -f infra/configmap/
kubectl apply -f infra/ingress/


```
note à moi même:

```bash
docker build -t jeck0v/browserquest .
minikube image load jeck0v/browserquest:lastest

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








