import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles, ChevronRight, Zap, Shield, Code, Globe, Cpu } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { IndustryCarousel } from './components/industry-carousel'
import { SectionHeader } from './components/section-header'
import { ProductCard } from './components/product-card'
import { ModelCard } from './components/model-card'
import { ScrollReveal } from './components/scroll-reveal'
import { AnimatedCounter } from './components/animated-counter'
import { useMouseParallax } from './components/use-mouse-parallax'
import { SyntaxHighlight } from './components/syntax-highlight'

/* ── Hero 轮播数据 ── */
const slides = [
  { title: '国产大模型的灯塔', title2: '一站汇聚，照亮 AI 之路', desc: 'OpenAI 兼容格式，统一 API 调用 DeepSeek、通义千问、GLM 等国产大模型，按量计费，快速集成', bg: '/banner-1.png', overlay: 'linear-gradient(180deg, rgba(230,240,250,0.55) 0%, rgba(220,235,248,0.65) 50%, rgba(255,255,255,0.9) 100%)', textColor: '#252736', badge: 'AI 之塔', isDark: false, bgPos: 'right center', bgSize: 'cover' },
  { title: '覆盖 8 大国产厂商', title2: '16 款主流模型', desc: 'DeepSeek V4、Qwen3、GLM-5.1、Kimi-K2 等最新旗舰模型，一次接入全部调用', bg: '/banner-2.png', overlay: 'linear-gradient(180deg, rgba(230,240,250,0.55) 0%, rgba(220,235,248,0.65) 50%, rgba(255,255,255,0.9) 100%)', textColor: '#252736', badge: '模型生态', isDark: false, bgPos: 'center', bgSize: 'cover' },
  { title: '比官方更优的价格', title2: '按量计费无门槛', desc: '新人注册即享体验额度，支持高速推理通道，99.9% 服务可用性保障', bg: '/banner-3.png', overlay: 'linear-gradient(180deg, rgba(230,240,250,0.55) 0%, rgba(220,235,248,0.65) 50%, rgba(255,255,255,0.9) 100%)', textColor: '#252736', badge: '高性价比', isDark: false, bgPos: 'center', bgSize: 'cover' },
  { title: '三步接入零门槛', title2: '一行代码调用大模型', desc: '获取 API Key → 选择模型 → 复制代码，OpenAI SDK 直接兼容，5 分钟完成集成', bg: '/banner-4.png', overlay: 'linear-gradient(180deg, rgba(230,240,250,0.55) 0%, rgba(220,235,248,0.65) 50%, rgba(255,255,255,0.9) 100%)', textColor: '#252736', badge: '极速接入', isDark: false, bgPos: 'center', bgSize: 'cover' },
  { title: '企业级安全合规', title2: '数据隐私全面保障', desc: '支持私有化部署，计算隔离/网络隔离/存储隔离，符合行业安全标准与合规要求', bg: '/banner-5.png', overlay: 'linear-gradient(180deg, rgba(230,240,250,0.55) 0%, rgba(220,235,248,0.65) 50%, rgba(255,255,255,0.9) 100%)', textColor: '#252736', badge: '安全可靠', isDark: false, bgPos: 'center', bgSize: 'cover' },
]

