# new-api 前端重设计方案 - SiliconFlow 风格

## 目标
参照 SiliconFlow 网站的设计、布局、交互风格，重构 new-api 的前端。保持功能不变，只改进视觉和用户体验。

---

## 一、页面结构总体规划

### 首页 (/) 完整布局

```
┌─────────────────────────────────────────┐
│          1. 导航栏 (Navigation)          │
│  Logo | 菜单项 | 用户/登录 CTA          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          2. Hero Banner 轮播             │
│   [大标题 + 描述 + CTA] × N 轮播        │
│   背景: 紫色渐变 + 装饰元素             │
│   [✉ • ❍ ❍ ❍]  tab 指示器              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    3. 产品矩阵 (Product Grid 4列)        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │API   │ │模型库 │ │控制台 │ │文档   │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│  标题 + 描述 + 图片占位符 + CTA 按钮    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  4. 为什么选择 new-api (6 优势展示)     │
│  [高速] [成本优] [稳定] [功能] [安全] [扩展]│
│  数据统计 + 描述说明 + 图标             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  5. 使用场景/行业方案 (Scenarios)       │
│  左: 文字描述      右: 图片占位符       │
│  可左右交替展示                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  6. 客户案例 (Customer Cases)          │
│  客户 Logo 墙 / 成功案例卡片            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  7. 常见问题 (FAQ)                      │
│  Accordion 展开/收起                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  8. CTA 区域 (Call to Action)          │
│  大标题 + 两个按钮 + 背景图片占位符     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          9. 页脚 (Footer)                │
│  链接导航 | 社交媒体 | 法律文案          │
└─────────────────────────────────────────┘
```

---

## 二、详细设计规范

### 2.1 导航栏 (Navigation Bar)

**文件位置：** `web/default/src/components/layout/navigation.tsx`

**特性：**
- 固定顶部 (sticky top)
- 深色背景 + 白色文字 (dark mode: 深灰 + 浅文字)
- Logo + Brand Name 左侧
- 菜单项居中: [API 文档] [定价] [模型] [关于]
- 右侧: 用户下拉 / 登录按钮 / 注册按钮
- 移动端: 汉堡菜单

**布局代码框架：**
```tsx
export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Brand Name */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="new-api" className="h-8 w-8" />
          <span className="font-bold text-lg">new-api</span>
        </div>
        
        {/* Menu Items (Desktop) */}
        <div className="hidden md:flex gap-8">
          <NavLink href="/docs">Documentation</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/models">Models</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Button variant="ghost">Sign In</Button>
          <Button variant="primary">Get Started</Button>
          {/* Mobile Menu Button */}
          <MobileMenuButton />
        </div>
      </div>
    </nav>
  )
}
```

---

### 2.2 Hero Banner 轮播 (Hero Carousel)

**文件位置：** `web/default/src/features/home/hero-carousel.tsx`

**特性：**
- 自动轮播 (5秒切换一次)
- 手动切换 (点击指示器)
- 响应式: 桌面全宽，移动端垂直单列
- 背景: 紫色渐变 + 几何装饰
- 内容: 标题 (h1) + 副标题 (p) + CTA 按钮 + 右侧图片

**轮播内容（4个 slides）：**

**Slide 1 - 主推荐**
```
标题: Unified AI API Platform
副标题: Connect to 40+ AI providers with a single API
图片位置: 右侧 (宽度: 45%, 高度: 100%)
占位符: [Image Placeholder: Hero Main Image]
CTA: [Get Free API Key] [View Docs]
```

**Slide 2 - 速度优势**
```
标题: 10x Faster API Response
副标题: Optimized infrastructure for low-latency requests
数据展示: "Average: 200ms" (大字体)
图片: 右侧图表/数据可视化占位符
CTA: [Try Now] [Learn More]
```

**Slide 3 - 成本优势**
```
标题: 50% Lower Costs
副标题: Transparent pricing with no hidden fees
数据展示: "$0.001/1K tokens" (大字体)
图片: 右侧价格对比表占位符
CTA: [View Pricing] [Calculator]
```

**Slide 4 - 功能展示**
```
标题: All Models in One Platform
副标题: ChatGPT, Claude, Gemini, and more
图片: 右侧模型 logo 墙占位符
CTA: [Explore Models] [Sign Up]
```

