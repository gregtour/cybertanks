# Cyber Tanks
### Code Version 2.

1.0.2-a

## Building

Run `npm run build`.

## Deploying

Run `npm start`.

## Environment Variables

process.env.PORT - Sets the server port.

process.env.SALT - The salt for admin security.

process.env.ADMIN_KEY - SHA256 hex hash of admin password+salt.

## Notice
This project is uses the MIT license for all original code. 

./tedge/extlib contains external libraries, with their own respective licenses.

Copyright (C) 2016 Team Duck

## Help

For further documentation on the Team Duck Game Engine for HTML 5 and Node.JS (tedge), please contact the authors. 

[http://team-duck.com](http://team-duck.com)

## Runtime Paradigm
```
  Offline
+----------+
|  Client  |
+----------+
|   Game   |
+----------+
|  Server  |
+----------+

   Online
+----------+                         +----------+
|  Client1 |                         |  Client2 |
+----------+      +----------+       +----------+
|   Game   | <--> |   Game   |  <--> |   Game   |
+----------+      +----------+       +----------+
                  |  Server  |
                  +----------+
```

The game code is broken into three chunks, which each override a Tedge library class, the client, the game, and the server. In the case of an offline (singleplayer) game, the client, game, and server all coexist. In the case of a multiplayer game, the server is separated from the clients.

The Game class should contain data and logic that impacts the flow of the game. This logic will be executed on both the server and the client, or just the client in an offline game. 
