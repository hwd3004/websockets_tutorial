socketIO client의 emit

```
emit을 사용하여 백엔드에서 호출하여 프론트엔드에서 실행될 함수에
파라미터를 넣어서 보낼 수 있다.
```

```svelte
...

  const handleSubmit = (event: SubmitEvent) => {
    socket.emit("enter_room", { playload: inputValue }, (message: string) => {
      console.log("handleSubmit Done");
      console.log(message);
    });
    inputValue = "";
  };

...
````

```ts
...

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
```
