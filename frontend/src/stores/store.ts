import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { io } from "socket.io-client";

export const local = false;

export const socket = io("http://localhost:4000");

export const showRoom = writable(false);

export const roomName = writable("asdasdasd");
