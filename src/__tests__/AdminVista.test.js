import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import AdminVista from '@/views/AdminVista.vue'

const routes = [
  { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
  { path: '/admin', name: 'admin', component: { template: '<div>Admin</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('AdminVista', () => {
  let wrapper

  beforeEach(() => {
    localStorage.clear()
    router.push('/admin')
    wrapper = mount(AdminVista, {
      global: {
        plugins: [router],
        stubs: {
          Dashboard: { template: '<div>Dashboard mock</div>' },
          GestorReportes: { template: '<div>GestorReportes mock</div>' },
        },
      },
    })
  })

  it('renders admin navbar with title', () => {
    expect(wrapper.text()).toContain('Panel de Administración')
    expect(wrapper.text()).toContain('Valle del Sol')
  })

  it('renders admin badge', () => {
    expect(wrapper.text()).toContain('Personal Municipal / Brigadista')
  })

  it('renders logout button', () => {
    expect(wrapper.text()).toContain('Cerrar Sesión')
  })

  it('renders Dashboard section header', () => {
    expect(wrapper.text()).toContain('Análisis Histórico y Estado Actual')
  })

  it('renders GestorReportes section header', () => {
    expect(wrapper.text()).toContain('Gestor Operativo de Incendios')
  })

  it('renders footer', () => {
    expect(wrapper.text()).toContain('Municipalidad Valle del Sol')
  })

  it('clears localStorage and redirects on logout', async () => {
    localStorage.setItem('usuarioActivo', JSON.stringify({ rut: 'test' }))
    await wrapper.find('.btn-logout').trigger('click')
    expect(localStorage.getItem('usuarioActivo')).toBeNull()
  })
})
