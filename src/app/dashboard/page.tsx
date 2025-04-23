export default function Page() {
  return (
    <div className="mx-auto flex max-h-screen w-full items-center p-4">
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video animate-pulse rounded-xl bg-muted/50" />
          <div className="aspect-video animate-pulse rounded-xl bg-muted/50" />
          <div className="aspect-video animate-pulse rounded-xl bg-muted/50" />
        </div>
        <div className="mb-2 aspect-video h-full max-h-[500px] animate-pulse rounded-xl bg-muted/50"></div>
      </div>
    </div>
  )
}
