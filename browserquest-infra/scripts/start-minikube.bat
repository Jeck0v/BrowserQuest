@echo off
minikube delete
minikube start --driver=docker --network-plugin=cni --cni=bridge
minikube addons enable ingress
minikube addons enable metrics-server