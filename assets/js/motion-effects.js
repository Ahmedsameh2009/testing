/**
 * Enhanced Motion Effects - Handles advanced UI animations and interactions
 * - Motion background with parallax and motion blur
 * - Custom cursor with ripple effects
 * - Scroll animations with intersection observer
 * - Theme transition effects
 * - Performance optimized with requestAnimationFrame
 */

class MotionEffects {
  constructor() {
    // Motion background elements
    this.motionBackground = null;
    this.layers = [];
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;
    this.mouseVelocity = { x: 0, y: 0 };
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    // Custom cursor elements
    this.cursor = null;
    this.cursorDot = null;
    this.cursorVisible = true;
    this.cursorHover = false;
    this.cursorActive = false;
    this.cursorTrail = [];
    this.maxTrailLength = 8;
    
    // Scroll animation elements
    this.animatedElements = [];
    this.staggerGroups = [];
    this.intersectionObserver = null;
    
    // Performance optimization
    this.animationFrameId = null;
    this.lastScrollTime = 0;
    this.lastMouseMoveTime = 0;
    this.scrollThrottle = 16; // ~60fps
    this.mouseMoveThrottle = 8; // ~120fps
    
    // Check if reduced motion is preferred
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize
    this.init();
  }
  
  init() {
    console.log('MotionEffects init started...');
    
    // Create motion background
    this.createMotionBackground();
    
    // Create custom cursor
    this.createCustomCursor();
    
    // Setup scroll animations with Intersection Observer
    this.setupScrollAnimations();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start animation loop
    this.startAnimationLoop();
    
    // Initial animations
    this.animatePageTransition();
    
    console.log('MotionEffects init completed');
  }
  
