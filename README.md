# BrowserQuest Rework 2025 [updated & with Socket.IO V2]

## Team 1:
- [Arnaud Fischer](https://github.com/Jeck0v)
- [Maxime Bidan](https://github.com/Oomaxime)
- [Louis Dondey](https://github.com/Kae134)
- [Alexis Gontier](https://github.com/Alexis-Gontier)



## Changes

- Updated backend and frontend to use latest Socket.io and NodeJS version
- Fixed bugs and error.
- Updated client and server configuration files to use dynamic hostnames.
- Modified the client's config.js to properly parse and use the dynamic hostname.
- Make a dockerfile for running the game everywhere.
- Improved security with a firewall that blacklist ip base on identified bad behavior, limitation of the number of possible connexion try by IP, validation of player entry.
- Creating a K8S infrastructure with minikube
- Add path for access to wesbsocket
- Add loadbalancing with nginx-ingress
- Add HPA for K8S
- Add docs for start minikube
- Removed unecessary console.log, error, ...
- Refactored some part of the code

## HOW TO RUN?

setup config json file in client/config and server/config (cf documentation)
```shell
docker build -t browserquest .
docker run -p 8080:8080 -p 8000:8000 browserquest
```
If you want to improve the project, you'll need to update the docker image and rebuild + refer to dockerhub, so modify `browserquest-infra/base/deployment.yaml`, like this:
```shell
docker build -t DockerUserName/ImageName:test .
docker login
docker push DockerUserName/ImageName:test
```
in `browserquest-infra/base/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: browserquest
  namespace: browserquest
spec:
  replicas: 3
  selector:
    matchLabels:
      app: browserquest
  template:
    metadata:
      labels:
        app: browserquest
    spec:
      containers:
        - name: browserquest
          image: DockerUserName/ImageName:test
          ports:
            - containerPort: 8080
              name: http
            - containerPort: 8000
              name: websocket
          resources:
            requests:
              cpu: 500m
            limits:
              cpu: 1000m
```

## Documentation

Documentation is located in client and server directories, and browserquest-infra/docs

## License

Code is licensed under MPL 2.0. Content is licensed under CC-BY-SA 3.0.
See the LICENSE file for details.

## Credits

Created by [Little Workshop](http://www.littleworkshop.fr):

- Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
- Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)
