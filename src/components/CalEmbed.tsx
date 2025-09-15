import Cal from '@calcom/embed-react'

export default function CalEmbed({ link }: { link: string }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <Cal calLink={link} style={{ height: '70vh', width: '100%', border: 0 }} />
    </div>
  )
}