**HTML 结构：**
```tsx
export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const slides = [
    { title: "...", subtitle: "...", image: "/placeholder-hero-1.png" },
    // ... 3 more slides
  ]
  
  return (
    <div className="relative h-96 md:h-[500px] bg-gradient-to-r from-purple-600 to-purple-800">
      {/* Carousel Container */}
      <div className="relative h-full overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="container mx-auto px-4 h-full flex items-center gap-8">
              {/* Content (Left 55%) */}
              <div className="w-full md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  {slide.subtitle}
                </p>
                <div className="flex gap-4">
                  <Button size="lg" variant="primary">Get Started</Button>
                  <Button size="lg" variant="secondary">Learn More</Button>
                </div>
              </div>
              
              {/* Image (Right 45%) */}
              <div className="hidden md:block w-1/2">
                <ImagePlaceholder
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Tab Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === current
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
```

---

### 2.3 产品矩阵 (Product Grid)

**文件位置：** `web/default/src/features/home/product-matrix.tsx`

**布局：** 4 列网格 (响应式: 桌面 4列, 平板 2列, 手机 1列)

**4 个产品卡片：**

```tsx
const products = [
  {
    id: 'api',
    title: 'Unified API',
    description: 'Single API endpoint for 40+ AI models and providers',
    image: '/placeholder-product-api.png',
    icon: '⚡',
    features: ['40+ Providers', 'OpenAI Compatible', 'Stream Support'],
    cta: { text: 'Get API Key', href: '/console/keys' }
  },
  {
    id: 'models',
    title: 'Model Library',
    description: 'Extensive collection of cutting-edge AI models',
    image: '/placeholder-product-models.png',
    icon: '🤖',
    features: ['LLMs', 'Image Generation', 'Audio & Video'],
    cta: { text: 'Browse Models', href: '/models' }
  },
  {
    id: 'console',
    title: 'Admin Console',
    description: 'Complete management platform with analytics',
    image: '/placeholder-product-console.png',
    icon: '📊',
    features: ['Usage Analytics', 'User Management', 'Billing'],
    cta: { text: 'View Console', href: '/console' }
  },
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    image: '/placeholder-product-docs.png',
    icon: '📚',
    features: ['API Reference', 'Tutorials', 'Code Examples'],
    cta: { text: 'Read Docs', href: '/docs' }
  }
]

export function ProductMatrix() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Complete AI Solution Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to integrate AI into your applications
          </p>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ icon, title, description, image, features, cta }) {
  return (
    <div className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-xl transition-all hover:border-purple-500">
      {/* Image Placeholder */}
      <ImagePlaceholder
        src={image}
        alt={title}
        className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-950 rounded-lg mb-4 flex items-center justify-center"
      >
        <span className="text-4xl">{icon}</span>
      </ImagePlaceholder>
      
      {/* Content */}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      
      {/* Features */}
      <ul className="mb-6 space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
            ✓ {feature}
          </li>
        ))}
      </ul>
      
      {/* CTA */}
      <Link href={cta.href} className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
        {cta.text} →
      </Link>
    </div>
  )
}
```

---

### 2.4 为什么选择我们 (Why Choose Us)

**文件位置：** `web/default/src/features/home/why-choose-us.tsx`

**6 个优势展示：**

