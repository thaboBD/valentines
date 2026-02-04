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
      envelopeFlap: document.querySelector('.envelope-flap-interactive'),
      letter: document.getElementById('letter'),
      videoContainer: document.getElementById('video-container'),
      unlockMessage: document.getElementById('unlock-message'),
      cursiveText: document.querySelector('#envelope-interactive .cursive-text'),
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

    // Animation sequence:
    // 1. Fade out unlock message and "To Simomo"
    // 2. Open envelope flap
    // 3. Slide letter out from envelope
    // 4. Enlarge letter to full screen
    // 5. Fade in video

    const isMobile = window.innerWidth <= 480;
    const finalWidth = isMobile ? '100vw' : '90vw';
    const finalHeight = isMobile ? '100vh' : '90vh';
    const finalMaxWidth = isMobile ? '100vw' : '1200px';
    const finalMaxHeight = isMobile ? '100vh' : '800px';

    this.timeline
      // 1. Fade out unlock message
      .to(this.elements.unlockMessage, {
        opacity: 0,
        duration: this.reducedMotion ? 0.1 : 0.3,
        ease: 'power2.out',
      })
      // Fade out "To Simomo" text
      .to(this.elements.cursiveText, {
        opacity: 0,
        duration: this.reducedMotion ? 0.1 : 0.3,
        ease: 'power2.out',
      }, '-=0.2')
      // 2. Open envelope flap (rotate backward)
      .to(this.elements.envelopeFlap, {
        rotationX: -180,
        duration: this.reducedMotion ? 0.1 : 0.8,
        ease: 'power2.inOut',
        transformOrigin: '50% 0%',
      }, '+=0.2')
      // 3. Slide letter out and make it visible
      .to(this.elements.letter, {
        opacity: 1,
        y: -200,
        duration: this.reducedMotion ? 0.1 : 0.9,
        ease: 'power2.out',
      }, '-=0.3')
      // 4. Enlarge letter to full screen (fixed positioning)
      .to(this.elements.letter, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        width: finalWidth,
        height: finalHeight,
        maxWidth: finalMaxWidth,
        maxHeight: finalMaxHeight,
        borderRadius: '12px',
        zIndex: 100,
        duration: this.reducedMotion ? 0.1 : 0.7,
        ease: 'power2.inOut',
      }, '-=0.3')
      // 5. Fade in video and change object-fit to contain
      .to(this.elements.videoContainer, {
        opacity: 1,
        duration: this.reducedMotion ? 0.1 : 0.5,
        ease: 'power2.in',
      }, '-=0.3')
      .set(this.elements.videoContainer.querySelector('video'), {
        objectFit: 'contain',
      });
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

    // Retraction sequence (reverse of opening):
    // 1. Fade out video
    // 2. Shrink letter back down
    // 3. Slide letter back into envelope
    // 4. Close envelope flap
    // 5. Fade "To Simomo" back in

    this.timeline
      // 1. Fade out video and reset object-fit
      .to(this.elements.videoContainer, {
        opacity: 0,
        duration: this.reducedMotion ? 0.1 : 0.4,
        ease: 'power2.out',
      })
      .set(this.elements.videoContainer.querySelector('video'), {
        objectFit: 'cover',
      })
      // 2. Shrink letter back to original size
      .to(this.elements.letter, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        width: window.innerWidth <= 480 ? '200px' : '240px',
        height: window.innerWidth <= 480 ? '135px' : '160px',
        maxWidth: 'none',
        maxHeight: 'none',
        borderRadius: '6px',
        zIndex: 1,
        clearProps: 'y',
        duration: this.reducedMotion ? 0.1 : 0.7,
        ease: 'power2.inOut',
      }, '-=0.2')
      // 3. Slide letter back into envelope
      .to(this.elements.letter, {
        y: 0,
        opacity: 0,
        duration: this.reducedMotion ? 0.1 : 0.8,
        ease: 'power2.in',
      }, '-=0.3')
      // 4. Close envelope flap
      .to(this.elements.envelopeFlap, {
        rotationX: 0,
        duration: this.reducedMotion ? 0.1 : 0.6,
        ease: 'power2.inOut',
      }, '-=0.4')
      // 5. Fade "To Simomo" back in
      .to(this.elements.cursiveText, {
        opacity: 1,
        duration: this.reducedMotion ? 0.1 : 0.4,
        ease: 'power2.inOut',
      }, '-=0.3');
  }

  /**
   * Fade out the envelope completely (used when transitioning to question state)
   * @param {Function} onComplete - Callback when animation completes
   */
  fadeOutEnvelope(onComplete) {
    gsap.to(this.elements.envelopeInteractive.parentElement.parentElement, {
      opacity: 0,
      scale: 0.9,
      duration: this.reducedMotion ? 0.1 : 0.5,
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
