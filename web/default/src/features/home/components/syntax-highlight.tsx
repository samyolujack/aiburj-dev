import { type ReactNode } from 'react'

type Token = { text: string; color?: string; bold?: boolean }

/**
 * Minimal syntax highlighter for code blocks.
 * Tokenizes by splitting on common delimiters and applying colors.
 */
function highlightCode(code: string, lang: string): Token[] {
  // Pre-split into tokens
  const tokens: Token[] = []
  // Simple regex-based tokenizer
  const patterns: Record<string, Array<{ re: RegExp; color: string; bold?: boolean }>> = {
    curl: [
      { re: /\b(curl|POST|GET|PUT|DELETE)\b/g, color: '#F97316', bold: true },
      { re: /-H\b|--header\b|-d\b|--data\b|-X\b|--request\b/g, color: '#EAB308' },
      { re: /"([^"]*)"/g, color: '#22C55E' },
      { re: /https?:\/\/[^\s\\]+/g, color: '#60A5FA' },
      { re: /\b(Bearer|Authorization|Content-Type|application\/json)\b/g, color: '#C084FC' },
      { re: /\\\\/g, color: '#9098B0' },
    ],
    python: [
      { re: /\b(import|from|def|class|return|if|else|for|in|as|print|True|False|None|async|await|with|try|except|raise|yield|lambda|pass|break|continue)\b/g, color: '#C084FC', bold: true },
      { re: /"([^"]*)"|'([^']*)'/g, color: '#22C55E' },
      { re: /\b([A-Z][a-zA-Z]*)\b/g, color: '#60A5FA' },
      { re: /#.*$/gm, color: '#9098B0' },
      { re: /\b(\d+\.?\d*)\b/g, color: '#FB923C' },
    ],
    javascript: [
      { re: /\b(import|export|const|let|var|function|return|if|else|for|of|in|await|async|class|new|this|true|false|null|undefined|from|default|try|catch|throw)\b/g, color: '#C084FC', bold: true },
      { re: /"([^"]*)"|'([^']*)'|`([^`]*)`/g, color: '#22C55E' },
      { re: /\b(console|client|process|stdout)\b/g, color: '#60A5FA' },
      { re: /\/\/.*$/gm, color: '#9098B0' },
      { re: /\b(\d+\.?\d*)\b/g, color: '#FB923C' },
      { re: /\b(new\s+)?([A-Z][a-zA-Z]*)\b/g, color: '#F97316' },
    ],
  }

  const rules = patterns[lang] || []
  if (rules.length === 0) return [{ text: code }]

  // Collect all matches with positions
  type Match = { start: number; end: number; text: string; color: string; bold?: boolean }
  const matches: Match[] = []
  for (const rule of rules) {
    let m: RegExpExecArray | null
    while ((m = rule.re.exec(code)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], color: rule.color, bold: rule.bold })
    }
  }
  matches.sort((a, b) => a.start - b.start)

  // Build token array from matches
  let pos = 0
  for (const m of matches) {
    if (m.start < pos) continue // overlapping, skip
    if (m.start > pos) {
      tokens.push({ text: code.slice(pos, m.start) })
    }
    tokens.push({ text: m.text, color: m.color, bold: m.bold })
    pos = m.end
  }
  if (pos < code.length) {
    tokens.push({ text: code.slice(pos) })
  }

  return tokens
}

type SyntaxHighlightProps = {
  code: string
  lang: string
}

export function SyntaxHighlight({ code, lang }: SyntaxHighlightProps) {
  const tokens = highlightCode(code, lang)
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} style={{ color: t.color || '#CDD6F4', fontWeight: t.bold ? 600 : undefined }}>
          {t.text}
        </span>
      ))}
    </>
  )
}
