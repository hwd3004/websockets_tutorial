<script lang="ts">
  import { socket, showRoom, roomName } from "@store";

  let welcomRef: HTMLDivElement;
  let inputRef: HTMLInputElement;

  let inputValue = "";

  const handleShowRoom = () => {
    showRoom.update(() => true);
  };

  const handleSubmit = (_event: SubmitEvent) => {
    if (inputValue.trim() != "") {
      socket.emit("enter_room", inputValue, handleShowRoom);
      roomName.update(() => inputValue);
      inputValue = "";
    }
  };
</script>

<div bind:this={welcomRef} id="welcome">
  <form on:submit|preventDefault={handleSubmit}>
    <input bind:this={inputRef} bind:value={inputValue} type="text" placeholder="room name" required />
    <button>Enter Room</button>
  </form>
</div>
