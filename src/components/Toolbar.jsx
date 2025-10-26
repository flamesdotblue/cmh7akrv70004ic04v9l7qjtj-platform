import { Plus, StickyNote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Toolbar({ canPrev, canNext, onPrev, onNext, addStickyMode, setAddStickyMode, onAddPage }) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur border-b border-amber-200 bg-amber-50/70">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-white/80 px-3 py-2 text-sm shadow-sm disabled:opacity-40 hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-white/80 px-3 py-2 text-sm shadow-sm disabled:opacity-40 hover:bg-white"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setAddStickyMode((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm ${
            addStickyMode
              ? 'border-amber-600 bg-amber-200/80'
              : 'border-amber-300 bg-white/80 hover:bg-white'
          }`}
        >
          <StickyNote className="h-4 w-4" /> {addStickyMode ? 'Click on page to place' : 'Add Sticky'}
        </button>
        <button
          onClick={onAddPage}
          className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-white/80 px-3 py-2 text-sm shadow-sm hover:bg-white"
        >
          <Plus className="h-4 w-4" /> Page
        </button>
      </div>
    </div>
  );
}
