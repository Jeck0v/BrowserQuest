@echo off
echo Test d'accessibilite de l'application sur http://localhost:8080...

timeout /t 5 > nul

curl -I http://localhost:8080

IF %ERRORLEVEL% EQU 0 (
    echo [OK] Application accessible sur http://localhost:8080
) ELSE (
    echo [ERREUR] L'application ne repond pas sur http://localhost:8080
    echo Verifie si le tunnel Minikube est bien lance (minikube tunnel)
)
