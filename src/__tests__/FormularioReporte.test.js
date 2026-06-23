import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import FormularioReporte from '@/components/FormularioReporte.vue'

describe('FormularioReporte', () => {
  let wrapper

  beforeEach(() => {
    vi.restoreAllMocks()
    wrapper = mount(FormularioReporte)
  })

  it('renders the form with all fields', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('#descripcion').exists()).toBe(true)
    expect(wrapper.find('#urlEvidencia').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows validation error when submitting empty form', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('La descripción y las coordenadas son obligatorias')
  })

  it('shows validation error when description is missing', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.alerta-error').text()).toContain('obligatorias')
  })

  it('disables submit button while loading', async () => {
    wrapper = mount(FormularioReporte, {
      data() {
        return { cargando: true }
      },
    })
    const btn = wrapper.find('button[type="submit"]')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('disables inputs while loading', async () => {
    wrapper = mount(FormularioReporte, {
      data() {
        return { cargando: true }
      },
    })
    expect(wrapper.find('#descripcion').attributes('disabled')).toBeDefined()
  })
})
