# new-api 前端重设计 - 实现指南

## 📋 已创建的文件清单

### 1. 设计文档
- **FRONTEND_REDESIGN_SILICONFLOW_STYLE.md** — 完整的设计规范和实现方案

### 2. 新增组件

#### 基础组件
```
web/default/src/components/ui/image-placeholder.tsx
├── ImagePlaceholder - 图片占位符组件
└── getPlaceholderUrl() - 快速生成占位符 URL
```

#### 页面组件
```
web/default/src/features/home/
├── hero-carousel.tsx - Hero 轮播（4 个 slides）
├── product-matrix.tsx - 产品矩阵（4 列网格）
├── why-choose-us.tsx - 优势展示（3 列网格，6 个优势）
└── index-new.tsx - 改进的首页（集成所有组件）
```

---

## 🚀 快速开始

### 第 1 步：将新首页集成到路由

**编辑：** `web/default/src/routes/index.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Home } from '@/features/home/index-new'  // ← 改这里

export const Route = createFileRoute('/')({
  component: Home,
})
```

### 第 2 步：测试组件

在浏览器中访问首页：
```
http://localhost:5173/
```

你应该看到：
1. ✅ Hero Carousel (4 个轮播 slide)
2. ✅ Product Matrix (4 个产品卡片)
3. ✅ Why Choose Us (6 个优势卡片)
4. ✅ Placeholder sections (待开发部分)
5. ✅ Final CTA 区域

---

## 📸 图片占位符替换指南

### 当前占位符方案

所有图片默认使用 `https://via.placeholder.com` 服务生成。你可以：

1. **保持现状** — via.placeholder 会自动生成占位符
2. **使用本地占位符** — 在 `public/placeholder/` 中添加 SVG 文件
3. **使用真实图片** — 直接替换 URL

### 自定义占位符步骤

#### 创建本地占位符目录
```bash
mkdir -p public/placeholder/{hero,products,advantages,usecases,customers,cta}
```

#### 创建简单的 SVG 占位符
**文件：** `public/placeholder/products/product-api.svg`

```xml
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9333ea;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#6e29f6;stop-opacity:0.3" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#grad)" />
  <text x="200" y="150" font-size="32" text-anchor="middle" fill="#6e29f6" font-weight="bold">
    API Product
  </text>
</svg>
```

#### 在组件中使用本地占位符

**改进 hero-carousel.tsx：**
```tsx
import { getPlaceholderUrl } from '@/components/ui/image-placeholder'

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'unified-api',
    // ... 其他属性 ...
    image: '/placeholder/hero/hero-unified-api.svg', // ← 使用本地文件
  },
  // ...
]
```

---

## 🎨 国际化文案补充

### 添加缺失的翻译

**编辑：** `web/default/src/i18n/locales/en.json`

```json
{
  "home": {
    "hero": {
      "title": {
        "main": "Unified AI API Platform",
        "speed": "10x Faster API Response",
        "cost": "50% Lower Costs",
        "models": "All AI Models in One Place"
      },
      "subtitle": {
        "main": "Connect to 40+ AI providers with a single API endpoint",
        "speed": "Optimized infrastructure with average response time < 200ms",
        "cost": "Transparent pricing with automatic provider optimization",
        "models": "ChatGPT, Claude, Gemini, LLaMA, and 40+ more"
      }
    },
    "products": {
      "title": "Complete AI Solution Platform",
      "subtitle": "Everything you need to integrate AI into your applications",
      "api": {
        "title": "Unified API",
        "description": "Single endpoint to access 40+ AI providers and models"
      },
      "models": {
        "title": "Model Library",
        "description": "Extensive collection of cutting-edge AI models"
      },
      "console": {
        "title": "Admin Console",
        "description": "Complete management platform with real-time analytics"
      },
      "docs": {
        "title": "Documentation",
        "description": "Comprehensive guides, tutorials, and API reference"
      }
    },
    "advantages": {
      "title": "Why Choose new-api?",
      "subtitle": "Industry-leading performance, reliability, and innovation",
      "speed": "High Speed",
      "cost": "Cost Effective",
      "reliable": "Reliable",
      "smart": "Comprehensive",
      "secure": "Secure",
      "scalable": "Scalable"
    },
    "cta": {
      "title": "Ready to Build with AI?",
      "subtitle": "Join thousands of developers using new-api to power their AI applications. Get started in minutes."
    }
  }
}
```

**同样编辑** `zh.json`, `fr.json`, `ru.json`, `ja.json`, `vi.json`

---

## 🔧 常见自定义需求

### 1. 修改 Hero Carousel 的内容

**文件：** `web/default/src/features/home/hero-carousel.tsx`

```tsx
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'your-slide-id',
    title: 'Your Title',
    subtitle: 'Your subtitle',
    cta1: { text: 'Button 1', href: '/path' },
    cta2: { text: 'Button 2', href: '/path' },
    image: 'your-image-url',
    icon: '🎯', // 任意 emoji
  },
  // ... 添加更多 slides
]
```

### 2. 修改产品卡片

**文件：** `web/default/src/features/home/product-matrix.tsx`

```tsx
const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'your-product',
    icon: '🚀',
    title: 'Your Product Name',
    description: 'Product description',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    image: 'your-image-url',
    cta: { text: 'Button Text', href: '/path' },
  },
  // ...
]
```

### 3. 修改优势卡片

**文件：** `web/default/src/features/home/why-choose-us.tsx`

