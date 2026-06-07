/* ── Section 间波浪曲线分隔 ── */
type WaveDividerProps = {
  fill: string   // 波浪填充色，即下方 section 的背景色
  height?: number
}

export function WaveDivider({ fill, height = 60 }: WaveDividerProps) {
  return (
    <svg
      viewBox={`0 0 1440 ${height}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height, display: 'block', marginTop: -1 }}
    >
      <path d={`M0,${height * 0.5} C360,${height * 0.1} 720,${height * 0.9} 1440,${height * 0.5} L1440,${height} L0,${height} Z`} fill={fill} />
    </svg>
  )
}
