import { writable } from "svelte/store";
import { browser } from "$app/environment";

const messageStore = writable("");

export const local = false;
let wsURL = "";

local ? (wsURL = "ws://localhost:4000/ws") : (wsURL = "ws://172.30.10.45/socket");

// https://stackoverflow.com/questions/69151604/how-to-access-websocket-in-svelte
// 스벨트킷에서 웹소켓 연결
let socket: WebSocket;
if (browser) {
  socket = new WebSocket(wsURL);

  socket.addEventListener("open", (event) => {
    console.log("socket open", event);
  });

  socket.addEventListener("message", (event) => {
    console.log("socket message", event);
    messageStore.set(event.data);
  });

  socket.addEventListener("close", (event) => {
    console.log("socket close", event);
  });
}

const sendMessage = (message: string) => {
  if (socket.readyState <= 1) {
    socket.send(message);
  }
};

export default {
  subscribe: messageStore.subscribe,
  sendMessage,
};
