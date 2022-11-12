<script context="module">
  import axios from "axios";

  const local = false;
  let baseURL = "";
  local ? (baseURL = "http://localhost:4000/api") : (baseURL = "/api");

  export const axiosInstance = axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      console.log("axios error");
      console.log(error);
      return error;
    }
  );
</script>

<script lang="ts">
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/mvp.css" />
</svelte:head>

<slot />
