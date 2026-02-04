/**
 * Rose Explosion Module
 * Handles the rose confetti celebration effect using canvas-confetti
 */

import confetti from 'canvas-confetti';

export class RoseExplosion {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Configuration
    this.config = {
      // Reduce particle count and duration if user prefers reduced motion
      particleCount: this.reducedMotion ? 20 : 100,
      duration: this.reducedMotion ? 1000 : 3000,
      burstCount: this.reducedMotion ? 3 : 8,
    };
  }

  /**
   * Create a rose emoji scalar for confetti
   */
  createRoseShape() {
    // Try to use rose emoji
    try {
      return confetti.shapeFromText({ text: '🌹', scalar: 2 });
    } catch (e) {
      // Fallback to default shapes if emoji not supported
      console.warn('Rose emoji not supported, using default shapes');
      return undefined;
    }
  }

  /**
   * Fire a single burst of roses from a position
   * @param {number} x - X position (0-1, where 0.5 is center)
   * @param {number} y - Y position (0-1, where 0.5 is center)
   * @param {number} particleCount - Number of particles
   * @param {number} spread - Spread angle in degrees
   */
  fireBurst(x = 0.5, y = 0.5, particleCount = 50, spread = 60) {
    const roseShape = this.createRoseShape();

    const config = {
      particleCount,
      spread,
      origin: { x, y },
      colors: ['#ff6b9d', '#ff8fab', '#ffb3c1', '#e0ac69', '#d4af37'],
      ticks: 200,
      gravity: 1,
      scalar: roseShape ? 1.5 : 1,
      shapes: roseShape ? [roseShape] : ['circle', 'square'],
      startVelocity: 45,
    };

    confetti(config);
  }

  /**
   * Create a large explosion of roses from the center
   */
  explosion() {
    const centerX = 0.5;
    const centerY = 0.5;

    // Main burst
    this.fireBurst(centerX, centerY, this.config.particleCount, 360);

    // Additional bursts if not reduced motion
    if (!this.reducedMotion) {
      setTimeout(() => {
        this.fireBurst(centerX, centerY, 70, 120);
      }, 150);

      setTimeout(() => {
        this.fireBurst(centerX, centerY, 50, 90);
      }, 300);
    }
  }

  /**
   * Create a continuous rose rain effect
   * @param {number} duration - Duration in milliseconds
   */
  rain(duration = 2000) {
    const end = Date.now() + duration;

    const frame = () => {
      const now = Date.now();
      if (now >= end) {
        return;
      }

      // Fire from random positions at the top
      this.fireBurst(
        Math.random(),
        0,
        this.reducedMotion ? 2 : 5,
        this.reducedMotion ? 30 : 50
      );

      requestAnimationFrame(frame);
    };

    frame();
  }

  /**
   * Play the full rose celebration sequence
   */
  celebrate() {
    // Initial explosion
    this.explosion();

    // Follow with rose rain
    if (!this.reducedMotion) {
      setTimeout(() => {
        this.rain(this.config.duration);
      }, 400);

      // Additional side bursts
      for (let i = 0; i < this.config.burstCount; i++) {
        setTimeout(() => {
          // Random position around the center
          const angle = (Math.PI * 2 * i) / this.config.burstCount;
          const radius = 0.3;
          const x = 0.5 + radius * Math.cos(angle);
          const y = 0.5 + radius * Math.sin(angle);

          this.fireBurst(x, y, 30, 60);
        }, 200 + i * 200);
      }
    }
  }

  /**
   * Clear all confetti from screen immediately
   */
  clear() {
    confetti.reset();
  }
}
