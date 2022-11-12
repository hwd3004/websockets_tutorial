import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import WebSocket from "ws";
import router from "./routers/router";

const app = express();

app.use(compression());
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", router);

const port = 4000;

const handleListening = () => {
  console.log(`http://localhost:${port}`);
};

// http 서버 위에 ws서버를 올림. 동시에 작동함.
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: `/ws` });

interface IWebSocket extends WebSocket.WebSocket {
  nickname: string;
}

const sockets: any[] = [];

const handleConnection = (socket: IWebSocket) => {
  console.log("handleConnection socket", socket);

  sockets.push(socket);
  socket.nickname = "ㅇㅇ";

  socket.on("close", () => {
    console.log("브라우저에서 연결을 해제하였습니다.");
  });

  socket.on("message", (message: any) => {
    interface ISocketMessage {
      type: "nickname" | "message";
      payload: string;
    }

    const parsed: ISocketMessage = JSON.parse(message.toString());
    console.log("parsed", parsed);

    switch (parsed.type) {
      case "message":
        sockets.forEach((eachSocket) => {
          eachSocket.send(`${socket.nickname}: ${parsed.payload}`);
        });
        break;
      case "nickname":
        console.log("parsed.payload", parsed.payload);
        socket.nickname = parsed.payload;
        console.log("socket.nickname", socket.nickname);
        break;
    }
  });
};

wss.on("connection", handleConnection);

server.listen(port, handleListening);
