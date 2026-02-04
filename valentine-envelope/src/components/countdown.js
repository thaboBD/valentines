/**
 * Countdown Timer Module
 * Handles the countdown to Valentine's Day 2026 in Australia/Sydney timezone
 * Uses Luxon for reliable timezone handling
 */

import { DateTime } from 'luxon';

export class CountdownTimer {
  constructor(onUnlock) {
    this.onUnlock = onUnlock;
    this.intervalId = null;
    this.isUnlocked = false;

    // Target date: SET TO PAST FOR TESTING - Change back to 2026 for production!
    // PRODUCTION: year: 2026, month: 2, day: 14
    this.targetDate = DateTime.fromObject(
      {
        year: 2023,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
      { zone: 'Australia/Sydney' }
    );

    // DOM elements
    this.elements = {
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
    };
  }

  /**
   * Start the countdown timer
   */
  start() {
    // Check immediately if already unlocked
    if (this.checkUnlock()) {
      return;
    }

    // Update every second
    this.update();
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000);
  }

  /**
   * Stop the countdown timer
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Update the countdown display
   */
  update() {
    if (this.isUnlocked) {
      return;
    }

    // Get current time in Australia/Sydney timezone
    const now = DateTime.now().setZone('Australia/Sydney');
    const diff = this.targetDate.diff(now, ['days', 'hours', 'minutes', 'seconds']);

    // Check if countdown has finished
    if (diff.toMillis() <= 0) {
      this.unlock();
      return;
    }

    // Extract time components
    const days = Math.floor(diff.days);
    const hours = Math.floor(diff.hours);
    const minutes = Math.floor(diff.minutes);
    const seconds = Math.floor(diff.seconds);

    // Update DOM with padded values
    this.elements.days.textContent = this.pad(days);
    this.elements.hours.textContent = this.pad(hours);
    this.elements.minutes.textContent = this.pad(minutes);
    this.elements.seconds.textContent = this.pad(seconds);
  }

  /**
   * Check if the countdown should be unlocked
   * @returns {boolean} True if unlocked
   */
  checkUnlock() {
    const now = DateTime.now().setZone('Australia/Sydney');
    const isUnlocked = now >= this.targetDate;

    if (isUnlocked && !this.isUnlocked) {
      this.unlock();
    }

    return isUnlocked;
  }

  /**
   * Unlock the envelope and trigger callback
   */
  unlock() {
    if (this.isUnlocked) {
      return;
    }

    this.isUnlocked = true;
    this.stop();

    // Set all values to 00
    this.elements.days.textContent = '00';
    this.elements.hours.textContent = '00';
    this.elements.minutes.textContent = '00';
    this.elements.seconds.textContent = '00';

    // Trigger unlock callback
    if (this.onUnlock && typeof this.onUnlock === 'function') {
      this.onUnlock();
    }
  }

  /**
   * Pad a number with leading zero
   * @param {number} num - Number to pad
   * @returns {string} Padded number
   */
  pad(num) {
    return String(num).padStart(2, '0');
  }

  /**
   * Get formatted time remaining (for debugging)
   * @returns {string} Formatted time remaining
   */
  getTimeRemaining() {
    const now = DateTime.now().setZone('Australia/Sydney');
    const diff = this.targetDate.diff(now, ['days', 'hours', 'minutes', 'seconds']);

    if (diff.toMillis() <= 0) {
      return 'Unlocked!';
    }

    const days = Math.floor(diff.days);
    const hours = Math.floor(diff.hours);
    const minutes = Math.floor(diff.minutes);
    const seconds = Math.floor(diff.seconds);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
