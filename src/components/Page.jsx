import { useRef } from 'react';
import StickyNote from './StickyNote';

export default function Page({ side, page, addStickyMode, onAddStickyAt, onUpdateNote, onDeleteNote, onBringNoteToFront }) {
  const containerRef = useRef(null);

  const handlePageClick = (e) => {
    if (!addStickyMode || !page || page.blank) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    onAddStickyAt(page.id, clamp(px, 0, 95), clamp(py, 0, 95));
  };

  return (
    <div ref={containerRef} className="absolute inset-0 p-6 md:p-8 select-none" onClick={handlePageClick}>
      {!page?.blank && (
        <div className="h-full w-full relative">
          <header className="flex items-baseline justify-between text-stone-500 pb-2 border-b border-amber-200">
            <h3 className="font-serif text-lg md:text-xl tracking-wide">{page.title}</h3>
            <span className="text-xs md:text-sm">{page.date}</span>
          </header>
          <div className="prose prose-stone max-w-none pt-3 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-["IBM Plex Sans",_ui-sans-serif]">
            {page.content || 'Write your diary entry here...'}
          </div>

          {/* ruled lines effect */}
          <div className="pointer-events-none absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="border-b border-amber-300/50" style={{ position: 'absolute', top: `${(i + 1) * (100 / 22)}%`, left: 0, right: 0 }} />
            ))}
          </div>

          {/* Sticky notes layer */}
          <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
            {page.notes?.map((note) => (
              <StickyNote
                key={note.id}
                containerRef={containerRef}
                note={note}
                pageId={page.id}
                onUpdateNote={onUpdateNote}
                onDeleteNote={onDeleteNote}
                onBringNoteToFront={onBringNoteToFront}
              />
            ))}
          </div>
        </div>
      )}

      {page?.blank && (
        <div className="h-full w-full grid place-items-center text-stone-400 italic">Blank</div>
      )}

      {/* page curvature shadows near spine */}
      {side === 'left' ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/10 via-black/5 to-transparent" />
      ) : (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/10 via-black/5 to-transparent" />
      )}
    </div>
  );
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
