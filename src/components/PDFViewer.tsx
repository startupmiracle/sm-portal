export default function PDFViewer({ src }: { src?: string | null }) {
  if (!src) return null
  return (
    <div className="w-full overflow-hidden rounded-2xl border">
      <iframe className="h-[70vh] w-full" src={src} title="PDF" />
    </div>
  )
}