/* ── 产品矩阵数据 ── */
const productCards = [
  { title: '开箱即用的大模型 API', desc: '覆盖语言、语音、图片、视频等场景，一站式提供大模型 API 服务，按量计费，助力应用快速上线。', img: '/product-api.png', tag: 'API 服务', href: '/pricing', imgBg: '#EEF3FF' },
  { title: '高效能模型推理加速', desc: '自研推理加速引擎，无论是自研模型还是开源模型，均可接入高效推理加速服务，全面提升响应速度与处理性能。', img: '/product-speed.png', tag: '推理加速', href: '/pricing', imgBg: '#E6F7F5' },
  { title: '按量计费 + 企业级保障', desc: '无月费无门槛，按实际 Token 用量计费。提供企业级 SLA 保障，99.9% 服务可用性，新用户注册即享体验额度。', img: '/product-billing.png', tag: '灵活计费', href: '/pricing', imgBg: '#FFF5EE' },
  { title: '专属预留实例', desc: '面向企业核心推理场景，提供独占算力、精度保障与成本优化的一站式方案，支撑关键业务稳定运行。', img: '/product-reserved.png', tag: '企业方案', href: '/pricing', imgBg: '#EDF2FA' },
  { title: '私有化部署', desc: '提供企业级私有化部署方案，一站式解决模型性能优化、部署与运维等痛点，满足多样化场景需求。', img: '/product-private.png', tag: '私有部署', href: '/pricing', imgBg: '#F4F0FA' },
  { title: '多模态 AI 服务', desc: '整合视觉理解、语音识别、视频生成等多模态能力，统一 API 调用，覆盖内容创作、智能客服、实时互动等场景。', img: '/product-multimodal.png', tag: '多模态', href: '/pricing', imgBg: '#EEF6F0' },
]

/* ── 性能指标 ── */
const perfCards = [
  { value: '16+', label: '主流模型', desc: '覆盖语言、视觉、语音', icon: Cpu },
  { value: '8', label: '国产厂商', desc: '深度合作持续接入', icon: Globe },
  { value: '99.9%', label: '服务可用性', desc: '企业级 SLA 保障', icon: Shield },
  { value: '100%', label: '国产模型', desc: '全场景国产覆盖', icon: Zap },
]

/* ── 核心优势大卡 ── */
const bigCards = [
  {
    title: '高速推理', bg: "url('/deco-speed-bg.png') center/cover no-repeat",
    textColor: '#FAFDFF', borderColor: '#0080C0',
    shadowHover: '0 24px 70px rgba(0,42,96,0.30)',
    sections: [
      { value: '10x+', label: '推理速度提升' },
      { value: '3x+', label: '生图模型加速' },
      { value: '100ms', label: '语音生成延迟' },
    ],
  },
  {
    title: '高性价比', bg: "url('/deco-save-bg.png') center/cover no-repeat",
    textColor: '#0A1628', borderColor: '#C8D8E8',
    shadowHover: '0 24px 70px rgba(0,74,143,0.12)',
    sections: [
      { value: '66%', label: '生图成本节省' },
      { value: '46%', label: '语言模型成本节省' },
      { value: '52%', label: '客户托管成本下降' },
    ],
  },
]

