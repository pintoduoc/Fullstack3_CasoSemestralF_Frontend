import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import MuroAlertas from '@/components/MuroAlertas.vue'

vi.mock('axios')

describe('MuroAlertas', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state on mount', () => {
    wrapper = mount(MuroAlertas)
    expect(wrapper.text()).toContain('Actualizando información')
  })

  it('displays error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'))
    wrapper = mount(MuroAlertas)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.text()).toContain('No se pudieron cargar las alertas')
  })

  it('shows empty state when no alerts', async () => {
    axios.get.mockResolvedValue({ data: [] })
    wrapper = mount(MuroAlertas)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.text()).toContain('No hay alertas activas')
  })

  it('renders alert cards when data is loaded', async () => {
    const mockAlertas = [
      { id: 1, nivelRiesgo: 'CATASTROFE', mensajeAlerta: 'Incendio grave', fechaEmision: '2026-06-23T12:00:00', idReporte: 1 },
      { id: 2, nivelRiesgo: 'PREVENTIVO', mensajeAlerta: 'Precaución', fechaEmision: '2026-06-22T10:00:00', idReporte: 2 },
    ]
    axios.get.mockResolvedValue({ data: mockAlertas })
    wrapper = mount(MuroAlertas)
    await new Promise(resolve => setTimeout(resolve, 0))
    const cards = wrapper.findAll('.alerta-card')
    expect(cards.length).toBe(2)
    expect(cards[0].text()).toContain('CATASTROFE')
    expect(cards[1].text()).toContain('PREVENTIVO')
  })

  it('formateaFecha formats date correctly', () => {
    axios.get.mockResolvedValue({ data: [] })
    wrapper = mount(MuroAlertas)
    expect(typeof wrapper.vm.formatearFecha).toBe('function')
    const result = wrapper.vm.formatearFecha('2026-06-23T12:00:00')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('getClaseRiesgo returns correct CSS class', () => {
    axios.get.mockResolvedValue({ data: [] })
    wrapper = mount(MuroAlertas)
    expect(wrapper.vm.getClaseRiesgo('CATASTROFE')).toBe('riesgo-critico')
    expect(wrapper.vm.getClaseRiesgo('EVACUACION')).toBe('riesgo-alto')
    expect(wrapper.vm.getClaseRiesgo('PREVENTIVO')).toBe('riesgo-medio')
    expect(wrapper.vm.getClaseRiesgo('DESCONOCIDO')).toBe('')
  })
})
