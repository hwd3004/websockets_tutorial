<script lang="ts">
  import store from "../stores/store";
  import { onMount } from "svelte";

  const { socket } = store;

  const title = "WebSockets Tutorial";

  let welcomeRef: HTMLDivElement;
  let inputRef: HTMLInputElement;
  let inputValue: "";

  const handleSubmit = (event: SubmitEvent) => {
    socket.emit("enter_room", { playload: inputValue }, (message: string) => {
      console.log("handleSubmit Done");
      console.log(message);
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
