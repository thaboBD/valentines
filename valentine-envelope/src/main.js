/**
 * Valentine's Day Envelope Experience
 * Main application logic
 */

import './style.css';
import { CountdownTimer } from './components/countdown.js';
import { EnvelopeAnimations } from './components/animations.js';
import { RoseExplosion } from './components/roses.js';

// =============================
// Application State
// =============================

const AppState = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  PLAYING: 'playing',
  QUESTION: 'question',
  FINAL: 'final',
};

let currentState = AppState.LOCKED;
let isInteractionLocked = false;

// =============================
// Configuration
// =============================

const CONFIG = {
  // Video retraction timestamp (in seconds)
  // The letter will retract after this point in the video
  videoRetractTime: 85,

  // Whether to keep video playing for audio after retraction
  keepAudioPlaying: true,
};

// =============================
// DOM Elements
// =============================

const elements = {
  lockedState: document.getElementById('locked-state'),
  unlockedState: document.getElementById('unlocked-state'),
  questionState: document.getElementById('question-state'),
  finalState: document.getElementById('final-state'),

  envelopeInteractive: document.getElementById('envelope-interactive'),
  envelopeLocked: document.getElementById('envelope'),
  video: document.getElementById('montage-video'),
  loadingIndicator: document.getElementById('loading-indicator'),
  lockedAudio: document.getElementById('locked-audio'),
  patiencePopup: document.getElementById('patience-popup'),

  btnYes: document.getElementById('btn-yes'),
  btnOfCourse: document.getElementById('btn-of-course'),
};

// =============================
// Module Instances
// =============================

let countdownTimer = null;
let animations = null;
let roseExplosion = null;

// =============================
// State Management
// =============================

/**
 * Switch to a new application state
 * @param {string} newState - The new state to switch to
 */
function switchState(newState) {
  currentState = newState;

  // Hide all states
  elements.lockedState.classList.add('hidden');
  elements.unlockedState.classList.add('hidden');
  elements.questionState.classList.add('hidden');
  elements.finalState.classList.add('hidden');

  // Show the appropriate state
  switch (newState) {
    case AppState.LOCKED:
      elements.lockedState.classList.remove('hidden');
      break;
    case AppState.UNLOCKED:
      elements.unlockedState.classList.remove('hidden');
      break;
    case AppState.QUESTION:
      elements.questionState.classList.remove('hidden');
      break;
    case AppState.FINAL:
      elements.finalState.classList.remove('hidden');
      break;
  }
}

// =============================
// Countdown Logic
// =============================

/**
 * Handle countdown unlock event
 */
function handleUnlock() {
  console.log('Envelope unlocked! 🎉');
  switchState(AppState.UNLOCKED);

  // Wait a brief moment for DOM to update, then init interactions
  setTimeout(() => {
    initEnvelopeInteraction();
  }, 100);
}

/**
 * Initialize countdown timer
 */
function initCountdown() {
  countdownTimer = new CountdownTimer(handleUnlock);
  countdownTimer.start();
}

// =============================
// Video Logic
// =============================

/**
 * Handle video time update
 */
function handleVideoTimeUpdate() {
  const currentTime = elements.video.currentTime;

  // Trigger retraction at configured timestamp
  if (currentTime >= CONFIG.videoRetractTime && currentState === AppState.PLAYING) {
    handleVideoRetraction();
  }
}

/**
 * Handle video retraction sequence
 */
function handleVideoRetraction() {
  if (isInteractionLocked) {
    return;
  }

  isInteractionLocked = true;

  console.log('Starting letter retraction...');

  // Play retraction animation
  animations.playRetractSequence(() => {
    console.log('Retraction complete');

    // Pause and hide video if not keeping audio
    if (!CONFIG.keepAudioPlaying) {
      elements.video.pause();
    }

    // Show question state
    switchState(AppState.QUESTION);

    // Fade out envelope after a short delay
    setTimeout(() => {
      animations.fadeOutEnvelope(() => {
        elements.unlockedState.style.display = 'none';
      });
    }, 500);

    isInteractionLocked = false;
  });
}

/**
 * Handle video loading and playback
 */