```tsx
const advantages = [
  {
    icon: '⚡',
    title: 'High Speed',
    description: 'Average response time < 200ms',
    stat: '10x faster',
    image: '/placeholder-speed-chart.png'
  },
  {
    icon: '💰',
    title: 'Cost Effective',
    description: 'Transparent pricing with no hidden fees',
    stat: '50% savings',
    image: '/placeholder-cost-chart.png'
  },
  {
    icon: '🛡️',
    title: 'Reliable',
    description: '99.99% uptime SLA guarantee',
    stat: '99.99%',
    image: '/placeholder-reliability-chart.png'
  },
  {
    icon: '🧠',
    title: 'Smart Features',
    description: 'Advanced load balancing and failover',
    stat: '40+ models',
    image: '/placeholder-features-chart.png'
  },
  {
    icon: '🔒',
    title: 'Secure',
    description: 'Bank-level encryption and compliance',
    stat: 'ISO 27001',
    image: '/placeholder-security-badge.png'
  },
  {
    icon: '📈',
    title: 'Scalable',
    description: 'Handle millions of requests per day',
    stat: '∞ scale',
    image: '/placeholder-scalability-chart.png'
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose new-api?
          </h2>
          <p className="text-xl text-gray-300">
            Industry-leading performance and reliability
          </p>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, i) => (
            <AdvantageCard key={i} {...advantage} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AdvantageCard({ icon, title, description, stat, image, index }) {
  return (
    <div className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 hover:border-purple-500 transition-all hover:shadow-xl hover:shadow-purple-500/20">
      {/* Icon + Stat */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        <div className="text-right">
          <div className="text-3xl font-bold text-purple-400">{stat}</div>
        </div>
      </div>
      
      {/* Title & Description */}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm mb-6">{description}</p>
      
      {/* Image Placeholder */}
      <ImagePlaceholder
        src={image}
        alt={title}
        className="w-full h-32 bg-gradient-to-br from-purple-600/20 to-purple-900/20 rounded-lg mb-4"
      />
      
      {/* Learn More */}
      <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-semibold inline-flex items-center gap-2">
        Learn more →
      </a>
    </div>
  )
}
```

---

### 2.5 使用场景 (Use Cases / Scenarios)

**文件位置：** `web/default/src/features/home/use-cases.tsx`

**5-6 个场景，左右交替显示：**

```tsx
const useCases = [
  {
    id: 'chatbot',
    title: 'AI Chatbot & Assistant',
    description: 'Build intelligent chatbots with multi-model support and real-time streaming',
    features: [
      'Multi-model support',
      'Real-time streaming',
      'Context management'
    ],
    image: '/placeholder-usecase-chatbot.png',
    cta: 'See Example'
  },
  {
    id: 'content',
    title: 'Content Generation',
    description: 'Generate high-quality content at scale with automatic provider switching',
    features: [
      'Batch processing',
      'Provider failover',
      'Cost optimization'
    ],
    image: '/placeholder-usecase-content.png',
    cta: 'View Guide',
    reversed: true
  },
  // ... more use cases
]

export function UseCases() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Power your AI applications with our platform
          </p>
        </div>
        
        {/* Use Cases */}
        <div className="space-y-16">
          {useCases.map((useCase, i) => (
            <UseCaseCard key={useCase.id} {...useCase} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function UseCaseCard({ title, description, features, image, cta, reversed, index }) {
  return (
    <div className={`flex items-center gap-12 ${reversed ? 'flex-row-reverse' : ''}`}>
      {/* Content (Left or Right based on reversed) */}
      <div className="flex-1">
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>
        
        {/* Features */}
        <ul className="mb-8 space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-purple-500 font-bold">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* CTA */}
        <a href="#" className="text-purple-600 hover:text-purple-700 font-bold inline-flex items-center gap-2">
          {cta} →
        </a>
      </div>
      
      {/* Image Placeholder (Right or Left) */}
      <div className="flex-1">
        <ImagePlaceholder
          src={image}
          alt={title}
          className="w-full h-80 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-950 rounded-lg"
        />
      </div>
    </div>
  )
}
```

---

### 2.6 客户案例 & 合作伙伴 (Customers & Partners)

**文件位置：** `web/default/src/features/home/customers.tsx`

```tsx
const customers = [
  { name: 'Customer 1', logo: '/placeholder-logo-1.png' },
  { name: 'Customer 2', logo: '/placeholder-logo-2.png' },
  { name: 'Customer 3', logo: '/placeholder-logo-3.png' },
  { name: 'Customer 4', logo: '/placeholder-logo-4.png' },
  { name: 'Customer 5', logo: '/placeholder-logo-5.png' },
  { name: 'Customer 6', logo: '/placeholder-logo-6.png' },
  // ... more customers
]

export function Customers() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Trusted by Industry Leaders</h2>
        </div>
        
        {/* Logo Wall */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {customers.map((customer, i) => (
            <div
              key={i}
              className="flex items-center justify-center h-20 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <img
                src={customer.logo}
                alt={customer.name}
                className="max-h-12 max-w-full opacity-70 hover:opacity-100 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

### 2.7 FAQ 部分

**文件位置：** `web/default/src/features/home/faq.tsx`

**使用 Accordion 组件：**

```tsx
const faqs = [
  {
    question: 'How does new-api differ from other API gateways?',
    answer: 'new-api supports 40+ AI providers with automatic failover, real-time streaming, and transparent pricing...'
  },
  {
    question: 'What is the pricing model?',
    answer: 'Pay-as-you-go based on actual usage with no setup fees or monthly minimums...'
  },
  {
    question: 'Can I use my own models?',
    answer: 'Yes, we support custom model deployment with automatic load balancing...'
  },
  // ... more FAQs
]

