<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// --- ESTADOS PRINCIPALES ---
const reportes = ref([]);
const cargando = ref(true);
const error = ref('');

// --- ESTADOS DEL MODAL DE ALERTA ---
const mostrarModal = ref(false);
const reporteSeleccionado = ref(null);
const enviandoAlerta = ref(false);
const formularioAlerta = ref({
  nivelRiesgo: 'PREVENTIVO',
  mensajeAlerta: ''
});

// --- FUNCIONES DE REPORTES ---
const cargarReportes = async () => {
  try {
    cargando.value = true;
    const respuesta = await axios.get('http://localhost:8080/api/bff/reportes');
    // Ordenar para que los más recientes (ID más alto) salgan primero
    reportes.value = respuesta.data.sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error("Error al cargar reportes:", err);
    error.value = "No se pudieron cargar los reportes. Verifique la conexión.";
  } finally {
    cargando.value = false;
  }
};

const actualizarEstado = async (reporte) => {
  try {
    await axios.put(`http://localhost:8080/api/bff/reportes/${reporte.id}`, reporte);
    // Mostrar un pequeño feedback visual (opcional)
    console.log(`Reporte #${reporte.id} actualizado a ${reporte.estado}`);
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    alert("Hubo un error al actualizar el estado del reporte.");
  }
};

// --- FUNCIONES DE ALERTAS (MODAL) ---
const abrirModalAlerta = (reporte) => {
  reporteSeleccionado.value = reporte;
  formularioAlerta.value = {
    nivelRiesgo: 'PREVENTIVO',
    mensajeAlerta: `Se informa situación respecto al reporte #${reporte.id}: ${reporte.descripcion}`
  };
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  reporteSeleccionado.value = null;
};

const enviarAlerta = async () => {
  if (!formularioAlerta.value.mensajeAlerta) {
    alert("El mensaje de alerta no puede estar vacío.");
    return;
  }

  try {
    enviandoAlerta.value = true;
    
    // Armamos el objeto tal como lo espera AlertaEmergencia.java
    const nuevaAlerta = {
      idReporte: reporteSeleccionado.value.id,
      mensajeAlerta: formularioAlerta.value.mensajeAlerta,
      // LocalDateTime de Java acepta el formato ISO 8601 sin la "Z" al final
      fechaEmision: new Date().toISOString().slice(0, 19), 
      nivelRiesgo: formularioAlerta.value.nivelRiesgo
    };

    // Apuntamos al microservicio de alertas a través del Gateway
    await axios.post('http://localhost:8080/api/bff/alertas', nuevaAlerta);
    
    alert("¡Alerta emitida exitosamente a la comunidad!");
    cerrarModal();

  } catch (err) {
    console.error("Error al emitir alerta:", err);
    alert("Hubo un error al intentar emitir la alerta.");
  } finally {
    enviandoAlerta.value = false;
  }
};

onMounted(() => {
  cargarReportes();
});
</script>

<template>
  <div class="gestor-wrapper">
    <header class="gestor-header">
      <h2>Gestión Operativa de Reportes</h2>
      <button @click="cargarReportes" class="btn-actualizar" :disabled="cargando">
        🔄 Actualizar
      </button>
    </header>

    <div v-if="cargando" class="mensaje-carga">Cargando reportes activos...</div>
    <div v-else-if="error" class="mensaje-error">{{ error }}</div>

    <div v-else class="tabla-container">
      <table class="tabla-reportes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Ubicación</th>
            <th>Estado Operativo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reporte in reportes" :key="reporte.id">
            <td><strong>#{{ reporte.id }}</strong></td>
            <td class="col-desc">{{ reporte.descripcion }}</td>
            <td class="col-ubic">
              <a :href="`https://maps.google.com/?q=${reporte.latitud},${reporte.longitud}`" target="_blank" title="Ver en Google Maps">
                📍 {{ reporte.latitud?.toFixed(3) }}, {{ reporte.longitud?.toFixed(3) }}
              </a>
            </td>
            <td>
              <select 
                v-model="reporte.estado" 
                @change="actualizarEstado(reporte)"
                :class="`estado-${reporte.estado.toLowerCase()}`"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_COMBATE">En Combate</option>
                <option value="CONTROLADO">Controlado</option>
                <option value="EXTINGUIDO">Extinguido</option>
              </select>
            </td>
            <td>
              <button @click="abrirModalAlerta(reporte)" class="btn-alerta">
                🚨 Emitir Alerta
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <header class="modal-header">
          <h3>Emitir Alerta Pública</h3>
          <p>Asociada al Reporte #{{ reporteSeleccionado.id }}</p>
        </header>

        <form @submit.prevent="enviarAlerta" class="modal-form">
          <div class="form-group">
            <label>Nivel de Riesgo</label>
            <select v-model="formularioAlerta.nivelRiesgo" class="select-riesgo">
              <option value="PREVENTIVO">🔵 Preventivo</option>
              <option value="EVACUACION">🟠 Evacuación</option>
              <option value="CATASTROFE">🔴 Catástrofe</option>
            </select>
          </div>

          <div class="form-group">
            <label>Mensaje para la Comunidad</label>
            <textarea 
              v-model="formularioAlerta.mensajeAlerta" 
              rows="4"
              required
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="cerrarModal" class="btn-cancelar" :disabled="enviandoAlerta">Cancelar</button>
            <button type="submit" class="btn-confirmar" :disabled="enviandoAlerta">
              {{ enviandoAlerta ? 'Emitiendo...' : 'Publicar Alerta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gestor-wrapper {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.gestor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 15px;
}

.gestor-header h2 {
  color: #2c3e50;
  margin: 0;
}

.btn-actualizar {
  background: #ecf0f1;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: #2c3e50;
  transition: background 0.2s;
}

.btn-actualizar:hover { background: #bdc3c7; }

.tabla-container {
  overflow-x: auto;
}

.tabla-reportes {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.tabla-reportes th {
  background: #f8f9fa;
  color: #34495e;
  padding: 12px 15px;
  border-bottom: 2px solid #bdc3c7;
}

.tabla-reportes td {
  padding: 12px 15px;
  border-bottom: 1px solid #ecf0f1;
  vertical-align: middle;
}

.col-desc { max-width: 250px; }
.col-ubic a { color: #3498db; text-decoration: none; font-size: 0.9rem; }
.col-ubic a:hover { text-decoration: underline; }

/* Estilos dinámicos para el Select de Estado */
select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #bdc3c7;
  font-weight: bold;
  cursor: pointer;
}
.estado-pendiente { background: #fdf2e9; color: #e67e22; border-color: #f39c12; }
.estado-en_combate { background: #faded8; color: #c0392b; border-color: #e74c3c; }
.estado-controlado { background: #fcf3cf; color: #b7950b; border-color: #f1c40f; }
.estado-extinguido { background: #d5f5e3; color: #27ae60; border-color: #2ecc71; }

.btn-alerta {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  transition: transform 0.1s;
}

.btn-alerta:hover { transform: scale(1.05); background: #c0392b; }

/* --- ESTILOS DEL MODAL --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header h3 { margin: 0 0 5px 0; color: #e74c3c; }
.modal-header p { margin: 0 0 20px 0; color: #7f8c8d; font-size: 0.9rem; }

.modal-form .form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.modal-form label { font-weight: bold; margin-bottom: 5px; color: #2c3e50; }
.modal-form select, .modal-form textarea {
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.btn-cancelar {
  background: white;
  border: 1px solid #bdc3c7;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-confirmar {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
</style>