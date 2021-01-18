<script>
  import { onMount } from "svelte";

  let src = "";

  onMount(() => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then(res => res.json())
      .then(({ message }) => {
        src = message;
      });
  });
</script>

<img {src} alt="A very good boi" />

<style>
  img {
    display: block;
    width: 600px;
    height: 400px;
    object-fit: cover;
    background: #ddd;
  }
</style>
