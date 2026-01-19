export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-border border-t-emerald-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-semibold">Loading application form...</p>
      </div>
    </div>
  )
}
