<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import L from 'leaflet';
// Es crucial importar el CSS de Leaflet para que el mapa no se vea desarmado
import 'leaflet/dist/leaflet.css';

// Referencia al contenedor HTML del mapa
const mapContainer = ref(null);
const reportes = ref([]);
const cargando = ref(true);
const error = ref(null);

// Función para asignar colores según la gravedad del estado
const getColorPorEstado = (estado) => {
  switch (estado) {
    case 'EN_COMBATE': return '#e74c3c'; // Rojo
    case 'PENDIENTE': return '#f39c12';  // Naranja
    case 'CONTROLADO': return '#f1c40f'; // Amarillo
    case 'EXTINGUIDO': return '#2ecc71'; // Verde
    default: return '#3498db';           // Azul por defecto
  }
};

const inicializarMapa = async () => {
  try {
    // 1. Crear la instancia del mapa centrado en Santiago
    // Coordenadas: Latitud -33.456, Longitud -70.648, Nivel de Zoom 10
    const mapa = L.map(mapContainer.value).setView([-33.456, -70.648], 10);

    // 2. Cargar las "baldosas" (imágenes) del mapa desde OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    // 3. Consumir el API Gateway para obtener los reportes
    const respuesta = await axios.get('/api/bff/reportes');
    reportes.value = respuesta.data;

    // 4. Dibujar los puntos en el mapa
    reportes.value.forEach(reporte => {
      // Verificamos que el reporte tenga coordenadas válidas
      if (reporte.latitud && reporte.longitud) {
        
        // Usamos CircleMarker porque son más fáciles de colorear dinámicamente
        // y no sufren problemas de carga de imágenes en Vite
        const marcador = L.circleMarker([reporte.latitud, reporte.longitud], {
          radius: 10,
          fillColor: getColorPorEstado(reporte.estado),
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(mapa);

        // 5. Crear el popup (globo de información) al hacer clic en el punto
        const contenidoPopup = `
          <div style="font-family: sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #2c3e50;">Reporte #${reporte.id}</h3>
            <p style="margin: 0 0 5px 0;">
              <strong>Estado:</strong> 
              <span style="color: ${getColorPorEstado(reporte.estado)}; font-weight: bold;">
                ${reporte.estado}
              </span>
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #555;">${reporte.descripcion}</p>
          </div>
        `;
        
        marcador.bindPopup(contenidoPopup);
      }
    });

  } catch (err) {
    console.error("Error al cargar el mapa o los datos:", err);
    error.value = "No se pudieron cargar los datos geográficos.";
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  // El mapa debe inicializarse solo después de que el HTML esté montado
  inicializarMapa();
});
</script>

<template>
  <div class="mapa-wrapper">
    <header class="mapa-header">
      <h2>Monitoreo Geográfico</h2>
      <p>Visualización de focos reportados en tiempo real</p>
    </header>

    <div class="leyenda">
      <div class="leyenda-item"><span class="punto" style="background: #e74c3c;"></span> En Combate</div>
      <div class="leyenda-item"><span class="punto" style="background: #f39c12;"></span> Pendiente</div>
      <div class="leyenda-item"><span class="punto" style="background: #f1c40f;"></span> Controlado</div>
      <div class="leyenda-item"><span class="punto" style="background: #2ecc71;"></span> Extinguido</div>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>

    <div class="mapa-visual" :class="{ 'cargando': cargando }">
      <div v-if="cargando" class="overlay-carga">
        <p>Cargando mapa y coordenadas...</p>
      </div>
      <div ref="mapContainer" class="contenedor-leaflet"></div>
    </div>
  </div>
</template>

<style scoped>
.mapa-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.mapa-header {
  margin-bottom: 20px;
}

.mapa-header h2 {
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.mapa-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.95rem;
}

.leyenda {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #34495e;
  font-weight: 600;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.punto {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid rgba(0,0,0,0.2);
}

.mapa-visual {
  position: relative;
  height: 500px; /* Altura fija importante para Leaflet */
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #bdc3c7;
}

.contenedor-leaflet {
  height: 100%;
  width: 100%;
  z-index: 1; /* Leaflet usa z-index internos, lo mantenemos bajo control */
}

.overlay-carga {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  font-weight: bold;
  color: #2c3e50;
}

.error-msg {
  color: #c0392b;
  background: #fadbd8;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
}
</style>