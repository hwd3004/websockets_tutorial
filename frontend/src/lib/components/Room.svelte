<script lang="ts">
  import { roomName, socket, nickname } from "@store";

  let roomRef: HTMLDivElement;
  let inputRef: HTMLInputElement;
  let ulRef: HTMLUListElement;

  let inputValue: "";

  let title = ``;

  const addMessage = (message: string) => {
    const li = document.createElement("li");
    li.innerText = message;
    ulRef.appendChild(li);
  };

  const handleSubmitMessage = (_event: SubmitEvent) => {
    const value = inputValue;
    socket.emit("chat", inputValue, $roomName, () => {
      addMessage(`${$nickname}: ${value}`);
    });
    inputValue = "";
  };

  socket.on("welcome", (name: string, count: number) => {
    addMessage(`${name} joined.`);
    title = `${$roomName} (😎${count})`;
  });

  socket.on("bye", (name: string, count: number) => {
    addMessage(`${name} left.`);
    title = `${$roomName} (😎${count})`;
  });

  socket.on("chat", (message: string) => {
    addMessage(message);
  });
</script>

<div bind:this={roomRef} id="room">
  <h3>{title}</h3>
  <ul bind:this={ulRef} />
  <form on:submit|preventDefault={handleSubmitMessage}>
    <input bind:this={inputRef} bind:value={inputValue} type="text" placeholder="message" required />
    <button>Send</button>
  </form>
</div>
