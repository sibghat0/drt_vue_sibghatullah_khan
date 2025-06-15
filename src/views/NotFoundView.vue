<script setup lang="ts"></script>
<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary">404</h1>
      <p class="text-2xl font-semibold text-muted-foreground mt-4">Page Not Found</p>
      <p class="text-muted-foreground mt-2">Sorry, the page you are looking for does not exist.</p>
      <button class="mt-4">
        <router-link to="/"> Go to Home </router-link>
      </button>
    </div>
  </div>
</template>