  createMotionBackground() {
    // Skip if reduced motion is preferred
    if (this.prefersReducedMotion) {
      console.log('Motion background disabled due to prefers-reduced-motion');
      return;
    }
    
    console.log('Creating motion background...');
    
    // Create container
    this.motionBackground = document.createElement('div');
    this.motionBackground.className = 'motion-background';
    this.motionBackground.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      will-change: transform;
    `;
    document.body.appendChild(this.motionBackground);
    
    // Create interactive grid element
    this.gridElement = document.createElement('div');
    this.gridElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255, 255, 255, 0.08) 40px, rgba(255, 255, 255, 0.08) 41px),
        repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255, 255, 255, 0.08) 40px, rgba(255, 255, 255, 0.08) 41px),
        repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(255, 255, 255, 0.03) 60px, rgba(255, 255, 255, 0.03) 61px),
        repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(255, 255, 255, 0.03) 60px, rgba(255, 255, 255, 0.03) 61px);
      pointer-events: none;
      will-change: transform;
      z-index: -1;
    `;
    this.motionBackground.appendChild(this.gridElement);
    
    console.log('Motion background container created');
    
    // Create layers with enhanced parallax
    for (let i = 1; i <= 4; i++) {
      const layer = document.createElement('div');
      layer.className = `layer layer-${i}`;
      layer.style.cssText = `
        position: absolute;
        inset: -100px;
        will-change: transform;
        transition: transform 0.15s linear;
        filter: blur(1px);
      `;
      
      // Set different background gradients for each layer
      if (i === 1) {
        layer.style.background = 'radial-gradient(1400px 900px at 10% -10%, rgba(34, 56, 111, 0.12), transparent 70%)';
        layer.style.filter = 'blur(25px)';
      } else if (i === 2) {
        layer.style.background = 'radial-gradient(1200px 700px at 110% 10%, rgba(220, 38, 38, 0.10), transparent 70%)';
        layer.style.filter = 'blur(35px)';
      } else if (i === 3) {
        layer.style.background = 'radial-gradient(1600px 1100px at 50% 100%, rgba(22, 163, 74, 0.04), transparent 70%)';
        layer.style.filter = 'blur(30px)';
      } else if (i === 4) {
        layer.style.background = 'radial-gradient(800px 600px at 80% 20%, rgba(245, 158, 11, 0.08), transparent 70%)';
        layer.style.filter = 'blur(40px)';
      }
      
      this.motionBackground.appendChild(layer);
      this.layers.push(layer);
    }
    
    console.log('Motion background layers created:', this.layers.length);
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
      position: absolute;
      inset: 0;
      opacity: 0.4;
      filter: blur(0.5px);
    `;
    this.motionBackground.appendChild(particlesContainer);
    
    // Create floating particles with enhanced animation
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 8px and 25px
      const size = 8 + Math.random() * 17;
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(34, 56, 111, 0.15);
        border-radius: 50%;
        filter: blur(10px);
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      
      // Enhanced random animation with different patterns
      const duration = 20 + Math.random() * 40;
      const delay = Math.random() * 10;
      const animationType = Math.random() > 0.5 ? 'float' : 'pulse';
      particle.style.animation = `${animationType} ${duration}s ease-in-out ${delay}s infinite alternate`;
      
      // Add subtle rotation
      if (Math.random() > 0.7) {
        particle.style.animation += `, rotate ${duration * 2}s linear ${delay}s infinite`;
      }
      
      // Different colors for variety
      if (i % 3 === 0) {
        particle.style.background = 'rgba(22, 163, 74, 0.1)';
      } else if (i % 3 === 1) {
        particle.style.background = 'rgba(245, 158, 11, 0.08)';
      }
      
      particlesContainer.appendChild(particle);
      this.particles.push(particle);
    }
    
    // Create floating icons container
    const iconsContainer = document.createElement('div');
    iconsContainer.className = 'floating-icons';
    iconsContainer.style.cssText = `
      position: absolute;
      inset: 0;
      opacity: 0.3;
      pointer-events: none;
    `;
    this.motionBackground.appendChild(iconsContainer);
    
    // Array of SVG icons to use
    const icons = [
      // Dashboard icons
      '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
      // Settings icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
      // Chart icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      // Clock icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>',
      // Alert icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      // Check icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><polyline points="20,6 9,17 4,12"></polyline></svg>',
      // Home icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
      // User icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
      // File icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
      // Search icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',
      // Star icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
      // Heart icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
      // Lightning icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      // Shield icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
      // Target icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
      // Zap icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      // Activity icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
      // Trending up icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
      // Database icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
      // Server icon
      '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>'
    ];
    
    // Create floating geometric shapes
    for (let i = 0; i < 25; i++) {
      const shapeElement = document.createElement('div');
      shapeElement.className = 'floating-shape';
      
      // Random size between 20px and 80px
      const size = 20 + Math.random() * 60;
      
      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Random shape type: 0=circle, 1=square, 2=triangle, 3=line
      const shapeType = Math.floor(Math.random() * 4);
      
      // Random color
      const colors = [
        'rgba(59, 130, 246, 0.3)',
        'rgba(16, 185, 129, 0.3)',
        'rgba(245, 158, 11, 0.3)',
        'rgba(239, 68, 68, 0.3)',
        'rgba(139, 92, 246, 0.3)',
        'rgba(236, 72, 153, 0.3)'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      let shapeStyles = `
        position: absolute;
        left: ${left}%;
        top: ${top}%;
        pointer-events: none;
        will-change: transform;
        transition: transform 0.3s ease;
        opacity: 0.4;
      `;
      
      // Different shape styles
      if (shapeType === 0) {
        // Circle
        shapeStyles += `
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 2px solid ${randomColor};
          background: transparent;
        `;
      } else if (shapeType === 1) {
        // Square
        shapeStyles += `
          width: ${size}px;
          height: ${size}px;
          border: 2px solid ${randomColor};
          background: transparent;
          transform: rotate(${Math.random() * 45}deg);
        `;
      } else if (shapeType === 2) {
        // Triangle
        shapeStyles += `
          width: 0;
          height: 0;
          border-left: ${size/2}px solid transparent;
          border-right: ${size/2}px solid transparent;
          border-bottom: ${size}px solid ${randomColor};
          background: transparent;
        `;
      } else {
        // Line
        shapeStyles += `
          width: ${size * 2}px;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${randomColor}, transparent);
          transform: rotate(${Math.random() * 360}deg);
        `;
      }
      
      shapeElement.style.cssText = shapeStyles;
      
      // Add floating animation with variety
      const duration = 20 + Math.random() * 15;
      const delay = Math.random() * 10;
      shapeElement.style.animation = `geometricFloat ${duration}s ease-in-out ${delay}s infinite alternate`;
      
      iconsContainer.appendChild(shapeElement);
      this.floatingShapes = this.floatingShapes || [];
      this.floatingShapes.push(shapeElement);
    }
    
    console.log('Motion background particles created:', this.particles.length);
    console.log('Floating geometric shapes created:', this.floatingShapes ? this.floatingShapes.length : 0);
    console.log('Motion background setup complete');
  }
  
  createCustomCursor() {
    // Skip if reduced motion is preferred
    if (this.prefersReducedMotion) return;
    
    // Create cursor elements
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);
    
    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(this.cursorDot);
    
    // Create cursor trail elements
    for (let i = 0; i < this.maxTrailLength; i++) {
      const trailDot = document.createElement('div');
      trailDot.className = 'custom-cursor-trail';
      trailDot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background-color: rgba(var(--primary-rgb), ${0.3 - (i * 0.03)});
        border-radius: 50%;
        pointer-events: none;
        z-index: ${9998 - i};
        transition: transform 0.1s ease;
      `;
      document.body.appendChild(trailDot);
      this.cursorTrail.push(trailDot);
    }
    
    // Set initial position off-screen
    this.cursor.style.top = '-100px';
    this.cursor.style.left = '-100px';
    this.cursorDot.style.top = '-100px';
    this.cursorDot.style.left = '-100px';
    
    // Add interactive elements for hover effect
    this.setupInteractiveElements();
  }
  
  setupInteractiveElements() {
    const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-btn, .card, .kpi-card, input, select, .icon, .history-card-delete');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursorHover = true;
        this.cursor.classList.add('hover');
        this.cursorDot.classList.add('hover');
      });
      
      el.addEventListener('mouseleave', () => {
        this.cursorHover = false;
        this.cursor.classList.remove('hover');
        this.cursorDot.classList.remove('hover');
      });
      
      el.addEventListener('mousedown', () => {
        this.cursorActive = true;
        this.cursor.classList.add('active');
        this.cursorDot.classList.add('active');
      });
      
      el.addEventListener('mouseup', () => {
        this.cursorActive = false;
        this.cursor.classList.remove('active');
        this.cursorDot.classList.remove('active');
      });
      
      // Add click ripple effect
      el.addEventListener('click', (e) => {
        this.createRippleEffect(e);
      });
    });
    
    // Watch for dynamically added elements
    this.observeNewElements();
  }
  
  observeNewElements() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const interactiveElements = node.querySelectorAll ? 
              node.querySelectorAll('a, button, .btn, .nav-btn, .card, .kpi-card, input, select, .icon, .history-card-delete') : 
              [];
            
            if (node.matches && node.matches('a, button, .btn, .nav-btn, .card, .kpi-card, input, select, .icon, .history-card-delete')) {
              interactiveElements.push(node);
            }
            
            interactiveElements.forEach(el => {
              this.addInteractiveListeners(el);
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  addInteractiveListeners(el) {
    el.addEventListener('mouseenter', () => {
      this.cursorHover = true;
      this.cursor.classList.add('hover');
      this.cursorDot.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      this.cursorHover = false;
      this.cursor.classList.remove('hover');
      this.cursorDot.classList.remove('hover');
    });
    
    el.addEventListener('mousedown', () => {
      this.cursorActive = true;
      this.cursor.classList.add('active');
      this.cursorDot.classList.add('active');
    });
    
    el.addEventListener('mouseup', () => {
      this.cursorActive = false;
      this.cursor.classList.remove('active');
      this.cursorDot.classList.remove('active');
    });
    
    el.addEventListener('click', (e) => {
      this.createRippleEffect(e);
    });
  }
  
  createRippleEffect(event) {
    if (this.prefersReducedMotion) return;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(var(--primary-rgb), 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
      z-index: 1000;
    `;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    event.currentTarget.style.position = 'relative';
    event.currentTarget.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  setupScrollAnimations() {
    // Use Intersection Observer for better performance
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add stagger effect for groups
          if (entry.target.classList.contains('stagger-group')) {
            entry.target.classList.add('visible');
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Find elements to animate
    this.animatedElements = document.querySelectorAll('.animate-on-scroll');
    this.staggerGroups = document.querySelectorAll('.stagger-group');
    
    // Observe elements
    this.animatedElements.forEach(el => {
      this.intersectionObserver.observe(el);
    });
    
    this.staggerGroups.forEach(group => {
      this.intersectionObserver.observe(group);
    });
  }
  
  setupEventListeners() {
    // Mouse move for parallax and cursor
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Mouse events for cursor visibility
    document.addEventListener('mouseenter', () => { this.cursorVisible = true; });
    document.addEventListener('mouseleave', () => { this.cursorVisible = false; });
    document.addEventListener('mousedown', () => { this.cursorActive = true; });
    document.addEventListener('mouseup', () => { this.cursorActive = false; });
    
    // Resize for recalculating dimensions
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Theme change for transition effects
    document.addEventListener('theme-change', this.handleThemeChange.bind(this));
    
    // Handle card hover effects
    document.addEventListener('mousemove', this.handleCardHover.bind(this));
  }
  
  handleMouseMove(e) {
    // Throttle mouse move events
    const now = Date.now();
    if (now - this.lastMouseMoveTime < this.mouseMoveThrottle) return;
    this.lastMouseMoveTime = now;
    
    // Calculate mouse velocity
    this.mouseVelocity.x = e.clientX - this.lastMouseX;
    this.mouseVelocity.y = e.clientY - this.lastMouseY;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    
    // Update mouse position
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }
  
  handleCardHover(e) {
    // Add hover effect to cards based on mouse position
    const cards = document.querySelectorAll('.card, .kpi-card, .history-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  }
  
  handleResize() {
    // Update center position for parallax effect
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;
    
    // Recheck elements in viewport
    this.checkElementsInViewport();
  }
  
  handleThemeChange() {
    // Add transition class to body for theme change animation
    document.body.classList.add('theme-transitioning');
    
    // Remove class after transition completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 600);
  }
  
  checkElementsInViewport() {
    // Skip if reduced motion is preferred
    if (this.prefersReducedMotion) {
      // Make all elements visible immediately
      this.animatedElements.forEach(el => el.classList.add('visible'));
      this.staggerGroups.forEach(group => group.classList.add('visible'));
      return;
    }
    
    // Check individual animated elements
    this.animatedElements.forEach(el => {
      if (this.isElementInViewport(el)) {
        el.classList.add('visible');
      }
    });
    
    // Check stagger groups
    this.staggerGroups.forEach(group => {
      if (this.isElementInViewport(group)) {
        group.classList.add('visible');
      }
    });
  }
  
  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Element is considered in viewport if its top is below the top of the viewport
    // and its bottom is above the bottom of the viewport minus a threshold
    const threshold = 100; // px from bottom of viewport
    return (
      rect.top <= windowHeight - threshold &&
      rect.bottom >= 0
    );
  }
  
  startAnimationLoop() {
    const animate = () => {
      this.updateCursor();
      this.updateMotionBackground();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  updateCursor() {
    if (!this.cursor || !this.cursorDot || this.prefersReducedMotion) return;
    
    // Update main cursor position with smooth interpolation
    const targetX = this.mouseX;
    const targetY = this.mouseY;
    
    const currentX = parseFloat(this.cursor.style.left) || targetX;
    const currentY = parseFloat(this.cursor.style.top) || targetY;
    
    const newX = currentX + (targetX - currentX) * 0.1;
    const newY = currentY + (targetY - currentY) * 0.1;
    
    this.cursor.style.transform = `translate(${newX}px, ${newY}px) translate(-50%, -50%)`;
    this.cursorDot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
    
    // Update cursor trail
    this.updateCursorTrail(targetX, targetY);
  }
  
  updateCursorTrail(x, y) {
    // Update trail positions
    for (let i = this.cursorTrail.length - 1; i > 0; i--) {
      const current = this.cursorTrail[i];
      const previous = this.cursorTrail[i - 1];
      
      const currentX = parseFloat(current.style.left) || x;
      const currentY = parseFloat(current.style.top) || y;
      const previousX = parseFloat(previous.style.left) || x;
      const previousY = parseFloat(previous.style.top) || y;
      
      const newX = currentX + (previousX - currentX) * 0.3;
      const newY = currentY + (previousY - currentY) * 0.3;
      
      current.style.transform = `translate(${newX}px, ${newY}px) translate(-50%, -50%)`;
    }
    
    // Update first trail element
    if (this.cursorTrail[0]) {
      this.cursorTrail[0].style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }
  }
  
  updateMotionBackground() {
    if (!this.layers.length || this.prefersReducedMotion) return;
    
    // Calculate distance from center with velocity influence
    const distX = this.mouseX - this.centerX + this.mouseVelocity.x * 2;
    const distY = this.mouseY - this.centerY + this.mouseVelocity.y * 2;
    
    // Move layers in opposite direction of mouse with different intensities
    this.layers.forEach((layer, index) => {
      const intensity = (index + 1) * 0.02; // Increased intensity for more visible effect
      const translateX = distX * intensity; // Removed negative to make it move opposite to cursor
      const translateY = distY * intensity; // Removed negative to make it move opposite to cursor
      
      // Add subtle rotation based on mouse movement
      const rotation = (distX * 0.0002) + (distY * 0.0002);
      
      layer.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
    });
    
    // Move grid in opposite direction of mouse with enhanced effect
    if (this.gridElement) {
      const gridIntensity = 0.15; // Much stronger effect for grid
      const gridTranslateX = distX * gridIntensity;
      const gridTranslateY = distY * gridIntensity;
      
      // Add subtle rotation for more dynamic effect
      const gridRotation = (distX + distY) * 0.0005;
      
      // Add scale effect based on mouse velocity for more dynamic feel
      const gridScale = 1 + Math.abs(this.mouseVelocity.x + this.mouseVelocity.y) * 0.0001;
      
      this.gridElement.style.transform = `translate(${gridTranslateX}px, ${gridTranslateY}px) rotate(${gridRotation}deg) scale(${gridScale})`;
    }
    
    // Also move particles slightly
    this.particles.forEach((particle, index) => {
      const intensity = 0.005 + (index % 3) * 0.002;
      const translateX = distX * intensity; // Removed negative to make it move opposite to cursor
      const translateY = distY * intensity; // Removed negative to make it move opposite to cursor
      
      const currentTransform = particle.style.transform || '';
      const baseTransform = currentTransform.replace(/translate\([^)]*\)/g, '');
      particle.style.transform = `translate(${translateX}px, ${translateY}px) ${baseTransform}`;
    });
    
    // Move floating geometric shapes with more pronounced effect
    if (this.floatingShapes) {
      this.floatingShapes.forEach((shape, index) => {
        const intensity = 0.03 + (index % 5) * 0.01; // More pronounced movement for shapes
        const translateX = distX * intensity; // Removed negative to make it move opposite to cursor
        const translateY = distY * intensity; // Removed negative to make it move opposite to cursor
        
        // Add subtle scale effect based on mouse movement
        const scale = 1 + Math.abs(distX + distY) * 0.0001;
        
        shape.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      });
    }
  }
  
  animatePageTransition() {
    // Add transition class to main content
    const mainContent = document.querySelector('.main');
    if (mainContent) {
      mainContent.classList.add('page-transition');
      
      // Trigger animation after a short delay
      setTimeout(() => {
        mainContent.classList.add('active');
      }, 50);
    }
  }
  
  // Public method to add shimmer loading effect
  addShimmerLoading(element) {
    if (this.prefersReducedMotion) return;
    
    element.classList.add('loading');
    
    // Remove loading class after animation
    setTimeout(() => {
      element.classList.remove('loading');
    }, 2000);
  }
  
  // Public method to trigger page transition
  triggerPageTransition() {
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
      section.classList.add('page-transition');
      setTimeout(() => {
        section.classList.add('active');
      }, 100);
    });
  }
  
  // Cleanup method
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Remove cursor elements
    if (this.cursor) this.cursor.remove();
    if (this.cursorDot) this.cursorDot.remove();
    this.cursorTrail.forEach(trail => trail.remove());
    
    // Remove motion background
    if (this.motionBackground) this.motionBackground.remove();
  }
}

// Initialize motion effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Motion Effects...');
  window.motionEffects = new MotionEffects();
  console.log('Motion Effects initialized:', window.motionEffects);
});

// Add CSS for ripple effect
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
  }
`;
document.head.appendChild(rippleStyles);