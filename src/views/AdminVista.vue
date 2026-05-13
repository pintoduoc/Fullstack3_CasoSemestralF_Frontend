<script setup>
import { useRouter } from 'vue-router';
import Dashboard from '@/components/Dashboard.vue';
import GestorReportes from '@/components/GestorReportes.vue';

const router = useRouter();

// Función para cerrar sesión y limpiar el almacenamiento local
const cerrarSesion = () => {
  localStorage.removeItem('usuarioActivo');
  router.push('/');
};
</script>

<template>
  <div class="admin-layout">
    <nav class="admin-navbar">
      <div class="nav-brand">
        <h1>Panel de Administración <span>Valle del Sol</span></h1>
      </div>
      <div class="nav-user">
        <span class="user-badge">Personal Municipal / Brigadista</span>
        <button @click="cerrarSesion" class="btn-logout">Cerrar Sesión</button>
      </div>
    </nav>

    <main class="admin-container">
      
      <section class="admin-section">
        <div class="section-header">
          <span class="icon">📊</span>
          <h2>Análisis Histórico y Estado Actual</h2>
        </div>
        <Dashboard />
      </section>

      <section class="admin-section">
        <div class="section-header">
          <span class="icon">🚨</span>
          <h2>Gestor Operativo de Incendios</h2>
        </div>
        <GestorReportes />
      </section>

    </main>

    <footer class="admin-footer">
      <p>© 2026 Municipalidad Valle del Sol - Sistema de Gestión de Emergencias v2.0</p>
    </footer>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: #f0f2f5; /* Un gris un poco más sólido para un look "profesional" */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Estilos Navbar */
.admin-navbar {
  background-color: #1a252f; /* Un tono más oscuro que el de ciudadano */
  color: white;
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.4rem;
}

.nav-brand span {
  color: #e74c3c; /* Rojo para destacar el enfoque en incendios */
  font-weight: 300;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-badge {
  background: #34495e;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.btn-logout {
  background-color: #c0392b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-logout:hover {
  background-color: #e74c3c;
}

/* Contenedor de Secciones */
.admin-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.admin-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
}

.section-header .icon {
  font-size: 1.8rem;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  border-left: 4px solid #e74c3c;
  padding-left: 15px;
}

/* Footer */
.admin-footer {
  text-align: center;
  padding: 30px;
  color: #95a5a6;
  font-size: 0.85rem;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 768px) {
  .admin-navbar {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .nav-user {
    flex-direction: column;
    gap: 10px;
  }
}
</style>