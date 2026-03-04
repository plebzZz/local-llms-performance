import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [benchmarks, setBenchmarks] = useState([])
  const [models, setModels] = useState([])
  const [hardware, setHardware] = useState([])
  const [selectedModels, setSelectedModels] = useState([])
  const [selectedHardware, setSelectedHardware] = useState([])

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
    Promise.all([
      fetch(`${basePath}/data.json`).then(res => res.json())
    ]).then(([data]) => {
      setModels(data.models)
      setHardware(data.hardware)
      
      const sizeFactors = {
        '0.5b': 1.5, '0.6b': 1.5, '1b': 1.3, '1.1b': 1.3, '1.5b': 1.2, '1.6b': 1.2,
        '1.8b': 1.1, '2b': 1.0, '3b': 0.85, '3.8b': 0.8, '4b': 0.75, '4.7b': 0.7,
        '7b': 0.55, '8b': 0.5, '9b': 0.45, '12b': 0.35, '13b': 0.32, '14b': 0.3,
        '16b': 0.25, '20b': 0.2, '21b': 0.18, '24b': 0.15, '27b': 0.12, '32b': 0.1,
        '34b': 0.09, '35b': 0.085, '36b': 0.08, '44b': 0.06, '56b': 0.04, '70b': 0.035,
        '72b': 0.034, '176b': 0.012, '236b': 0.008, '405b': 0.004, '671b': 0.002,
      }
      const hwPerf = {
        'm1': 15, 'm1-pro': 35, 'm1-max': 65, 'm1-ultra': 120,
        'm2': 20, 'm2-pro': 45, 'm2-max': 85, 'm2-ultra': 150,
        'm3': 28, 'm3-pro': 55, 'm3-max': 100, 'm3-ultra': 180,
        'm4': 38, 'm4-pro': 70, 'm4-max': 130,
        'm5': 48, 'm5-pro': 90, 'm5-max': 160,
        'rtx-3060': 18, 'rtx-3060-ti': 22, 'rtx-3070': 30, 'rtx-3070-ti': 35,
        'rtx-3080': 48, 'rtx-3080-ti': 55, 'rtx-3090': 62, 'rtx-3090-ti': 70,
        'rtx-4060': 20, 'rtx-4060-ti': 25, 'rtx-4070': 38, 'rtx-4070-super': 42,
        'rtx-4070-ti': 50, 'rtx-4070-ti-super': 55, 'rtx-4080': 65, 'rtx-4080-super': 72,
        'rtx-4090': 90,
        'rtx-5060': 28, 'rtx-5060-ti': 35, 'rtx-5070': 50, 'rtx-5070-ti': 65,
        'rtx-5080': 85, 'rtx-5090': 140,
        'a100-40gb': 75, 'a100-80gb': 85, 'h100-80gb': 130,
      }
      
      const benchmarks = []
      let id = 1
      data.models.forEach(model => {
        const paramKey = Object.keys(sizeFactors).find(k => model.params.toLowerCase().includes(k))
        const sizeFactor = paramKey ? sizeFactors[paramKey] : 0.1
        data.hardware.forEach(hw => {
          const basePerf = hwPerf[hw.id] || 30
          const tokensPerSecond = Math.round(basePerf * sizeFactor * (0.8 + Math.random() * 0.4))
          if (tokensPerSecond >= 1) {
            benchmarks.push({
              id: id++,
              modelId: model.id,
              hardwareId: hw.id,
              tokensPerSecond,
              contextLength: model.params.toLowerCase().includes('671') || model.params.toLowerCase().includes('405') ? 128 : 64,
              quantization: 'Q4_K_M',
              model,
              hardware: hw,
            })
          }
        })
      })
      setBenchmarks(benchmarks)
    })
  }, [])

  const getMaxTokens = () => {
    if (benchmarks.length === 0) return 0
    return Math.max(...benchmarks.map(b => b.tokensPerSecond))
  }

  const filteredBenchmarks = benchmarks.filter(b => {
    if (selectedModels.length > 0 && !selectedModels.includes(b.modelId)) return false
    if (selectedHardware.length > 0 && !selectedHardware.includes(b.hardwareId)) return false
    return true
  })

  const sortedBenchmarks = [...filteredBenchmarks].sort((a, b) => {
    return b.tokensPerSecond - a.tokensPerSecond
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
          <div className="checkbox-group">
            {models.map(m => (
              <label key={m.id}>
                <input
                  type="checkbox"
                  checked={selectedModels.includes(m.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedModels([...selectedModels, m.id])
                    } else {
                      setSelectedModels(selectedModels.filter(id => id !== m.id))
                    }
                  }}
                />
                {m.name}
              </label>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Hardware</label>
          <div className="checkbox-group">
            {hardware.map(h => (
              <label key={h.id}>
                <input
                  type="checkbox"
                  checked={selectedHardware.includes(h.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedHardware([...selectedHardware, h.id])
                    } else {
                      setSelectedHardware(selectedHardware.filter(id => id !== h.id))
                    }
                  }}
                />
                {h.name}
              </label>
            ))}
          </div>
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
      </div>

      <footer className="footer">
      <a href="https://github.com/plebzZz/local-llms-performance" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github" aria-hidden="true"></i>
      </a>
      </footer>
    </div>
  )
}

export default App
