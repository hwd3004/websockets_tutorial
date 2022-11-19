<script lang="ts">
  import { roomName } from "@store";

  let roomRef: HTMLDivElement;
  let inputRef: HTMLInputElement;

  let inputValue: "";

  const handleSubmitMessage = (_event: SubmitEvent) => {};
</script>

<div bind:this={roomRef} id="room">
  <h3>{$roomName}</h3>
  <ul />
  <form on:submit|preventDefault={handleSubmitMessage}>
    <input bind:this={inputRef} bind:value={inputValue} type="text" placeholder="message" required />
    <button>Send</button>
  </form>
</div>