/* ── 核心优势小卡图标 ── */
const IconStability = () => (
  <svg width="65" height="64" viewBox="0 0 65 64" fill="none"><rect opacity="0.8" width="34.441" height="34.441" rx="8" transform="matrix(0.866025 0.5 -0.866025 0.5 32.9531 29.5586)" fill="#004A8F"/><rect opacity="0.95" width="34.441" height="34.441" rx="8" transform="matrix(0.866025 0.5 -0.866025 0.5 32.9531 14.5391)" fill="#0080C0"/><rect opacity="0.8" width="34.441" height="34.441" rx="8" transform="matrix(0.866025 0.5 -0.866025 0.5 32.9531 0)" fill="#004A8F"/></svg>
)
const IconIntelligence = () => (
  <svg width="65" height="64" viewBox="0 0 65 64" fill="none"><ellipse opacity="0.95" cx="32.3405" cy="32" rx="11.8424" ry="33.4124" transform="rotate(45 32.3405 32)" fill="#0080C0"/><ellipse opacity="0.8" cx="32.3408" cy="31.9984" rx="11.8424" ry="33.4124" transform="rotate(-45 32.3408 31.9984)" fill="#004A8F"/></svg>
)
const IconSecurity = () => (
  <svg width="67" height="64" viewBox="0 0 67 64" fill="none"><circle opacity="0.95" cx="33.1708" cy="19.122" r="19.122" fill="#0080C0"/><path opacity="0.8" d="M7.82389 54.4403L28.7304 26.0672C31.1284 22.8128 35.9931 22.8128 38.3911 26.0672L59.2976 54.4403C62.2167 58.4019 59.3882 63.9995 54.4673 63.9995H12.6542C7.73335 63.9995 4.90483 58.4019 7.82389 54.4403Z" fill="#004A8F"/></svg>
)
const IconScalability = () => (
  <svg width="65" height="64" viewBox="0 0 65 64" fill="none"><path d="M17.6602 14.0137C17.6602 19.7944 22.3463 24.4805 28.127 24.4805C33.9075 24.4803 38.5938 19.7943 38.5938 14.0137C38.5938 13.9032 38.5884 13.7932 38.585 13.6836H46.5166C48.6185 13.6837 50.322 15.3874 50.3223 17.4893V27.3018C45.2313 28.0108 41.3125 32.3798 41.3125 37.666C41.3125 42.9522 45.2313 47.3202 50.3223 48.0293V54.9297C50.3222 57.0317 48.6186 58.7353 46.5166 58.7354H38.585C38.4104 53.1077 33.7969 48.5988 28.127 48.5986C22.4569 48.5986 17.8436 53.1077 17.6689 58.7354H9.07617C6.97436 58.7351 5.27057 57.0315 5.27051 54.9297V46.998C5.38015 47.0014 5.49012 47.0068 5.60059 47.0068C11.3812 47.0068 16.0672 42.3206 16.0674 36.54C16.0674 30.7594 11.3813 26.0732 5.60059 26.0732C5.49012 26.0732 5.38015 26.0777 5.27051 26.0811V17.4893C5.27076 15.3876 6.97447 13.6838 9.07617 13.6836H17.6689C17.6655 13.7932 17.6602 13.9032 17.6602 14.0137ZM51.8555 28C57.1103 28 61.3709 32.2598 61.3711 37.5146C61.3711 42.7696 57.1105 47.0303 51.8555 47.0303C46.6006 47.0301 42.3408 42.7695 42.3408 37.5146C42.341 32.2599 46.6008 28.0002 51.8555 28Z" fill="#004A8F"/><circle cx="28.1071" cy="14.0153" r="9.51531" fill="#0080C0"/></svg>
)
const smallCards = [
  { title: '高稳定性', items: ['经过开发者验证，保证高可靠稳定运行', '完善的监控和容错机制', '专业技术支持，满足企业级场景需求'], Icon: IconStability },
  { title: '高智能', items: ['多种先进模型服务', '智能扩展，灵活适配业务规模', '智能成本分析，优化业务支持'], Icon: IconIntelligence },
  { title: '高安全性', items: ['支持 BYOC 部署，保护数据隐私', '计算/网络/存储隔离', '符合行业标准与合规要求'], Icon: IconSecurity },
  { title: '高扩展性', items: ['动态扩容支持弹性业务', '一键部署自定义模型', '灵活架构，支持混合云部署'], Icon: IconScalability },
]

