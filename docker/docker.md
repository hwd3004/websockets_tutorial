```
git clone https://github.com/hwd3004/websockets_tutorial.git

docker network create --driver bridge wss-network

docker run -d -it --name wss_back -p 4000:4000 --network wss-network -v /websockets_tutorial/backend:/websockets_tutorial/backend node:18.12.0

docker run -d -it --name wss_front -p 80:3000 --network wss-network -v /websockets_tutorial/frontend:/websockets_tutorial/frontend node:18.12.0

docker inspect wss-network

docker exec -it wss_back bash
docker exec -it wss_front bash

npm i -g typescript && npm i -g nodemon

apt update && apt upgrade -y && apt install vim -y

docker exec -itd wss_tutorial-container sh -c "cd /websockets_tutorial/backend && npm start"

docker exec -itd wss_tutorial-container sh -c "cd /websockets_tutorial/frontend && node dist"
```

```
docker network create --driver bridge wss-network

docker run -d -it --name wss_back -p 4000:4000 --network wss-network -v C:\workspace\websockets_tutorial\backend:/websockets_tutorial/backend node:18.12.0

docker run -d -it --name wss_front -p 80:3000 --network wss-network -v C:\workspace\websockets_tutorial\frontend:/websockets_tutorial/frontend node:18.12.0
```
