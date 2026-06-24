import axios from 'axios'

export const reporteService = {
  listar: () => axios.get('/api/bff/reportes').then(r => r.data),
  obtener: (id) => axios.get(`/api/bff/reportes/${id}`).then(r => r.data),
  crear: (reporte) => axios.post('/api/bff/reportes', reporte).then(r => r.data),
  actualizar: (id, reporte) => axios.put(`/api/bff/reportes/${id}`, reporte).then(r => r.data),
  estadisticas: () => axios.get('/api/bff/dashboard/estadisticas').then(r => r.data),
}

export const alertaService = {
  listar: () => axios.get('/api/bff/alertas').then(r => r.data),
  crear: (alerta) => axios.post('/api/bff/alertas', alerta).then(r => r.data),
}

export const usuarioService = {
  login: (rut) => axios.get(`/api/bff/login/${rut}`).then(r => r.data),
  registrar: (usuario) => axios.post('/api/usuario', usuario).then(r => r.data),
}
