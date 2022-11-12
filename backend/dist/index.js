"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const ws_1 = __importDefault(require("ws"));
const router_1 = __importDefault(require("./routers/router"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use("/api", router_1.default);
const port = 4000;
const handleListening = () => {
    console.log(`http://localhost:${port}`);
};
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server, path: `/ws` });
const sockets = [];
const handleConnection = (socket) => {
    console.log("handleConnection socket", socket);
    sockets.push(socket);
    socket.nickname = "ㅇㅇ";
    socket.on("close", () => {
        console.log("브라우저에서 연결을 해제하였습니다.");
    });
    socket.on("message", (message) => {
        const parsed = JSON.parse(message.toString());
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
//# sourceMappingURL=index.js.map