```tsx
const DEFAULT_ADVANTAGES: AdvantageItem[] = [
  {
    id: 'your-advantage',
    icon: '⭐',
    title: 'Your Advantage Title',
    description: 'Description',
    stat: '99%',
    statLabel: 'uptime',
    image: 'your-image-url',
  },
  // ...
]
```

### 4. 修改颜色主题

**文件：** `web/default/src/styles/theme.css`

```css
/* 修改主色调 */
--primary: oklch(0.47 0.26 293); /* 改这里 */

/* 或在 theme-presets.css 中创建新的紫色渐变主题 */
[data-theme-preset='purple-gradient'] {
  --primary: oklch(0.52 0.28 293);
  --secondary: oklch(0.62 0.20 293);
  /* ... 更多颜色定义 */
}
```

---

## 📝 后续开发清单

### 已完成 ✅
- [x] Hero Carousel 组件
- [x] Product Matrix 组件
- [x] Why Choose Us 组件
- [x] Image Placeholder 组件
- [x] 改进的首页布局

### 待开发 ⏳
- [ ] **Use Cases 组件** — 左右交替布局展示 5-6 个使用场景
- [ ] **Customers 组件** — 客户 logo 墙和案例展示
- [ ] **FAQ 组件** — Accordion 形式的常见问题
- [ ] **Navigation 优化** — 改进导航栏设计
- [ ] **Footer 优化** — 改进页脚设计
- [ ] **动画优化** — Framer Motion 或 CSS 动画
- [ ] **性能优化** — 图片懒加载、代码分割等

### 图片替换待办 📸
- [ ] `/placeholder/hero/` — 4 张 Hero 图片
- [ ] `/placeholder/products/` — 4 张产品图片
- [ ] `/placeholder/advantages/` — 6 张优势图片
- [ ] `/placeholder/usecases/` — 5-6 张场景图片
- [ ] `/placeholder/customers/` — 6+ 个客户 logo
- [ ] `/placeholder/cta/` — 最终 CTA 背景图

---

## 🧪 测试清单

### 功能测试
- [ ] Hero Carousel 自动播放
- [ ] Hero Carousel 手动切换（点击指示器）
- [ ] 响应式设计（桌面、平板、手机）
- [ ] 暗色模式切换
- [ ] 图片占位符显示正确
- [ ] CTA 按钮链接正确

### 性能测试
- [ ] Lighthouse 性能评分 > 80
- [ ] First Contentful Paint < 2s
- [ ] Cumulative Layout Shift < 0.1

### 浏览器兼容性
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 💡 贴士和最佳实践

### 1. 保持一致性
- 所有图片尽量使用相同的宽高比
- 使用一致的调色板和字体
- 保持间距和对齐的一致性

### 2. 性能优化
```tsx
// 使用 React.lazy 进行代码分割
const HeroCarousel = lazy(() => import('./hero-carousel'))
const ProductMatrix = lazy(() => import('./product-matrix'))

// 在 index-new.tsx 中：
<Suspense fallback={<HeroSkeletonLoading />}>
  <HeroCarousel />
</Suspense>
```

### 3. 国际化最佳实践
```tsx
// 始终使用 useTranslation() hook
const { t } = useTranslation()

// 提供默认值以防翻译缺失
<h2>{t('home.products.title') || 'Default Title'}</h2>
```

### 4. 无障碍（Accessibility）
```tsx
// 为轮播按钮添加 aria-label
<button aria-label="Next slide">→</button>

// 为装饰性元素添加 role="img"
<span role="img">{icon}</span>
```

---

## 🔗 相关文件链接

- [设计规范文档](./FRONTEND_REDESIGN_SILICONFLOW_STYLE.md)
- [ImagePlaceholder 组件](./web/default/src/components/ui/image-placeholder.tsx)
- [HeroCarousel 组件](./web/default/src/features/home/hero-carousel.tsx)
- [ProductMatrix 组件](./web/default/src/features/home/product-matrix.tsx)
- [WhyChooseUs 组件](./web/default/src/features/home/why-choose-us.tsx)
- [改进的首页](./web/default/src/features/home/index-new.tsx)

---

## 📞 需要帮助？

### 常见问题

**Q: 如何修改轮播速度？**
A: 在 `hero-carousel.tsx` 中，修改 `autoPlayInterval` 属性（毫秒）：
```tsx
<HeroCarousel autoPlayInterval={3000} /> // 3 秒
```

**Q: 如何隐藏轮播指示器？**
A: 
```tsx
<HeroCarousel showIndicators={false} />
```

**Q: 如何修改产品卡片数量？**
A: 修改 `DEFAULT_PRODUCTS` 数组，或传递自定义的 `products` prop

**Q: 如何使用本地图片而不是占位符？**
A: 直接修改图片 URL，从 `https://via.placeholder.com/...` 改为你的本地路径 `/placeholder/...`

---

## 下一步行动

1. ✅ **集成新首页** — 修改 `routes/index.tsx`
2. ✅ **测试页面** — 在浏览器中访问首页
3. ✅ **添加翻译** — 补充各语言的 i18n 文案
4. ⏳ **开发缺失组件** — Use Cases, Customers, FAQ
5. ⏳ **替换占位符图片** — 准备真实图片
6. ⏳ **优化性能** — 代码分割、图片优化
7. ⏳ **测试和打磨** — 跨浏览器、响应式、无障碍

---

**预期结果：**
一个现代、专业的首页，设计风格对标 SiliconFlow，用户体验优秀，转化率更高！ 🚀
