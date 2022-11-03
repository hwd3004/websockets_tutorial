<script context="module">
  import axios from "axios";

  export const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
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
