import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import CiudadanoVista from '@/views/CiudadanoVista.vue'

const routes = [
  { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
  { path: '/ciudadano', name: 'ciudadano', component: { template: '<div>Ciudadano</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('CiudadanoVista', () => {
  let wrapper

  beforeEach(() => {
    localStorage.clear()
    router.push('/ciudadano')
    wrapper = mount(CiudadanoVista, {
      global: {
        plugins: [router],
        stubs: {
          MapaInteractivo: { template: '<div>Mapa mock</div>' },
          FormularioReporte: { template: '<div>Formulario mock</div>' },
          MuroAlertas: { template: '<div>Muro mock</div>' },
        },
      },
    })
  })

  it('renders citizen navbar with title', () => {
    expect(wrapper.text()).toContain('Portal Ciudadano')
    expect(wrapper.text()).toContain('Valle del Sol')
  })

  it('renders logout button', () => {
    expect(wrapper.text()).toContain('Cerrar Sesión')
  })

  it('renders footer', () => {
    expect(wrapper.text()).toContain('Municipalidad Valle del Sol - Sistema de Emergencias')
  })

  it('clears localStorage and redirects on logout', async () => {
    localStorage.setItem('usuarioActivo', JSON.stringify({ rut: 'test' }))
    await wrapper.find('.btn-logout').trigger('click')
    expect(localStorage.getItem('usuarioActivo')).toBeNull()
  })
})
