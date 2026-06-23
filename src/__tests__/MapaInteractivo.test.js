import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import MapaInteractivo from '@/components/MapaInteractivo.vue'

vi.mock('axios')

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({ setView: vi.fn() })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    circleMarker: vi.fn(() => ({ addTo: vi.fn(() => ({ bindPopup: vi.fn() })) })),
  }
}))

describe('MapaInteractivo', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading text on mount', () => {
    wrapper = mount(MapaInteractivo)
    expect(wrapper.text()).toContain('Cargando mapa y coordenadas')
  })

  it('displays error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'))
    wrapper = mount(MapaInteractivo)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.text()).toContain('No se pudieron cargar los datos geográficos')
  })

  it('renders leyenda items', async () => {
    axios.get.mockResolvedValue({ data: [] })
    wrapper = mount(MapaInteractivo)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.text()).toContain('En Combate')
    expect(wrapper.text()).toContain('Pendiente')
    expect(wrapper.text()).toContain('Controlado')
    expect(wrapper.text()).toContain('Extinguido')
  })

  it('getColorPorEstado returns correct colors', () => {
    axios.get.mockResolvedValue({ data: [] })
    wrapper = mount(MapaInteractivo)
    const vm = wrapper.vm
    expect(vm.getColorPorEstado('EN_COMBATE')).toBe('#e74c3c')
    expect(vm.getColorPorEstado('PENDIENTE')).toBe('#f39c12')
    expect(vm.getColorPorEstado('CONTROLADO')).toBe('#f1c40f')
    expect(vm.getColorPorEstado('EXTINGUIDO')).toBe('#2ecc71')
    expect(vm.getColorPorEstado('DESCONOCIDO')).toBe('#3498db')
  })
})
