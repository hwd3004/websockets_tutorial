<script lang="ts">
  import Lobby from "@components/Lobby.svelte";
  import Room from "@components/Room.svelte";
  import Nickname from "@components/Nickname.svelte";
  import { showRoom } from "@store";
  import OpenRooms from "../lib/components/OpenRooms.svelte";

  const title = "WebSockets Tutorial";
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<header>{title}</header>

<main>
  {#if $showRoom}
    <Room />
  {:else}
    <Nickname />
    <Lobby />
    <OpenRooms />
  {/if}
</main>
