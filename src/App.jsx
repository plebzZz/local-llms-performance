import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [benchmarks, setBenchmarks] = useState([])
  const [models, setModels] = useState([])
  const [hardware, setHardware] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedHardware, setSelectedHardware] = useState('')
  const [selectedVendor, setSelectedVendor] = useState('')
  const [sortBy, setSortBy] = useState('tokensDesc')

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(setModels)
    fetch('/api/hardware')
      .then(res => res.json())
      .then(setHardware)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedModel) params.append('model', selectedModel)
    if (selectedHardware) params.append('hardware', selectedHardware)
    if (selectedVendor) params.append('vendor', selectedVendor)
    
    fetch(`/api/benchmarks?${params}`)
      .then(res => res.json())
      .then(setBenchmarks)
  }, [selectedModel, selectedHardware, selectedVendor])

  const vendors = ['Apple', 'NVIDIA']

  const getMaxTokens = () => {
    if (benchmarks.length === 0) return 0
    return Math.max(...benchmarks.map(b => b.tokensPerSecond))
  }

  const sortedBenchmarks = [...benchmarks].sort((a, b) => {
    switch (sortBy) {
      case 'tokensDesc':
        return b.tokensPerSecond - a.tokensPerSecond
      case 'tokensAsc':
        return a.tokensPerSecond - b.tokensPerSecond
      case 'modelAsc':
        return (a.model?.name || '').localeCompare(b.model?.name || '')
      case 'modelDesc':
        return (b.model?.name || '').localeCompare(a.model?.name || '')
      case 'hardwareAsc':
        return (a.hardware?.name || '').localeCompare(b.hardware?.name || '')
      case 'hardwareDesc':
        return (b.hardware?.name || '').localeCompare(a.hardware?.name || '')
      default:
        return 0
    }
  })

  return (
    <div className="app">
      <header className="header">
        <h1>Local LLM Benchmarks</h1>
        <p className="subtitle">Performance comparison of Qwen3, DeepSeek, Llama3 on Apple Silicon & NVIDIA GPUs</p>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label>Model</label>
          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
            <option value="">All Models</option>
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Hardware Vendor</label>
          <select value={selectedVendor} onChange={e => setSelectedVendor(e.target.value)}>
            <option value="">All Vendors</option>
            {vendors.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Hardware</label>
          <select value={selectedHardware} onChange={e => setSelectedHardware(e.target.value)}>
            <option value="">All Hardware</option>
            {hardware
              .filter(h => !selectedVendor || h.vendor === selectedVendor)
              .map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="tokensDesc">Performance (High to Low)</option>
            <option value="tokensAsc">Performance (Low to High)</option>
            <option value="modelAsc">Model (A-Z)</option>
            <option value="modelDesc">Model (Z-A)</option>
            <option value="hardwareAsc">Hardware (A-Z)</option>
            <option value="hardwareDesc">Hardware (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="content">
        <section className="chart-section">
          <h2>Performance Chart</h2>
          <div className="bar-chart">
            {sortedBenchmarks.map((b, i) => (
              <div key={i} className="bar-row">
                <div className="bar-label">
                  <span className="model-name">{b.model?.name}</span>
                  <span className="hardware-name">{b.hardware?.name}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className={`bar ${b.hardware?.vendor === 'Apple' ? 'apple' : 'nvidia'}`}
                    style={{ width: `${(b.tokensPerSecond / getMaxTokens()) * 100}%` }}
                  >
                    <span className="bar-value">{b.tokensPerSecond} tok/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="table-section">
          <h2>Benchmark Results</h2>
          <table className="benchmark-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Hardware</th>
                <th>Vendor</th>
                <th>Tokens/sec</th>
                <th>Context</th>
                <th>Quantization</th>
              </tr>
            </thead>
            <tbody>
              {sortedBenchmarks.map((b, i) => (
                <tr key={i}>
                  <td>
                    <span className="model-cell">{b.model?.name}</span>
                    <span className="params-cell">{b.model?.params}</span>
                  </td>
                  <td>{b.hardware?.name}</td>
                  <td>
                    <span className={`vendor-badge ${b.hardware?.vendor.toLowerCase()}`}>
                      {b.hardware?.vendor}
                    </span>
                  </td>
                  <td className="tokps-cell">{b.tokensPerSecond}</td>
                  <td>{b.contextLength}K</td>
                  <td>{b.quantization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="hardware-section">
          <h2>Hardware Specifications</h2>
          <div className="hardware-grid">
            {hardware.map(h => (
              <div key={h.id} className={`hardware-card ${h.vendor.toLowerCase()}`}>
                <h3>{h.name}</h3>
                <div className="hardware-specs">
                  <div className="spec">
                    <span className="spec-label">Vendor</span>
                    <span className="spec-value">{h.vendor}</span>
                  </div>
                  <div className="spec">
                    <span className="spec-label">Cores</span>
                    <span className="spec-value">{h.cores}</span>
                  </div>
                  <div className="spec">
                    <span className="spec-label">Memory</span>
                    <span className="spec-value">{h.memory}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="footer">
        <p>Data collected from community benchmarks • Last updated: March 2025</p>
      </footer>
    </div>
  )
}

export default App
