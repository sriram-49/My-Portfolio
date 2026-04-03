import { useState, useEffect, useRef, useCallback } from "react";

/* ─── THEME ──────────────────────────────────────────────────────────────── */
const T = {
  espresso: "#2C1A0E",
  caramel: "#9B6B2F",
  tan: "#C4914A",
  cream: "#F5ECD7",
  milk: "#FAF5EC",
  light: "#EDD9B8",
};

/* ─── DATA ───────────────────────────────────────────────────────────────── */
const NAV = ["Home", "About", "Education", "Skills", "Projects", "Certifications", "Contact"];

const PROJECTS = [
  { title: "MG Classifier", desc: "Music Genre Classification with ML. A machine learning project designed to classify songs into genres by analyzing their audio features and applying supervised learning algorithms.", tags: ["Python", "HTML", "CSS"], year: "2024", href: "https://github.com/sriram-49/Music-Genre-Classifier" },
  { title: "ClassQuiz", desc: "Interactive Educational Assessment Platform. An educational platform that helps educators simplify assessment work in an easy and interactive way.", tags: ["React", "Express", "TypeScript"], year: "2025", href: "https://github.com/sriram-49/ClassQuiz" },
  { title: "Ser-Wise", desc: "Smart Vehicle Service Management System. A comprehensive full-stack vehicle service center management system with role-based access control, AI-powered features, automated PDF receipts, and interactive analytics dashboards.", tags: ["Flask", "Python", "SQLite"], year: "2024", href: "https://github.com/sriram-49/Ser-Wise" },
  { title: "AutoQuizzer", desc: "AI-Powered Quiz Generation Platform. An AI-powered quiz generation platform using Google Gemini AI to automatically create educational quizzes from topics or uploaded documents with configurable difficulty levels.", tags: ["React", "TypeScript", "Node.js"], year: "2025", href: "https://github.com/sriram-49/AutoQuizzer" },
];

const SKILLS = {
  Languages: ["Python", "Java", "C", "C++", "JavaScript"],
  Frameworks: ["React", "Node.js", "FastAPI"],
  Databases: ["MongoDB", "SQLite", "Firebase"],
  Tools: ["Git", "GitHub", "Blender", "Figma", "Canva"],
  "Soft Skills": ["Problem Solving", "Creativity", "Time Management", "Leadership", "Emotional Intelligence"],
};

const EDUCATION = [
  { degree: "B.Tech Information Technology", school: "M Kumarasamy College of Engineering", year: "2023 – 2027 (Current)", detail: "CGPA : 7.8 / 10" },
  { degree: "Higher Secondary Education", school: "Gandhi Matric Higher Secondary School", year: "2022 – 2023", detail: "86%" },
];

