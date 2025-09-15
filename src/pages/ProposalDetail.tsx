import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getMemberships, getProposalDetail } from '@/lib/db'
import type { Deliverable, ProposalSection, Proposal } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Markdown from '@/components/Markdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CalEmbed from '@/components/CalEmbed'
import { supabase } from '@/lib/supabase'

export default function ProposalDetail() {
  const { org = '', slug = '' } = useParams()
  const [params] = useSearchParams()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [sections, setSections] = useState<ProposalSection[]>([])
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [shareInvalid, setShareInvalid] = useState(false)
  const [source, setSource] = useState<'share' | 'member' | 'none'>('none')
  const [isOwner, setIsOwner] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied'>('idle')
  const [disableState, setDisableState] = useState<'idle' | 'working' | 'done'>('idle')

  useEffect(() => {
    getProposalDetail(org, slug, { share: params.get('share') }).then((res) => {
      setProposal(res.proposal)
      setSections(res.sections)
      setDeliverables(res.deliverables)
      setShareInvalid(!!res.shareInvalid)
      setSource(res.source)
    })
  }, [org, slug, params])

  useEffect(() => {
    async function checkOwner() {
      if (!proposal) return
      const { data } = await supabase.auth.getUser()
      if (!data.user) return setIsOwner(false)
      const { data: isOwnerBool, error } = await supabase.rpc('is_owner', { p_org_id: proposal.org_id })
      if (error) {
        console.error(error)
        setIsOwner(false)
      } else {
        setIsOwner(!!isOwnerBool)
      }
    }
    checkOwner()
  }, [proposal])

  const calLink = useMemo(() => `https://cal.com/${import.meta.env.VITE_CAL_LINK}?embed=1&layout=month_view`, [])
  const stripeLink = useMemo(() => 'https://buy.stripe.com/5kQ9AU4NQ0xA6UB3cl0kE0o', [])

  if (!proposal) {
    if (params.get('share') && shareInvalid) {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Invalid or expired share link. Please request a new link or sign in to view this proposal.
        </div>
      )
    }
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  return (
    <div className="grid gap-6">
      {shareInvalid && source === 'member' && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          The share link provided is invalid. Showing your member view instead.
        </div>
      )}
      <Card className="bg-gradient-to-br from-sky-50 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">{proposal.title}</CardTitle>
              <CardDescription>Proposal for {org}</CardDescription>
            </div>
            <Badge variant={proposal.status === 'approved' ? 'success' : 'secondary'}>{proposal.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Markdown>{proposal.summary_md}</Markdown>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={stripeLink} target="_blank" rel="noreferrer">
              <Button>Approve & Start</Button>
            </a>
            <a href="#book-call">
              <Button variant="outline">Book Exec Kickoff</Button>
            </a>
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!proposal) return
                    try {
                      setCopyState('copying')
                      let token = proposal.share_token
                      if (!token) {
                        token = Math.random().toString(36).slice(2)
                        const { error } = await supabase
                          .from('proposals')
                          .update({ share_token: token })
                          .eq('id', proposal.id)
                        if (error) throw error
                        setProposal({ ...proposal, share_token: token })
                      }
                      const shareUrl = `${window.location.origin}/c/${org}/proposals/${slug}?share=${token}`
                      await navigator.clipboard.writeText(shareUrl)
                      setCopyState('copied')
                      setTimeout(() => setCopyState('idle'), 2000)
                    } catch (e: any) {
                      alert(e.message ?? 'Failed to copy link')
                      setCopyState('idle')
                    }
                  }}
                  disabled={copyState === 'copying'}
                >
                  {copyState === 'copied' ? 'Copied!' : 'Copy Public Link'}
                </Button>
                {proposal?.share_token && (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!proposal) return
                      try {
                        setDisableState('working')
                        const { error } = await supabase
                          .from('proposals')
                          .update({ share_token: null })
                          .eq('id', proposal.id)
                        if (error) throw error
                        setProposal({ ...proposal, share_token: null })
                        setDisableState('done')
                        setTimeout(() => setDisableState('idle'), 1500)
                      } catch (e: any) {
                        alert(e.message ?? 'Failed to disable link')
                        setDisableState('idle')
                      }
                    }}
                    disabled={disableState === 'working'}
                  >
                    {disableState === 'done' ? 'Disabled' : 'Disable Public Link'}
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sections.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown>{s.body_md}</Markdown>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deliverables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {deliverables.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>{d.title}</div>
                <Badge variant={d.status === 'done' ? 'success' : d.status === 'in_progress' ? 'secondary' : 'outline'}>
                  {d.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card id="book-call">
        <CardHeader>
          <CardTitle>Book Executive Kickoff</CardTitle>
          <CardDescription>Pick a time that works for you</CardDescription>
        </CardHeader>
        <CardContent>
          <CalEmbed link={import.meta.env.VITE_CAL_LINK} />
        </CardContent>
      </Card>
    </div>
  )
}
