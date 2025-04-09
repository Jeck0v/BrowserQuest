# DualStack IPv4/IPv6 Support in Minikube

Minikube ≥ v1.30.0 (avec Kubernetes 1.26+) supporte l’IPv6 en dual-stack si activé :

## Étapes :
Active IPv6 avec le driver Docker :
```bash

minikube start --network-plugin=cni --cni=calico --feature-gates="IPv6DualStack=true" --extra-config=kubelet.node-ip=<IPv6>,<IPv4>
