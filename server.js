const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const models = [
  { id: 'llama3-8b', name: 'Llama 3 8B', params: '8B', family: 'Llama' },
  { id: 'llama3-70b', name: 'Llama 3 70B', params: '70B', family: 'Llama' },
  { id: 'llama3.1-8b', name: 'Llama 3.1 8B', params: '8B', family: 'Llama' },
  { id: 'llama3.1-70b', name: 'Llama 3.1 70B', params: '70B', family: 'Llama' },
  { id: 'llama3.1-405b', name: 'Llama 3.1 405B', params: '405B', family: 'Llama' },
  { id: 'llama3.2-1b', name: 'Llama 3.2 1B', params: '1B', family: 'Llama' },
  { id: 'llama3.2-3b', name: 'Llama 3.2 3B', params: '3B', family: 'Llama' },
  { id: 'llama3.3-70b', name: 'Llama 3.3 70B', params: '70B', family: 'Llama' },
  { id: 'qwen2-0.5b', name: 'Qwen2 0.5B', params: '0.5B', family: 'Qwen' },
  { id: 'qwen2-1.5b', name: 'Qwen2 1.5B', params: '1.5B', family: 'Qwen' },
  { id: 'qwen2-7b', name: 'Qwen2 7B', params: '7B', family: 'Qwen' },
  { id: 'qwen2-72b', name: 'Qwen2 72B', params: '72B', family: 'Qwen' },
  { id: 'qwen2.5-0.5b', name: 'Qwen2.5 0.5B', params: '0.5B', family: 'Qwen' },
  { id: 'qwen2.5-1.5b', name: 'Qwen2.5 1.5B', params: '1.5B', family: 'Qwen' },
  { id: 'qwen2.5-3b', name: 'Qwen2.5 3B', params: '3B', family: 'Qwen' },
  { id: 'qwen2.5-7b', name: 'Qwen2.5 7B', params: '7B', family: 'Qwen' },
  { id: 'qwen2.5-14b', name: 'Qwen2.5 14B', params: '14B', family: 'Qwen' },
  { id: 'qwen2.5-32b', name: 'Qwen2.5 32B', params: '32B', family: 'Qwen' },
  { id: 'qwen2.5-72b', name: 'Qwen2.5 72B', params: '72B', family: 'Qwen' },
  { id: 'qwen3-0.6b', name: 'Qwen3 0.6B', params: '0.6B', family: 'Qwen' },
  { id: 'qwen3-1.8b', name: 'Qwen3 1.8B', params: '1.8B', family: 'Qwen' },
  { id: 'qwen3-4.7b', name: 'Qwen3 4.7B', params: '4.7B', family: 'Qwen' },
  { id: 'qwen3-8b', name: 'Qwen3 8B', params: '8B', family: 'Qwen' },
  { id: 'qwen3-14b', name: 'Qwen3 14B', params: '14B', family: 'Qwen' },
  { id: 'qwen3-32b', name: 'Qwen3 32B', params: '32B', family: 'Qwen' },
  { id: 'qwen3-235b', name: 'Qwen3 235B (MoE)', params: '235B', family: 'Qwen' },
  { id: 'qwen3.5-0.6b', name: 'Qwen3.5 0.6B', params: '0.6B', family: 'Qwen' },
  { id: 'qwen3.5-1.8b', name: 'Qwen3.5 1.8B', params: '1.8B', family: 'Qwen' },
  { id: 'qwen3.5-3b', name: 'Qwen3.5 3B', params: '3B', family: 'Qwen' },
  { id: 'qwen3.5-4.7b', name: 'Qwen3.5 4.7B', params: '4.7B', family: 'Qwen' },
  { id: 'qwen3.5-8b', name: 'Qwen3.5 8B', params: '8B', family: 'Qwen' },
  { id: 'qwen3.5-14b', name: 'Qwen3.5 14B', params: '14B', family: 'Qwen' },
  { id: 'qwen3.5-32b', name: 'Qwen3.5 32B', params: '32B', family: 'Qwen' },
  { id: 'qwen3.5-72b', name: 'Qwen3.5 72B', params: '72B', family: 'Qwen' },
  { id: 'qwen3.5-coder-1.5b', name: 'Qwen3.5-Coder 1.5B', params: '1.5B', family: 'Qwen' },
  { id: 'qwen3.5-coder-7b', name: 'Qwen3.5-Coder 7B', params: '7B', family: 'Qwen' },
  { id: 'qwen3.5-coder-14b', name: 'Qwen3.5-Coder 14B', params: '14B', family: 'Qwen' },
  { id: 'qwen3.5-coder-32b', name: 'Qwen3.5-Coder 32B', params: '32B', family: 'Qwen' },
  { id: 'qwen3-coder-next-14b', name: 'Qwen3-Coder-Next 14B', params: '14B', family: 'Qwen' },
  { id: 'qwen3-coder-next-32b', name: 'Qwen3-Coder-Next 32B', params: '32B', family: 'Qwen' },
  { id: 'deepseek-r1-1.5b', name: 'DeepSeek-R1 1.5B', params: '1.5B', family: 'DeepSeek' },
  { id: 'deepseek-r1-7b', name: 'DeepSeek-R1 7B', params: '7B', family: 'DeepSeek' },
  { id: 'deepseek-r1-14b', name: 'DeepSeek-R1 14B', params: '14B', family: 'DeepSeek' },
  { id: 'deepseek-r1-32b', name: 'DeepSeek-R1 32B', params: '32B', family: 'DeepSeek' },
  { id: 'deepseek-r1-70b', name: 'DeepSeek-R1 70B', params: '70B', family: 'DeepSeek' },
  { id: 'deepseek-r1-671b', name: 'DeepSeek-R1 671B (MoE)', params: '671B', family: 'DeepSeek' },
  { id: 'deepseek-coder-v2-16b', name: 'DeepSeek Coder V2 16B', params: '16B', family: 'DeepSeek' },
  { id: 'deepseek-coder-v2-236b', name: 'DeepSeek Coder V2 236B', params: '236B', family: 'DeepSeek' },
  { id: 'mistral-7b', name: 'Mistral 7B', params: '7B', family: 'Mistral' },
  { id: 'mistral-small-24b', name: 'Mistral Small 24B', params: '24B', family: 'Mistral' },
  { id: 'mistral-large-24b', name: 'Mistral Large 24B', params: '24B', family: 'Mistral' },
  { id: 'mixtral-8x7b', name: 'Mixtral 8x7B (MoE)', params: '56B', family: 'Mistral' },
  { id: 'mixtral-8x22b', name: 'Mixtral 8x22B (MoE)', params: '176B', family: 'Mistral' },
  { id: 'gemma-2b', name: 'Gemma 2B', params: '2B', family: 'Gemma' },
  { id: 'gemma-7b', name: 'Gemma 7B', params: '7B', family: 'Gemma' },
  { id: 'gemma2-9b', name: 'Gemma 2 9B', params: '9B', family: 'Gemma' },
  { id: 'gemma2-27b', name: 'Gemma 2 27B', params: '27B', family: 'Gemma' },
  { id: 'gemma3-1b', name: 'Gemma 3 1B', params: '1B', family: 'Gemma' },
  { id: 'gemma3-4b', name: 'Gemma 3 4B', params: '4B', family: 'Gemma' },
  { id: 'gemma3-12b', name: 'Gemma 3 12B', params: '12B', family: 'Gemma' },
  { id: 'gemma3-27b', name: 'Gemma 3 27B', params: '27B', family: 'Gemma' },
  { id: 'gemma3n-4b', name: 'Gemma 3n 4B', params: '4B', family: 'Gemma' },
  { id: 'phi-3-mini-4b', name: 'Phi-3 Mini 4B', params: '4B', family: 'Phi' },
  { id: 'phi-3-medium-14b', name: 'Phi-3 Medium 14B', params: '14B', family: 'Phi' },
  { id: 'phi-4-mini-4b', name: 'Phi-4 Mini 4B', params: '4B', family: 'Phi' },
  { id: 'phi-4-14b', name: 'Phi-4 14B', params: '14B', family: 'Phi' },
  { id: 'granite3.1-1b', name: 'Granite 3.1 1B', params: '1B', family: 'Granite' },
  { id: 'granite3.1-3b', name: 'Granite 3.1 3B', params: '3B', family: 'Granite' },
  { id: 'granite3.1-8b', name: 'Granite 3.1 8B', params: '8B', family: 'Granite' },
  { id: 'granite3.1-20b', name: 'Granite 3.1 20B', params: '20B', family: 'Granite' },
  { id: 'olmo2-7b', name: 'OLMo 2 7B', params: '7B', family: 'OLMo' },
  { id: 'olmo2-13b', name: 'OLMo 2 13B', params: '13B', family: 'OLMo' },
  { id: 'tinyllama-1b', name: 'TinyLlama 1B', params: '1B', family: 'TinyLlama' },
  { id: 'codellama-7b', name: 'CodeLlama 7B', params: '7B', family: 'Llama' },
  { id: 'codellama-13b', name: 'CodeLlama 13B', params: '13B', family: 'Llama' },
  { id: 'codellama-34b', name: 'CodeLlama 34B', params: '34B', family: 'Llama' },
  { id: 'llava-7b', name: 'LLaVA 7B', params: '7B', family: 'LLaVA' },
  { id: 'llava-13b', name: 'LLaVA 13B', params: '13B', family: 'LLaVA' },
  { id: 'llava1.6-7b', name: 'LLaVA 1.6 7B', params: '7B', family: 'LLaVA' },
  { id: 'llava1.6-34b', name: 'LLaVA 1.6 34B', params: '34B', family: 'LLaVA' },
  { id: 'pixtral-12b', name: 'Pixtral 12B', params: '12B', family: 'Mistral' },
  { id: 'command-r-35b', name: 'Command R 35B', params: '35B', family: 'Command-R' },
  { id: 'command-r7b-12b', name: 'Command R7B 12B', params: '12B', family: 'Command-R' },
  { id: 'aya-23b', name: 'Aya 23 35B', params: '35B', family: 'Aya' },
  { id: 'snowflake-arctic-embed-m', name: 'Snowflake Arctic Embed M', params: '0.3B', family: 'Snowflake' },
  { id: 'nomic-embed-text', name: 'Nomic Embed Text', params: '0.1B', family: 'Nomic' },
];

