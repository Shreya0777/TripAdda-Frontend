// A small, reusable spinner for routes that need to wait on the auth
// check before deciding what to render — used instead of a bare
// "Loading..." line.
export default function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      <p className="text-sm text-mutedText">Just a moment…</p>
    </div>
  );
}