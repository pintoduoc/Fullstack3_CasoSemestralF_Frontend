import { createRouter, createWebHistory } from 'vue-router'
// Importamos las vistas principales
import Home from '@/views/Home.vue'
import CiudadanoVista from '@/views/CiudadanoVista.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/ciudadano',
      name: 'ciudadano',
      component: CiudadanoVista
    },
    {
      // Ruta temporal para administración (la completaremos después)
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminVista.vue') 
    }
  ]
})

// Guardia de navegación simple (Opcional)
// Esto evita que alguien entre a /ciudadano sin haberse "logueado" (RUT en localStorage)
router.beforeEach((to, from, next) => {
  const usuario = localStorage.getItem('usuarioActivo');
  
  if (to.path === '/ciudadano' && !usuario) {
    next('/');
  } else {
    next();
  }
});

export default router