const hardware = [
  { id: 'm1', name: 'MacBook Air M1', vendor: 'Apple', cores: '8 CPU + 7 GPU', memory: '16GB', year: 2020 },
  { id: 'm1-pro', name: 'MacBook Pro M1 Pro', vendor: 'Apple', cores: '8 CPU + 14 GPU', memory: '32GB', year: 2021 },
  { id: 'm1-max', name: 'MacBook Pro M1 Max', vendor: 'Apple', cores: '10 CPU + 32 GPU', memory: '64GB', year: 2021 },
  { id: 'm1-ultra', name: 'Mac Studio M1 Ultra', vendor: 'Apple', cores: '20 CPU + 64 GPU', memory: '128GB', year: 2022 },
  { id: 'm2', name: 'MacBook Air M2', vendor: 'Apple', cores: '8 CPU + 10 GPU', memory: '24GB', year: 2022 },
  { id: 'm2-pro', name: 'MacBook Pro M2 Pro', vendor: 'Apple', cores: '10 CPU + 16 GPU', memory: '32GB', year: 2023 },
  { id: 'm2-max', name: 'MacBook Pro M2 Max', vendor: 'Apple', cores: '12 CPU + 38 GPU', memory: '96GB', year: 2023 },
  { id: 'm2-ultra', name: 'Mac Studio M2 Ultra', vendor: 'Apple', cores: '24 CPU + 76 GPU', memory: '192GB', year: 2023 },
  { id: 'm3', name: 'MacBook Air M3', vendor: 'Apple', cores: '8 CPU + 10 GPU', memory: '24GB', year: 2024 },
  { id: 'm3-pro', name: 'MacBook Pro M3 Pro', vendor: 'Apple', cores: '11 CPU + 18 GPU', memory: '36GB', year: 2024 },
  { id: 'm3-max', name: 'MacBook Pro M3 Max', vendor: 'Apple', cores: '16 CPU + 40 GPU', memory: '128GB', year: 2024 },
  { id: 'm3-ultra', name: 'Mac Studio M3 Ultra', vendor: 'Apple', cores: '32 CPU + 80 GPU', memory: '192GB', year: 2024 },
  { id: 'm4', name: 'MacBook Air M4', vendor: 'Apple', cores: '10 CPU + 10 GPU', memory: '24GB', year: 2025 },
  { id: 'm4-pro', name: 'MacBook Pro M4 Pro', vendor: 'Apple', cores: '12 CPU + 16 GPU', memory: '48GB', year: 2025 },
  { id: 'm4-max', name: 'MacBook Pro M4 Max', vendor: 'Apple', cores: '16 CPU + 40 GPU', memory: '128GB', year: 2025 },
  { id: 'm5', name: 'MacBook Air M5', vendor: 'Apple', cores: '10 CPU + 10 GPU', memory: '24GB', year: 2026 },
  { id: 'm5-pro', name: 'MacBook Pro M5 Pro', vendor: 'Apple', cores: '15 CPU + 20 GPU', memory: '48GB', year: 2026 },
  { id: 'm5-max', name: 'MacBook Pro M5 Max', vendor: 'Apple', cores: '18 CPU + 40 GPU', memory: '128GB', year: 2026 },
  { id: 'rtx-3060', name: 'RTX 3060', vendor: 'NVIDIA', cores: '3584 CUDA', memory: '12GB', year: 2021 },
  { id: 'rtx-3060-ti', name: 'RTX 3060 Ti', vendor: 'NVIDIA', cores: '4864 CUDA', memory: '8GB', year: 2020 },
  { id: 'rtx-3070', name: 'RTX 3070', vendor: 'NVIDIA', cores: '5888 CUDA', memory: '8GB', year: 2020 },
  { id: 'rtx-3070-ti', name: 'RTX 3070 Ti', vendor: 'NVIDIA', cores: '6144 CUDA', memory: '8GB', year: 2021 },
  { id: 'rtx-3080', name: 'RTX 3080', vendor: 'NVIDIA', cores: '8704 CUDA', memory: '10GB', year: 2020 },
  { id: 'rtx-3080-ti', name: 'RTX 3080 Ti', vendor: 'NVIDIA', cores: '10240 CUDA', memory: '12GB', year: 2021 },
  { id: 'rtx-3090', name: 'RTX 3090', vendor: 'NVIDIA', cores: '10496 CUDA', memory: '24GB', year: 2020 },
  { id: 'rtx-3090-ti', name: 'RTX 3090 Ti', vendor: 'NVIDIA', cores: '10752 CUDA', memory: '24GB', year: 2022 },
  { id: 'rtx-4060', name: 'RTX 4060', vendor: 'NVIDIA', cores: '3072 CUDA', memory: '8GB', year: 2023 },
  { id: 'rtx-4060-ti', name: 'RTX 4060 Ti', vendor: 'NVIDIA', cores: '4352 CUDA', memory: '8GB', year: 2023 },
  { id: 'rtx-4070', name: 'RTX 4070', vendor: 'NVIDIA', cores: '5888 CUDA', memory: '12GB', year: 2023 },
  { id: 'rtx-4070-super', name: 'RTX 4070 SUPER', vendor: 'NVIDIA', cores: '7168 CUDA', memory: '12GB', year: 2024 },
  { id: 'rtx-4070-ti', name: 'RTX 4070 Ti', vendor: 'NVIDIA', cores: '7680 CUDA', memory: '12GB', year: 2023 },
  { id: 'rtx-4070-ti-super', name: 'RTX 4070 Ti SUPER', vendor: 'NVIDIA', cores: '8448 CUDA', memory: '16GB', year: 2024 },
  { id: 'rtx-4080', name: 'RTX 4080', vendor: 'NVIDIA', cores: '9728 CUDA', memory: '16GB', year: 2022 },
  { id: 'rtx-4080-super', name: 'RTX 4080 SUPER', vendor: 'NVIDIA', cores: '10240 CUDA', memory: '16GB', year: 2024 },
  { id: 'rtx-4090', name: 'RTX 4090', vendor: 'NVIDIA', cores: '16384 CUDA', memory: '24GB', year: 2022 },
  { id: 'rtx-5060', name: 'RTX 5060', vendor: 'NVIDIA', cores: '3840 CUDA', memory: '12GB', year: 2025 },
  { id: 'rtx-5060-ti', name: 'RTX 5060 Ti', vendor: 'NVIDIA', cores: '4608 CUDA', memory: '8GB', year: 2025 },
  { id: 'rtx-5070', name: 'RTX 5070', vendor: 'NVIDIA', cores: '6144 CUDA', memory: '12GB', year: 2025 },
  { id: 'rtx-5070-ti', name: 'RTX 5070 Ti', vendor: 'NVIDIA', cores: '8960 CUDA', memory: '16GB', year: 2025 },
  { id: 'rtx-5080', name: 'RTX 5080', vendor: 'NVIDIA', cores: '10752 CUDA', memory: '16GB', year: 2025 },
  { id: 'rtx-5090', name: 'RTX 5090', vendor: 'NVIDIA', cores: '21760 CUDA', memory: '32GB', year: 2025 },
  { id: 'a100-40gb', name: 'A100 40GB', vendor: 'NVIDIA', cores: '6912 CUDA', memory: '40GB', year: 2020 },
  { id: 'a100-80gb', name: 'A100 80GB', vendor: 'NVIDIA', cores: '6912 CUDA', memory: '80GB', year: 2020 },
  { id: 'h100-80gb', name: 'H100 80GB', vendor: 'NVIDIA', cores: '16896 CUDA', memory: '80GB', year: 2023 },
];

