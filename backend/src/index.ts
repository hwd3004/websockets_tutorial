import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import { instrument } from "@socket.io/admin-ui";
import router from "./routers/router";
import { Server } from "socket.io";
import { clog } from "./common";
import { roomName } from "../../frontend/src/stores/store";

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
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (roomName: string) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });

  socket.on("offer", (offer: RTCSessionDescriptionInit, roomName: string) => {
    socket.to(roomName).emit("offer", offer);
  });

  socket.on("answer", (answer: RTCSessionDescriptionInit, roomName: string) => {
    socket.to(roomName).emit("answer", answer);
  });
});

httpServer.listen(port, handleListening);
