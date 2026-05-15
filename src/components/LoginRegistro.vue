<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Instancia del router para hacer las redirecciones
const router = useRouter();

// Estados de la interfaz
const esLogin = ref(true); // true = Mostrar Login, false = Mostrar Registro
const cargando = ref(false);
const mensajeError = ref('');

// Datos del formulario
const formulario = ref({
  rut: '',
  nombreCompleto: '',
  contacto: ''
});

// Función para alternar entre Login y Registro
const toggleModo = () => {
  esLogin.value = !esLogin.value;
  mensajeError.value = '';
  formulario.value = { rut: '', nombreCompleto: '', contacto: '' };
};

// Función principal de Inicio de Sesión
const iniciarSesion = async () => {
  if (!formulario.value.rut) {
    mensajeError.value = 'Por favor, ingrese su RUT.';
    return;
  }

  try {
    cargando.value = true;
    mensajeError.value = '';

    // Asumiendo que tu endpoint de búsqueda en UsuarioController es /api/usuario/rut/{rut}
    const respuesta = await axios.get(`/api/bff/login/${rut.value}`);
    const usuario = respuesta.data;

    if (!usuario) {
      mensajeError.value = 'Usuario no encontrado. Verifique su RUT o regístrese.';
      return;
    }

    // Aquí iría la lógica para guardar el usuario en Pinia (estado global),
    // pero por ahora lo guardaremos en localStorage para simular la sesión.
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

    // Redirección basada en el Rol
    if (usuario.rol === 'ADMINISTRADOR' || usuario.rol === 'BRIGADISTA') {
      router.push('/admin'); // Redirige a AdminView
    } else {
      router.push('/ciudadano'); // Redirige a CitizenView
    }

  } catch (error) {
    console.error(error);
    // Si el backend devuelve un 404 cuando no encuentra el usuario
    if (error.response && error.response.status === 404) {
      mensajeError.value = 'Usuario no encontrado. Por favor, regístrese.';
    } else {
      mensajeError.value = 'Error al conectar con el servidor.';
    }
  } finally {
    cargando.value = false;
  }
};

// Función principal de Registro
const registrarUsuario = async () => {
  if (!formulario.value.rut || !formulario.value.nombreCompleto) {
    mensajeError.value = 'El RUT y el Nombre son obligatorios.';
    return;
  }

  try {
    cargando.value = true;
    mensajeError.value = '';

    const nuevoUsuario = {
      rut: formulario.value.rut,
      nombreCompleto: formulario.value.nombreCompleto,
      contacto: formulario.value.contacto,
      rol: 'CIUDADANO' // Todo usuario nuevo desde el portal público es ciudadano
    };

    // Llamada POST al API Gateway para crear el usuario
    const respuesta = await axios.post('/api/usuario', nuevoUsuario);
    
    // Guardamos la sesión y redirigimos directamente a la vista de ciudadano
    localStorage.setItem('usuarioActivo', JSON.stringify(respuesta.data));
    router.push('/ciudadano');

  } catch (error) {
    console.error(error);
    mensajeError.value = 'Error al registrar el usuario. Es posible que el RUT ya exista.';
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>{{ esLogin ? 'Iniciar Sesión' : 'Registro Ciudadano' }}</h2>
        <p>Plataforma de Emergencias Valle del Sol</p>
      </div>

      <form @submit.prevent="esLogin ? iniciarSesion() : registrarUsuario()" class="auth-form">
        
        <div class="form-group">
          <label for="rut">RUT</label>
          <input 
            id="rut" 
            v-model="formulario.rut" 
            type="text" 
            placeholder="Ej: 12345678-9" 
            :disabled="cargando"
          />
        </div>

        <template v-if="!esLogin">
          <div class="form-group">
            <label for="nombre">Nombre Completo</label>
            <input 
              id="nombre" 
              v-model="formulario.nombreCompleto" 
              type="text" 
              placeholder="Juan Pérez" 
              :disabled="cargando"
            />
          </div>
          
          <div class="form-group">
            <label for="contacto">Correo o Teléfono (Opcional)</label>
            <input 
              id="contacto" 
              v-model="formulario.contacto" 
              type="text" 
              placeholder="juan@correo.cl" 
              :disabled="cargando"
            />
          </div>
        </template>

        <div v-if="mensajeError" class="error-msg">
          {{ mensajeError }}
        </div>

        <button type="submit" class="btn-submit" :disabled="cargando">
          {{ cargando ? 'Procesando...' : (esLogin ? 'Ingresar' : 'Registrarme') }}
        </button>
      </form>

      <div class="auth-footer">
        <p v-if="esLogin">
          ¿No tienes cuenta? 
          <a href="#" @click.prevent="toggleModo">Regístrate como ciudadano</a>
        </p>
        <p v-else>
          ¿Ya estás registrado? 
          <a href="#" @click.prevent="toggleModo">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.auth-card {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  padding: 30px;
  border-top: 6px solid #e74c3c; /* Color temático de emergencias */
}

.auth-header {
  text-align: center;
  margin-bottom: 25px;
}

.auth-header h2 {
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.auth-header p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #34495e;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #e74c3c;
}

.form-group input:disabled {
  background-color: #ecf0f1;
  cursor: not-allowed;
}

.btn-submit {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  background-color: #c0392b;
}

.btn-submit:disabled {
  background-color: #e08277;
  cursor: not-allowed;
}

.error-msg {
  background-color: #fadbd8;
  color: #c0392b;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  text-align: center;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.auth-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>