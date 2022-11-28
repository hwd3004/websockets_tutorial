import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import router from "./routers/router";
import { Server } from "socket.io";
import { clog } from "./common";

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

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;

  const publicRooms: string[] = [];

  rooms.forEach((_value, key) => {
    clog("sids.get(key)", sids.get(key));
    clog("rooms.get(key)", rooms.get(key));
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
};

const countRoom = (roomName: string) => {
  // 소켓 접속자의 수 조회가 제대로 계산되지 않을 시 이 함수가 문제일 수 있음
  return io.sockets.adapter.rooms.get(roomName)?.size as number;
};

io.on("connection", (socket) => {
  socket.onAny((event) => {
    clog("Socket Event : ", event);
    clog("io.sockets.adapter", io.sockets.adapter);
  });

  io.sockets.emit("room_change", publicRooms());

  socket.on("enter_room", (roomName: string, doneFn: Function) => {
    socket.join(roomName);
    doneFn();
    // socket.to(roomName).emit("welcome", socket["nickname"], countRoom(roomName));
    io.to(roomName).emit("welcome", socket["nickname"], countRoom(roomName));

    io.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      // socket.to(room).emit("bye", socket["nickname"], countRoom(room) - 1);
      io.to(room).emit("bye", socket["nickname"], countRoom(room) - 1);
    });
  });

  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });

  socket.on("chat", (message: string, roomName: string, doneFn: Function) => {
    socket.to(roomName).emit("chat", `${socket["nickname"]}: ${message}`);
    doneFn();
  });

  socket.on("nickname", (nickname: string, doneFn: Function) => {
    socket["nickname"] = nickname;
    doneFn();
  });
});

httpServer.listen(port, handleListening);
