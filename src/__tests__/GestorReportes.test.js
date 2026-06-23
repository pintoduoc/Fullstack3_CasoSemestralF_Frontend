import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import GestorReportes from '@/components/GestorReportes.vue'

vi.mock('axios')

describe('GestorReportes', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading text on mount', () => {
    wrapper = mount(GestorReportes)
    expect(wrapper.text()).toContain('Cargando reportes activos')
  })

  it('displays error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'))
    wrapper = mount(GestorReportes)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.text()).toContain('No se pudieron cargar los reportes')
  })

  it('renders table when reportes are loaded', async () => {
    const mockReportes = [
      { id: 1, descripcion: 'Incendio en cerro', latitud: -33.456, longitud: -70.648, estado: 'PENDIENTE' },
      { id: 2, descripcion: 'Fuego en bosque', latitud: -33.5, longitud: -70.7, estado: 'EN_COMBATE' },
    ]
    axios.get.mockResolvedValue({ data: mockReportes })
    wrapper = mount(GestorReportes)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.text()).toContain('Incendio en cerro')
    expect(wrapper.text()).toContain('Fuego en bosque')
  })

  it('opens modal when clicking emitir alerta button', async () => {
    const mockReportes = [
      { id: 1, descripcion: 'Incendio', latitud: -33.456, longitud: -70.648, estado: 'PENDIENTE' },
    ]
    axios.get.mockResolvedValue({ data: mockReportes })
    wrapper = mount(GestorReportes)
    await new Promise(resolve => setTimeout(resolve, 0))

    await wrapper.find('.btn-alerta').trigger('click')
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Emitir Alerta Pública')
  })

  it('closes modal when clicking cancelar', async () => {
    const mockReportes = [
      { id: 1, descripcion: 'Incendio', latitud: -33.456, longitud: -70.648, estado: 'PENDIENTE' },
    ]
    axios.get.mockResolvedValue({ data: mockReportes })
    wrapper = mount(GestorReportes)
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.find('.btn-alerta').trigger('click')
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    await wrapper.find('.btn-cancelar').trigger('click')
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('updates report status via API', async () => {
    const mockReportes = [
      { id: 1, descripcion: 'Incendio', latitud: -33.456, longitud: -70.648, estado: 'PENDIENTE' },
    ]
    axios.get.mockResolvedValue({ data: mockReportes })
    axios.put.mockResolvedValue({})
    wrapper = mount(GestorReportes)
    await new Promise(resolve => setTimeout(resolve, 0))

    const select = wrapper.find('select')
    await select.setValue('EN_COMBATE')
    await select.trigger('change')

    expect(axios.put).toHaveBeenCalledWith('/api/bff/reportes/1', expect.objectContaining({ estado: 'EN_COMBATE' }))
  })
})
