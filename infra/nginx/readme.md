# NGINX Reverse Proxy - BrowserQuest

Ce dossier contient les fichiers liés au déploiement d’un reverse proxy NGINX personnalisé dans Kubernetes.

## Objectif

Ce NGINX est utilisé comme reverse proxy pour :
- Servir les fichiers statiques du client (`/`)
- Gérer les connexions WebSocket vers le backend (`/ws/`)
- S'assurer que la communication reste persistente (keep-alive) et compatible WebSocket

## Structure

- `nginx.conf` : fichier de configuration NGINX (monté via un `ConfigMap`)
- `nginx-configmap.yaml` : expose `nginx.conf` sous forme de `ConfigMap`
- `nginx-deployment.yaml` : déploie un conteneur NGINX avec le `ConfigMap`
- `nginx-service.yaml` : expose le reverse proxy comme un service interne

## À savoir

- Le reverse proxy redirige `/ws/` vers `server-service:8000`
- La racine `/` est servie depuis `/usr/share/nginx/html` (penser à builder le client dedans si besoin)

## Déploiement

```bash

kubectl apply -f nginx/nginx-configmap.yaml
kubectl apply -f deployement/nginx-deployement.yaml
kubectl apply -f services/nginx-services.yaml
```
