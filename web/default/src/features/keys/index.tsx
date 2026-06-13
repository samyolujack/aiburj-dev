import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Copy, Check, Trash2, Plus, Loader2, Eye, EyeOff, Key } from 'lucide-react'
import { toast } from 'sonner'
import { SectionPageLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { getApiKeys, createApiKey, deleteApiKey, fetchTokenKey } from './api'

function maskKey(key: string) {
  if (!key) return 'sk-****'
  return `sk-${key.slice(0, 4)}${'*'.repeat(Math.min(12, key.length))}`
}

function formatTime(ts: number) {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export function ApiKeys() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyResult, setNewKeyResult] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [resolvingId, setResolvingId] = useState<number | null>(null)
  const [resolvedKeys, setResolvedKeys] = useState<Record<number,string>>({})
  const [visibleKeys, setVisibleKeys] = useState<Record<number,boolean>>({})

  const { data: keys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const res = await getApiKeys({ p: 1, size: 50 })
      return res?.items || []
    },
  })

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      return createApiKey({ name, remain_quota: 0, expired_time: -1, unlimited_quota: false, model_limits_enabled: false, allow_ips: null, group: '', models: [] } as any)
    },
    onSuccess: (res: any) => {
      setNewKeyResult(res?.data?.key || '')
      qc.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  })

  const handleToggleKey = useCallback(async (id: number) => {
    if (visibleKeys[id]) {
      setVisibleKeys(prev => ({ ...prev, [id]: false }))
      return
    }
    if (resolvedKeys[id]) {
      setVisibleKeys(prev => ({ ...prev, [id]: true }))
      return
    }
    setResolvingId(id)
    try {
      const res: any = await fetchTokenKey(id)
      const key = res?.data?.key || ''
      setResolvedKeys(prev => ({ ...prev, [id]: key }))
      setVisibleKeys(prev => ({ ...prev, [id]: true }))
    } catch { toast.error('获取失败') }
    finally { setResolvingId(null) }
  }, [visibleKeys, resolvedKeys])

  const handleCopy = useCallback(async (id: number) => {
    const key = resolvedKeys[id]
    if (!key) {
      setResolvingId(id)
      try {
        const res: any = await fetchTokenKey(id)
        const k = res?.data?.key || ''
        setResolvedKeys(prev => ({ ...prev, [id]: k }))
        await navigator.clipboard.writeText(k)
      } catch { toast.error('复制失败'); return }
      finally { setResolvingId(null) }
    } else {
      await navigator.clipboard.writeText(key)
    }
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('已复制')
  }, [resolvedKeys])

  return (
    <>
    <SectionPageLayout>
      <SectionPageLayout.Title>API 密钥</SectionPageLayout.Title>
      <SectionPageLayout.Actions>
        <Button onClick={() => { setShowCreate(true); setNewKeyName(''); setNewKeyResult('') }}
          style={{ background: '#004A8F', borderRadius: 10, height: 42, padding: '0 28px', fontSize: 15, fontWeight: 600 }}>
          <Plus size={18} style={{ marginRight: 6 }} />新建 API 密钥
        </Button>
      </SectionPageLayout.Actions>
      <SectionPageLayout.Content>
        <div style={{ background: '#F0F4FA', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#4A6A8A' }}>
          <Key size={16} />
          请妥善保管您的 API 密钥，不要泄露给他人。如果密钥泄露，请立即删除并创建新的密钥。
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-[72px] w-full rounded-xl" />)}
          </div>
        ) : !keys || keys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: '#F0F4FA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Key size={32} color="#004A8F" />
            </div>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#002060', marginBottom: 8 }}>暂无 API 密钥</p>
            <p style={{ fontSize: 14, color: '#4A6A8A', marginBottom: 28 }}>创建 API 密钥后即可调用 aiburj 的所有模型</p>
            <Button onClick={() => setShowCreate(true)} style={{ background: '#004A8F', borderRadius: 10, height: 42, padding: '0 28px', fontSize: 15, fontWeight: 600 }}>
              <Plus size={16} style={{ marginRight: 6 }} />创建 API 密钥
            </Button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF2', overflow: 'hidden' }}>
            {keys.map((k: any, i: number) => (
              <div key={k.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 24px', borderBottom: i < keys.length - 1 ? '1px solid #E8ECF2' : 'none',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#002060' }}>{k.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <code style={{
                        fontSize: 13, color: '#4A6A8A', fontFamily: 'SF Mono, Menlo, monospace',
                        background: '#F0F4FA', padding: '2px 10px', borderRadius: 6, letterSpacing: '0.3px'
                      }}>
                        {visibleKeys[k.id] && resolvedKeys[k.id] ? resolvedKeys[k.id] : maskKey(k.key)}
                      </code>
                      <button onClick={() => handleToggleKey(k.id)} disabled={resolvingId === k.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#4A6A8A', display: 'flex' }}>
                        {resolvingId === k.id ? <Loader2 size={15} className="animate-spin" /> :
                          visibleKeys[k.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => handleCopy(k.id)} disabled={resolvingId === k.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: copiedId === k.id ? '#10B981' : '#4A6A8A', display: 'flex' }}>
                        {copiedId === k.id ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, color: '#4A6A8A' }}>{formatTime(k.created_time)}</span>
                  <Button variant="ghost" size="icon" style={{ color: '#EF4444', opacity: 0.6 }}
                    onClick={() => { if (confirm('确定删除该 API 密钥？删除后无法恢复。')) deleteMutation.mutate(k.id) }}>
                    <Trash2 size={17} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionPageLayout.Content>
    </SectionPageLayout>

    {/* Create Dialog — outside SectionPageLayout so it's not filtered out */}
    <Dialog open={showCreate} onOpenChange={(o) => { setShowCreate(o); if (!o) setNewKeyResult('') }}>
      <DialogContent style={{ borderRadius: 16, maxWidth: 460, padding: 32 }}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: 20, fontWeight: 700 }}>新建 API 密钥</DialogTitle>
        </DialogHeader>
        {newKeyResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#FFF3E0', border: '1px solid #FFCC80', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#E65100', lineHeight: 1.6 }}>
              ⚠️ 请立即复制并保存此密钥，关闭后将<b>无法再次查看</b>完整密钥。
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Input readOnly value={newKeyResult} style={{ fontFamily: 'SF Mono, monospace', fontSize: 13, background: '#F0F4FA', borderRadius: 10 }} />
              <Button onClick={() => { navigator.clipboard.writeText(newKeyResult); toast.success('已复制') }}
                style={{ background: '#004A8F', borderRadius: 10, flexShrink: 0, padding: '0 14px' }}>
                <Copy size={15} style={{ marginRight: 4 }} />复制
              </Button>
            </div>
            <Button variant="outline" onClick={() => { setShowCreate(false); setNewKeyResult('') }}
              style={{ borderRadius: 10, width: '100%' }}>完成</Button>
          </div>
        ) : (
          <>
            <Input placeholder="密钥名称，例如：生产环境" value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              style={{ borderRadius: 10, height: 46, fontSize: 15 }} autoFocus />
            <DialogFooter style={{ marginTop: 16 }}>
              <Button variant="outline" onClick={() => setShowCreate(false)} style={{ borderRadius: 10 }}>取消</Button>
              <Button onClick={() => createMutation.mutate(newKeyName || '默认密钥')} disabled={createMutation.isPending}
                style={{ background: '#004A8F', borderRadius: 10, fontWeight: 600 }}>
                {createMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : '创建'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
