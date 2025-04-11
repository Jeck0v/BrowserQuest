@echo off
kubectl get all -n browserquest
kubectl get hpa -n browserquest
minikube service list
