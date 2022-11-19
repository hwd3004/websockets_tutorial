https://socket.io/docs/v4/rooms/

socket의 join 메소드를 이용하여, 채팅방에 입장하는 개념으로 room에 이름을 지정하여서 입장할 수 있다. 동시에 여러 개의 방에 입장할 수 있다.

onAny 메소드는 socket의 이벤트를 탐지하고, 원하는 행위를 실행할 수 있다.

leave 메소드로 방을 떠날 수 있다.

to 메소드로 방 전체에 메세지를 보낼 수 있다.

```ts
...

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log("Socket Event : ", event);
  });

  socket.on("enter_room", (roomName: string, callbackFn: Function) => {
    console.log("socket.rooms : ", socket.rooms);
    socket.join(roomName);
    console.log("socket.rooms : ", socket.rooms);
    console.log(roomName);
    setTimeout(() => {
      callbackFn("message from the backend");
    }, 3000);
  });
});

...
```

```log
Socket Event :  enter_room
socket.rooms :  Set(1) { 'k_yjI-zyGuv_fu0IAAAN' }
socket.rooms :  Set(2) { 'k_yjI-zyGuv_fu0IAAAN', 'room1' }
room1
Socket Event :  enter_room
socket.rooms :  Set(1) { 'y_ZdXP_2akaEGqRVAAAP' }
socket.rooms :  Set(2) { 'y_ZdXP_2akaEGqRVAAAP', 'room1' }
room1
Socket Event :  enter_room
socket.rooms :  Set(2) { 'y_ZdXP_2akaEGqRVAAAP', 'room1' }
socket.rooms :  Set(3) { 'y_ZdXP_2akaEGqRVAAAP', 'room1', 'room2' }
```
