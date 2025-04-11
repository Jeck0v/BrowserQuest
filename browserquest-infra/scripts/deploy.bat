@echo off
kubectl apply -k manifests/base
kubectl apply -k manifests/metrics

echo Attente du controller NGINX...
kubectl wait --namespace ingress-nginx --for=condition=Ready pod --selector=app.kubernetes.io/component=controller --timeout=120s

:retry
kubectl apply -k manifests/ingress
IF %ERRORLEVEL% NEQ 0 (
    echo Echec de l'application de l'ingress, nouvelle tentative dans 10s...
    timeout /t 10
    GOTO retry
)
