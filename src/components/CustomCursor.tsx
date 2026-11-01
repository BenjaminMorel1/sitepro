import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "motion/react";

// Curseur personnalisé : un point qui suit la souris et un anneau qui le rattrape
// avec un ressort, grossi au survol des liens et boutons. Le curseur natif reste
// visible ; rien n'est affiché sur les écrans tactiles.

const Cursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 25, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 250, damping: 25, mass: 0.5 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHovering(!!(e.target as Element | null)?.closest("a, button"));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-white mix-blend-difference"
      />
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 0.9 : 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 h-10 w-10 rounded-full border border-white mix-blend-difference"
      />
    </>
  );
};

const CustomCursor = () => {
  const [finePointer] = useState(() => window.matchMedia("(pointer: fine)").matches);
  if (!finePointer) return null;
  // rendu dans <body> pour ne pas dépendre des transitions de page
  return createPortal(<Cursor />, document.body);
};

export default CustomCursor;
