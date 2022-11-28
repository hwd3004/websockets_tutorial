<script lang="ts">
  import { socket, nickname } from "@store";

  let inputValue: string = "";

  const handleSubmit = () => {
    if (inputValue.trim() != "") {
      socket.emit("nickname", inputValue, () => {
        nickname.update(() => inputValue);
      });
    }
  };
</script>

<div>
  <form on:submit|preventDefault={handleSubmit}>
    <input bind:value={inputValue} type="text" placeholder="change nickname" required />
    <button>Send</button>
  </form>
</div>