const hardwarePerformance = {
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
};

const modelSizeFactors = {
  '0.5b': 1.5, '0.6b': 1.5, '1b': 1.3, '1.1b': 1.3, '1.5b': 1.2, '1.6b': 1.2,
  '1.8b': 1.1, '2b': 1.0, '3b': 0.85, '3.8b': 0.8, '4b': 0.75, '4.7b': 0.7,
  '7b': 0.55, '8b': 0.5, '9b': 0.45, '12b': 0.35, '13b': 0.32, '14b': 0.3,
  '16b': 0.25, '20b': 0.2, '21b': 0.18, '24b': 0.15, '27b': 0.12, '32b': 0.1,
  '34b': 0.09, '35b': 0.085, '36b': 0.08, '44b': 0.06, '56b': 0.04, '70b': 0.035,
  '72b': 0.034, '176b': 0.012, '236b': 0.008, '405b': 0.004, '671b': 0.002,
};

function generateBenchmarks() {
  const benchmarks = [];
  let id = 1;
  
  models.forEach(model => {
    const paramKey = Object.keys(modelSizeFactors).find(k => model.params.toLowerCase().includes(k));
    const sizeFactor = paramKey ? modelSizeFactors[paramKey] : 0.1;

    hardware.forEach(hw => {
      const basePerf = hardwarePerformance[hw.id] || 30;
      const tokensPerSecond = Math.round(basePerf * sizeFactor * (0.8 + Math.random() * 0.4));
      
      if (tokensPerSecond >= 1) {
        benchmarks.push({
          id: id++,
          modelId: model.id,
          hardwareId: hw.id,
          tokensPerSecond,
          contextLength: model.params.toLowerCase().includes('671') || model.params.toLowerCase().includes('405') ? 128 : 64,
          quantization: 'Q4_K_M',
          date: '2025-03-01',
        });
      }
    });
  });

  return benchmarks;
}

const benchmarkData = {
  models,
  hardware,
  benchmarks: generateBenchmarks(),
};

app.get('/api/benchmarks', (req, res) => {
  const { model, hardware: hw, vendor } = req.query;
  
  let filtered = benchmarkData.benchmarks;
  
  if (model) {
    filtered = filtered.filter(b => b.modelId === model);
  }
  if (hw) {
    filtered = filtered.filter(b => b.hardwareId === hw);
  }
  
  const enriched = filtered.map(b => ({
    ...b,
    model: benchmarkData.models.find(m => m.id === b.modelId),
    hardware: benchmarkData.hardware.find(h => h.id === b.hardwareId),
  }));
  
  if (vendor) {
    return res.json(enriched.filter(b => b.hardware?.vendor === vendor));
  }
  
  res.json(enriched);
});

app.get('/api/models', (req, res) => {
  res.json(benchmarkData.models);
});

app.get('/api/hardware', (req, res) => {
  res.json(benchmarkData.hardware);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
