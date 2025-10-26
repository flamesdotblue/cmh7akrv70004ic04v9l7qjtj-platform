import { useMemo, useState } from 'react';
import Toolbar from './components/Toolbar';
import Book from './components/Book';

function createInitialPages() {
  const today = new Date();
  const fmt = (d) => d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const p1 = {
    id: crypto.randomUUID(),
    title: 'Welcome',
    date: fmt(today),
    content:
      "This is your daily diary. Write your thoughts, plans, and reflections. Use the toolbar to add new pages or place sticky notes anywhere.",
    notes: [],
  };
  const p2 = {
    id: crypto.randomUUID(),
    title: 'How to use',
    date: fmt(new Date(today.getTime() + 86400000)),
    content:
      "- Click the right page to turn forward, left page to turn back.\n- Toggle 'Add Sticky' then click anywhere on a page to drop a sticky note.\n- Drag stickies to reposition. Click them to edit.\n- Use the + Page button to add new diary pages.",
    notes: [],
  };
  return [p1, p2];
}

export default function App() {
  const [pages, setPages] = useState(() => createInitialPages());
  // sheetIndex: 0 shows pages[0] (left) and pages[1] (right)
  const [sheetIndex, setSheetIndex] = useState(0);
  const [addStickyMode, setAddStickyMode] = useState(false);

  // Ensure even number of pages for spreads
  const normalizedPages = useMemo(() => {
    if (pages.length % 2 === 0) return pages;
    return [...pages, { id: 'blank-last', title: '', date: '', content: '', notes: [], blank: true }];
  }, [pages]);

  const maxSheet = Math.max(0, Math.floor((normalizedPages.length - 1) / 2));

  const addPage = () => {
    const date = new Date();
    const title = `Entry ${pages.length + 1}`;
    const newPage = {
      id: crypto.randomUUID(),
      title,
      date: date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      content: '',
      notes: [],
    };
    setPages((p) => [...p, newPage]);
  };

  const handleAddStickyAt = (pageId, percentX, percentY) => {
    setPages((prev) => prev.map((p) => {
      if (p.id !== pageId) return p;
      const newNote = {
        id: crypto.randomUUID(),
        x: percentX,
        y: percentY,
        color: '#FFEB3B',
        text: '',
        z: Date.now(),
      };
      return { ...p, notes: [...p.notes, newNote] };
    }));
  };

  const handleUpdateNote = (pageId, noteId, updates) => {
    setPages((prev) => prev.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        notes: p.notes.map((n) => (n.id === noteId ? { ...n, ...updates } : n)),
      };
    }));
  };

  const handleDeleteNote = (pageId, noteId) => {
    setPages((prev) => prev.map((p) => {
      if (p.id !== pageId) return p;
      return { ...p, notes: p.notes.filter((n) => n.id !== noteId) };
    }));
  };

  const bringNoteToFront = (pageId, noteId) => {
    const zTop = Date.now();
    handleUpdateNote(pageId, noteId, { z: zTop });
  };

  const leftIndex = sheetIndex * 2;
  const rightIndex = leftIndex + 1;

  return (
    <div className="min-h-screen bg-amber-100/60 text-stone-800">
      <Toolbar
        canPrev={sheetIndex > 0}
        canNext={sheetIndex < maxSheet}
        onPrev={() => setSheetIndex((s) => Math.max(0, s - 1))}
        onNext={() => setSheetIndex((s) => Math.min(maxSheet, s + 1))}
        addStickyMode={addStickyMode}
        setAddStickyMode={setAddStickyMode}
        onAddPage={addPage}
      />

      <div className="container mx-auto px-4 pb-12">
        <Book
          pages={normalizedPages}
          sheetIndex={sheetIndex}
          setSheetIndex={setSheetIndex}
          addStickyMode={addStickyMode}
          onAddStickyAt={handleAddStickyAt}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onBringNoteToFront={bringNoteToFront}
        />
      </div>
    </div>
  );
}