function handleVideoLoading() {
  console.log('handleVideoLoading called');
  console.log('Video element:', elements.video);
  console.log('Video src:', elements.video.querySelector('source')?.src);
  console.log('Video readyState:', elements.video.readyState);
  console.log('Video networkState:', elements.video.networkState);

  // Show loading indicator
  elements.loadingIndicator.classList.remove('hidden');

  // Switch to auto preload and force load
  elements.video.preload = 'auto';
  elements.video.load(); // Force reload the video

  // Set a timeout in case video doesn't load
  const loadingTimeout = setTimeout(() => {
    console.warn('Video loading timeout - file may be missing');
    console.log('Final video readyState:', elements.video.readyState);
    console.log('Final video networkState:', elements.video.networkState);
    console.log('Video error:', elements.video.error);
    elements.loadingIndicator.textContent =
      'Video loading timed out. Tap here to retry.';
    elements.loadingIndicator.style.background = 'rgba(139, 0, 0, 0.8)';
    elements.loadingIndicator.style.cursor = 'pointer';

    elements.loadingIndicator.addEventListener('click', () => {
      console.log('Retry clicked');
      elements.loadingIndicator.textContent = 'Loading...';
      elements.video.load();
      elements.video.play();
    });
  }, 10000); // Increased to 10 seconds for large file

  // Listen for canplay event
  const onCanPlay = () => {
    console.log('Video canplay event fired');
    console.log('Video readyState:', elements.video.readyState);
    clearTimeout(loadingTimeout);
    elements.loadingIndicator.classList.add('hidden');

    // Start playback
    const playPromise = elements.video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playing successfully');
        })
        .catch((error) => {
          console.error('Video playback failed:', error);
          // Handle autoplay restrictions
          elements.loadingIndicator.textContent =
            'Tap here to play video';
          elements.loadingIndicator.classList.remove('hidden');
          elements.loadingIndicator.style.cursor = 'pointer';

          const playOnClick = () => {
            console.log('Play on click triggered');
            elements.video.play();
            elements.loadingIndicator.classList.add('hidden');
            elements.loadingIndicator.removeEventListener('click', playOnClick);
          };

          elements.loadingIndicator.addEventListener('click', playOnClick);
        });
    }

    elements.video.removeEventListener('canplay', onCanPlay);
  };

  // Also listen for loadeddata as a fallback
  const onLoadedData = () => {
    console.log('Video loadeddata event fired');
    if (elements.video.readyState >= 2) {
      onCanPlay();
    }
  };

  elements.video.addEventListener('canplay', onCanPlay);
  elements.video.addEventListener('loadeddata', onLoadedData, { once: true });

  // Track loading progress
  elements.video.addEventListener('loadstart', () => {
    console.log('Video loadstart');
  }, { once: true });

  elements.video.addEventListener('progress', (e) => {
    console.log('Video loading progress...');
  });

  elements.video.addEventListener('loadedmetadata', () => {
    console.log('Video metadata loaded');
  }, { once: true });

  // Handle video errors
  const onError = (e) => {
    clearTimeout(loadingTimeout);
    console.error('Video error event:', e);
    console.error('Video error details:', elements.video.error);
    console.error('Video src:', elements.video.currentSrc);

    let errorMessage = 'Video file not found. ';

    if (elements.video.error) {
      switch (elements.video.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Video loading was aborted.';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading video.';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Video file is corrupted or in wrong format.';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video file not found. Add montage.mp4 to public/video/';
          break;
        default:
          errorMessage = 'Unknown video error occurred.';
      }
    }

    elements.loadingIndicator.textContent = errorMessage;
    elements.loadingIndicator.style.background = 'rgba(139, 0, 0, 0.8)';
    elements.loadingIndicator.classList.remove('hidden');
  };

  elements.video.addEventListener('error', onError, { once: true });
}

/**
 * Initialize video event listeners
 */
function initVideo() {
  elements.video.addEventListener('timeupdate', handleVideoTimeUpdate);
}

// =============================
// Envelope Interaction
// =============================

/**
 * Handle envelope click to open
 */
function handleEnvelopeClick() {
  if (currentState !== AppState.UNLOCKED || isInteractionLocked) {
    return;
  }

  isInteractionLocked = true;
  currentState = AppState.PLAYING;

  console.log('Opening envelope...');

  // Disable further clicks
  elements.envelopeInteractive.style.pointerEvents = 'none';

  // Start video loading
  handleVideoLoading();

  // Play opening animation
  animations.playOpenSequence(() => {
    console.log('Envelope opened');
    isInteractionLocked = false;
  });
}

/**
 * Initialize envelope interaction
 */
function initEnvelopeInteraction() {
  if (!elements.envelopeInteractive) {
    return; // Not yet unlocked
  }

  // Click handler
  elements.envelopeInteractive.addEventListener('click', handleEnvelopeClick);

  // Keyboard accessibility
  elements.envelopeInteractive.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnvelopeClick();
    }
  });
}

/**
 * Handle locked envelope click - play audio and show popup
 */
function handleLockedEnvelopeClick() {
  if (currentState === AppState.LOCKED) {
    console.log('Locked envelope clicked - playing audio and showing popup');

    // Show patience popup
    if (elements.patiencePopup) {
      elements.patiencePopup.classList.remove('hidden');

      // Auto-hide after 2 seconds
      setTimeout(() => {
        elements.patiencePopup.classList.add('hidden');
      }, 2000);
    }

    // Play audio
    if (elements.lockedAudio) {
      // Reset audio to start if already playing
      elements.lockedAudio.currentTime = 0;
      // Play audio
      const playPromise = elements.lockedAudio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Audio playback failed (may need user interaction first):', error);
        });
      }
    }
  }
}

