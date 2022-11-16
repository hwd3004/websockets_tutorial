socketIO client의 emit

```
클라이언트에서 서버로 데이터를 전달할 수 있다.
string을 1개만 보낼 수 있는 ws와 달리 데이터 형식과 개수가 자유롭다.
그리고 함수도 보낼 수 있다.
```

```
처리비용이 크고 시간이 걸리는 작업이 완료되었을 때, 프론트엔드에 알리고 싶을 경우
마지막 파라미터에 함수를 넣어서 보낼 수 있다.
이렇게 보낸 함수는 백엔드에서 호출만 하고, 실행은 프론트엔드에서 한다.
```

```svelte
<script lang="ts">
  import store from "../stores/store";
  import { onMount } from "svelte";

  const { socket } = store;

  const title = "WebSockets Tutorial";

  let welcomeRef: HTMLDivElement;
  let inputRef: HTMLInputElement;
  let inputValue: "";

  const handleSubmit = (event: SubmitEvent) => {
    socket.emit("enter_room", { playload: inputValue }, () => {
      console.log("handleSubmit Done");
    });
    inputValue = "";
  };

  onMount(() => {});
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<header>{title}</header>

<main>
  <div bind:this={welcomeRef} id="welcome">
    <form on:submit|preventDefault={handleSubmit}>
      <input bind:this={inputRef} bind:value={inputValue} type="text" placeholder="room name" required />
      <button>Enter Room</button>
    </form>
  </div>
</main>
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
      callbackFn();
    }, 3000);
  });
});

httpServer.listen(port, handleListening);
```
