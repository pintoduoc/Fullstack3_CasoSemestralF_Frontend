import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
  ],
})

describe('Home', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: {
          LoginRegistro: { template: '<div class="login-stub">Login</div>' },
          MuroAlertas: { template: '<div class="muro-stub">Alertas</div>' },
        },
      },
    })
  })

  it('renders LoginRegistro section', () => {
    expect(wrapper.find('.login-stub').exists()).toBe(true)
  })

  it('renders MuroAlertas section', () => {
    expect(wrapper.find('.muro-stub').exists()).toBe(true)
  })

  it('has a separator between sections', () => {
    const hr = wrapper.find('.separator')
    expect(hr.exists()).toBe(true)
  })
})
