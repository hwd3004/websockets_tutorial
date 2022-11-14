```
git clone https://github.com/hwd3004/websockets_tutorial.git

docker network create --driver bridge wss-network

sudo docker run -d -it --name wss-back \
    -v /websockets_tutorial/backend:/websockets_tutorial/backend -p 4000:4000 \
    --network wss-network node:18.12.0

sudo docker run -d -it --name wss-front \
    -v /websockets_tutorial/frontend:/websockets_tutorial/frontend -p 3000:3000 \
    --network wss-network node:18.12.0

sudo docker run -d -it --name wss-nginx-container \
    -p 80:80 \
    -v /websockets_tutorial/log/z_deploy/default.conf:/etc/nginx/conf.d/default.conf \
    --network wss-network nginx

docker exec -itd wss-back sh -c "cd /websockets_tutorial/backend && npm i -g nodemon && npm i -g typescript && npm i && node dist"

docker exec -itd wss-front sh -c "cd /websockets_tutorial/frontend && npm i -g nodemon && npm i -g typescript && npm i && npm run build && node dist"

docker exec -itd wss-front sh -c "cd /websockets_tutorial/frontend && node dist"
```

```
docker run -d -it --name wss-back `
    -v C:\workspace\websockets_tutorial\backend:/websockets_tutorial/backend -p 4000:4000 `
    --network wss-network node:18.12.0

docker run -d -it --name wss-front `
    -v C:\workspace\websockets_tutorial\frontend:/websockets_tutorial/frontend -p 3000:3000 `
    --network wss-network node:18.12.0
```

```
docker run -d -it --name wss-nginx-container -p 80:80 `
    -v C:\workspace\websockets_tutorial\log\z_deploy\default.conf:/etc/nginx/conf.d/default.conf `
    --network wss-network nginx

docker run -d -it --name wss-nginx-container -p 80:80 --network wss-network nginx

docker cp /data/clone_tube/db mongodb-container:/data
```

```
docker exec -it wss-back bash

docker exec -it wss-front bash
```
