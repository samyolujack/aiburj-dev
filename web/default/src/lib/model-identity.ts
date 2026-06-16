/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
/**
 * Model name → { vendor display name, LobeHub icon name } mapping.
 * Used as fallback when the backend returns unknown vendor/icon info.
 *
 * Mapping logic: model name substring match (case-insensitive).
 * More specific patterns are listed first to avoid fuzzy matches.
 */
export type ModelIdentity = {
  vendor: string
  icon: string
}

const MODEL_IDENTITIES: Array<{
  match: string
  identity: ModelIdentity
}> = [
  // DeepSeek family
  { match: 'deepseek', identity: { vendor: 'DeepSeek', icon: 'DeepSeek' } },
  // Qwen / Alibaba Cloud family
  { match: 'qwen', identity: { vendor: 'Alibaba Cloud', icon: 'AlibabaCloud' } },
  // OpenAI family
  { match: 'gpt-', identity: { vendor: 'OpenAI', icon: 'OpenAI' } },
  { match: 'o1-', identity: { vendor: 'OpenAI', icon: 'OpenAI' } },
  { match: 'o3-', identity: { vendor: 'OpenAI', icon: 'OpenAI' } },
  { match: 'o4-', identity: { vendor: 'OpenAI', icon: 'OpenAI' } },
  // Claude / Anthropic family
  { match: 'claude', identity: { vendor: 'Anthropic', icon: 'Anthropic' } },
  // 智谱 GLM
  { match: 'glm-', identity: { vendor: 'Zhipu AI', icon: 'Zhipu' } },
  { match: 'chatglm', identity: { vendor: 'Zhipu AI', icon: 'Zhipu' } },
  // MiniMax
  { match: 'abab', identity: { vendor: 'MiniMax', icon: 'Minimax' } },
  { match: 'minimax', identity: { vendor: 'MiniMax', icon: 'Minimax' } },
  // 月之暗面 Moonshot / Kimi
  { match: 'moonshot', identity: { vendor: 'Moonshot AI', icon: 'Moonshot' } },
  { match: 'kimi', identity: { vendor: 'Moonshot AI', icon: 'Moonshot' } },
  // 零一万物 Yi
  { match: 'yi-', identity: { vendor: '01.AI', icon: 'Yi' } },
  // 百川 Baichuan
  { match: 'baichuan', identity: { vendor: 'Baichuan', icon: 'Baichuan' } },
  // 阶跃星辰 Step
  { match: 'step-', identity: { vendor: 'StepFun', icon: 'Stepfun' } },
  // 百度文心
  { match: 'ernie', identity: { vendor: 'Baidu', icon: 'Baidu' } },
  { match: 'wenxin', identity: { vendor: 'Baidu', icon: 'Baidu' } },
  // 讯飞星火
  { match: 'spark', identity: { vendor: 'iFlytek', icon: 'Spark' } },
  // 字节豆包 / 火山引擎
  { match: 'doubao', identity: { vendor: 'ByteDance', icon: 'ByteDance' } },
  { match: 'skylark', identity: { vendor: 'ByteDance', icon: 'ByteDance' } },
  // Google Gemini
  { match: 'gemini', identity: { vendor: 'Google', icon: 'Google' } },
  // Meta Llama
  { match: 'llama', identity: { vendor: 'Meta', icon: 'Meta' } },
  // Mistral
  { match: 'mistral', identity: { vendor: 'Mistral AI', icon: 'Mistral' } },
  // DeepSeek 子模型 (more specific)
  { match: 'deepseek-ai', identity: { vendor: 'DeepSeek', icon: 'DeepSeek' } },
]

/** Lazily match a model name to a known identity. */
export function resolveModelIdentity(modelName: string): ModelIdentity | null {
  const lower = modelName.toLowerCase()
  for (const entry of MODEL_IDENTITIES) {
    if (lower.includes(entry.match)) return entry.identity
  }
  return null
}
