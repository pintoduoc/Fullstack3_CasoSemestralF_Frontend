<script setup>
// Importamos los dos componentes que ya creamos
import LoginRegistro from '@/components/LoginRegistro.vue';
import MuroAlertas from '@/components/MuroAlertas.vue';
</script>

<template>
  <main class="home-view">
    <section class="auth-section">
      <LoginRegistro />
    </section>

    <hr class="separator" />

    <section class="news-section">
      <MuroAlertas />
    </section>
  </main>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 40px; /* Espacio entre el login y el muro */
  padding-bottom: 60px;
  background-color: #f4f7f6; /* Un color de fondo suave para toda la página */
  min-height: 100vh;
}

.auth-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}

.separator {
  border: 0;
  height: 1px;
  background: #dcdde1;
  width: 80%;
  margin: 0 auto;
}

.news-section {
  width: 100%;
}
</style>