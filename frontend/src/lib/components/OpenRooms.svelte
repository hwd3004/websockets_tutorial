<script lang="ts">
  import { socket, showRoom, roomName } from "@store";

  let roomList: string[] = [];

  let buttonRef: HTMLButtonElement;

  socket.on("room_change", (rooms: string[]) => {
    roomList = rooms;
  });

  const enterRoom = (event: Event) => {
    // socket.emit("enter_room", inputValue, handleShowRoom);
    socket.emit("enter_room", buttonRef.innerText, showRoom.onShowRoom);
    roomName.update(() => buttonRef.innerText);
  };
</script>

<div>
  <h4>Open Rooms :</h4>
  {#if roomList.length == 0}
    <p>There is no rooms.</p>
  {:else}
    <ul>
      {#each roomList as room}
        <li><button bind:this={buttonRef} on:click={enterRoom}>{room}</button></li>
      {/each}
    </ul>
  {/if}
</div>
