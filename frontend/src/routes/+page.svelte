<script lang="ts">
  import store from "../stores/store";
  import { onMount } from "svelte";
  import { axiosInstance } from "./+layout.svelte";

  let getInit = async () => {
    const { data } = await axiosInstance.get("/");
    console.log(data);
    return data;
  };

  let init = getInit();

  //
  //
  //

  let message: string;
  let nickname: string = "ㅇㅇ";
  let messages: any[] = [];

  onMount(() => {
    store.subscribe((currentMessage) => {
      console.log("currentMessage", currentMessage);
      messages = [...messages, currentMessage];
    });
  });

  const onSendMessage = () => {
    if (message.length > 0) {
      // store.sendMessage(message);
      store.sendMessage(JSON.stringify({ type: "message", payload: message }));
      message = "";
    }
  };

  const onSetNickname = () => {
    console.log("onSetNickname");
    if (nickname.length > 0) {
      store.sendMessage(JSON.stringify({ type: "nickname", payload: nickname }));
    }
  };
</script>

<svelte:head>
  <title>WebSockets Tutorial</title>
</svelte:head>

<header>WebSOckets Tutorial</header>

<main>
  <h3>Welcome</h3>
  <hr />
  {#await init}
    <p>...loading</p>
  {:then data}
    <p>{data.home}</p>
  {/await}
  <hr />
  <div>
    <div>
      <input type="text" bind:value={nickname} />
      <button on:click={onSetNickname}>set nickname</button>
    </div>
    <div>
      <input
        type="text"
        bind:value={message}
        on:keyup={(event) => {
          event.key == "Enter" ? onSendMessage() : null;
        }}
      />
      <button on:click={onSendMessage}>Send Message</button>
    </div>
  </div>
  <div>
    <ul>
      {#each messages as data}
        <li>{data}</li>
      {/each}
    </ul>
  </div>
</main>
