import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function StickyNote({ containerRef, note, pageId, onUpdateNote, onDeleteNote, onBringNoteToFront }) {
  const nodeRef = useRef(null);
  const [editing, setEditing] = useState(false);

  const handleDragEnd = () => {
    const el = nodeRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    const left = elRect.left - cRect.left;
    const top = elRect.top - cRect.top;

    const px = (left / cRect.width) * 100;
    const py = (top / cRect.height) * 100;

    const clampedX = clamp(px, 0, 95);
    const clampedY = clamp(py, 0, 95);

    onUpdateNote(pageId, note.id, { x: clampedX, y: clampedY });
  };

  const handleFocus = () => onBringNoteToFront(pageId, note.id);

  const constraints = containerRef;

  return (
    <motion.div
      ref={nodeRef}
      className="absolute"
      style={{ left: `${note.x}%`, top: `${note.y}%`, zIndex: note.z || 1, pointerEvents: 'auto' }}
      drag
      dragConstraints={constraints}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onMouseDown={handleFocus}
      onTouchStart={handleFocus}
    >
      <div
        className="group relative w-36 md:w-40 shadow-lg"
        style={{
          background: note.color || '#FFEB3B',
          transform: 'rotate(-1deg)',
          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 85% 100%, 0 100%)',
        }}
      >
        <textarea
          value={note.text}
          onChange={(e) => onUpdateNote(pageId, note.id, { text: e.target.value })}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          placeholder="Write note..."
          className="w-full h-28 md:h-32 bg-transparent resize-none p-3 text-sm outline-none font-sans text-stone-800"
        />
        <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDeleteNote(pageId, note.id)}
            className="inline-flex items-center justify-center rounded bg-black/10 hover:bg-black/20 p-1"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="absolute -top-1 left-3 w-4 h-4 rounded-full bg-amber-500 shadow-inner" />
      </div>
    </motion.div>
  );
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
