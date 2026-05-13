<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Estado del formulario mapeado a tu entidad ReporteIncendio
const formulario = ref({
  descripcion: '',
  urlEvidencia: '',
  latitud: null,
  longitud: null,
  estado: 'PENDIENTE' // Todo reporte nuevo entra como PENDIENTE por defecto
});

// Estados de la interfaz
const cargando = ref(false);
const obteniendoUbicacion = ref(false);
const mensajeExito = ref('');
const mensajeError = ref('');

// Función para obtener las coordenadas del dispositivo
const obtenerMiUbicacion = () => {
  if (!navigator.geolocation) {
    mensajeError.value = "Tu navegador no soporta la geolocalización.";
    return;
  }

  obteniendoUbicacion.value = true;
  mensajeError.value = '';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      formulario.value.latitud = position.coords.latitude;
      formulario.value.longitud = position.coords.longitude;
      obteniendoUbicacion.value = false;
    },
    (error) => {
      console.error("Error obteniendo ubicación:", error);
      mensajeError.value = "No se pudo obtener la ubicación. Por favor, ingresa las coordenadas manualmente o da permisos al navegador.";
      obteniendoUbicacion.value = false;
    }
  );
};

// Función para enviar los datos al API Gateway
const enviarReporte = async () => {
  // Validación básica
  if (!formulario.value.descripcion || !formulario.value.latitud || !formulario.value.longitud) {
    mensajeError.value = "La descripción y las coordenadas son obligatorias.";
    return;
  }

  try {
    cargando.value = true;
    mensajeError.value = '';
    mensajeExito.value = '';

    // Enviamos el POST al puerto 8080 del Gateway, que enrutará al 8081 (report-service)
    await axios.post('http://localhost:8080/api/bff/reportes', formulario.value);

    // Si tiene éxito, mostramos mensaje y limpiamos el formulario
    mensajeExito.value = "¡Emergencia reportada exitosamente! Los equipos de emergencia han sido notificados.";
    formulario.value = {
      descripcion: '',
      urlEvidencia: '',
      latitud: null,
      longitud: null,
      estado: 'PENDIENTE'
    };

    // Ocultar el mensaje de éxito después de 5 segundos
    setTimeout(() => {
      mensajeExito.value = '';
    }, 5000);

  } catch (error) {
    console.error("Error al enviar el reporte:", error);
    mensajeError.value = "Hubo un problema al enviar el reporte. Verifica tu conexión.";
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="formulario-wrapper">
    <div class="formulario-card">
      <header class="formulario-header">
        <h2>Reportar Emergencia</h2>
        <p>Proporciona los detalles para desplegar a nuestras brigadas.</p>
      </header>

      <form @submit.prevent="enviarReporte" class="form-emergencia">
        
        <div class="form-group">
          <label for="descripcion">Descripción de la situación <span class="req">*</span></label>
          <textarea 
            id="descripcion" 
            v-model="formulario.descripcion" 
            rows="3" 
            placeholder="Ej: Fuego visible en pastizales cerca de la ruta principal..."
            :disabled="cargando"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="urlEvidencia">Enlace a Fotografía o Video (Opcional)</label>
          <input 
            id="urlEvidencia" 
            v-model="formulario.urlEvidencia" 
            type="url" 
            placeholder="http://mis-fotos.cl/incendio.jpg" 
            :disabled="cargando"
          />
        </div>

        <div class="coordenadas-section">
          <div class="form-group">
            <label>Ubicación <span class="req">*</span></label>
            <div class="coordenadas-inputs">
              <input 
                v-model="formulario.latitud" 
                type="number" 
                step="any" 
                placeholder="Latitud" 
                :disabled="cargando"
              />
              <input 
                v-model="formulario.longitud" 
                type="number" 
                step="any" 
                placeholder="Longitud" 
                :disabled="cargando"
              />
            </div>
          </div>
          <button 
            type="button" 
            class="btn-geo" 
            @click="obtenerMiUbicacion" 
            :disabled="obteniendoUbicacion || cargando"
          >
            📍 {{ obteniendoUbicacion ? 'Ubicando...' : 'Usar mi ubicación actual' }}
          </button>
        </div>

        <div v-if="mensajeError" class="alerta alerta-error">{{ mensajeError }}</div>
        <div v-if="mensajeExito" class="alerta alerta-exito">{{ mensajeExito }}</div>

        <button type="submit" class="btn-submit" :disabled="cargando">
          🚨 {{ cargando ? 'Enviando reporte...' : 'Enviar Reporte de Emergencia' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.formulario-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.formulario-card {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 30px;
  border-top: 6px solid #e67e22; /* Color naranja de alerta */
}

.formulario-header {
  text-align: center;
  margin-bottom: 25px;
}

.formulario-header h2 {
  color: #d35400;
  margin: 0 0 8px 0;
}

.formulario-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.95rem;
}

.form-emergencia {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.req {
  color: #e74c3c;
}

input, textarea {
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #e67e22;
}

.coordenadas-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ecf0f1;
}

.coordenadas-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.coordenadas-inputs input {
  flex: 1;
}

.btn-geo {
  width: 100%;
  background: #34495e;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-geo:hover:not(:disabled) {
  background: #2c3e50;
}

.btn-submit {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alerta {
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  font-size: 0.95rem;
}

.alerta-error {
  background: #fadbd8;
  color: #c0392b;
  border: 1px solid #f5b7b1;
}

.alerta-exito {
  background: #d4efdf;
  color: #27ae60;
  border: 1px solid #a9dfbf;
}
</style>