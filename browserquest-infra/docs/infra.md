### Start app with only the dockerfile:
```shell
docker build -t browserquest .
docker run -p 8080:8080 -p 8000:8000 browserquest
```
For pull :

`
docker pull maxbdk/browserquest:test
`
### Minikube launch documentation:

#### Install Minikube and Kubectl on Windows:
Minikube:
```bash
choco install minikube
```
Kubectl:
```bash
choco install kubernetes-cli
```
#### On MacOS:
```
brew install minikube
```

#### Start Minikube:
if you already have a minikube cluster: 
```bash
minikube delete
```

```bash
minikube start --driver=docker --network-plugin=cni --cni=bridge
```
Activating minikube ingress
```bash
minikube addons enable ingress
```
Activating metrics-server
```bash
minikube addons enable metrics-server
```
And then:
``` bash
cd browserquest-infra
```
you can:
```bash
kubectl apply -k .
```

### Test the app:

```bash
kubectl port-forward -n browserquest svc/browserquest 8080:8080 8000:8000
```
