import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { io } from "socket.io-client";

export const local = false;

export const socket = io("http://localhost:4000");

const handleShowRoom = () => {
  const { subscribe, set, update } = writable(false);
  return {
    subscribe,
    set,
    update,
    onShowRoom: () => {
      update(() => true);
    },
  };
};

export const showRoom = handleShowRoom();

export const roomName = writable("");

export const nickname = writable("");
