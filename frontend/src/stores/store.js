"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nickname = exports.roomName = exports.showRoom = exports.socket = exports.local = void 0;
const store_1 = require("svelte/store");
const socket_io_client_1 = require("socket.io-client");
exports.local = false;
exports.socket = (0, socket_io_client_1.io)("http://localhost:4000");
exports.showRoom = (0, store_1.writable)(false);
exports.roomName = (0, store_1.writable)("");
exports.nickname = (0, store_1.writable)("");
//# sourceMappingURL=store.js.map