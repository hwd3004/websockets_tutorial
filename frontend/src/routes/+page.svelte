<script lang="ts">
  import Lobby from "@components/Lobby.svelte";
  import Room from "@components/Room.svelte";
  import { showRoom } from "@store";

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
    <Lobby />
  {/if}
</main>