export function FAQ() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Can't find the answer? Check our documentation or contact support.
          </p>
        </div>
        
        <Accordion>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
```

---

### 2.8 最终 CTA 区域

**文件位置：** `web/default/src/features/home/final-cta.tsx`

```tsx
export function FinalCTA() {
  return (
    <section
      className="relative py-24 text-white overflow-hidden"
      style={{
        backgroundImage: 'url(/placeholder-cta-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 text-center max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-white/80 mb-8">
          Join thousands of developers using new-api for their AI projects
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="primary">
            Get Free API Key
          </Button>
          <Button size="lg" variant="secondary">
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
```

---

## 三、图片占位符列表

需要创建的占位符图片：

```
web/default/public/placeholder/
├── hero/
│   ├── hero-main.svg
│   ├── hero-speed.svg
│   ├── hero-cost.svg
│   └── hero-models.svg
├── products/
│   ├── product-api.svg
│   ├── product-models.svg
│   ├── product-console.svg
│   └── product-docs.svg
├── advantages/
│   ├── speed-chart.svg
│   ├── cost-chart.svg
│   ├── reliability-chart.svg
│   ├── features-chart.svg
│   ├── security-badge.svg
│   └── scalability-chart.svg
├── usecases/
│   ├── usecase-chatbot.svg
│   ├── usecase-content.svg
│   ├── usecase-integration.svg
│   └── usecase-analytics.svg
├── customers/
│   ├── logo-1.svg
│   ├── logo-2.svg
│   └── ... (6+ logos)
├── cta/
│   └── cta-background.svg
└── misc/
    └── gradient-bg.svg
```

**创建占位符的方式：**
1. 使用 SVG 占位符服务（如 `https://via.placeholder.com/800x600`）
2. 或在 public 目录中手动创建简单的 SVG 占位符
3. 后续用真实图片替换

---

## 四、新增组件清单

### 基础组件
- ✅ `ImagePlaceholder` — 带占位符样式的图片容器
- ✅ `Button` — 改进版按钮（已有，可增强）
- ✅ `Card` — 卡片容器
- ✅ `Accordion` — 折叠框（FAQ）

### 特殊组件
- 🆕 `HeroCarousel` — Hero 轮播
- 🆕 `ProductCard` — 产品卡片
- 🆕 `AdvantageCard` — 优势卡片
- 🆕 `UseCaseCard` — 场景卡片
- 🆕 `Navigation` — 改进导航栏

### 布局组件
- 🆕 `ProductMatrix` — 4列网格
- 🆕 `WhyChooseUs` — 优势展示区
- 🆕 `UseCases` — 使用场景
- 🆕 `Customers` — 客户案例
- 🆕 `FAQ` — 常见问题
- 🆕 `FinalCTA` — 最终 CTA

---

## 五、文件结构

```
web/default/src/
├── components/
│   ├── layout/
│   │   └── navigation.tsx (NEW - 改进导航栏)
│   ├── ui/
│   │   ├── image-placeholder.tsx (NEW)
│   │   ├── carousel.tsx (NEW)
│   │   └── ... (existing components)
│   └── ...
├── features/
│   ├── home/
│   │   ├── hero-carousel.tsx (NEW)
│   │   ├── product-matrix.tsx (NEW)
│   │   ├── why-choose-us.tsx (NEW)
│   │   ├── use-cases.tsx (NEW)
│   │   ├── customers.tsx (NEW)
│   │   ├── faq.tsx (NEW)
│   │   ├── final-cta.tsx (NEW)
│   │   └── index.tsx (MODIFY - 导入上述组件)
│   └── ...
├── styles/
│   ├── hero-carousel.css (NEW)
│   └── ... (existing)
└── ...

public/
└── placeholder/ (NEW - 所有占位符图片)
```

---

## 六、实现步骤

### Phase 1: 基础设置 (1-2 天)
- [ ] 创建 `ImagePlaceholder` 组件
- [ ] 创建 `Carousel` 组件
- [ ] 准备占位符图片
- [ ] 改进 `Navigation` 组件

### Phase 2: 首页主体 (3-4 天)
- [ ] 实现 `HeroCarousel`
- [ ] 实现 `ProductMatrix`
- [ ] 实现 `WhyChooseUs`
- [ ] 测试响应式设计

### Phase 3: 增强内容 (2-3 天)
- [ ] 实现 `UseCases`
- [ ] 实现 `Customers`
- [ ] 实现 `FAQ`
- [ ] 实现 `FinalCTA`

### Phase 4: 打磨 (1-2 天)
- [ ] 动画优化 (Framer Motion)
- [ ] 暗色模式调整
- [ ] 性能优化
- [ ] 跨浏览器测试
- [ ] SEO 优化

---

## 七、关键 CSS 样式参考

### 紫色渐变主题
```css
.bg-hero-gradient {
  background: linear-gradient(135deg, #6e29f6 0%, #9333ea 50%, #7c3aed 100%);
}

.text-gradient {
  background: linear-gradient(90deg, #6e29f6, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hover-glow:hover {
  box-shadow: 0 0 24px rgba(139, 51, 234, 0.4);
}
```

### 响应式间距
```css
.container {
  @apply px-4 md:px-6 lg:px-8;
}

.section-spacing {
  @apply py-16 md:py-20 lg:py-24;
}
```

---

## 八、国际化 (i18n)

所有新增文案需要添加到 i18n 翻译文件：

**文件位置：** `web/default/src/i18n/locales/`

**需要翻译的键值：**
```json
{
  "home.hero.title.main": "Unified AI API Platform",
  "home.hero.title.speed": "10x Faster API Response",
  "home.hero.title.cost": "50% Lower Costs",
  "home.hero.title.models": "All Models in One Platform",
  
  "home.products.title": "Complete AI Solution Platform",
  "home.products.api.title": "Unified API",
  "home.products.models.title": "Model Library",
  "home.products.console.title": "Admin Console",
  "home.products.docs.title": "Documentation",
  
  "home.advantages.title": "Why Choose new-api?",
  "home.advantages.speed": "High Speed",
  "home.advantages.cost": "Cost Effective",
  "home.advantages.reliable": "Reliable",
  "home.advantages.smart": "Smart Features",
  "home.advantages.secure": "Secure",
  "home.advantages.scalable": "Scalable",
  
  // ... more keys
}
```

**支持的语言：** en, zh, fr, ru, ja, vi

---

## 九、颜色系统

### 主色调
- **紫色主色：** `#6e29f6` (oklch(0.47 0.26 293))
- **紫色浅色：** `#9333ea` (oklch(0.62 0.20 293))
- **紫色深色：** `#5b21b6` (oklch(0.35 0.18 293))

### 中性色
- **背景：** `#f5f6fa` (light), `#0f172a` (dark)
- **文字：** `#252736` (light), `#f5f6fa` (dark)
- **边框：** `#d5d6ea` (light), `#1e293b` (dark)

---

## 十、性能优化建议

1. **图片优化**
   - 使用 WebP 格式
   - 实现 lazy loading
   - 响应式图片 (srcset)

2. **轮播性能**
   - 使用 `embla-carousel` 或 `swiper.js`
   - 只渲染可见幻灯片
   - 预加载相邻图片

3. **CSS 优化**
   - 使用 Tailwind CSS 树摇
   - 避免过多的自定义 CSS
   - 预加载关键样式

4. **JavaScript 优化**
   - 代码分割
   - 懒加载组件
   - 最小化重排/重绘

---

## 总结

这个设计方案完全按照 SiliconFlow 网站的风格、布局和交互，为 new-api 提供了一个现代化的首页。所有图片位置都用占位符表示，可以后续逐步替换为真实图片。

**关键优势：**
✅ 布局和设计完全对标 SiliconFlow
✅ 所有占位符已标记清晰，便于后续替换
✅ 组件化设计，易于维护
✅ 完整的国际化支持
✅ 响应式设计
✅ 性能优化建议齐全

---

**下一步行动：**
1. 根据本方案创建组件框架
2. 准备占位符图片
3. 逐阶段开发实现
4. 测试和优化
5. 替换真实图片和文案
