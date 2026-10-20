import React from 'react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/** VASUKI opening brand reveal. Plays the supplied logo animation automatically on every app load. */
export default function BrandIntro() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const finish = () => setVisible(false);
  useEffect(() => {
    if (!visible) return undefined;
    if (reduceMotion) { const t = window.setTimeout(finish, 900); return () => window.clearTimeout(t); }
    // Safety timeout in case the browser cannot autoplay or the video has no end event.
    const t = window.setTimeout(finish, 10500);
    return () => window.clearTimeout(t);
  }, [visible, reduceMotion]);
  return (
    <AnimatePresence>
      {visible && <motion.div className="brand-intro" role="status" aria-label="VASUKI — Guardian of Gold"
        initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.15 : 0.7, ease: 'easeInOut' } }}>
        {!reduceMotion && !videoFailed ? <video className="brand-intro__video" autoPlay muted playsInline preload="auto" onEnded={finish} onError={() => setVideoFailed(true)}>
          <source src="/images/brand/vasuki-logo-animation.mp4" type="video/mp4" />
        </video> : <motion.div className="brand-intro__content" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <img className="brand-intro__logo-fallback" src="/images/brand/vasuki-logo.png" alt="VASUKI — Guardian of Gold" />
          <p>GUARDIAN OF GOLD</p>
        </motion.div>}
        <button className="brand-intro__skip" onClick={finish} aria-label="Skip brand animation">Skip intro ↗</button>
      </motion.div>}
    </AnimatePresence>
  );
}