/* ─── HOOKS ──────────────────────────────────────────────────────────────── */
// Smooth, flicker-free reveal:
// - Elements start invisible via CSS class "reveal-hidden"
// - On enter: class swaps to "reveal-in" which transitions opacity+transform smoothly
// - On exit:  class swaps back to "reveal-hidden" with a fast-out transition
// - No DOM remounting, no key tricks — pure CSS transition toggling
function useReveal(delay = 0, from = "bottom") {
  const ref = useRef(null);
  const inside = useRef(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;

    // Set initial hidden state immediately (before paint) to avoid FOUC
    el.style.opacity = "0";
    const origins = { bottom: "translateY(36px)", left: "translateX(-44px)", right: "translateX(44px)", scale: "scale(0.92) translateY(16px)" };
    el.style.transform = origins[from] || origins.bottom;
    el.style.transition = "none";

    const enter = () => {
      if (inside.current) return;
      inside.current = true;
      // Use rAF so the browser has painted the hidden state first
      requestAnimationFrame(() => {
        el.style.transition = `opacity 0.7s cubic-bezier(.25,.8,.25,1) ${delay}ms, transform 0.7s cubic-bezier(.25,.8,.25,1) ${delay}ms`;
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    };

    const exit = () => {
      if (!inside.current) return;
      inside.current = false;
      // Snap back instantly so re-entry always feels fresh, no weird half-states
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = origins[from] || origins.bottom;
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) enter(); else exit();
    }, { threshold: 0.1 });

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

/* ─── ANIMATED WRAPPERS ──────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, from = "bottom", style = {} }) {
  const ref = useReveal(delay, from);
  return (
    <div ref={ref} style={{ willChange: "opacity, transform", ...style }}>
      {children}
    </div>
  );
}

/* ─── PARTICLE CANVAS ────────────────────────────────────────────────────── */
function Particles() {
  const canvas = useRef(null);
  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, pts, raf;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    const init = () => {
      resize();
      pts = Array.from({ length: 55 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: Math.random() * 2 + 0.8,
        a: Math.random(),
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155,107,47,${p.a * 0.4})`;
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(155,107,47,${(1 - d / 110) * 0.15})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    init(); draw();
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={canvas} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ─── MARQUEE ────────────────────────────────────────────────────────────── */
function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: `1.5px solid ${T.caramel}30`, borderBottom: `1.5px solid ${T.caramel}30`, padding: "14px 0", background: `${T.espresso}08`, position: "relative" }}>
      <div className="marquee-track" style={{ display: "flex", gap: "48px", width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", letterSpacing: "0.12em", color: T.caramel, opacity: 0.7, whiteSpace: "nowrap" }}>
            {item} <span style={{ color: T.tan, marginLeft: "8px" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── HERO TITLE ─────────────────────────────────────────────────────────── */
// DOM-driven: controlled by heroContentRef observer, not React state
function HeroTitleDom() {
  return (
    <div style={{ lineHeight: 0.9, marginBottom: "28px", overflow: "hidden" }}>
      <div
        data-hero="1" data-delay="200" data-from="translateY(110%)"
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "clamp(48px,8vw,100px)",
          letterSpacing: "0.04em",
          color: T.espresso,
          display: "block",
          opacity: 0,
          transform: "translateY(110%)",
        }}>Hello , I&apos;m</div>
      <div
        data-hero="1" data-delay="320" data-from="translateY(110%)"
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "clamp(48px,8vw,100px)",
          letterSpacing: "0.04em",
          color: "transparent",
          WebkitTextStroke: `2px ${T.caramel}`,
          display: "block",
          opacity: 0,
          transform: "translateY(110%)",
        }}>Sriramkrishna V</div>
    </div>
  );
}


/* ─── HORIZONTAL SCROLL CARDS (Spylt-style) ─────────────────────────────── */
function HScroll({ items, dark = false, compact = false }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  // Vertical wheel → horizontal scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const canScroll = el.scrollWidth > el.clientWidth;
      if (!canScroll) return;
      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      e.stopPropagation();
      el.scrollLeft += e.deltaY * 1.2;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Document-level drag: keeps dragging even when cursor leaves the element
  useEffect(() => {
    const onDocMove = (e) => {
      if (!isDragging.current || !trackRef.current) return;
      e.preventDefault();
      const x = e.pageX - trackRef.current.offsetLeft;
      const walk = (x - startX.current) * 1.4;
      trackRef.current.scrollLeft = scrollLeftRef.current - walk;
    };
    const onDocUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (trackRef.current) trackRef.current.style.cursor = "grab";
    };
    document.addEventListener("mousemove", onDocMove);
    document.addEventListener("mouseup", onDocUp);
    return () => {
      document.removeEventListener("mousemove", onDocMove);
      document.removeEventListener("mouseup", onDocUp);
    };
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
  };

  return (
    <div
      ref={trackRef}
      onMouseDown={onMouseDown}
      style={{
        display: "flex", gap: compact ? "24px" : "72px",
        overflowX: "auto", overflowY: "hidden",
        padding: compact ? "16px 20px 56px" : "20px 80px 72px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        cursor: compact ? "auto" : "grab",
        WebkitOverflowScrolling: "touch",
        userSelect: "none",
        scrollSnapType: compact ? "x mandatory" : "none",
      }}
    >
      {items.map((item, i) => (
        <SpyltCard key={i} item={item} index={i} dark={dark} compact={compact} />
      ))}
      <div style={{ minWidth: "40px", flexShrink: 0 }} />
    </div>
  );
}

function SpyltCard({ item, index, dark, compact = false }) {
  const [hovered, setHovered] = useState(false);
  const { bg, title, sub, year, desc, num, href } = item;
  const isActive = compact || hovered;

  const handleClick = () => {
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        position: "relative",
        minWidth: compact ? "calc(100vw - 64px)" : "360px",
        width: compact ? "calc(100vw - 64px)" : "360px",
        maxWidth: compact ? "340px" : "360px",
        height: compact ? "420px" : "480px",
        borderRadius: compact ? "22px" : "24px",
        background: bg.base,
        overflow: "hidden",
        flexShrink: 0,
        transform: isActive
          ? compact ? "rotate(0deg)" : "rotate(0deg) scale(1.03) translateY(-8px)"
          : `rotate(${index % 2 === 0 ? "-2deg" : "2deg"})`,
        transition: "transform 0.45s cubic-bezier(.16,1,.3,1), box-shadow 0.45s",
        boxShadow: isActive
          ? compact ? `0 18px 48px ${bg.dark}55` : `0 32px 80px ${bg.dark}88`
          : `0 12px 40px ${bg.dark}44`,
        cursor: "pointer",
        scrollSnapAlign: compact ? "center" : "none",
      }}
    >
      {/* large background blob shape */}
      <div style={{
        position: "absolute",
        top: "-40px", right: "-40px",
        width: "260px", height: "260px",
        borderRadius: "50%",
        background: bg.light,
        opacity: 0.35,
        transition: "transform 0.5s ease",
        transform: isActive ? "scale(1.2)" : "scale(1)",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-60px", left: "-30px",
        width: "200px", height: "200px",
        borderRadius: "50%",
        background: bg.dark,
        opacity: 0.3,
      }} />

      {/* diagonal stripe accent */}
      <div style={{
        position: "absolute",
        top: "0", left: "0", right: "0", bottom: "0",
        background: `linear-gradient(135deg, ${bg.light}22 0%, transparent 50%, ${bg.dark}33 100%)`,
        pointerEvents: "none",
      }} />

      {/* top row */}
      <div style={{
        position: "absolute", top: compact ? "24px" : "28px", left: compact ? "22px" : "28px", right: compact ? "22px" : "28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: compact ? "42px" : "48px",
          letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.15)",
          lineHeight: 1,
        }}>{num}</span>
        <span style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "13px",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.12)",
          padding: "5px 12px",
          borderRadius: "20px",
        }}>{year}</span>
      </div>

      {/* center desc — fades in on hover */}
      <div style={{
        position: "absolute",
        top: compact ? "84px" : "90px", left: compact ? "22px" : "28px", right: compact ? "22px" : "28px",
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s",
      }}>
        <p style={{
          fontFamily: "'Lora', serif",
          fontSize: compact ? "13px" : "14px",
          color: "rgba(255,255,255,0.82)",
          lineHeight: compact ? 1.65 : 1.75,
        }}>{desc}</p>
      </div>

      {/* bottom content */}
      <div style={{
        position: "absolute",
        bottom: compact ? "24px" : "28px", left: compact ? "22px" : "28px", right: compact ? "22px" : "28px",
      }}>
        {/* sub label */}
        <div style={{
          display: "inline-block",
          background: "rgba(255,255,255,0.18)",
          borderRadius: "4px",
          padding: "4px 10px",
          marginBottom: "12px",
        }}>
          <span style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "12px",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.85)",
          }}>{sub}</span>
        </div>
        {/* big title */}
        <h3 style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: compact ? "30px" : "clamp(26px,3vw,34px)",
          letterSpacing: "0.04em",
          color: "#FFFFFF",
          lineHeight: 1.05,
          textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          transition: "transform 0.35s cubic-bezier(.16,1,.3,1)",
          transform: isActive && !compact ? "translateY(-4px)" : "none",
        }}>{title}</h3>
        {/* arrow */}
        <div style={{
          marginTop: "14px",
          width: "38px", height: "38px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
          color: "#fff",
          transition: "background 0.25s, transform 0.25s",
          transform: hovered ? "translate(4px,-4px)" : "none",
        }}>↗</div>
      </div>
    </div>
  );
}


/* ─── MAGNETIC BUTTON (GSAP-style hover) ────────────────────────────────── */
function MagneticBtn({ children, className = "", onClick, type = "button", style = {} }) {
  const btnRef = useRef(null);
  const inner = useRef(null);
  const bounds = useRef(null);

  const onEnter = () => { bounds.current = btnRef.current.getBoundingClientRect(); };

  const onMove = (e) => {
    if (!bounds.current) return;
    const { left, top, width, height } = bounds.current;
    const cx = left + width / 2;
    const cy = top + height / 2;
    const dx = (e.clientX - cx) / (width / 2);   // -1 … +1
    const dy = (e.clientY - cy) / (height / 2);
    // outer shell moves gently, inner text follows more
    const ox = dx * 10, oy = dy * 10;
    const ix = dx * 5, iy = dy * 5;
    btnRef.current.style.transform = `translate(${ox}px, ${oy}px)`;
    if (inner.current) inner.current.style.transform = `translate(${ix}px, ${iy}px)`;
  };

  const onLeave = () => {
    bounds.current = null;
    if (btnRef.current) {
      btnRef.current.style.transform = "translate(0,0)";
      btnRef.current.style.transition = "transform 0.55s cubic-bezier(.23,1,.32,1)";
    }
    if (inner.current) {
      inner.current.style.transform = "translate(0,0)";
      inner.current.style.transition = "transform 0.55s cubic-bezier(.23,1,.32,1)";
    }
    setTimeout(() => {
      if (btnRef.current) btnRef.current.style.transition = "";
      if (inner.current) inner.current.style.transition = "";
    }, 560);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      className={className}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ position: "relative", willChange: "transform", ...style }}
    >
      <span ref={inner} style={{ display: "block", willChange: "transform" }}>
        {children}
      </span>
    </button>
  );
}


/* ─── PHOTO FRAME ────────────────────────────────────────────────────────── */
function PhotoFrame({ compact = false }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef(null);

  const onMove = (e) => {
    const { left, top, width, height } = frameRef.current.getBoundingClientRect();
    const cx = left + width / 2, cy = top + height / 2;
    const rx = ((e.clientY - cy) / (height / 2)) * -8;
    const ry = ((e.clientX - cx) / (width / 2)) * 8;
    setTilt({ x: rx, y: ry });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={frameRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        width: compact ? "min(78vw, 320px)" : "320px",
        height: compact ? "min(102vw, 420px)" : "420px",
        perspective: "800px",
        cursor: compact ? "default" : "crosshair",
      }}
    >
      {/* rotating decorative ring */}
      <div style={{
        position: "absolute", inset: "-18px",
        borderRadius: "38% 62% 55% 45% / 48% 40% 60% 52%",
        border: `1.5px solid ${T.caramel}55`,
        animation: "morphRing 8s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: "-8px",
        borderRadius: "55% 45% 40% 60% / 60% 55% 45% 40%",
        border: `1px solid ${T.caramel}30`,
        animation: "morphRing 12s ease-in-out infinite reverse",
        pointerEvents: "none",
      }} />

      {/* main frame card */}
      <div style={{
        width: "100%", height: "100%",
        borderRadius: "28px",
        background: `linear-gradient(145deg, ${T.light}, ${T.cream})`,
        border: `1.5px solid ${T.caramel}44`,
        boxShadow: `0 24px 64px ${T.espresso}22, 0 0 0 1px ${T.caramel}18, inset 0 1px 0 rgba(255,255,255,0.6)`,
        overflow: "hidden",
        transform: compact ? "none" : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.25s cubic-bezier(.23,1,.32,1)",
        transformStyle: "preserve-3d",
        position: "relative",
      }}>
        {/* inner glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${T.caramel}18 0%, transparent 60%)`,
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* profile photo */}
        <img
          src="/assets/mypic.png"
          alt="Sriramkrishna V"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />

        {/* corner accents */}
        {[["0", "0", "borderTop", "borderLeft"], ["0", "auto", "borderTop", "borderRight"], ["auto", "0", "borderBottom", "borderLeft"], ["auto", "auto", "borderBottom", "borderRight"]].map(([t, r, b1, b2], i) => (
          <div key={i} style={{
            position: "absolute",
            top: t !== "auto" ? "16px" : "auto",
            right: r !== "auto" ? "16px" : "auto",
            bottom: t === "auto" ? "16px" : "auto",
            left: r === "auto" && t !== "auto" ? "16px" : r === "auto" ? "16px" : "auto",
            width: "20px", height: "20px",
            borderTop: (b1 === "borderTop" || b2 === "borderTop") ? `2px solid ${T.caramel}88` : "none",
            borderRight: (b1 === "borderRight" || b2 === "borderRight") ? `2px solid ${T.caramel}88` : "none",
            borderBottom: (b1 === "borderBottom" || b2 === "borderBottom") ? `2px solid ${T.caramel}88` : "none",
            borderLeft: (b1 === "borderLeft" || b2 === "borderLeft") ? `2px solid ${T.caramel}88` : "none",
          }} />
        ))}

        {/* name badge at bottom */}
        <div style={{
          position: "absolute", bottom: "24px", left: "24px", right: "24px",
          background: `${T.espresso}cc`,
          backdropFilter: "blur(8px)",
          borderRadius: "10px",
          padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          border: `1px solid ${T.caramel}33`,
        }}>
          <div>
            <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", letterSpacing: "0.1em", color: T.cream, lineHeight: 1 }}>IT UNDERGRADUATE</p>
            <p style={{ fontFamily: "'Lora', serif", fontSize: "11px", color: T.caramel, marginTop: "2px" }}>Sriramkrishna V</p>
          </div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade8088" }} />
        </div>
      </div>

      {/* floating tag chips */}
      <div style={{
        position: "absolute", top: compact ? "-10px" : "-8px", right: compact ? "-8px" : "-40px",
        background: T.caramel, color: T.cream, borderRadius: "20px", padding: "6px 14px",
        fontFamily: "'Bebas Neue', cursive", fontSize: "12px", letterSpacing: "0.15em",
        boxShadow: `0 8px 20px ${T.caramel}44`,
        animation: "floatChip2 5s ease-in-out infinite",
      }}>OPEN TO WORK</div>
    </div>
  );
}

/* ─── CURSOR GLOW ────────────────────────────────────────────────────────── */
function CursorGlow({ disabled = false }) {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    if (disabled) return;
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [disabled]);
  if (disabled) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999,
      width: "360px", height: "360px",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${T.caramel}18 0%, transparent 70%)`,
      transform: `translate(${pos.x - 180}px, ${pos.y - 180}px)`,
      transition: "transform 0.12s ease",
    }} />
  );
}

/* ─── SECTION LABEL ──────────────────────────────────────────────────────── */
function SLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <div style={{ width: "32px", height: "2px", background: T.caramel }} />
      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "13px", letterSpacing: "0.25em", color: T.caramel }}>{children}</span>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroInside = useRef(false);
  const isMobile = viewportWidth <= 767;
  const isTablet = viewportWidth <= 1024;
  const sidePadding = isMobile ? 20 : isTablet ? 32 : 48;
  const sectionGap = isMobile ? 28 : 80;

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Hero: direct DOM transition toggling — no React state, no flicker
  useEffect(() => {
    const section = heroRef.current;
    const content = heroContentRef.current;
    if (!section || !content) return;

    const children = Array.from(content.querySelectorAll("[data-hero]"));

    const hide = () => {
      children.forEach(el => {
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = el.dataset.from || "translateY(24px)";
      });
    };

    const show = () => {
      children.forEach((el, i) => {
        const d = parseInt(el.dataset.delay || "0");
        requestAnimationFrame(() => {
          el.style.transition = `opacity 0.7s cubic-bezier(.25,.8,.25,1) ${d}ms, transform 0.7s cubic-bezier(.25,.8,.25,1) ${d}ms`;
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      });
    };

    // Set hidden immediately
    hide();

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !heroInside.current) {
        heroInside.current = true;
        show();
      } else if (!e.isIntersecting) {
        heroInside.current = false;
        hide();
      }
    }, { threshold: 0.1 });

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      for (const l of [...NAV].reverse()) {
        const el = document.getElementById(l.toLowerCase());
        if (el && el.getBoundingClientRect().top <= 100) { setActive(l); return; }
      }
      setActive("Home");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = id => {
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (!el) return;
    const navH = 64;
    const start = window.scrollY;
    const target = el.getBoundingClientRect().top + window.scrollY - navH;
    const distance = target - start;
    const duration = 900;
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      window.scrollTo(0, start + distance * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <div style={{ background: T.milk, color: T.espresso, minHeight: "100vh", fontFamily: "'Lora', serif", overflowX: "hidden", paddingTop: "64px" }}>
      <style>{CSS}</style>
      <CursorGlow disabled={isTablet} />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: `0 ${sidePadding}px`, height: "64px", background: `${T.milk}f0`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.caramel}22`
      }}>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", letterSpacing: "0.1em", color: T.espresso }}>
          SRK<span style={{ color: T.caramel }}>.</span>
        </span>
        <div className="nav-links">
          {NAV.map(l => (
            <button key={l} onClick={() => goto(l)} className={`nav-btn ${active === l ? "nav-active" : ""}`}>{l}</button>
          ))}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "✕" : "☰"}</button>
      </nav>

      {menuOpen && (
        <div style={{ position: "fixed", top: "64px", inset: "64px 0 0 0", background: `${T.milk}fa`, zIndex: 199, display: "flex", flexDirection: "column", padding: isMobile ? "24px 20px" : "32px 48px", gap: "8px", backdropFilter: "blur(12px)" }}>
          {NAV.map((l, i) => (
            <button key={l} onClick={() => goto(l)}
              style={{
                fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "34px" : "42px", letterSpacing: "0.08em", color: T.espresso, background: "none", border: "none", textAlign: "left", cursor: "pointer",
                animation: `slideInLeft 0.4s cubic-bezier(.16,1,.3,1) ${i * 60}ms both`
              }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* ── HOME ── */}
      <section id="home" ref={heroRef} style={{ position: "relative", minHeight: isMobile ? "auto" : "100vh", display: "flex", alignItems: "center", overflow: "hidden", padding: isMobile ? "32px 0 56px" : 0 }}>
        <Particles />

        <div style={{
          position: "absolute", right: isMobile ? "-140px" : "-60px", top: isMobile ? "-40px" : "10%", width: isMobile ? "320px" : "520px", height: isMobile ? "320px" : "520px",
          background: `${T.caramel}10`, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none"
        }} />
        {!isMobile && (
          <div style={{
            position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
            width: "2px", height: "60%", background: `linear-gradient(to bottom, transparent, ${T.caramel}40, transparent)`,
            animation: "pulseBar 3s ease-in-out infinite"
          }} />
        )}

        <div ref={heroContentRef} style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: `0 ${sidePadding}px`, width: "100%", display: "flex", flexDirection: isMobile ? "column-reverse" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: isMobile ? "36px" : "48px" }}>

          {/* Left: text */}
          <div style={{ flex: "1", minWidth: 0 }}>


            <HeroTitleDom />

            <div style={{ overflow: "hidden" }}>
              <p data-hero="1" data-delay="460" data-from="translateY(28px)"
                style={{
                  fontFamily: "'Lora', serif", fontSize: "clamp(15px,1.6vw,19px)", color: `${T.espresso}99`, lineHeight: 1.8,
                  maxWidth: isMobile ? "100%" : "480px", marginBottom: isMobile ? "32px" : "44px", opacity: 0, transform: "translateY(28px)"
                }}>
                A Guy who's Passionate about coding, learning, and building amazing projects!
              </p>
            </div>

            <div data-hero="1" data-delay="580" data-from="translateY(20px)"
              style={{ display: "flex", gap: "16px", flexWrap: "wrap", opacity: 0, transform: "translateY(20px)", width: isMobile ? "100%" : "auto" }}>
              <MagneticBtn className="btn-fill" onClick={() => goto("Projects")} style={isMobile ? { width: "100%" } : {}}>View Projects</MagneticBtn>
              <MagneticBtn className="btn-outline" onClick={() => goto("Contact")} style={isMobile ? { width: "100%" } : {}}>Get in Touch</MagneticBtn>
            </div>
          </div>

          {/* Right: photo frame */}
          <div data-hero="1" data-delay="300" data-from="translateY(32px)"
            style={{ flexShrink: 0, opacity: 0, transform: "translateY(32px)", alignSelf: isMobile ? "center" : "auto" }}>
            <PhotoFrame compact={isMobile} />
          </div>

          {/* scroll indicator */}
          {!isMobile && (
            <div data-hero="1" data-delay="700" data-from="translateY(10px)"
              style={{
                position: "absolute", right: "-8px", bottom: "-80px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0, transform: "translateY(10px)"
              }}>
              <div style={{ width: "1px", height: "80px", background: `linear-gradient(to bottom, transparent, ${T.caramel})` }} />
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "11px", letterSpacing: "0.2em", color: T.caramel, writingMode: "vertical-lr" }}>SCROLL</span>
            </div>
          )}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee items={["DATABASE MANAGEMENT SYSTEM", "DIGITAL MARKETING", "MACHINE LEARNING", "DATABASE MANAGEMENT SYSTEM", "DIGITAL MARKETING", "MACHINE LEARNING"]} />

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: isMobile ? "88px 0" : "120px 0", maxWidth: "1200px", margin: "0 auto", paddingLeft: `${sidePadding}px`, paddingRight: `${sidePadding}px` }}>
        <Reveal><SLabel>About Me</SLabel></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: `${sectionGap}px`, alignItems: "start" }}>
          <div>
            <Reveal delay={80}>
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(40px,5vw,64px)", letterSpacing: "0.04em", lineHeight: 0.95, marginBottom: "32px", color: T.espresso }}>
                A LITTLE<br /><span style={{ color: T.caramel }}>ABOUT ME</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p style={{ fontSize: "16px", lineHeight: 1.85, color: `${T.espresso}bb` }}>
                A highly motivated and detail-oriented undergraduate student pursuing a Bachelor's degree in Information Technology, with a strong foundation in data structures, algorithms, and software development principles. Proficient in languages such as Python, Java, and C, with hands-on experience in building applications through academic projects and personal initiatives.
              </p>
            </Reveal>
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              {[["4+", "Projects"], ["1", "Internship"], ["5+", "Certifications"]].map(([n, l], i) => (
                <Reveal key={l} delay={i * 100} from="scale">
                  <div className="stat-card">
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", letterSpacing: "0.02em", color: T.caramel, lineHeight: 1 }}>{n}</span>
                    <span style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: `${T.espresso}88`, fontFamily: "'Bebas Neue', cursive" }}>{l}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={320}>
              <div style={{ display: "flex", justifyContent: isMobile ? "stretch" : "flex-end" }}>
                <a
                  href="/assets/SriramkrishnaV_Resume.pdf"
                  download="SriramkrishnaV_Resume.pdf"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    padding: "12px 28px",
                    width: isMobile ? "100%" : "auto",
                    justifyContent: "center",
                    background: T.espresso,
                    color: T.cream,
                    borderRadius: "8px",
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: "15px",
                    letterSpacing: "0.18em",
                    textDecoration: "none",
                    border: `1px solid ${T.caramel}44`,
                    boxShadow: `0 8px 24px ${T.espresso}22`,
                    transition: "background 0.25s, transform 0.25s, box-shadow 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.caramel; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 32px ${T.caramel}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.espresso; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 24px ${T.espresso}22`; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v13M5 16l7 7 7-7" /><line x1="3" y1="22" x2="21" y2="22" />
                  </svg>
                  Download Resume
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" style={{ background: T.espresso, padding: isMobile ? "88px 0" : "120px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: `0 ${sidePadding}px` }}>
          <Reveal><SLabel>Education</SLabel></Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(40px,5vw,64px)", letterSpacing: "0.04em", color: T.cream, marginBottom: "56px", lineHeight: 0.95 }}>
              ACADEMIC<br /><span style={{ color: T.caramel }}>BACKGROUND</span>
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {EDUCATION.map((e, i) => (
              <Reveal key={e.degree} delay={i * 140} from="left">
                <div className="edu-card">
                  <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "13px", letterSpacing: "0.2em", color: T.caramel, minWidth: "130px" }}>{e.year}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", letterSpacing: "0.06em", color: T.cream, marginBottom: "4px" }}>{e.degree}</h3>
                    <p style={{ fontSize: "14px", color: T.tan, marginBottom: "6px" }}>{e.school}</p>
                    <p style={{ fontSize: "13px", color: `${T.cream}77` }}>{e.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: isMobile ? "88px 0" : "120px 0", maxWidth: "1200px", margin: "0 auto", paddingLeft: `${sidePadding}px`, paddingRight: `${sidePadding}px` }}>
        <Reveal><SLabel>Skills</SLabel></Reveal>
        <Reveal delay={80}>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(40px,5vw,64px)", letterSpacing: "0.04em", color: T.espresso, marginBottom: "56px", lineHeight: 0.95 }}>
            TOOLS &<br /><span style={{ color: T.caramel }}>TECHNOLOGIES</span>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "repeat(2,1fr)", gap: isMobile ? "28px" : "40px" }}>
          {Object.entries(SKILLS).map(([cat, items], i) => (
            <Reveal key={cat} delay={i * 120}>
              <div>
                <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", letterSpacing: "0.2em", color: T.caramel, marginBottom: "16px" }}>{cat}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {items.map((sk, j) => (
                    <Reveal key={sk} delay={i * 60 + j * 50} from="scale">
                      <span className="skill-tag">{sk}</span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ background: `${T.espresso}08`, padding: isMobile ? "88px 0 0 0" : "120px 0 0 0", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: `0 ${sidePadding}px 56px` }}>
          <Reveal><SLabel>Projects</SLabel></Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(40px,5vw,64px)", letterSpacing: "0.04em", color: T.espresso, marginBottom: "0", lineHeight: 0.95 }}>
              MY <span style={{ color: T.caramel }}>WORKS</span>
            </h2>
          </Reveal>
        </div>
        <HScroll items={PROJECTS.map((p, i) => ({
          title: p.title,
          sub: p.tags.join(" · "),
          year: p.year,
          desc: p.desc,
          href: p.href,
          bg: [
            { base: "#C4914A", light: "#D4A86A", dark: "#9B6B2F" },
            { base: "#2C1A0E", light: "#4A2E1A", dark: "#1A0D06" },
            { base: "#9B6B2F", light: "#B8823E", dark: "#7A5020" },
            { base: "#5C3D1E", light: "#7A5432", dark: "#3D2810" },
          ][i % 4],
          num: String(i + 1).padStart(2, "0"),
        }))} compact={isMobile} />
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section id="certifications" style={{ background: T.espresso, padding: isMobile ? "88px 0 0 0" : "120px 0 0 0", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: `0 ${sidePadding}px 56px` }}>
          <Reveal><SLabel>Certifications</SLabel></Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(40px,5vw,64px)", letterSpacing: "0.04em", color: T.cream, marginBottom: "0", lineHeight: 0.95 }}>
              CERTIFICATES <span style={{ color: T.caramel }}>&amp;</span><br />EXPERIENCES
            </h2>
          </Reveal>
        </div>
        <HScroll dark items={[
          { title: "Oracle Cloud Infrastructure", sub: "Oracle · Certification", year: "2025", desc: "Oracle Cloud Infrastructure Foundations Associate certification.", bg: { base: "#9B6B2F", light: "#C4914A", dark: "#7A5020" }, num: "01", href: "/assets/oracle-cloud-infrastructure.pdf" },
          { title: "NPTEL IoT", sub: "NPTEL · Certification", year: "2024", desc: "Introduction to Internet of Things — NPTEL online course completion.", bg: { base: "#C4914A", light: "#D4A86A", dark: "#9B6B2F" }, num: "02", href: "/assets/nptel-iot.pdf" },
          { title: "NPTEL Industry 4.0 & IIoT", sub: "NPTEL · Certification", year: "2024", desc: "Industry 4.0 and Industrial Internet of Things — NPTEL course certificate.", bg: { base: "#5C3D1E", light: "#7A5432", dark: "#3D2810" }, num: "03", href: "/assets/nptel-industry-4.0-iiot.pdf" },
          { title: "NPTEL Cloud Computing", sub: "NPTEL · Certification", year: "2025", desc: "Cloud Computing fundamentals and architecture — NPTEL course certificate.", bg: { base: "#2C1A0E", light: "#4A2E1A", dark: "#1A0D06" }, num: "04", href: "/assets/nptel-cloud-computing.pdf" },
          { title: "Internship", sub: "Product Marketing · Experience", year: "2025", desc: "Product Marketing internship — hands-on experience in digital marketing strategy.", bg: { base: "#9B6B2F", light: "#B8823E", dark: "#7A5020" }, num: "05", href: "/assets/internship-product-marketing.pdf" },
          { title: "Hashgraph", sub: "Hedera · Certification", year: "2026", desc: "Hedera Hashgraph foundations — distributed ledger technology certificate.", bg: { base: "#7A5020", light: "#9B6B2F", dark: "#4A2E1A" }, num: "06", href: "/assets/Hashgraph.pdf" },
        ]} compact={isMobile} />
      </section>


      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: T.espresso, padding: isMobile ? "88px 0 0 0" : "120px 0 0 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: `0 ${sidePadding}px ${isMobile ? 56 : 80}px` }}>
          <Reveal><SLabel>Contact</SLabel></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: `${sectionGap}px` }}>
            <div>
              <Reveal delay={80}>
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(40px,5vw,64px)", letterSpacing: "0.04em", color: T.cream, marginBottom: "28px", lineHeight: 0.95 }}>
                  LET'S WORK<br /><span style={{ color: T.caramel }}>TOGETHER</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p style={{ fontSize: "16px", color: `${T.cream}99`, lineHeight: 1.8, marginBottom: "40px" }}>
                  Open to full-time roles, contract work, and interesting collaborations. I'll get back to you within 24 hours.
                </p>
              </Reveal>

              {/* Location & Phone */}
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
                    </svg>
                  ), label: "Location", value: "Namakkal, Tamilnadu", href: null
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.5 2.18 2 2 0 012.49 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  ), label: "Phone", value: "+91 9080158337", href: "tel:+919080158337"
                },
              ].map(({ icon, label, value, href }, i) => (
                <Reveal key={label} delay={160 + i * 80} from="left">
                  <div style={{ display: "flex", gap: "16px", alignItems: isMobile ? "flex-start" : "center", flexWrap: isMobile ? "wrap" : "nowrap", padding: "14px 0", borderBottom: `1px solid ${T.caramel}20` }}>
                    <span style={{ color: T.caramel, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "12px", letterSpacing: "0.2em", color: T.caramel, width: isMobile ? "100%" : "80px" }}>{label}</span>
                    {href
                      ? <a href={href} style={{ fontSize: "14px", color: `${T.cream}cc`, textDecoration: "none" }}>{value}</a>
                      : <span style={{ fontSize: "14px", color: `${T.cream}cc` }}>{value}</span>
                    }
                  </div>
                </Reveal>
              ))}

              {/* Email / GitHub / LinkedIn */}
              {[
                {
                  label: "Email", value: "sriramkrishnav4949@gmail.com", href: "mailto:sriramkrishnav4949@gmail.com",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  )
                },
                {
                  label: "GitHub", value: "github.com/sriram-49", href: "https://github.com/sriram-49",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  )
                },
                {
                  label: "LinkedIn", value: "linkedin.com/in/sriramkrishna-v", href: "https://www.linkedin.com/in/sriramkrishna-v-805388290/",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.982V9h3.128v1.561h.046c.436-.824 1.5-1.695 3.086-1.695 3.299 0 3.907 2.172 3.907 4.993v6.593zM5.337 7.433a1.816 1.816 0 110-3.63 1.816 1.816 0 010 3.63zm1.616 13.019H3.72V9h3.233v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )
                },
              ].map(({ label, value, href, icon }, i) => (
                <Reveal key={label} delay={320 + i * 90} from="left">
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    style={{ display: "flex", gap: "16px", alignItems: isMobile ? "flex-start" : "center", flexWrap: isMobile ? "wrap" : "nowrap", padding: "16px 0", borderBottom: `1px solid ${T.caramel}25`, textDecoration: "none" }}
                  >
                    <span style={{ color: T.caramel, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "12px", letterSpacing: "0.2em", color: T.caramel, width: isMobile ? "100%" : "80px" }}>{label}</span>
                    <span style={{ fontSize: "14px", color: `${T.cream}cc`, wordBreak: "break-word" }}>{value}</span>
                  </a>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120} from="right">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: isMobile ? "220px" : "320px" }}>
                <svg width={isMobile ? "220" : "320"} height={isMobile ? "220" : "320"} viewBox="0 0 846.66 846.66" style={{ shapeRendering: "geometricPrecision", textRendering: "geometricPrecision", imageRendering: "optimizeQuality", fillRule: "evenodd", clipRule: "evenodd", maxWidth: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
                  <path fill={T.cream} d="M93.8 270.07l126.32 36.09 16.3 -57.07c3.15,-11.05 14.65,-17.46 25.7,-14.32l120.91 34.54c11.05,3.15 17.46,14.66 14.31,25.7l-16.31 57.12 7.48 2.13 77.13 -22.03 -16.32 -57.11c-3.14,-11.05 3.26,-22.56 14.31,-25.7l120.91 -34.55c11.05,-3.14 22.56,3.27 25.7,14.32l16.3 57.07 126.32 -36.08c11.05,-3.15 22.56,3.26 25.7,14.31l60.57 212.02c3.15,11.05 -3.26,22.56 -14.31,25.7l-56.57 16.17c-1.98,39.9 -29.22,74.68 -67.84,85.71l-242.46 69.27 -4.76 16.66c-3.14,11.05 -14.65,17.46 -25.7,14.31l-281.24 -80.34c-38.62,-11.04 -65.86,-45.81 -67.84,-85.72l-56.57 -16.16c-11.05,-3.14 -17.45,-14.65 -14.31,-25.7l60.57 -212.02c3.14,-11.05 14.65,-17.46 25.7,-14.32zm466.82 422.65c-13.89,-23.52 21.9,-44.65 35.79,-21.15l42.25 71.6c13.89,23.51 -21.9,44.64 -35.79,21.14l-42.25 -71.59zm105.68 1.33c-24.93,-11.12 -8.01,-49.02 16.91,-37.9l86.85 38.73c24.93,11.13 8.01,49.02 -16.91,37.9l-86.85 -38.73zm-416.85 -522.47c-15.38,22.55 -49.7,-0.87 -34.32,-23.42l45.78 -66.9c15.38,-22.54 49.7,0.88 34.32,23.42l-45.78 66.9zm-50.29 13.23c8.88,25.89 -30.49,39.38 -39.36,13.5l-28.17 -82.16c-8.88,-25.89 30.49,-39.38 39.36,-13.5l28.17 82.16zm234.96 420.53l-101.05 -27.61c-26.31,-7.16 -15.42,-47.18 10.9,-40.01l101.54 27.74 15.69 -54.93 -98.61 -26.13c-26.41,-6.95 -15.85,-47.12 10.58,-40.17l99.45 26.35 12.94 -45.32c-45.31,-12.95 -90.63,-25.9 -135.94,-38.84 -11.05,-3.14 -17.46,-14.65 -14.32,-25.7l16.32 -57.11 -80.9 -23.12 -16.31 57.08c-3.14,11.04 -14.65,17.45 -25.7,14.31l-54.47 -15.56 -52.35 183.24c-7.87,27.57 8.17,56.53 35.75,64.41l261.26 74.64c5.07,-17.76 10.14,-35.52 15.22,-53.27zm30.11 -229.44l52.74 15.06c11.05,3.15 17.46,14.66 14.31,25.7l-59.87 209.58 217.61 -62.16c27.58,-7.88 43.62,-36.85 35.75,-64.42l-52.35 -183.24 -54.47 15.56c-11.05,3.15 -22.56,-3.26 -25.7,-14.31l-16.3 -57.07 -80.91 23.11 16.32 57.11c3.14,11.05 -3.27,22.56 -14.32,25.7l-32.81 9.38zm280.04 -80l-31.84 9.09 49.14 172.03 31.84 -9.1 -49.14 -172.02zm-610.04 28.99l-31.84 -9.1 -49.14 172.03 31.84 9.09 49.14 -172.02z" />
                </svg>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── FOOTER (attached to contact) ── */}
        <div style={{ borderTop: `1px solid ${T.caramel}22`, padding: `24px ${sidePadding}px`, display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "10px" : 0, justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: `${T.cream}55`, textAlign: isMobile ? "center" : "left" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.1em" }}>© 2026 Sriramkrishna V</span>
          <span>Built with React</span>
        </div>
      </section>
    </div>
  );
}

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: auto; }

  body { cursor: none; }
  a, button, img, svg { max-width: 100%; }

  .nav-links { display: flex; gap: 4px; }
  .nav-btn {
    background: none; border: none; cursor: pointer; padding: 7px 14px; border-radius: 4px;
    font-family: 'Bebas Neue', cursive; font-size: 15px; letter-spacing: 0.1em;
    color: #2C1A0Eaa; transition: color 0.2s, background 0.2s;
  }
  .nav-btn:hover { color: #9B6B2F; background: #9B6B2F12; }
  .nav-active { color: #9B6B2F !important; background: #9B6B2F15 !important; }

  .hamburger { display: none; background: none; border: none; font-size: 22px; cursor: pointer; color: #2C1A0E; }

  /* ── Magnetic buttons — transform handled by JS, only visual styles here ── */
  .btn-fill {
    font-family: 'Bebas Neue', cursive; letter-spacing: 0.15em; font-size: 16px;
    background: #9B6B2F; color: #F5ECD7; border: none;
    padding: 14px 32px; border-radius: 3px; cursor: pointer;
    box-shadow: 0 4px 20px #9B6B2F33;
    overflow: hidden; position: relative;
    transition: background 0.35s ease, box-shadow 0.35s ease;
  }
  .btn-fill::before {
    content: ""; position: absolute; inset: 0;
    background: #C4914A;
    transform: translateY(101%);
    transition: transform 0.4s cubic-bezier(.23,1,.32,1);
    z-index: 0;
  }
  .btn-fill:hover::before { transform: translateY(0); }
  .btn-fill:hover { box-shadow: 0 12px 36px #9B6B2F55; }
  .btn-fill > span { position: relative; z-index: 1; }

  .btn-outline {
    font-family: 'Bebas Neue', cursive; letter-spacing: 0.15em; font-size: 16px;
    background: transparent; color: #2C1A0E;
    border: 1.5px solid #9B6B2F55; padding: 14px 32px; border-radius: 3px; cursor: pointer;
    overflow: hidden; position: relative;
    transition: border-color 0.3s, color 0.3s;
  }
  .btn-outline::before {
    content: ""; position: absolute; inset: 0;
    background: #9B6B2F;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(.23,1,.32,1);
    z-index: 0;
  }
  .btn-outline:hover::before { transform: scaleX(1); }
  .btn-outline:hover { border-color: #9B6B2F; color: #F5ECD7; }
  .btn-outline > span { position: relative; z-index: 1; }

  .stat-card {
    background: #F5ECD7; border: 1px solid #9B6B2F20; border-radius: 8px;
    padding: 28px 24px; display: flex; flex-direction: column; gap: 6px;
    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  }
  .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px #9B6B2F22; border-color: #9B6B2F55; }

  .edu-card {
    display: flex; gap: 36px; align-items: flex-start;
    padding: 28px 32px; border-radius: 8px; border: 1px solid #9B6B2F22;
    background: #F5ECD708;
    transition: background 0.25s, border-color 0.25s, transform 0.25s;
  }
  .edu-card:hover { background: #9B6B2F15; border-color: #9B6B2F55; transform: translateX(6px); }

  .skill-tag {
    display: inline-block; padding: 7px 14px;
    background: #F5ECD7; border: 1px solid #9B6B2F25;
    border-radius: 4px; font-family: 'Lora', serif; font-size: 13px;
    color: #2C1A0E; transition: background 0.2s, color 0.2s, transform 0.2s, border-color 0.2s;
    cursor: default;
  }
  .skill-tag:hover { background: #9B6B2F; color: #F5ECD7; transform: translateY(-2px); border-color: #9B6B2F; }

  /* hide scrollbars on hscroll tracks */
  div::-webkit-scrollbar { display: none; }

  .c-input {
    padding: 14px 16px; border: 1px solid #9B6B2F33; border-radius: 6px;
    font-size: 14px; font-family: 'Lora', serif; background: #F5ECD710; color: #F5ECD7;
    outline: none; width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .c-input::placeholder { color: #F5ECD755; }
  .c-input:focus { border-color: #9B6B2F; box-shadow: 0 0 0 3px #9B6B2F22; background: #F5ECD708; }

  .marquee-track { animation: marquee 28s linear infinite; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .marquee-track:hover { animation-play-state: paused; }

  @keyframes pulseBar   { 0%,100%{opacity:.3} 50%{opacity:.9} }
  @keyframes morphRing  { 0%,100%{border-radius:38% 62% 55% 45%/48% 40% 60% 52%} 50%{border-radius:60% 40% 45% 55%/55% 60% 40% 45%} }
  @keyframes floatChip1 { 0%,100%{transform:translateY(0px) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
  @keyframes floatChip2 { 0%,100%{transform:translateY(0px) rotate(2deg)}  50%{transform:translateY(-6px) rotate(-2deg)} }
  @keyframes growLine { from{height:0;opacity:0} to{height:80px;opacity:1} }
  @keyframes slideInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:none} }

  /* transitions handled via direct DOM style toggling — no keyframes needed */

  @media (hover: none), (pointer: coarse) {
    body { cursor: auto; }
    .btn-fill::before, .btn-outline::before { transform: none; opacity: 0.08; }
    .btn-fill:hover, .btn-outline:hover, .stat-card:hover, .edu-card:hover, .skill-tag:hover {
      transform: none;
      box-shadow: inherit;
      background: inherit;
      color: inherit;
      border-color: inherit;
    }
  }

  @media (max-width: 768px) {
    .nav-links { display: none !important; }
    .hamburger { display: block !important; }
    .btn-fill, .btn-outline {
      width: 100%;
      justify-content: center;
      padding: 15px 22px;
    }
    .stat-card {
      padding: 24px 20px;
    }
    .edu-card {
      flex-direction: column;
      gap: 14px;
      padding: 24px 20px;
    }
    .skill-tag {
      font-size: 12px;
      padding: 8px 12px;
    }
    .marquee-track {
      gap: 24px !important;
      animation-duration: 20s;
    }
  }
`;
