interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl">
        ⚠️
      </div>
      <div>
        <p className="font-semibold text-slate-700">Something went wrong</p>
        <p className="mt-1 text-sm text-slate-400">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-medium text-white
                   hover:bg-slate-700 active:scale-95 transition-all"
      >
        Retry
      </button>
    </div>
  );
}
