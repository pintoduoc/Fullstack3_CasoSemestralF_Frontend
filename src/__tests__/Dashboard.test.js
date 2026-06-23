import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import Dashboard from '@/components/Dashboard.vue'

vi.mock('axios')

describe('Dashboard', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading text on mount', () => {
    wrapper = mount(Dashboard)
    expect(wrapper.text()).toContain('Procesando datos hist')
  })

  it('displays error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'))
    wrapper = mount(Dashboard)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.text()).toContain('No se pudo conectar con el servidor de estad')
  })

  it('renders KPI cards when data is loaded', async () => {
    const mockStats = {
      total: 25,
      pendientes: 10,
      enCombate: 5,
      controlados: 7,
      extinguidos: 3,
    }
    axios.get.mockResolvedValue({ data: mockStats })
    wrapper = mount(Dashboard)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Total Histórico')
    expect(wrapper.text()).toContain('Focos Activos')
    expect(wrapper.text()).toContain('Por Verificar')
    expect(wrapper.text()).toContain('25')
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('10')
  })

  it('renders chart section when data is loaded', async () => {
    const mockStats = { total: 0, pendientes: 0, enCombate: 0, controlados: 0, extinguidos: 0 }
    axios.get.mockResolvedValue({ data: mockStats })
    wrapper = mount(Dashboard)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.text()).toContain('Distribución de Estados')
  })
})
