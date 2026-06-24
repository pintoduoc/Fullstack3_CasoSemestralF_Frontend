const validarRut = (rut) => /^\d{7,8}-[\dkK]$/.test(rut)

export const estrategias = {
  login: {
    nombre: 'login',
    validar: (data) => {
      const errores = []
      if (!data.rut) errores.push('Por favor, ingrese su RUT.')
      else if (!validarRut(data.rut)) errores.push('El formato del RUT no es válido.')
      return { valido: errores.length === 0, errores }
    },
  },
  registro: {
    nombre: 'registro',
    validar: (data) => {
      const errores = []
      if (!data.rut) errores.push('El RUT es obligatorio.')
      else if (!validarRut(data.rut)) errores.push('El formato del RUT no es válido.')
      if (!data.nombreCompleto) errores.push('El nombre completo es obligatorio.')
      return { valido: errores.length === 0, errores }
    },
  },
  reporte: {
    nombre: 'reporte',
    validar: (data) => {
      const errores = []
      if (!data.descripcion) errores.push('La descripción es obligatoria.')
      if (!data.latitud || !data.longitud) errores.push('Las coordenadas son obligatorias.')
      return { valido: errores.length === 0, errores }
    },
  },
}

export function ejecutarValidacion(tipo, data) {
  const estrategia = estrategias[tipo]
  if (!estrategia) {
    return { valido: false, errores: [`Estrategia "${tipo}" no encontrada.`] }
  }
  return estrategia.validar(data)
}
