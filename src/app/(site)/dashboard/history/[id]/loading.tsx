export default function HistoryDetailLoading() {
  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-gray-100" />
        <div className="rounded-lg bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
          <div className="h-6 w-64 rounded bg-gray-200" />
          <div className="h-24 rounded-xl bg-gray-100" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 rounded-lg bg-gray-100" />
            <div className="h-32 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
