import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import LoginRegistro from '@/components/LoginRegistro.vue'
import { nextTick } from 'vue'

const routes = [
  { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
  { path: '/ciudadano', name: 'ciudadano', component: { template: '<div>Ciudadano</div>' } },
  { path: '/admin', name: 'admin', component: { template: '<div>Admin</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('LoginRegistro', () => {
  let wrapper

  beforeEach(() => {
    localStorage.clear()
    wrapper = mount(LoginRegistro, {
      global: { plugins: [router] },
    })
  })

  it('renders login mode by default', () => {
    expect(wrapper.find('h2').text()).toContain('Iniciar Sesión')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Ingresar')
  })

  it('toggles to register mode', async () => {
    await wrapper.find('a').trigger('click')
    expect(wrapper.find('h2').text()).toContain('Registro Ciudadano')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Registrarme')
  })

  it('shows error when submitting empty RUT in login mode', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.error-msg').text()).toContain('ingrese su RUT')
  })

  it('toggles back and forth between modes', async () => {
    await wrapper.find('a').trigger('click')
    expect(wrapper.find('h2').text()).toContain('Registro Ciudadano')
    await wrapper.find('a').trigger('click')
    expect(wrapper.find('h2').text()).toContain('Iniciar Sesión')
  })

  it('clears error message when toggling mode', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.error-msg').exists()).toBe(true)
    await wrapper.find('a').trigger('click')
    expect(wrapper.find('.error-msg').exists()).toBe(false)
  })

  it('disables submit button while loading', async () => {
    wrapper = mount(LoginRegistro, {
      global: { plugins: [router] },
      data() {
        return { cargando: true }
      },
    })
    const btn = wrapper.find('button[type="submit"]')
    expect(btn.attributes('disabled')).toBeDefined()
  })
})
