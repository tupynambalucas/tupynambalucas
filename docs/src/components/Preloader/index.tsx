import React, { useState, useRef, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './styles.module.css';

/**
 * Preloader component that blocks the UI until 3D assets are loaded.
 * Uses useProgress from @react-three/drei to track GLB loading.
 */
export default function Preloader() {
  const { progress, active } = useProgress();
  const [isFinished, setIsFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Disable scroll on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useGSAP(
    () => {
      // Only trigger exit when progress is 100% and no longer active
      if (progress === 100 && !active) {
        const tl = gsap.timeline({
          delay: 0.4, // Reduced buffer
        });

        // Start re-enabling scroll slightly before the fade finishes
        tl.to(contentRef.current, {
          opacity: 0,
          y: -30,
          filter: 'blur(10px)',
          duration: 0.4,
          ease: 'power4.in',
        }).to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onStart: () => {
              // Re-enable scroll as soon as the main container starts fading
              document.body.style.overflow = '';
            },
            onComplete: () => {
              setIsFinished(true);
            },
          },
          '-=0.2',
        ); // Overlap with content fade
      }
    },
    { dependencies: [progress, active], scope: containerRef },
  );

  if (isFinished) return null;

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div className={styles.content} ref={contentRef}>
        <div className={styles.logo}>
          <span className={styles.bracket}>[</span>
          <span className={styles.brand}>TUPYDOCS</span>
          <span className={styles.bracket}>]</span>
        </div>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.status}>
          <span className={styles.loadingText}>INITIALIZING_TUPYDOCS</span>
          <span className={styles.percentage}>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Decorative background grid */}
      <div className={styles.gridOverlay} />
    </div>
  );
}
