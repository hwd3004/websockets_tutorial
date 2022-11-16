import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { io } from "socket.io-client";

export const local = false;

const socket = io("http://localhost:4000");

export default { local, socket };
