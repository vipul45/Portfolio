AOS.init();

gsap.from(".intro h2", { duration: 2, y: 50, opacity: 0 });
gsap.from(".intro p", { duration: 2, y: 20, opacity: 0, delay: 0.5 });

gsap.utils.toArray("section").forEach((section) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out",
  });
});

const typingElement = document.getElementById("typing");
const phrases = ["Hi, I'm Vipul.", "Backend Developer.","Blockchain Enthusiast","AI Admirer", "Poet.", "Learner."];
let phraseIndex = 0;
let charIndex = 0;
let typing = true;

function type() {
  if (typing) {
    if (charIndex < phrases[phraseIndex].length) {
      typingElement.textContent += phrases[phraseIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, 100);
    } else {
      typing = false;
      setTimeout(type, 1500);
    }
  } else {
    if (charIndex > 0) {
      typingElement.textContent = phrases[phraseIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(type, 50);
    } else {
      typing = true;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 200);
    }
  }
}
type();

// --- Skill Bubble Interaction ---

const skillsContainer = document.querySelector('.skills-container');
const skillBubbles = document.querySelectorAll('.skill-bubble');

let activeBubble = null;
let isDragging = false;
let initialX, initialY, offsetX, offsetY;

// Function to check if the device supports touch events
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

skillBubbles.forEach(bubble => {
  // Assign random translation values for more varied floating
  bubble.style.setProperty('--tx', `${Math.random() * 40 - 20}px`);
  bubble.style.setProperty('--ty', `${Math.random() * 40 - 20}px`);

  // Flag to prevent double clicks during animation
  let isPopping = false;

  // --- Click (Burst and Link) ---
  bubble.addEventListener('click', (e) => {
    // Only trigger click if not dragging AND not already popping
    if (!isDragging && !isPopping) {
      isPopping = true; // Set flag
      const url = bubble.getAttribute('data-url');
      bubble.classList.add('burst'); // Add class to trigger CSS @keyframes animation

      // Open link almost immediately
      if (url) {
          // Delay opening slightly allows animation to start visually
           setTimeout(() => {
               window.open(url, '_blank');
           }, 50); // Short delay (50ms)
      }

      // --- Reset bubble state AFTER the animation completes ---
      // The animation duration is 0.3s (300ms)
      setTimeout(() => {
        // Option 1: Keep it hidden (due to 'forwards' in CSS animation)
        // No action needed here if 'forwards' is used.

        // Option 2: Make it reappear (remove 'forwards' from CSS animation)
        // bubble.classList.remove('burst');
        // bubble.style.opacity = 1; // Make sure it's visible again
        // bubble.style.transform = 'scale(1)'; // Reset scale explicitly

        // Option 3: Remove the element entirely
        // bubble.remove();

        isPopping = false; // Reset flag after animation + buffer
      }, 350); // Wait slightly longer than the animation (300ms)

    }
    // Reset dragging flag after click logic might have run (or not)
    // Ensures a click after a drag-release doesn't get blocked if pop didn't happen
     setTimeout(() => { isDragging = false; }, 0);
  });

  // --- Dragging Logic (Keep the previous robust version) ---
  const dragStart = (e) => {
    if (isPopping) return; // Don't allow drag if popping

    activeBubble = bubble;
    activeBubble.classList.add('dragging');
    activeBubble.style.animationPlayState = 'paused'; // Explicitly pause float

    const eventX = isTouchDevice() ? e.touches[0].clientX : e.clientX;
    const eventY = isTouchDevice() ? e.touches[0].clientY : e.clientY;

    const rect = activeBubble.getBoundingClientRect();
    initialX = eventX - rect.left;
    initialY = eventY - rect.top;

    isDragging = false; // Will be set true on move

    if (isTouchDevice()) {
      document.addEventListener('touchmove', dragMove, { passive: false });
      document.addEventListener('touchend', dragEnd);
    } else {
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
    }
  };

  const dragMove = (e) => {
    if (!activeBubble || isPopping) return;

     if (isTouchDevice()) {
       e.preventDefault();
     }

    isDragging = true; // Set flag *only* when movement occurs

    const eventX = isTouchDevice() ? e.touches[0].clientX : e.clientX;
    const eventY = isTouchDevice() ? e.touches[0].clientY : e.clientY;

    const containerRect = skillsContainer.getBoundingClientRect();
    let newX = eventX - containerRect.left - initialX;
    let newY = eventY - containerRect.top - initialY;

    const bubbleRect = activeBubble.getBoundingClientRect();
    newX = Math.max(0, Math.min(newX, containerRect.width - bubbleRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height - bubbleRect.height));

    // Update position using transform for potentially smoother performance
    // activeBubble.style.transform = `translate(${newX}px, ${newY}px)`; // Option 1
    // Or stick to top/left if transform is used elsewhere (like float/pop)
    activeBubble.style.left = `${newX}px`; // Option 2 (Safer with other transforms)
    activeBubble.style.top = `${newY}px`;
  };

  const dragEnd = () => {
    if (!activeBubble) return;

    const wasDragging = isDragging; // Capture drag state before resetting bubble

    activeBubble.classList.remove('dragging');
    // Only resume animation if it wasn't popping
     if (!activeBubble.classList.contains('burst')) {
        activeBubble.style.animationPlayState = 'running'; // Resume float
     }


    if (isTouchDevice()) {
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('touchend', dragEnd);
    } else {
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
    }

    activeBubble = null;

     // Reset isDragging flag *after* potential click handler runs
     // The click handler now checks this flag
     // The setTimeout ensures click handler check happens first
     // setTimeout(() => { isDragging = false; }, 0); // Moved reset into click handler logic
  };

  if (isTouchDevice()) {
    bubble.addEventListener('touchstart', dragStart, { passive: true }); // Passive true for start is okay
  } else {
    bubble.addEventListener('mousedown', dragStart);
  }

  bubble.addEventListener('dragstart', (e) => e.preventDefault());
});

// Keep the resize listener as before
window.addEventListener('resize', () => {
    const containerRect = skillsContainer.getBoundingClientRect();
    skillBubbles.forEach(bubble => {
        if (bubble.classList.contains('burst')) return; // Don't reposition bursting bubbles

        let currentLeft = parseFloat(bubble.style.left);
        let currentTop = parseFloat(bubble.style.top);
        // Use offsetWidth/offsetHeight for more reliable dimensions
        const bubbleWidth = bubble.offsetWidth;
        const bubbleHeight = bubble.offsetHeight;

        if (currentLeft + bubbleWidth > containerRect.width) {
            bubble.style.left = `${containerRect.width - bubbleWidth - 5}px`;
        }
        if (currentTop + bubbleHeight > containerRect.height) {
             bubble.style.top = `${containerRect.height - bubbleHeight - 5}px`;
        }
         if (currentLeft < 0) {
            bubble.style.left = '5px';
        }
        if (currentTop < 0) {
             bubble.style.top = '5px';
        }
    });
});
