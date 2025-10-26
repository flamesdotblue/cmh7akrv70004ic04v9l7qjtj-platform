import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Page from './Page';

export default function Book({
  pages,
  sheetIndex,
  setSheetIndex,
  addStickyMode,
  onAddStickyAt,
  onUpdateNote,
  onDeleteNote,
  onBringNoteToFront,
}) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState(null); // 'forward' | 'backward'

  const leftIndex = sheetIndex * 2;
  const rightIndex = leftIndex + 1;
  const leftPage = pages[leftIndex] || null;
  const rightPage = pages[rightIndex] || null;

  const hasNext = rightIndex + 2 < pages.length;
  const hasPrev = sheetIndex > 0;

  const nextLeftIndex = rightIndex + 1;
  const nextRightIndex = rightIndex + 2;
  const prevLeftIndex = leftIndex - 2;
  const prevRightIndex = leftIndex - 1;

  const handleNext = () => {
    if (!hasNext || isFlipping) return;
    setDirection('forward');
    setIsFlipping(true);
  };

  const handlePrev = () => {
    if (!hasPrev || isFlipping) return;
    setDirection('backward');
    setIsFlipping(true);
  };

  const onFlipComplete = () => {
    if (direction === 'forward') setSheetIndex((s) => s + 1);
    if (direction === 'backward') setSheetIndex((s) => s - 1);
    setIsFlipping(false);
    setDirection(null);
  };

  const bookShadow = isFlipping ? 'shadow-2xl' : 'shadow-xl';

  return (
    <div className="w-full flex justify-center">
      <div className={`relative mx-auto aspect-[3/2] w-full max-w-5xl perspective-[2000px]`}>
        <div className={`absolute inset-0 rounded-xl bg-[#f7f0e6] ${bookShadow} ring-1 ring-amber-300 overflow-hidden`}>
          <div className="absolute inset-0 grid grid-cols-2">
            {/* Left static page */}
            <div onClick={handlePrev} className="relative border-r border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100/60">
              {leftPage && (
                <Page
                  side="left"
                  page={leftPage}
                  addStickyMode={addStickyMode}
                  onAddStickyAt={onAddStickyAt}
                  onUpdateNote={onUpdateNote}
                  onDeleteNote={onDeleteNote}
                  onBringNoteToFront={onBringNoteToFront}
                />
              )}
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/5 to-transparent" />
            </div>
            {/* Right static page */}
            <div onClick={handleNext} className="relative bg-gradient-to-br from-amber-50 to-amber-100/60">
              {rightPage && (
                <Page
                  side="right"
                  page={rightPage}
                  addStickyMode={addStickyMode}
                  onAddStickyAt={onAddStickyAt}
                  onUpdateNote={onUpdateNote}
                  onDeleteNote={onDeleteNote}
                  onBringNoteToFront={onBringNoteToFront}
                />
              )}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/5 to-transparent" />
            </div>
          </div>

          {/* Flip overlays */}
          <AnimatePresence initial={false}>
            {isFlipping && direction === 'forward' && (
              <FlippingPageForward
                key="flip-fwd"
                rightPage={rightPage}
                nextLeft={pages[nextLeftIndex]}
                onComplete={onFlipComplete}
                addStickyMode={addStickyMode}
                onAddStickyAt={onAddStickyAt}
                onUpdateNote={onUpdateNote}
                onDeleteNote={onDeleteNote}
                onBringNoteToFront={onBringNoteToFront}
              />
            )}
            {isFlipping && direction === 'backward' && (
              <FlippingPageBackward
                key="flip-back"
                leftPage={leftPage}
                prevRight={pages[prevRightIndex]}
                onComplete={onFlipComplete}
                addStickyMode={addStickyMode}
                onAddStickyAt={onAddStickyAt}
                onUpdateNote={onUpdateNote}
                onDeleteNote={onDeleteNote}
                onBringNoteToFront={onBringNoteToFront}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function CardFace({ children }) {
  return (
    <div className="absolute inset-0 backface-hidden">{children}</div>
  );
}

function FlippingPageForward({ rightPage, nextLeft, onComplete, addStickyMode, onAddStickyAt, onUpdateNote, onDeleteNote, onBringNoteToFront }) {
  // Right page flips over to left; back face shows nextLeft
  return (
    <motion.div
      className="absolute inset-y-0 right-1/2 w-1/2 origin-left"
      initial={{ rotateY: 0 }}
      animate={{ rotateY: -180 }}
      exit={{}}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={onComplete}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 rounded-none bg-gradient-to-br from-amber-50 to-amber-100/60 ring-0 overflow-hidden">
        <CardFace>
          <Page
            side="right"
            page={rightPage}
            addStickyMode={addStickyMode}
            onAddStickyAt={onAddStickyAt}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
            onBringNoteToFront={onBringNoteToFront}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
        </CardFace>
        <CardFace>
          <div className="absolute inset-0" style={{ transform: 'rotateY(180deg)' }}>
            <Page
              side="left"
              page={nextLeft}
              addStickyMode={addStickyMode}
              onAddStickyAt={onAddStickyAt}
              onUpdateNote={onUpdateNote}
              onDeleteNote={onDeleteNote}
              onBringNoteToFront={onBringNoteToFront}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/20 via-black/10 to-transparent" />
          </div>
        </CardFace>
      </div>
      <div className="pointer-events-none absolute inset-0 shadow-2xl" />
    </motion.div>
  );
}

function FlippingPageBackward({ leftPage, prevRight, onComplete, addStickyMode, onAddStickyAt, onUpdateNote, onDeleteNote, onBringNoteToFront }) {
  // Left page flips back to right; back face shows prevRight
  return (
    <motion.div
      className="absolute inset-y-0 left-1/2 w-1/2 origin-right"
      initial={{ rotateY: 0 }}
      animate={{ rotateY: 180 }}
      exit={{}}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={onComplete}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 rounded-none bg-gradient-to-br from-amber-50 to-amber-100/60 ring-0 overflow-hidden">
        <CardFace>
          <Page
            side="left"
            page={leftPage}
            addStickyMode={addStickyMode}
            onAddStickyAt={onAddStickyAt}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
            onBringNoteToFront={onBringNoteToFront}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/25 via-black/10 to-transparent" />
        </CardFace>
        <CardFace>
          <div className="absolute inset-0" style={{ transform: 'rotateY(180deg)' }}>
            <Page
              side="right"
              page={prevRight}
              addStickyMode={addStickyMode}
              onAddStickyAt={onAddStickyAt}
              onUpdateNote={onUpdateNote}
              onDeleteNote={onDeleteNote}
              onBringNoteToFront={onBringNoteToFront}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />
          </div>
        </CardFace>
      </div>
      <div className="pointer-events-none absolute inset-0 shadow-2xl" />
    </motion.div>
  );
}
