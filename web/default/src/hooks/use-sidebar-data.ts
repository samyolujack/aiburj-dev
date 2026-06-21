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
import {
  BarChart3,
  BookOpen,
  Box,
  CreditCard,
  FileText,
  Gift,
  Image,
  Key,
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  MessageSquare,
  Mic,
  Radio,
  ReceiptText,
  ScrollText,
  Settings,
  ShieldCheck,
  Store,
  Ticket,
  User,
  Users,
  Video,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type SidebarData } from '@/components/layout/types'

/**
 * Root navigation groups for the application sidebar.
 *
 * Groups follow the SiliconFlow-inspired structure:
 *   概览 → 体验中心 → 模型服务 → 费用管理 → 账户中心 → 活动运营
 *   → 文档中心 → 工单反馈 → 系统管理（admin only）
 *
 * These are shown when the URL does not match any nested sidebar view
 * registered in `layout/lib/sidebar-view-registry.ts`.
 */
export function useSidebarData(): SidebarData {
  const { t } = useTranslation()

  return {
    navGroups: [
      {
        id: 'overview',
        title: t('概览'),
        items: [
          {
            title: t('Overview'),
            url: '/dashboard/overview',
            icon: LayoutDashboard,
          },
        ],
      },
      {
        id: 'experience',
        title: t('体验中心'),
        items: [
          {
            title: t('文本对话'),
            url: '/playground',
            icon: MessageSquare,
          },
          {
            title: t('图像生成'),
            url: '/image-gen',
            icon: Image,
          },
          {
            title: t('视频生成'),
            url: '/video-gen',
            icon: Video,
          },
          {
            title: t('语音合成'),
            url: '/tts',
            icon: Mic,
          },
        ],
      },
      {
        id: 'models',
        title: t('模型服务'),
        items: [
          {
            title: t('API Keys'),
            url: '/keys',
            icon: Key,
          },
          {
            title: t('模型广场'),
            url: '/pricing',
            icon: Store,
          },
          {
            title: t('Dashboard'),
            url: '/dashboard/models',
            icon: BarChart3,
          },
        ],
      },
      {
        id: 'billing',
        title: t('费用管理'),
        items: [
          {
            title: t('Wallet'),
            url: '/wallet',
            icon: Wallet,
          },
          {
            title: t('费用明细'),
            url: '/billing',
            icon: ReceiptText,
          },
          {
            title: t('发票开具'),
            url: '/invoice',
            icon: FileText,
          },
        ],
      },
      {
        id: 'account',
        title: t('账户中心'),
        items: [
          {
            title: t('Profile'),
            url: '/profile',
            icon: User,
          },
          {
            title: t('实名认证'),
            url: '/verification',
            icon: ShieldCheck,
          },
          {
            title: t('使用日志'),
            url: '/usage-logs/common',
            icon: ScrollText,
          },
          {
            title: t('Task Logs'),
            url: '/usage-logs/task',
            activeUrls: ['/usage-logs/drawing'],
            configUrls: ['/usage-logs/drawing', '/usage-logs/task'],
            icon: ListTodo,
          },
        ],
      },
      {
        id: 'activity',
        title: t('活动运营'),
        items: [
          {
            title: t('推荐计划'),
            url: '/wallet',
            icon: Gift,
          },
          {
            title: t('邀请记录'),
            url: '/activity/invites',
            icon: Users,
          },
        ],
      },
      {
        id: 'docs',
        title: t('文档中心'),
        items: [
          {
            title: t('文档中心'),
            url: '/docs',
            icon: BookOpen,
          },
        ],
      },
      {
        id: 'tickets',
        title: t('工单反馈'),
        items: [
          {
            title: t('工单反馈'),
            url: '/tickets',
            icon: MessageCircle,
          },
        ],
      },
      {
        id: 'admin',
        title: t('系统管理'),
        items: [
          {
            title: t('Channels'),
            url: '/channels',
            icon: Radio,
          },
          {
            title: t('Models'),
            url: '/models/metadata',
            icon: Box,
          },
          {
            title: t('Users'),
            url: '/users',
            icon: Users,
          },
          {
            title: t('Redemption Codes'),
            url: '/redemption-codes',
            icon: Ticket,
          },
          {
            title: t('Subscription Management'),
            url: '/subscriptions',
            icon: CreditCard,
          },
          {
            title: t('System Settings'),
            url: '/system-settings/site',
            activeUrls: ['/system-settings'],
            icon: Settings,
          },
        ],
      },
    ],
  }
}
