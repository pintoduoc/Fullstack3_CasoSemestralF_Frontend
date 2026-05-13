<script setup>
import { useRouter } from 'vue-router';
import MapaInteractivo from '@/components/MapaInteractivo.vue';
import FormularioReporte from '@/components/FormularioReporte.vue';
import MuroAlertas from '@/components/MuroAlertas.vue';

const router = useRouter();

// Función sencilla para simular el cierre de sesión
const cerrarSesion = () => {
  localStorage.removeItem('usuarioActivo');
  router.push('/'); // Redirige al inicio (Home)
};
</script>

<template>
  <div class="ciudadano-layout">
    <nav class="navbar">
      <div class="nav-brand">
        <h1>Portal Ciudadano <span>Valle del Sol</span></h1>
      </div>
      <button @click="cerrarSesion" class="btn-logout">
        Cerrar Sesión
      </button>
    </nav>

    <main class="contenedor-principal">
      <section class="seccion-mapa">
        <MapaInteractivo />
      </section>

      <section class="seccion-accion">
        <FormularioReporte />
      </section>

      <hr class="divisor" />

      <section class="seccion-informacion">
        <MuroAlertas />
      </section>
    </main>
    
    <footer class="footer-ciudadano">
      <p>Municipalidad Valle del Sol - Sistema de Emergencias</p>
    </footer>
  </div>
</template>

<style scoped>
.ciudadano-layout {
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Estilos de la Barra de Navegación */
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-brand span {
  color: #e67e22;
  font-weight: 300;
}

.btn-logout {
  background-color: transparent;
  color: #ecf0f1;
  border: 1px solid #ecf0f1;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #ecf0f1;
  color: #2c3e50;
}

/* Estilos del Contenedor Principal */
.contenedor-principal {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px; /* Espacio uniforme entre secciones */
}

/* Ajustes específicos para las secciones */
.seccion-mapa {
  width: 100%;
}

.seccion-accion {
  display: flex;
  justify-content: center;
  width: 100%;
}

.divisor {
  border: 0;
  height: 1px;
  background: #dcdde1;
  width: 80%;
  margin: 10px auto;
}

.seccion-informacion {
  width: 100%;
}

/* Pie de página */
.footer-ciudadano {
  text-align: center;
  padding: 20px;
  background-color: #2c3e50;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: auto;
}
</style>