/**
 * Initialize locked envelope interaction
 */
function initLockedEnvelopeInteraction() {
  if (!elements.envelopeLocked) {
    return;
  }

  // Click handler for locked envelope
  elements.envelopeLocked.addEventListener('click', handleLockedEnvelopeClick);

  // Keyboard accessibility
  elements.envelopeLocked.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLockedEnvelopeClick();
    }
  });

  // Allow popup to be dismissed by clicking on it
  if (elements.patiencePopup) {
    elements.patiencePopup.addEventListener('click', () => {
      elements.patiencePopup.classList.add('hidden');
    });
  }
}

// =============================
// Question & Response Logic
// =============================

/**
 * Handle "Yes" button click
 */
function handleYesClick() {
  if (isInteractionLocked) {
    return;
  }

  isInteractionLocked = true;

  console.log('Yes clicked! 🌹');

  // Stop video if still playing
  if (elements.video && !elements.video.paused) {
    // Fade out audio
    const fadeAudio = setInterval(() => {
      if (elements.video.volume > 0.1) {
        elements.video.volume -= 0.1;
      } else {
        elements.video.volume = 0;
        elements.video.pause();
        clearInterval(fadeAudio);
      }
    }, 50);
  }

  // Trigger rose explosion
  roseExplosion.celebrate();

  // Switch to final state
  setTimeout(() => {
    switchState(AppState.FINAL);
    isInteractionLocked = false;
  }, 800);
}

/**
 * Initialize question buttons
 */
function initQuestionButtons() {
  elements.btnYes.addEventListener('click', handleYesClick);
  elements.btnOfCourse.addEventListener('click', handleYesClick);

  // Keyboard accessibility
  [elements.btnYes, elements.btnOfCourse].forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleYesClick();
      }
    });
  });
}

// =============================
// Initialization
// =============================

/**
 * Initialize the application
 */
function init() {
  console.log('Initializing Valentine\'s Day Envelope Experience...');

  // Initialize modules
  animations = new EnvelopeAnimations();
  roseExplosion = new RoseExplosion();

  // Initialize components
  initCountdown();
  initVideo();
  initEnvelopeInteraction();
  initLockedEnvelopeInteraction();
  initQuestionButtons();

  // Set initial state
  if (countdownTimer.checkUnlock()) {
    switchState(AppState.UNLOCKED);
  } else {
    switchState(AppState.LOCKED);
  }

  // Hide loading screen and show app after initialization
  const loadingScreen = document.getElementById('loading-screen');
  const app = document.getElementById('app');

  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    // Remove from DOM after transition
    setTimeout(() => {
      loadingScreen.remove();
    }, 300);
  }

  if (app) {
    app.classList.add('loaded');
  }

  console.log('Initialization complete ✨');
}

// =============================
// Start Application
// =============================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// =============================
// Debug Helpers (Development only)
// =============================

// Expose debug functions in development
if (import.meta.env.DEV) {
  window.valentineDebug = {
    skipToUnlocked: () => {
      countdownTimer.unlock();
    },
    skipToQuestion: () => {
      switchState(AppState.QUESTION);
    },
    skipToFinal: () => {
      switchState(AppState.FINAL);
    },
    triggerRoses: () => {
      roseExplosion.celebrate();
    },
    testEnvelopeAnimation: () => {
      console.log('Testing envelope opening animation (without video)...');
      if (currentState !== AppState.UNLOCKED) {
        console.warn('Switch to unlocked state first: valentineDebug.skipToUnlocked()');
        return;
      }
      // Trigger opening animation
      isInteractionLocked = true;
      currentState = AppState.PLAYING;
      elements.envelopeInteractive.style.pointerEvents = 'none';

      // Show loading indicator but don't try to load video
      elements.loadingIndicator.textContent = 'Testing animation (no video loaded)';
      elements.loadingIndicator.classList.remove('hidden');

      // Play opening animation
      animations.playOpenSequence(() => {
        console.log('Opening animation complete');
        isInteractionLocked = false;

        // Auto-retract after 5 seconds for testing
        setTimeout(() => {
          console.log('Auto-retracting for testing...');
          handleVideoRetraction();
        }, 5000);
      });
    },
    getState: () => currentState,
    getTimeRemaining: () => countdownTimer.getTimeRemaining(),
  };

  console.log(
    '%c🌹 Debug Helper Available 🌹',
    'color: #ff6b9d; font-size: 14px; font-weight: bold;'
  );
  console.log('Type valentineDebug in console to access debug functions');
  console.log('🎬 Test animations without video: valentineDebug.testEnvelopeAnimation()');
}
