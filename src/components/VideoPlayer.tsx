export default function VideoPlayer({ src }: { src?: string | null }) {
  if (!src) return null
  const isEmbed = src.includes('vimeo.com') || src.includes('youtube.com') || src.includes('wistia')
  if (isEmbed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl">
        <iframe className="h-full w-full" src={src} allow="autoplay; fullscreen; picture-in-picture" />
      </div>
    )
  }
  return (
    <video className="w-full rounded-2xl" src={src} controls preload="metadata"/>
  )
}

