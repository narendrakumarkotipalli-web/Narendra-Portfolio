import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [activeNav, setActiveNav] = useState('hero');
  const [scrollTopVisible, setScrollTopVisible] = useState(false);
  
  // Refs for logic
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const canvasRef = useRef(null);
  const timelineLineRef = useRef(null);

  // ═══════════════════════════════════
  // LOADER
  // ═══════════════════════════════════
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // ═══════════════════════════════════
  // CUSTOM CURSOR
  // ═══════════════════════════════════
  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${mouseX}px`;
        cursorDotRef.current.style.top = `${mouseY}px`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${ringX}px`;
        cursorRingRef.current.style.top = `${ringY}px`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animateRing();

    // Hover detection for ring
    const handleMouseEnter = () => cursorRingRef.current?.classList.add('hovering');
    const handleMouseLeave = () => cursorRingRef.current?.classList.remove('hovering');

    const interactiveElements = document.querySelectorAll('a, button, .skill-pill, .stat-card, .project-card, .social-link, .contact-item, .magnetic');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // ═══════════════════════════════════
  // PARTICLES CANVAS
  // ═══════════════════════════════════
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    let rafId;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '59,130,246' : '124,58,237';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ═══════════════════════════════════
  // TYPING EFFECT
  // ═══════════════════════════════════
  useEffect(() => {
    const roles = ['Full Stack Developer', 'React & TypeScript Expert', 'API Architect', 'AI Platform Builder'];
    let roleIdx = 0, charIdx = 0, deleting = false;
    let timer;

    const type = () => {
      const current = roles[roleIdx];
      if (!deleting) {
        setTypingText(current.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === current.length) {
          timer = setTimeout(() => { deleting = true; type(); }, 2200);
          return;
        }
        timer = setTimeout(type, 80);
      } else {
        setTypingText(current.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          timer = setTimeout(type, 400);
          return;
        }
        timer = setTimeout(type, 45);
      }
    };

    const initialTimer = setTimeout(type, 1600);
    return () => {
      clearTimeout(timer);
      clearTimeout(initialTimer);
    };
  }, []);

  // ═══════════════════════════════════
  // INTERSECTION OBSERVERS
  // ═══════════════════════════════════
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

    // Counter Animation Logic
    const animateCounter = (el, target, suffix = '') => {
      let start = 0;
      const duration = 1500;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(eased * target);
        el.textContent = val + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'));
          if (el.classList.contains('counter-pct')) animateCounter(el, target, '%');
          else animateCounter(el, target, '+');
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter, .counter-pct').forEach(el => counterObs.observe(el));

    // Timeline line
    const tlObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && timelineLineRef.current) {
          timelineLineRef.current.classList.add('visible');
          tlObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    if (timelineLineRef.current) tlObs.observe(timelineLineRef.current);

    return () => {
      revealObserver.disconnect();
      counterObs.disconnect();
      tlObs.disconnect();
    };
  }, []);

  // ═══════════════════════════════════
  // SCROLL LOGIC (NAV & TOP BTN)
  // ═══════════════════════════════════
  useEffect(() => {
    const handleScroll = () => {
      // Scroll to top visibility
      setScrollTopVisible(window.scrollY > 500);

      // Active Nav
      const sections = document.querySelectorAll('section[id], div[id]');
      let current = 'hero';
      sections.forEach(s => {
        if (window.scrollY + 100 >= s.offsetTop) current = s.id;
      });
      setActiveNav(current);

      // Navbar bg
      const nav = document.getElementById('navbar');
      if (nav) {
        nav.style.background = window.scrollY > 20 ? 'rgba(4,4,10,0.92)' : 'rgba(4,4,10,0.7)';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ═══════════════════════════════════
  // 3D TILT EFFECT
  // ═══════════════════════════════════
  useEffect(() => {
    const tiltElements = document.querySelectorAll('#tilt-card, .project-card, .stat-card');
    
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg) translateZ(8px)`;
    };

    const handleMouseLeave = (card) => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
      card.style.transition = 'transform 0.5s ease';
    };

    const handleMouseEnter = (card) => {
      card.style.transition = 'none';
    };

    tiltElements.forEach(card => {
      card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
      card.addEventListener('mouseleave', () => handleMouseLeave(card));
      card.addEventListener('mouseenter', () => handleMouseEnter(card));
    });

    return () => {
      tiltElements.forEach(card => {
        card.removeEventListener('mousemove', (e) => handleMouseMove(e, card));
        card.removeEventListener('mouseleave', () => handleMouseLeave(card));
        card.removeEventListener('mouseenter', () => handleMouseEnter(card));
      });
    };
  }, []);

  // ═══════════════════════════════════
  // FLOATING BADGES IN HERO
  // ═══════════════════════════════════
  useEffect(() => {
    const badgeTexts = ['React', 'TypeScript', 'FastAPI', 'Python', 'Node.js', 'MongoDB', 'Docker', 'Redis'];
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const spawnBadge = () => {
      const badge = document.createElement('div');
      badge.className = 'float-badge';
      badge.textContent = badgeTexts[Math.floor(Math.random() * badgeTexts.length)];
      badge.style.left = Math.random() * 80 + 5 + '%';
      badge.style.bottom = '-30px';
      badge.style.animationDuration = (8 + Math.random() * 6) + 's';
      badge.style.opacity = '0';
      badge.style.position = 'absolute';
      heroSection.appendChild(badge);
      setTimeout(() => badge.remove(), 14000);
    };

    const interval = setInterval(spawnBadge, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = async (e) => {
    const btn = e.currentTarget;
    const nameEl = document.getElementById('f-name');
    const emailEl = document.getElementById('f-email');
    const msgEl = document.getElementById('f-msg');
    
    if (!nameEl || !emailEl || !msgEl) return;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const msg = msgEl.value.trim();

    // Ripple
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left - 5}px`;
    ripple.style.top = `${e.clientY - rect.top - 5}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    const oldText = btn.innerHTML;

    if (!name || !email || !msg) {
      btn.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
      btn.textContent = '⚠ Fill all fields';
      setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = oldText;
      }, 2000);
      return;
    }

    btn.innerHTML = '<span>Sending...</span>';
    btn.style.pointerEvents = 'none';

    try {
      // Using FormSubmit.co for direct email delivery
      const response = await fetch("https://formsubmit.co/ajax/narendrakumarkotipalli@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: msg,
          _subject: "New Contact Form Submission - Portfolio",
          _captcha: "false",
          _template: "table"
        })
      });

      if (response.ok) {
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.innerHTML = '✓ Message Sent Successfully!';
        nameEl.value = '';
        emailEl.value = '';
        msgEl.value = '';
      } else {
        const errorText = await response.text();
        console.error("Form Submission Error:", errorText);
        throw new Error("Failed to submit form");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      btn.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
      btn.innerHTML = '✖ Error Sending';
    } finally {
      setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = oldText;
        btn.style.pointerEvents = 'all';
      }, 3000);
    }
  };

  return (
    <>
      {/* Custom Cursor */}
      <div id="cursor-dot" ref={cursorDotRef}></div>
      <div id="cursor-ring" ref={cursorRingRef}></div>

      {/* Page Loader */}
      <div id="loader" className={isLoaded ? 'hidden' : ''}>
        <div className="loader-monogram">KNK</div>
        <div className="loader-bar"><div className="loader-fill"></div></div>
      </div>

      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* Navbar */}
      <nav id="navbar">
        <a href="#hero" className="nav-logo">KNK</a>
        <ul className="nav-links">
          <li><a href="#hero" className={activeNav === 'hero' ? 'active' : ''}>Home</a></li>
          <li><a href="#about" className={activeNav === 'about' ? 'active' : ''}>About</a></li>
          <li><a href="#skills" className={activeNav === 'skills' ? 'active' : ''}>Skills</a></li>
          <li><a href="#projects" className={activeNav === 'projects' ? 'active' : ''}>Projects</a></li>
          <li><a href="#experience" className={activeNav === 'experience' ? 'active' : ''}>Experience</a></li>
          <li><a href="#contact-wrap" className={activeNav === 'contact-wrap' ? 'active' : ''}>Contact</a></li>
        </ul>
        <button 
          className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
          id="hamburger" 
          aria-label="Menu"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
          }}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} id="mobile-menu">
        {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact'].map((item, idx) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase().replace(' ', '-')}${item === 'Contact' ? '-wrap' : ''}`} 
            className="mob-link"
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            {item}
          </a>
        ))}
      </div>

      {/* HERO SECTION */}
      <section id="hero">
        <canvas id="particles-canvas" ref={canvasRef}></canvas>
        <div className="hero-grid-overlay"></div>
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-tag">
              <span className="hero-tag-dot"></span>
              Available for new opportunities
            </div>
            <div className="hero-greeting">Hi there, I'm</div>
            <h1 className="hero-name">Narendra Kumar<br/>Kotipalli</h1>
            <div className="hero-role-wrapper">
              <span className="hero-role-prefix">I am a</span>
              <span id="typing-text">{typingText}</span><span className="typing-cursor"></span>
            </div>
            <p className="hero-bio">Full Stack Developer crafting intelligent, scalable web platforms — from React UIs to FastAPI backends and AI-powered automation. Building the future, one commit at a time.</p>
            <div className="hero-ctas">
              <a href="#projects" className="btn-primary magnetic">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                View My Work
              </a>
              <a href="/Narendra_Resume_FS.pdf" className="btn-ghost magnetic" download="Narendra_Resume_FS.pdf">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Resume
              </a>
            </div>
            <div className="hero-socials">
              <a href="https://github.com/" className="social-link magnetic" target="_blank" title="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com/in/narendra-kumar-kotipalli" className="social-link magnetic" target="_blank" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="mailto:narendrakumarkotipalli@gmail.com" className="social-link magnetic" title="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-code-card" id="tilt-card">
              <div className="code-header">
                <div className="code-dot code-dot-r"></div>
                <div className="code-dot code-dot-y"></div>
                <div className="code-dot code-dot-g"></div>
                <span className="code-filename">developer.ts</span>
              </div>
              <div className="code-content">
                <span className="code-line"><span className="code-keyword">const</span> <span className="code-var">developer</span> <span className="code-punct">=</span> <span className="code-punct">{'{'}</span></span>
                <span className="code-line code-indent"><span className="code-fn">name</span><span className="code-punct">:</span> <span className="code-string">"Narendra Kumar"</span><span className="code-punct">,</span></span>
                <span className="code-line code-indent"><span className="code-fn">role</span><span className="code-punct">:</span> <span className="code-string">"Full Stack Developer"</span><span className="code-punct">,</span></span>
                <span className="code-line code-indent"><span className="code-fn">experience</span><span className="code-punct">:</span> <span className="code-string">"2+ years"</span><span className="code-punct">,</span></span>
                <span className="code-line code-indent"><span className="code-fn">location</span><span className="code-punct">:</span> <span className="code-string">"Hyderabad, IN"</span><span className="code-punct">,</span></span>
                <span className="code-line code-indent code-highlight"><span className="code-fn">stack</span><span className="code-punct">:</span> <span className="code-punct">[</span><span className="code-string">"React"</span><span className="code-punct">,</span> <span className="code-string">"FastAPI"</span><span className="code-punct">,</span> <span className="code-string">"Python"</span><span className="code-punct">],</span></span>
                <span className="code-line code-indent"><span className="code-fn">aiProjects</span><span className="code-punct">:</span> <span className="code-num">2</span><span className="code-punct">,</span></span>
                <span className="code-line code-indent"><span className="code-fn">passion</span><span className="code-punct">:</span> <span className="code-string">"Building intelligent platforms"</span><span className="code-punct">,</span></span>
                <span className="code-line code-indent"><span className="code-fn">openToWork</span><span className="code-punct">:</span> <span className="code-keyword">true</span></span>
                <span className="code-line"><span className="code-punct">{'}'};</span></span>
                <br/>
                <span className="code-line"><span className="code-comment">// Currently crafting AI-powered experiences</span></span>
                <span className="code-line"><span className="code-keyword">export default</span> <span className="code-var">developer</span><span className="code-punct">;</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <div className="section-divider"></div>
      <section id="about">
        <div className="about-grid">
          <div className="about-visual reveal-left">
            <div className="about-avatar-wrap">
              <div className="about-avatar-bg"></div>
              <div className="about-monogram-large">KNK</div>
              <div className="about-avatar-ring"></div>
              <div className="about-avatar-ring2"></div>
              <div className="about-floating-elem top-right"> 2yr exp</div>
              <div className="about-floating-elem bottom-left"> AI Builder</div>
            </div>
          </div>
          <div className="about-text reveal-right">
            <div className="section-tag">About Me</div>
            <h2 className="section-title">From Mechanical Gears to <span>Digital Products</span></h2>
            <p>Started as a Mechanical Engineering graduate, I discovered a passion for building things that live on screens — and never looked back. Through relentless self-study and real-world projects, I transitioned into a <strong>Full Stack Developer at FISClouds Pvt. Ltd.</strong></p>
            <p>Today, I architect enterprise-grade platforms that merge beautiful React frontends with powerful FastAPI backends — and increasingly, AI systems that automate and augment human workflows. I thrive at the intersection of <strong>performance, design, and intelligence</strong>.</p>
            <div className="stats-grid">
              <div className="stat-card reveal delay-1">
                <div className="stat-num counter" data-target="2">0</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-card reveal delay-2">
                <div className="stat-num counter" data-target="2">0</div>
                <div className="stat-label">AI Platforms Built</div>
              </div>
              <div className="stat-card reveal delay-3">
                <div className="stat-num counter-pct" data-target="30">0</div>
                <div className="stat-label">Defect Reduction</div>
              </div>
              <div className="stat-card reveal delay-4">
                <div className="stat-num counter-pct" data-target="70">0</div>
                <div className="stat-label">Faster Documentation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <div className="section-divider"></div>
      <div id="skills">
        <div className="skills-section-wrap">
          <div className="section-tag reveal">Tech Arsenal</div>
          <h2 className="section-title reveal delay-1">Tools I <span>Wield Daily</span></h2>
          <br/>
          <div className="skills-categories">
            {[
              {
                title: 'Frontend',
                skills: ['React.js', 'TypeScript', 'Redux Toolkit', 'Next.js', 'React Flow', 'JavaScript ES6+'],
                color: 'blue',
                delay: 'delay-1'
              },
              {
                title: 'UI & Styling',
                skills: ['Tailwind CSS', 'Material UI', 'Bootstrap 5', 'SASS/SCSS', 'HTML5', 'CSS3'],
                color: 'violet',
                delay: 'delay-2'
              },
              {
                title: 'Backend',
                skills: ['Node.js', 'Express.js', 'Python', 'FastAPI', 'REST APIs', 'JWT Auth', 'WebSockets'],
                color: 'cyan',
                delay: 'delay-3'
              },
              {
                title: 'Database',
                skills: ['MongoDB', 'PostgreSQL', 'Redis', 'BigQuery'],
                color: 'emerald',
                delay: 'delay-2'
              },
              {
                title: 'Cloud & DevOps',
                skills: ['Docker', 'GCP', 'GitHub Actions', 'GitLab CI/CD'],
                color: 'amber',
                delay: 'delay-3'
              },
              {
                title: 'Tools & Workflow',
                skills: ['Git', 'Postman', 'JIRA', 'Agile/Scrum', 'Bitbucket'],
                color: 'rose',
                delay: 'delay-4'
              }
            ].map((cat, i) => (
              <div key={i} className={`reveal ${cat.delay}`}>
                <div className="skill-category-title">{cat.title}</div>
                <div className="skills-pills">
                  {cat.skills.map((s, j) => (
                    <span key={j} className={`skill-pill pill-${cat.color}`}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECTS SECTION */}
      <div className="section-divider"></div>
      <section id="projects">
        <div className="section-tag reveal">Featured Work</div>
        <h2 className="section-title reveal delay-1">Products I've <span>Shipped</span></h2>
        <br/><br/>
        <div className="projects-stack">
          {/* Project 1 */}
          <div className="project-card reveal" id="pc1">
            <div className="project-glow glow-blue"></div>
            <div className="project-meta">
              <div className="project-tags-row">
                <span className="project-tag-badge tag-ai">AI</span>
                <span className="project-tag-badge tag-auto">Automation</span>
                <span className="project-tag-badge tag-ent">Enterprise</span>
              </div>
              <h3 className="project-title">Gurita AI</h3>
              <p className="project-desc">An enterprise-grade AI agent automation platform featuring a visual drag-and-drop workflow builder, RAG-powered data pipelines, real-time WebSocket streaming, and intelligent dashboards.</p>
              <div className="project-highlights">
                <div className="project-highlight">Visual drag-and-drop workflow builder with React Flow</div>
                <div className="project-highlight">RAG-powered AI querying with chart generation</div>
                <div className="project-highlight">Role-based access control + shareable dashboards</div>
                <div className="project-highlight">Real-time WebSocket streaming for live AI outputs</div>
              </div>
              <div className="project-techs">
                {['React', 'TypeScript', 'Redux Toolkit', 'React Flow', 'Node.js', 'FastAPI', 'Python', 'MongoDB', 'WebSockets'].map(t => (
                  <span key={t} className="tech-chip">{t}</span>
                ))}
              </div>
            </div>
            <div className="project-visual">
              <img src="/gurita_ai.png" alt="Gurita AI Dashboard" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
            </div>
          </div>

          {/* Project 2 */}
          <div className="project-card reverse reveal" id="pc2">
            <div className="project-glow glow-violet"></div>
            <div className="project-meta">
              <div className="project-tags-row">
                <span className="project-tag-badge tag-ai">AI</span>
                <span className="project-tag-badge tag-bio">Biomedical</span>
                <span className="project-tag-badge tag-health">Healthcare</span>
              </div>
              <h3 className="project-title">Curie</h3>
              <p className="project-desc">An AI-powered biomedical research platform for literature curation, hypothesis generation, and clinical documentation — reducing documentation time by 70%.</p>
              <div className="project-highlights">
                <div className="project-highlight">Full-stack AI document generation (70% time reduction)</div>
                <div className="project-highlight">Intelligent literature curation + hypothesis generation</div>
                <div className="project-highlight">Document parsing APIs with structured output</div>
                <div className="project-highlight">WebSocket streaming for long-running AI tasks</div>
              </div>
              <div className="project-techs">
                {['React', 'TypeScript', 'MUI', 'Node.js', 'FastAPI', 'Python', 'MongoDB', 'WebSockets'].map(t => (
                  <span key={t} className="tech-chip">{t}</span>
                ))}
              </div>
            </div>
            <div className="project-visual">
              <img src="/curie.png" alt="Curie AI Platform" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <div className="section-divider"></div>
      <section id="experience">
        <div className="section-tag reveal">Career Path</div>
        <h2 className="section-title reveal delay-1">Work <span>Experience</span></h2>
        <br/><br/>
        <div className="timeline-container">
          <div className="timeline-line" id="timeline-line" ref={timelineLineRef}></div>
          <div className="timeline-item reveal delay-1">
            <div className="timeline-node"></div>
            <div className="timeline-card">
              <div className="timeline-header">
                <div className="timeline-role">Full Stack Developer</div>
                <div className="timeline-date">Jan 2023 — Present</div>
              </div>
              <div className="timeline-company">@ <strong>FISClouds Pvt. Ltd.</strong> · Hyderabad, India</div>
              <div className="timeline-points">
                <div className="timeline-point"><div className="timeline-point-dot"></div>Led a 3-member UI team delivering complex enterprise frontend systems end-to-end</div>
                <div className="timeline-point"><div className="timeline-point-dot"></div>Architected scalable React applications with TypeScript and Redux Toolkit for AI platforms</div>
                <div className="timeline-point"><div className="timeline-point-dot"></div>Built secure FastAPI backends with JWT authentication, WebSockets, and RESTful APIs</div>
                <div className="timeline-point"><div className="timeline-point-dot"></div>Reduced production defects by <strong style={{color:'var(--blue-light)'}}>30%</strong> through rigorous code review practices and testing</div>
                <div className="timeline-point"><div className="timeline-point-dot"></div>Shipped two full AI platforms: <strong style={{color:'var(--violet-light)'}}>Gurita AI</strong> and <strong style={{color:'var(--violet-light)'}}>Curie</strong> from 0 to production</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <div className="section-divider"></div>
      <section id="education">
        <div className="section-tag reveal">Academic Background</div>
        <h2 className="section-title reveal delay-1">Education</h2>
        <br/><br/>
        <div className="edu-card reveal delay-2">
          <div className="edu-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <div className="edu-degree">B.Tech — Mechanical Engineering</div>
            <div className="edu-college">Aditya College of Engineering, Surampalem</div>
            <div className="edu-year">July 2018 — May 2021</div>
            <div className="edu-note">"Transitioned from Mechanical Engineering to Full Stack Development through self-driven learning, passion for technology, and real-world project experience."</div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <div className="section-divider"></div>
      <div id="contact-wrap">
        <section>
          <div className="contact-grid">
            <div className="reveal-left">
              <div className="section-tag">Get In Touch</div>
              <h2 className="contact-heading">Let's Build<br/><span>Something Great</span></h2>
              <p className="contact-sub">I'm always excited to work on ambitious projects. Whether you have a product idea, a challenge to solve, or just want to chat — my inbox is open.</p>
              <div className="contact-details">
                <a href="mailto:narendrakumarkotipalli@gmail.com" className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <div className="contact-item-label">Email</div>
                    <div className="contact-item-val">narendrakumarkotipalli@gmail.com</div>
                  </div>
                </a>
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.18 9.81 19.79 19.79 0 0 1 1.08 2.2 2 2 0 0 1 3.06.02h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 14.92z"/></svg>
                  </div>
                  <div>
                    <div className="contact-item-label">Phone</div>
                    <div className="contact-item-val">+91 7702925319</div>
                  </div>
                </div>
                <a href="https://linkedin.com/in/narendra-kumar-kotipalli" className="contact-item" target="_blank">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <div>
                    <div className="contact-item-label">LinkedIn</div>
                    <div className="contact-item-val">linkedin.com/in/narendra-kumar-kotipalli</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="reveal-right delay-2">
              <div className="contact-form" id="contact-form">
                <div className="form-group">
                  <label>Your Name <span style={{color: '#f43f5e'}}>*</span></label>
                  <input type="text" placeholder="John Doe" id="f-name" required />
                </div>
                <div className="form-group">
                  <label>Email Address <span style={{color: '#f43f5e'}}>*</span></label>
                  <input type="email" placeholder="john@company.com" id="f-email" required />
                </div>
                <div className="form-group">
                  <label>Message <span style={{color: '#f43f5e'}}>*</span></label>
                  <textarea placeholder="Tell me about your project..." id="f-msg" required></textarea>
                </div>
                <button 
                  className="btn-send magnetic" 
                  id="send-btn" 
                  type="button"
                  onClick={handleContactSubmit}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-socials">
        
          <a href="https://linkedin.com/in/narendra-kumar-kotipalli" className="footer-social" target="_blank" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="mailto:narendrakumarkotipalli@gmail.com" className="footer-social" title="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
        </div>
        <div className="footer-copy">© 2025 <span>Narendra Kumar Kotipalli</span> · Built with passion & precision</div>
      </footer>

      {/* Scroll to top */}
      <button 
        id="scroll-top" 
        className={scrollTopVisible ? 'visible' : ''} 
        title="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </>
  );
}

export default App;
