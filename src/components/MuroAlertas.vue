<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Estado reactivo para almacenar las alertas
const alertas = ref([]);
const cargando = ref(true);
const error = ref(null);

// Función para obtener las alertas desde el API Gateway
const obtenerAlertas = async () => {
  try {
    cargando.value = true;
    // Apuntamos al puerto 8080 del Gateway
    const respuesta = await axios.get('/api/bff/alertas');
    // Ordenamos las alertas por fecha (más reciente primero)
    alertas.value = respuesta.data.sort((a, b) => 
      new Date(b.fechaEmision) - new Date(a.fechaEmision)
    );
  } catch (err) {
    error.value = "No se pudieron cargar las alertas. Intente más tarde.";
    console.error("Error al consumir el API Gateway:", err);
  } finally {
    cargando.value = false;
  }
};

// Función para formatear la fecha de emisión
const formatearFecha = (fechaStr) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(fechaStr).toLocaleDateString('es-CL', opciones);
};

// Función para asignar color según el Nivel de Riesgo
const getClaseRiesgo = (nivel) => {
  switch (nivel) {
    case 'CATASTROFE': return 'riesgo-critico'; // Rojo
    case 'EVACUACION': return 'riesgo-alto';    // Naranja
    case 'PREVENTIVO': return 'riesgo-medio';   // Azul/Verde
    default: return '';
  }
};

onMounted(() => {
  obtenerAlertas();
});
</script>

<template>
  <div class="muro-container">
    <header class="muro-header">
      <h1>Muro de Alertas Oficiales</h1>
      <p>Información en tiempo real para la comunidad de Valle del Sol</p>
    </header>

    <div v-if="cargando" class="mensaje">
      <p>Actualizando información de emergencias...</p>
    </div>

    <div v-else-if="error" class="error-box">
      {{ error }}
    </div>

    <div v-else class="alertas-list">
      <div v-if="alertas.length === 0" class="mensaje">
        <p>No hay alertas activas en este momento.</p>
      </div>

      <article 
        v-for="alerta in alertas" 
        :key="alerta.id" 
        class="alerta-card"
        :class="getClaseRiesgo(alerta.nivelRiesgo)"
      >
        <div class="alerta-badge">
          {{ alerta.nivelRiesgo }}
        </div>
        <div class="alerta-content">
          <p class="mensaje-texto">{{ alerta.mensajeAlerta }}</p>
          <div class="meta-info">
            <span>📅 {{ formatearFecha(alerta.fechaEmision) }}</span>
            <span>📍 Reporte ID: #{{ alerta.idReporte }}</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.muro-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.muro-header {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
}

.alertas-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alerta-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-left: 8px solid #bdc3c7;
  transition: transform 0.2s;
}

.alerta-card:hover {
  transform: translateY(-5px);
}

.alerta-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  background: #ecf0f1;
}

.mensaje-texto {
  font-size: 1.2rem;
  color: #34495e;
  margin-bottom: 15px;
  line-height: 1.4;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #7f8c8d;
}

/* Colores por Nivel de Riesgo */
.riesgo-critico { border-left-color: #e74c3c; }
.riesgo-critico .alerta-badge { background: #fadbd8; color: #e74c3c; }

.riesgo-alto { border-left-color: #f39c12; }
.riesgo-alto .alerta-badge { background: #fdebd0; color: #af601a; }

.riesgo-medio { border-left-color: #3498db; }
.riesgo-medio .alerta-badge { background: #d6eaf8; color: #3498db; }

.mensaje, .error-box {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 12px;
}

.error-box {
  color: #e74c3c;
  border: 1px solid #fab1a0;
}
</style>