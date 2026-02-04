/**
 * Animations Module
 * Handles all GSAP-based animations for the envelope and letter
 */

import { gsap } from 'gsap';

export class EnvelopeAnimations {
  constructor() {
    this.timeline = null;
    this.isAnimating = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // DOM elements
    this.elements = {
      envelopeInteractive: document.getElementById('envelope-interactive'),
      videoContainer: document.getElementById('video-container'),
      unlockMessage: document.getElementById('unlock-message'),
    };
  }

  /**
   * Play the envelope opening sequence
   * @param {Function} onComplete - Callback when animation completes
   */
  playOpenSequence(onComplete) {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    // Create GSAP timeline
    this.timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        }
      },
    });

    // Simplified sequence:
    // 1. Fade out unlock message
    // 2. Fade out envelope
    // 3. Show video container full screen

    const fadeDuration = this.reducedMotion ? 0.1 : 0.3;
    const scaleDuration = this.reducedMotion ? 0.1 : 0.4;
    const videoDuration = this.reducedMotion ? 0.1 : 0.5;

    this.timeline
      // Fade out the unlock message
      .to(this.elements.unlockMessage, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.out',
      })
      // Fade out entire envelope
      .to(
        this.elements.envelopeInteractive,
        {
          opacity: 0,
          scale: this.reducedMotion ? 1 : 0.9,
          duration: scaleDuration,
          ease: 'power2.in',
        },
        '-=0.1'
      )
      // Position video container centered (responsive sizing)
      .set(this.elements.videoContainer, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: window.innerWidth <= 480 ? '95vw' : '90vw',
        height: window.innerWidth <= 480 ? '95vh' : '90vh',
        maxWidth: window.innerWidth <= 480 ? '95vw' : '1200px',
        maxHeight: window.innerWidth <= 480 ? '95vh' : '800px',
        zIndex: 100,
        xPercent: -50,
        yPercent: -50,
      })
      // Fade in video with scale
      .fromTo(
        this.elements.videoContainer,
        {
          opacity: 0,
          scale: this.reducedMotion ? 1 : 0.9,
        },
        {
          opacity: 1,
          scale: 1,
          duration: videoDuration,
          ease: this.reducedMotion ? 'none' : 'back.out(1.2)',
        }
      );
  }

  /**
   * Play the letter retraction sequence
   * @param {Function} onComplete - Callback when animation completes
   */
  playRetractSequence(onComplete) {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    // Create new timeline for retraction
    this.timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        }
      },
    });

    // Simplified sequence:
    // 1. Fade out video
    // 2. Reset video container position
    // 3. Fade envelope back in

    const videoFadeOut = this.reducedMotion ? 0.1 : 0.4;
    const envelopeFadeIn = this.reducedMotion ? 0.1 : 0.5;

    this.timeline
      // Fade out video
      .to(this.elements.videoContainer, {
        opacity: 0,
        scale: this.reducedMotion ? 1 : 0.9,
        duration: videoFadeOut,
        ease: 'power2.in',
      })
      // Reset video container to original state
      .set(this.elements.videoContainer, {
        position: 'absolute',
        top: 'auto',
        left: 'auto',
        width: 0,
        height: 0,
        maxWidth: 'none',
        maxHeight: 'none',
        zIndex: 'auto',
        xPercent: 0,
        yPercent: 0,
        clearProps: 'transform',
      })
      // Fade envelope back in
      .to(
        this.elements.envelopeInteractive,
        {
          opacity: 1,
          scale: 1,
          duration: envelopeFadeIn,
          ease: this.reducedMotion ? 'none' : 'back.out(1.2)',
        },
        '-=0.2'
      );
  }

  /**
   * Fade out the envelope completely
   * @param {Function} onComplete - Callback when animation completes
   */
  fadeOutEnvelope(onComplete) {
    gsap.to(this.elements.envelopeInteractive.parentElement, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        }
      },
    });
  }

  /**
   * Kill all active animations
   */
  killAll() {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    this.isAnimating = false;
  }
}