/* ── 模型生态数据 ── */
const modelsData = [
  { logo: '/logo-deepseek.svg', name: 'DeepSeek', models: 'V4-Pro, V4-Flash, V3.2', desc: '国产大模型标杆，旗舰推理能力' },
  { logo: '/logo-tongyi.svg', name: '通义千问', models: 'Qwen3-235B, Qwen-VL', desc: '阿里云自研，多尺寸覆盖全场景' },
  { logo: '/logo-bytedance.svg', name: '字节豆包', models: 'Doubao-1.5-pro', desc: '字节跳动自研，多模态能力强' },
  { logo: '/logo-zhipu.svg', name: '智谱 AI', models: 'GLM-5.1, GLM-5, GLM-4.7', desc: '全模态大模型先驱，学术商业并重' },
  { logo: '/logo-kimi.png', name: '月之暗面', models: 'Kimi-K2.6, K2.5', desc: '超长上下文，深度理解与推理' },
  { logo: '/logo-baidu.svg', name: '百度文心', models: 'ERNIE-4.5, ERNIE-Image', desc: '百度自研，知识增强型大模型' },
  { logo: '/logo-hunyuan.svg', name: '腾讯混元', models: 'Hunyuan-Large', desc: '腾讯全链路自研大语言模型' },
  { logo: '/logo-minimax.svg', name: 'MiniMax', models: 'MiniMax-M2.5', desc: '轻量高效，高性价比之选' },
  { logo: '/logo-stepfun.svg', name: '阶跃星辰', models: 'Step-2-16K', desc: '新一代推理模型，性能卓越' },
  { logo: '/logo-lingyi.png', name: '零一万物', models: 'Yi-Lightning, Yi-Large', desc: '李开复创立，高速推理引擎' },
  { logo: '/logo-baichuan.svg', name: '百川智能', models: 'Baichuan4, Baichuan-M1', desc: '王小川创立，医疗领域领先' },
  { logo: '/logo-baai.svg', name: '智源研究院', models: 'Aquila, BGE, FlagEmbedding', desc: '非营利研究机构，开源模型先驱' },
]

/* ── 行业方案 ── */
const industryCards = [
  { title: '互联网', desc: '高效智能的内容生成与个性化推荐服务，加速 AI 生成速度，优化 GPU 算力使用效率。', img: '/industry-internet.png' },
  { title: '教育', desc: 'AI 驱动的个性化学习、智能批改与知识问答，助力教育数字化转型。', img: '/industry-education.png' },
  { title: '政务', desc: '智能文档处理、政策问答、数据安全保障，支撑智慧政务建设。', img: '/industry-government.png' },
  { title: '智算中心', desc: '高性能推理服务、模型部署与运维，为智算中心提供全栈 AI 算力运营。', img: '/industry-ai-center.png' },
  { title: 'AI 硬件', desc: '边缘计算、端侧推理优化，赋能 AI 硬件设备智能化升级。', img: '/industry-hardware.png' },
]

/* ── 合作伙伴跑马灯 ── */
const partnerLogos = ['01.png','02.png','03.png','04.png','05.png','06.png','07.png','08.png','09.png','10.png','11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png','20.png','21.png']
const partnerLogos2 = ['01.png','02.png','03.png','04.png','05.png','06.png','07.png','08.png','09.png','10.png','11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png','20.png','21.png','22.png','23.png','24.png','25.png','26.png']
const partnerLogos3 = ['01.png','02.png','03.png','04.png','05.png','06.png','07.png','08.png','09.png','10.png','11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png']
const LOGO_BASE1 = '/partners/251106-1-'
const LOGO_BASE2 = '/partners/250903-3-'
const LOGO_BASE3 = '/partners/250903-2-'
const marqueeLogos1 = [...partnerLogos, ...partnerLogos]
const marqueeLogos2 = [...partnerLogos2, ...partnerLogos2]
const marqueeLogos3 = [...partnerLogos3, ...partnerLogos3]

