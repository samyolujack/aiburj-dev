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
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import {
  SettingsControlChildren,
  SettingsForm,
  SettingsSwitchContent,
  SettingsControlGroup,
  SettingsSwitchItem,
} from '../components/settings-form-layout'
import { SettingsPageFormActions } from '../components/settings-page-context'
import { SettingsSection } from '../components/settings-section'
import { useUpdateOption } from '../hooks/use-update-option'
import {
  SIDEBAR_MODULES_DEFAULT,
  type SidebarModulesAdminConfig,
  serializeSidebarModulesAdmin,
} from './config'

type SidebarModulesSectionProps = {
  config: SidebarModulesAdminConfig
  initialSerialized: string
}

type SidebarFormValues = SidebarModulesAdminConfig

const toTitleCase = (value: string) =>
  value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

export function SidebarModulesSection({
  config,
  initialSerialized,
}: SidebarModulesSectionProps) {
  const { t } = useTranslation()
  const updateOption = useUpdateOption()

  const sectionMeta: Record<string, { title: string; description: string }> = {
    overview: {
      title: t('概览'),
      description: t('Usage overview and setup guide.'),
    },
    experience: {
      title: t('体验中心'),
      description: t('AI model playground: text, images, video, and voice.'),
    },
    models: {
      title: t('模型服务'),
      description: t('API keys, model marketplace, and usage dashboard.'),
    },
    billing: {
      title: t('费用管理'),
      description: t('Balance top-up, billing details, and invoice requests.'),
    },
    account: {
      title: t('账户中心'),
      description: t('Profile settings, usage logs, and task history.'),
    },
    activity: {
      title: t('活动运营'),
      description: t('Referral program and invitation records.'),
    },
    docs: {
      title: t('文档中心'),
      description: t('Quick link to documentation center.'),
    },
    tickets: {
      title: t('工单反馈'),
      description: t('Submit feedback and support tickets.'),
    },
    admin: {
      title: t('系统管理'),
      description: t('Global configuration and administrative tools.'),
    },
  }

  const moduleMeta: Record<
    string,
    Record<string, { title: string; description: string }>
  > = {
    overview: {
      dashboard: {
        title: t('Overview'),
        description: t('Usage overview and quick-start guide.'),
      },
    },
    experience: {
      text: {
        title: t('文本对话'),
        description: t('Interactive AI conversation with model parameter tuning.'),
      },
      image: {
        title: t('图像生成'),
        description: t('Create images from text prompts with adjustable parameters.'),
      },
      video: {
        title: t('视频生成'),
        description: t('Generate videos from text descriptions with async task tracking.'),
      },
      tts: {
        title: t('语音合成'),
        description: t('Convert text to natural speech with voice selection.'),
      },
    },
    models: {
      keys: {
        title: t('API Keys'),
        description: t('Create, revoke, and audit API tokens.'),
      },
      pricing: {
        title: t('模型广场'),
        description: t('Browse and compare available AI models.'),
      },
      dashboard: {
        title: t('数据看板'),
        description: t('Aggregated usage metrics and trend charts.'),
      },
    },
    billing: {
      wallet: {
        title: t('Wallet'),
        description: t('Top up balance and view billing history.'),
      },
      detail: {
        title: t('费用明细'),
        description: t('Detailed consumption records and cost breakdown.'),
      },
      invoice: {
        title: t('发票开具'),
        description: t('Request and download invoices.'),
      },
    },
    account: {
      profile: {
        title: t('Profile'),
        description: t('Personal settings and profile management.'),
      },
      verification: {
        title: t('实名认证'),
        description: t('Real-name verification for API key access.'),
      },
      logs: {
        title: t('使用日志'),
        description: t('Detailed request logs for investigations.'),
      },
      tasks: {
        title: t('任务日志'),
        description: t('Background job tracker for queued work.'),
      },
    },
    activity: {
      referral: {
        title: t('推荐计划'),
        description: t('Invite friends and earn rewards.'),
      },
      invites: {
        title: t('邀请记录'),
        description: t('View invitation history and reward details.'),
      },
    },
    docs: {
      docs: {
        title: t('文档中心'),
        description: t('Quick access to platform documentation.'),
      },
    },
    tickets: {
      tickets: {
        title: t('工单反馈'),
        description: t('Submit and track support tickets.'),
      },
    },
    admin: {
      channel: {
        title: t('Channels'),
        description: t('Configure upstream providers and routing.'),
      },
      models: {
        title: t('Models'),
        description: t('Manage catalog visibility and pricing.'),
      },
      redemption: {
        title: t('Redeem codes'),
        description: t('Create and review invite or credit codes.'),
      },
      user: {
        title: t('Users'),
        description: t('Administer user accounts and roles.'),
      },
      setting: {
        title: t('System settings'),
        description: t('Advanced platform configuration.'),
      },
      subscription: {
        title: t('Subscription Management'),
        description: t('Manage subscription plans and pricing.'),
      },
    },
  }
  const formDefaults = useMemo(() => config, [config])

  const form = useForm<SidebarFormValues>({
    defaultValues: formDefaults,
  })

  useEffect(() => {
    form.reset(formDefaults)
  }, [formDefaults, form])

  const onSubmit = async (values: SidebarFormValues) => {
    const serialized = serializeSidebarModulesAdmin(values)
    if (serialized === initialSerialized) {
      return
    }

    await updateOption.mutateAsync({
      key: 'SidebarModulesAdmin',
      value: serialized,
    })
  }

  const resetToDefault = () => {
    form.reset(SIDEBAR_MODULES_DEFAULT)
  }

  const sections = Object.entries(config)

  return (
    <SettingsSection title={t('Sidebar modules')}>
      <Form {...form}>
        <SettingsForm onSubmit={form.handleSubmit(onSubmit)}>
          <SettingsPageFormActions
            onSave={form.handleSubmit(onSubmit)}
            onReset={resetToDefault}
            isSaving={updateOption.isPending}
            resetLabel='Reset to default'
            saveLabel='Save sidebar modules'
          />
          {sections.map(([sectionKey, sectionConfig]) => {
            const sectionInfo = sectionMeta[sectionKey] ?? {
              title: toTitleCase(sectionKey),
              description: t('Custom sidebar section'),
            }
            const modules = Object.entries(sectionConfig).filter(
              ([moduleKey]) => moduleKey !== 'enabled'
            )

            return (
              <SettingsControlGroup key={sectionKey}>
                <FormField
                  control={form.control}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={`${sectionKey}.enabled` as any}
                  render={({ field }) => (
                    <SettingsSwitchItem>
                      <SettingsSwitchContent>
                        <FormLabel>{sectionInfo.title}</FormLabel>
                        <FormDescription>
                          {sectionInfo.description}
                        </FormDescription>
                      </SettingsSwitchContent>
                      <FormControl>
                        <Switch
                          checked={Boolean(field.value)}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </SettingsSwitchItem>
                  )}
                />

                <SettingsControlChildren className='grid gap-3 md:grid-cols-2'>
                  {modules.map(([moduleKey]) => {
                    const moduleInfo = moduleMeta[sectionKey]?.[moduleKey] ?? {
                      title: toTitleCase(moduleKey),
                      description: t('Custom module'),
                    }
                    return (
                      <FormField
                        key={`${sectionKey}.${moduleKey}`}
                        control={form.control}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        name={`${sectionKey}.${moduleKey}` as any}
                        render={({ field }) => (
                          <SettingsSwitchItem className='border-b-0 py-2'>
                            <SettingsSwitchContent>
                              <FormLabel>{moduleInfo.title}</FormLabel>
                              <FormDescription>
                                {moduleInfo.description}
                              </FormDescription>
                            </SettingsSwitchContent>
                            <FormControl>
                              <Switch
                                checked={Boolean(field.value)}
                                onCheckedChange={field.onChange}
                                disabled={
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  !form.watch(`${sectionKey}.enabled` as any)
                                }
                              />
                            </FormControl>
                          </SettingsSwitchItem>
                        )}
                      />
                    )
                  })}
                </SettingsControlChildren>
              </SettingsControlGroup>
            )
          })}
        </SettingsForm>
      </Form>
    </SettingsSection>
  )
}
