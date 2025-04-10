# BrowserQuest Rework 2025 [updated & with Socket.IO V2]

## Teams

Maxime Bidan - Louis Dondey - Arnaud Fischer - Alexis Gontier

## Changes

- Updated backend and frontend to use latest Socket.io and NodeJS version
- Fixed bugs and error.
- Updated client and server configuration files to use dynamic hostnames.
- Modified the client's config.js to properly parse and use the dynamic hostname.
- Make a dockerfile for running the game everywhere.
- Improved security with a firewall that blacklist ip base on identified bad behavior, limitation of the number of possible connexion try by IP, validation of player entry.

## HOW TO RUN?

setup config json file in client/config and server/config (cf documentation)

```shell
docker build -t browserquest .
docker run -p 8080:8080 -p 8000:8000 browserquest
```

## Documentation

Documentation is located in client and server directories.

## License

Code is licensed under MPL 2.0. Content is licensed under CC-BY-SA 3.0.
See the LICENSE file for details.

## Credits

Created by [Little Workshop](http://www.littleworkshop.fr):

- Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
- Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)