export function Home() {
  const { smoothX, smoothY } = useMouseParallax()
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const titleRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isPaused) return
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [isPaused])

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.setProperty('-webkit-background-clip', 'text')
      titleRef.current.style.setProperty('-webkit-text-fill-color', 'transparent')
      titleRef.current.style.setProperty('background-clip', 'text')
      titleRef.current.style.setProperty('color', 'transparent')
    }
  }, [current])

  const s = slides[current]

  return (
    <PublicLayout showMainContainer={false}>
      {/* ═══ SECTION 1 — Hero Banner 轮播 ═══ */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', background: `url(${s.bg}) ${s.bgPos}/${s.bgSize} no-repeat`, transition: 'background 0.8s ease' }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: s.overlay, transition: 'background 0.8s ease' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* 大呼吸光晕 — 跟随鼠标微移 */}
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
            position: 'absolute', top: '5%', left: '50%',
            width: '900px', height: '700px',
            x: smoothX,
            background: 'radial-gradient(ellipse, rgba(0,128,192,0.08) 0%, rgba(0,74,143,0.04) 40%, transparent 70%)',
          }} />
          {/* 点阵背景 — 反向微移，增强深度感 */}
          <motion.div style={{
            position: 'absolute', inset: 0,
            x: smoothX,
            y: smoothY,
            backgroundImage: 'radial-gradient(circle, rgba(0,74,143,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.5,
          }} />
          <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '55%', height: '70%', background: s.isDark ? 'radial-gradient(ellipse, rgba(0,74,143,0.1) 0%, transparent 70%)' : 'radial-gradient(ellipse, rgba(0,74,143,0.04) 0%, transparent 70%)', transition: 'all 0.8s ease' }} />
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '180px 32px 200px', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ background: s.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,74,143,0.06)', border: `1px solid ${s.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,74,143,0.12)'}`, borderRadius: 50, padding: '8px 24px', fontSize: 14, fontWeight: 600, color: s.isDark ? 'rgba(255,255,255,0.95)' : '#004A8F' }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: s.isDark ? '#00A0E0' : '#004A8F', display: 'inline-block', marginRight: 10, boxShadow: `0 0 8px ${s.isDark ? '#00A0E0' : '#004A8F'}44` }} />{s.badge}
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(42px,6vw,72px)', fontWeight: 700, lineHeight: 1.15, color: s.textColor, marginBottom: 28, letterSpacing: '-0.025em' }}>
            {s.title}<br />
            <span ref={titleRef} style={{ background: s.isDark ? 'linear-gradient(135deg, #B8D8F0,#0080C0,#00A0E0)' : 'linear-gradient(135deg, #002060,#004A8F,#0080C0)' }}>{s.title2}</span>
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.8, color: s.isDark ? 'rgba(255,255,255,0.7)' : '#4A6A8A', maxWidth: 660, margin: '0 auto 56px' }}>{s.desc}</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button style={{ height: 56, padding: '0 40px', fontSize: 17, fontWeight: 700, borderRadius: 16, background: '#004A8F', boxShadow: '0 8px 32px rgba(0,74,143,0.3)', border: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,74,143,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,74,143,0.3)' }}
              render={<Link to="/sign-up" />}>立即体验 <ArrowRight style={{ marginLeft: 8, width: 18 }} /></Button>
            <Button variant="outline" style={{ height: 56, padding: '0 40px', fontSize: 17, fontWeight: 600, borderRadius: 16, borderColor: s.isDark ? 'rgba(255,255,255,0.25)' : '#D5D6EA', color: s.isDark ? 'rgba(255,255,255,0.9)' : '#334155', background: s.isDark ? 'rgba(255,255,255,0.06)' : '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#004A8F'; e.currentTarget.style.color = '#004A8F' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = s.isDark ? 'rgba(255,255,255,0.25)' : '#D5D6EA'; e.currentTarget.style.color = s.isDark ? 'rgba(255,255,255,0.9)' : '#334155' }}
              render={<Link to="/pricing" />}>查看模型</Button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 2 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 44 : 12, height: 12, borderRadius: 6, background: i === current ? (s.isDark ? '#fff' : '#004A8F') : (s.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,74,143,0.2)'), border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.96))', pointerEvents: 'none' }} />
      </section>

      {/* Gradient transition */}
      <div style={{ height: 40, background: 'linear-gradient(to bottom, rgba(0,0,0,0.02), #fff)', marginTop: -1 }} />
      {/* ═══ SECTION 2 — 性能指标 ═══ */}
      <ScrollReveal>
      <section style={{ background: 'linear-gradient(180deg, rgba(230,240,250,0.15), #fff)', padding: '64px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {perfCards.map((c, i) => {
            const accentColors = ['#004A8F', '#0080C0', '#002060', '#00A0E0']
            return (
            <div key={i} style={{ position: 'relative', background: '#fff', borderRadius: 16, padding: '36px 24px 32px', border: '1px solid #D5D6EA', borderTop: `3px solid ${accentColors[i]}`, textAlign: 'center', transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,74,143,0.1), 0 0 0 2px rgba(0,128,192,0.15)'; e.currentTarget.style.borderColor = 'rgba(0,128,192,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#D5D6EA' }}
            >
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,74,143,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <c.icon size={22} color="#0080C0" style={{ opacity: 0.75 }} />
              </div>
              <AnimatedCounter value={c.value} />
              <div style={{ fontSize: 17, fontWeight: 700, color: '#36384A', marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 14, color: '#8098B0' }}>{c.desc}</div>
            </div>
          )})}
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ SECTION 3 — 产品矩阵 3×2 ═══ */}
      <div style={{ height: 40, background: 'linear-gradient(to bottom, #fff, #F4F8FC)' }} />
      <ScrollReveal delay={0.1}>
      <section style={{ background: '#F4F8FC', padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader icon={Sparkles} badge="产品矩阵" title="全场景 AI 能力平台" desc="助力用户一站式实现 AI 能力与应用的快速对接" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {productCards.map((card, i) => (
              <ProductCard key={i} title={card.title} desc={card.desc} img={card.img} tag={card.tag} href={card.href} index={i} imgBg={card.imgBg} />
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ SECTION 4 — 核心优势 ═══ */}
      <div style={{ height: 40, background: 'linear-gradient(to bottom, #F4F8FC, #fff)' }} />
      <ScrollReveal delay={0.1}>
      <section style={{ background: '#fff', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader icon={Shield} badge="核心优势" title="为什么选择 aiburj" desc="致力于成为国内领先的 AI 能力提供商" descMaxWidth={500} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 1200, margin: '0 auto 74px' }}>
            {bigCards.map((card, i) => (
              <div key={i} style={{ position: 'relative', overflow: 'hidden', borderRadius: 15, background: card.bg, color: card.textColor, border: 'none', transition: 'box-shadow 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = card.shadowHover }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ position: 'absolute', right: -22, top: -39 }}>
                  <img src={i === 0 ? '/deco-speed.svg' : '/deco-save.svg'} alt="" style={{ width: 246, height: 250 }} />
                </div>
                {card.sections.map((sec, j) => (
                  <div key={j} style={{ borderBottom: j < card.sections.length - 1 ? `1px solid ${card.borderColor}` : 'none', padding: j === 0 ? '76px 0 0 92px' : '0 112px 0 92px', minHeight: j === 0 ? 376 : j === 1 ? 241 : 249, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                    {j === 0 && <h3 style={{ fontSize: 36, fontWeight: 600, lineHeight: 1, marginBottom: 92 }}>{card.title}</h3>}
                    <p style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, marginBottom: 12 }}>{sec.value}</p>
                    <p style={{ fontSize: 24, lineHeight: 1 }}>{sec.label}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48, margin: '56px -40px 0', padding: 0 }}>
            {smallCards.map((card, i) => {
              const cardBg = [
                'linear-gradient(180deg, #E8F1FB, #F0F6FC)',
                'linear-gradient(180deg, #E5EEF9, #EEF4FB)',
                'linear-gradient(180deg, #EAF2FB, #F2F7FD)',
                'linear-gradient(180deg, #ECF3FB, #F4F8FC)',
              ][i]
              return (
              <div key={i} className="advantage-small-card" style={{ background: cardBg, padding: '48px 32px', minHeight: 520, maxWidth: 326, position: 'relative', overflow: 'hidden', borderRadius: 8, transition: 'box-shadow 0.3s', cursor: 'default' }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 22px 58px rgba(30,41,59,0.12)'
                  const glow = e.currentTarget.querySelector('[data-glow]') as HTMLElement
                  if (glow) glow.style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  const glow = e.currentTarget.querySelector('[data-glow]') as HTMLElement
                  if (glow) glow.style.opacity = '0'
                }}
              >
                <div data-glow style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 0%, rgba(0,74,143,0.12), transparent 42%)', opacity: 0, transition: 'opacity 0.5s' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,74,143,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><card.Icon /></div>
                  <h3 style={{ fontSize: 32, fontWeight: 600, color: '#0A1628', textAlign: 'center', marginBottom: 40 }}>{card.title}</h3>
                  <ul style={{ listStyle: 'disc', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {card.items.map((item, j) => (<li key={j} style={{ fontSize: 17, color: '#4A6A8A', lineHeight: 1.75 }}>{item}</li>))}
                  </ul>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ SECTION 5 — 模型生态 3×4 ═══ */}
      <div style={{ height: 40, background: 'linear-gradient(to bottom, #fff, #F4F8FC)' }} />
      <ScrollReveal delay={0.1}>
      <section style={{ background: '#F4F8FC', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader icon={Cpu} badge="模型生态" title="已接入的国产大模型" desc="覆盖国内主流大模型厂商，一个 API 全部调用" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {modelsData.map((m, i) => (<ModelCard key={i} logo={m.logo} name={m.name} models={m.models} desc={m.desc} />))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ SECTION 6 — 行业方案 ═══ */}
      <div style={{ height: 40, background: 'linear-gradient(to bottom, #F4F8FC, #fff)' }} />
      <ScrollReveal delay={0.1}>
      <section style={{ background: '#fff', padding: '60px 24px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader icon={Globe} badge="行业方案" title="面向不同行业，提供灵活的解决方案" desc="覆盖互联网、教育、政务、智算中心、AI 硬件等多行业场景" descMaxWidth={640} />
          <div style={{ position: 'relative', margin: '0 -80px' }}>
            <IndustryCarousel cards={industryCards} />
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ SECTION 7 — 合作伙伴 ═══ */}
      <div style={{ height: 40, background: 'linear-gradient(to bottom, #fff, #F4F8FC)' }} />
      <ScrollReveal>
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #F4F8FC 0%, #E8F0FA 40%, #DCE8F8 70%, #F4F8FC 100%)', padding: '48px 0 0' }}>
        {/* 装饰光晕 */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(0,74,143,0.06) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(ellipse, rgba(0,128,192,0.04) 0%, transparent 70%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 48, fontWeight: 700, color: '#252736', textAlign: 'center', marginBottom: 66, letterSpacing: '-0.02em' }}>典型客户与合作伙伴</h2>
        {[{ logos: marqueeLogos1, base: LOGO_BASE1, anim: 'marquee-left 60s' }, { logos: marqueeLogos2, base: LOGO_BASE2, anim: 'marquee-right 60s' }, { logos: marqueeLogos3, base: LOGO_BASE3, anim: 'marquee-left 80s' }].map((row, ri) => (
          <div key={ri} style={{ height: 80, overflow: 'hidden', position: 'relative', marginBottom: 40 }}>
            <div style={{ display: 'flex', gap: 20, position: 'absolute', [ri === 1 ? 'right' : 'left']: 0, animation: `${row.anim} linear infinite` }}>
              {row.logos.map((logo, i) => (
                <img key={i} src={`${row.base}${logo}`} alt="" style={{ width: 185, height: 80, borderRadius: 8, flexShrink: 0, objectFit: 'contain', background: 'rgba(255,255,255,0.65)' }} />
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '60px 24px 80px' }}>
          <a href="/sign-up" style={{ width: 196, height: 64, borderRadius: 12, background: '#004A8F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600, textDecoration: 'none', transition: 'transform 0.3s, box-shadow 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 34px rgba(0,74,143,0.28)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >立即体验</a>
        </div>
        </div>
      </section>
      <div style={{ height: 40, background: 'linear-gradient(to bottom, #F4F8FC, #fff)' }} />
      <section style={{ background: 'linear-gradient(180deg, #F4F8FC, #fff 30%)', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader icon={Code} badge="快速开始" title="三步接入，零门槛" desc="获取 API Key → 选择模型 → 复制代码，OpenAI SDK 直接兼容" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {[
              { lang: 'cURL', color: '#F97316', code: `curl https://api.aiburj.com/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer *** \\\n  -d '{\n    "model": "deepseek-v4-pro",\n    "messages": [\n      {"role": "user", "content": "你好"}\n    ]\n  }'` },
              { lang: 'Python', color: '#3B82F6', code: `from openai import OpenAI\n\nclient = OpenAI(\n  base_url="https://api.aiburj.com/v1",\n  api_key="sk-xxx"\n)\n\nresponse = client.chat.completions.create(\n  model="deepseek-v4-pro",\n  messages=[\n    {"role": "user", "content": "你好"}\n  ]\n)\n\nprint(response.choices[0].message.content)` },
              { lang: 'JavaScript', color: '#EAB308', code: `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "https://api.aiburj.com/v1",\n  apiKey: "sk-xxx"\n});\n\nconst res = await client.chat.completions.create({\n  model: "deepseek-v4-pro",\n  messages: [\n    { "role": "user", "content": "你好" }\n  ]\n});\n\nconsole.log(res.choices[0].message.content);` },
            ].map((tab, i) => (
              <div key={i} style={{ background: '#1A1D2E', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 24px rgba(10,22,40,0.12)', transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,74,143,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(10,22,40,0.12)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: 7 }}><div style={{ width: 11, height: 11, borderRadius: 6, background: '#EF4444' }} /><div style={{ width: 11, height: 11, borderRadius: 6, background: '#EAB308' }} /><div style={{ width: 11, height: 11, borderRadius: 6, background: '#22C55E' }} /></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: tab.color, marginLeft: 12 }}>{tab.lang}</span>
                </div>
                <pre style={{ color: '#CDD6F4', fontSize: 13, lineHeight: 2, margin: 0, padding: '20px 22px 24px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: "'SF Mono','Fira Code',monospace", overflow: 'auto', maxHeight: 380 }}>
                  <SyntaxHighlight code={tab.code} lang={tab.lang.toLowerCase()} />
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ SECTION 9 — CTA ═══ */}
      <ScrollReveal delay={0.2}>
      <section style={{ position: 'relative', overflow: 'hidden', background: "url('/cta-bg.png') center/cover no-repeat", padding: '120px 24px 110px', textAlign: 'center' }}>
        {/* Subtle white overlay for readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0.35) 100%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,74,143,0.06)', borderRadius: 50, border: '1px solid rgba(0,74,143,0.15)', padding: '8px 24px', fontSize: 14, fontWeight: 600, color: '#004A8F', marginBottom: 36 }}>
            <Sparkles size={16} /> 限时体验
          </div>
          <h2 style={{ fontSize: 'clamp(34px,5vw,56px)', fontWeight: 900, color: '#0A1628', marginBottom: 24, lineHeight: 1.2 }}>开始构建你的 AI 应用</h2>
          <p style={{ color: '#4A6A8A', fontSize: 18, marginBottom: 48, lineHeight: 1.7 }}>注册即享体验额度，零成本测试所有国产大模型</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button style={{ height: 56, padding: '0 48px', fontSize: 17, fontWeight: 700, borderRadius: 16, background: '#004A8F', color: '#fff', boxShadow: '0 8px 32px rgba(0,74,143,0.3)' }}
              render={<Link to="/sign-up" />}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,74,143,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,74,143,0.3)' }}
            >免费注册 <ArrowRight style={{ marginLeft: 8, width: 20 }} /></Button>
            <Button variant="outline" style={{ height: 56, padding: '0 48px', fontSize: 17, fontWeight: 600, borderRadius: 16, borderColor: '#C8D8E8', color: '#334155', background: '#fff' }}
              render={<Link to="/pricing" />}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#004A8F'; e.currentTarget.style.color = '#004A8F' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#C8D8E8'; e.currentTarget.style.color = '#334155' }}
            >查看定价</Button>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </PublicLayout>
  )
}
