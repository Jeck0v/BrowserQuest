@echo off
minikube delete
minikube start --driver=docker --feature-gates=IPv6DualStack=true --network-plugin=cni --cni=bridge --extra-config=kubelet.node-ip=::1
minikube addons enable ingress
minikube addons enable metrics-server