<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// Importamos los elementos necesarios de Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

// Registramos los elementos de ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

// Estados reactivos
const cargando = ref(true);
const error = ref('');
const totalReportes = ref(0);

// Contadores para las tarjetas
const stats = ref({
  pendientes: 0,
  enCombate: 0,
  controlados: 0,
  extinguidos: 0
});

// Configuración reactiva del Gráfico
const chartData = ref({
  labels: ['Pendiente', 'En Combate', 'Controlado', 'Extinguido'],
  datasets: [
    {
      backgroundColor: ['#f39c12', '#e74c3c', '#f1c40f', '#2ecc71'], // Colores corporativos
      data: [0, 0, 0, 0] // Se llenará dinámicamente
    }
  ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
};

// Función para obtener y procesar datos
const cargarEstadisticas = async () => {
  try {
    cargando.value = true;
    error.value = '';
    
    // Llamamos al BFF que ya trae los datos calculados
    const respuesta = await axios.get('http://localhost:8080/api/bff/dashboard/estadisticas');
    const datos = respuesta.data;
    
    totalReportes.value = datos.total;

    // Asignamos directamente los valores del backend
    stats.value = { 
      pendientes: datos.pendientes, 
      enCombate: datos.enCombate, 
      controlados: datos.controlados, 
      extinguidos: datos.extinguidos 
    };

    // Actualizamos el gráfico
    chartData.value = {
      ...chartData.value,
      datasets: [
        {
          backgroundColor: chartData.value.datasets[0].backgroundColor,
          data: [datos.pendientes, datos.enCombate, datos.controlados, datos.extinguidos]
        }
      ]
    };

  } catch (err) {
    console.error("Error cargando dashboard:", err);
    error.value = "No se pudo conectar con el servidor de estadísticas.";
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarEstadisticas();
});
</script>

<template>
  <div class="dashboard-wrapper">
    <header class="dashboard-header">
      <h2>Centro de Comando y Estadísticas</h2>
      <p>Visión general histórica de emergencias en la comuna</p>
    </header>

    <div v-if="cargando" class="mensaje-carga">
      Procesando datos históricos...
    </div>

    <div v-else-if="error" class="mensaje-error">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      
      <div class="kpi-row">
        <div class="kpi-card total">
          <h3>Total Histórico</h3>
          <p class="numero">{{ totalReportes }}</p>
        </div>
        <div class="kpi-card combate">
          <h3>Focos Activos</h3>
          <p class="numero">{{ stats.enCombate }}</p>
        </div>
        <div class="kpi-card pendiente">
          <h3>Por Verificar</h3>
          <p class="numero">{{ stats.pendientes }}</p>
        </div>
      </div>

      <div class="grafico-container">
        <h3>Distribución de Estados</h3>
        <div class="grafico-wrapper">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 15px;
}

.dashboard-header h2 {
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.dashboard-header p {
  color: #7f8c8d;
  margin: 0;
}

.kpi-row {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.kpi-card {
  flex: 1;
  padding: 20px;
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.kpi-card h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-card .numero {
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
}

/* Colores de las tarjetas */
.kpi-card.total { background: #34495e; }
.kpi-card.combate { background: #e74c3c; }
.kpi-card.pendiente { background: #f39c12; }

.grafico-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ecf0f1;
}

.grafico-container h3 {
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
}

.grafico-wrapper {
  height: 300px;
  position: relative;
  display: flex;
  justify-content: center;
}

.mensaje-carga, .mensaje-error {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
  font-weight: 600;
}

.mensaje-error {
  color: #c0392b;
  background: #fadbd8;
}
</style>