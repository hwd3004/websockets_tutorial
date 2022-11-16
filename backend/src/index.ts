import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import router from "./routers/router";
import { Server } from "socket.io";

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

io.on("connection", (socket) => {
  socket.on("enter_room", (data: object, callbackFn: Function) => {
    console.log(data);
    setTimeout(() => {
      callbackFn("message from the backend");
    }, 3000);
  });
});

httpServer.listen(port, handleListening);
