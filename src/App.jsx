import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from './assets/logo.png'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const GRAIN = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
  <filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/>
  <feColorMatrix type='saturate' values='0'/></filter>
  <rect width='300' height='300' filter='url(%23g)' opacity='1'/>
</svg>`
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`

/* ── light warm palette ── */
const BG     = '#F5F1EB'
const SURF1  = '#EDE8DF'
const SURF2  = '#E5DDD3'
const DARK   = '#3D3C38'   /* logo charcoal */
const STONE  = '#8B6F47'
const SAGE   = '#8A9B6C'   /* logo sage green */
const MUTED  = '#7A6E62'
const BORDER = 'rgba(70,68,63,0.1)'
const S = (a) => `rgba(139,111,71,${a})`
const G = (a) => `rgba(138,155,108,${a})`   /* sage with alpha */
const D = (a) => `rgba(70,68,63,${a})`

const buildOptions = [
  { num:'01', name:'Custom Homes',  desc:'Fully bespoke design and build — your vision realised from the ground up, tailored to your lifestyle and site.',
    icon:(
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* house outline with chimney */}
        <path d="M4 13L15 4L26 13V26H4V13Z"/>
        <rect x="11" y="18" width="8" height="8"/>
        <line x1="19" y1="4" x2="19" y2="8"/>
        <rect x="19" y="1" width="3" height="5" rx="0.5"/>
        {/* window */}
        <rect x="5.5" y="15" width="5" height="5" rx="0.5"/>
        <line x1="8" y1="15" x2="8" y2="20"/>
        <line x1="5.5" y1="17.5" x2="10.5" y2="17.5"/>
      </svg>
    )},
  { num:'02', name:'Renovations',   desc:'Considered extensions and renovations that respect the existing structure while elevating the whole home.',
    icon:(
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* house with extension/addition on right side */}
        <path d="M2 14L11 6L20 14V26H2V14Z"/>
        <rect x="13" y="19" width="6" height="7"/>
        {/* extension block */}
        <path d="M18 18H26V26H18" strokeDasharray="2 1.5"/>
        <path d="M18 18L22 14L26 18"/>
        {/* tool/wrench hint */}
        <circle cx="24" cy="8" r="2.5"/>
        <line x1="22" y1="10" x2="19" y2="13"/>
      </svg>
    )},
  { num:'03', name:'Architectural', desc:'High-end architectural builds in partnership with leading NZ architects — award-winning results.',
    icon:(
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* architectural / blueprint grid with modern house silhouette */}
        <rect x="2" y="2" width="26" height="26" rx="1"/>
        <line x1="2" y1="10" x2="28" y2="10" strokeOpacity="0.35"/>
        <line x1="2" y1="18" x2="28" y2="18" strokeOpacity="0.35"/>
        <line x1="10" y1="2" x2="10" y2="28" strokeOpacity="0.35"/>
        <line x1="18" y1="2" x2="18" y2="28" strokeOpacity="0.35"/>
        {/* flat-roof modern house drawn on blueprint */}
        <rect x="6" y="12" width="18" height="11" rx="0.5"/>
        <line x1="6" y1="12" x2="24" y2="12"/>
        <rect x="10" y="17" width="4" height="6"/>
        <rect x="16" y="14" width="5" height="3"/>
      </svg>
    )},
  { num:'04', name:'For Sale',      desc:"Turnkey O'Leary homes available now — quality you can move straight into.",
    icon:(
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* house with key */}
        <path d="M3 14L13 5L23 14V26H3V14Z"/>
        <rect x="9" y="19" width="6" height="7"/>
        {/* key */}
        <circle cx="23" cy="9" r="4"/>
        <circle cx="23" cy="9" r="2"/>
        <line x1="26.8" y1="11.8" x2="29" y2="14"/>
        <line x1="29" y1="14" x2="27" y2="16"/>
        <line x1="27" y1="16" x2="25.5" y2="14.5"/>
      </svg>
    )},
]

const process = [
  { num:'01', step:'Initial Consultation', detail:'We sit down, listen, and understand your vision, budget, and timeline — no pressure, just honest conversation.' },
  { num:'02', step:'Design & Planning',    detail:'Working with your architect or ours, we develop plans that are buildable, beautiful, and on budget.' },
  { num:'03', step:'The Build',            detail:'Our team manages every trade, every schedule, and every detail — keeping you informed at every stage.' },
  { num:'04', step:'Handover',             detail:'A thorough walk-through, snag-list sign-off, and the keys to your new home. Then we stay available.' },
]

const credentials = [
  { stat:'20+',  label:'Years Experience' },
  { stat:'Est.', label:"2004 · Hawke's Bay" },
  { stat:'★',    label:'NZIA Award Winner' },
  { stat:'★★',   label:'Certified Builders\nPlatinum + Revere' },
]

const projects = [
  { label:'Havelock North Residence', type:'Custom Build',   img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80' },
  { label:'Napier Architectural Home', type:'Architectural', img:'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&auto=format&fit=crop&q=80' },
  { label:'Bay View Renovation',       type:'Renovation',    img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&auto=format&fit=crop&q=80' },
  { label:'Havelock North — For Sale', type:'Turnkey',       img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80' },
  { label:'Taradale Family Home',      type:'Custom Build',  img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop&q=80' },
]

export default function App() {
  const cursorDotRef  = useRef(null)
  const cursorBoxRef  = useRef(null)
  const navRef        = useRef(null)
  const logoWrapRef   = useRef(null)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [formData,  setFormData]  = useState({ name:'', email:'', phone:'', build:'', message:'' })
  const [submitted, setSubmitted] = useState(false)

  const navLinks = [['Build','#build'],['Process','#process'],['Projects','#projects'],['About','#about'],['Contact','#contact']]

  useEffect(() => {
    const dot = cursorDotRef.current, box = cursorBoxRef.current
    let mx=0,my=0,rx=0,ry=0,raf
    const onMove = e => {
      mx=e.clientX; my=e.clientY
      gsap.set(dot, { x:mx, y:my })
      const over = !!e.target.closest('a,button,.build-card,.p-item')
      gsap.to(dot, { scale:over?3.5:1, background:over?STONE:DARK, duration:.15 })
    }
    document.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(function noop(){}) // placeholder so cleanup works

    /* nav */
    const nav = navRef.current
    const onScroll = () => {
      const logoEl = logoWrapRef.current
      if (window.scrollY > 60) {
        nav.style.background='rgba(245,241,235,0.92)'
        nav.style.backdropFilter='blur(20px) saturate(1.4)'
        nav.style.WebkitBackdropFilter='blur(20px) saturate(1.4)'
        nav.style.borderBottomColor=BORDER
        nav.style.boxShadow='0 1px 0 rgba(28,24,20,0.06)'
      } else {
        nav.style.background='rgba(245,241,235,0.03)'
        nav.style.backdropFilter='blur(20px) saturate(1.5)'
        nav.style.WebkitBackdropFilter='blur(20px) saturate(1.5)'
        nav.style.borderBottomColor='transparent'
        nav.style.boxShadow='none'
      }
    }
    window.addEventListener('scroll', onScroll, { passive:true })

    /* progress bar */
    const bar = document.createElement('div')
    bar.style.cssText=`position:fixed;top:0;left:0;height:2px;width:0%;background:linear-gradient(90deg,${SAGE},${STONE},${DARK});z-index:9999;pointer-events:none;`
    document.body.appendChild(bar)
    const updateBar = () => { bar.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%' }
    window.addEventListener('scroll', updateBar, { passive:true })

    /* hero */
    gsap.fromTo('.h-eyebrow', { opacity:0, y:20 }, { opacity:1, y:0, duration:.8, delay:.3 })
    gsap.fromTo('.h-l1',      { opacity:0, y:70 }, { opacity:1, y:0, duration:1.1, delay:.5,  ease:'power3.out' })
    gsap.fromTo('.h-l2',      { opacity:0, y:70 }, { opacity:1, y:0, duration:1.1, delay:.65, ease:'power3.out' })
    gsap.fromTo('.h-l3',      { opacity:0, y:70 }, { opacity:1, y:0, duration:1.1, delay:.8,  ease:'power3.out' })
    gsap.fromTo('.h-sub',     { opacity:0, y:24 }, { opacity:1, y:0, duration:.8,  delay:1.1 })
    gsap.fromTo('.h-cta',     { opacity:0, y:20 }, { opacity:1, y:0, duration:.8,  delay:1.3 })
    gsap.fromTo('.h-meta',    { opacity:0 },       { opacity:1,       duration:.8,  delay:1.5 })

    /* section reveals */
    gsap.utils.toArray('.popout').forEach(el => {
      gsap.fromTo(el,
        { clipPath:'inset(40px 20px round 12px)' },
        { clipPath:'inset(0px 0px round 0px)', duration:1.1, ease:'power3.out',
          scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'play none none none' } }
      )
    })
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el, { opacity:0, y:32 }, { opacity:1, y:0, duration:.8, ease:'power2.out',
        scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' } })
    })
    gsap.fromTo('.build-card', { opacity:0, y:40 }, { opacity:1, y:0, duration:.7, stagger:.1, ease:'power2.out',
      scrollTrigger:{ trigger:'#build', start:'top 80%' } })
    gsap.fromTo('.proc-row', { opacity:0, x:-20 }, { opacity:1, x:0, duration:.6, stagger:.12, ease:'power2.out',
      scrollTrigger:{ trigger:'#process', start:'top 80%' } })
    gsap.fromTo('.p-item', { opacity:0, scale:.95 }, { opacity:1, scale:1, duration:.6, stagger:.08, ease:'power2.out',
      scrollTrigger:{ trigger:'#projects', start:'top 80%' } })
    gsap.utils.toArray('.draw-line').forEach(el => {
      gsap.fromTo(el, { scaleX:0 }, { scaleX:1, duration:.8, ease:'power2.inOut',
        transformOrigin:'left', scrollTrigger:{ trigger:el, start:'top 90%' } })
    })
    gsap.to('#hero', { scale:.97, opacity:.7,
      scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1 } })

    return () => {
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', updateBar)
      bar.remove(); cancelAnimationFrame(raf)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const eyebrow = (n, label) => (
    <div className="reveal" style={{
      fontFamily:"'Space Mono',monospace", fontSize:'0.68rem',
      letterSpacing:'0.22em', textTransform:'uppercase', color:MUTED,
      display:'flex', alignItems:'center', gap:12, marginBottom:40,
    }}>
      <span className="draw-line" style={{ display:'block', width:24, height:1, background:SAGE }}/>
      {n} / {label}
    </div>
  )

  const inp = {
    width:'100%', padding:'14px 18px', border:`1px solid ${BORDER}`,
    borderRadius:8, background:'rgba(28,24,20,0.03)', color:DARK,
    fontSize:'0.9rem', outline:'none', transition:'border-color .2s',
  }

  return (
    <>
      {/* ── DEMO BANNER ── */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, background:DARK, padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
        <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:STONE, flexShrink:0 }}/>
        <p style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(245,241,235,0.6)', textAlign:'center' }}>
          Demo site — built to showcase what your O'Leary Homes website could look like. <span style={{ color:STONE }}>Not the real olearyhomes.co.nz.</span>
        </p>
        <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:STONE, flexShrink:0 }}/>
      </div>

      {/* grain — multiply on light bg */}
      <div style={{ position:'fixed', inset:0, zIndex:9000, pointerEvents:'none', backgroundImage:GRAIN_URL, backgroundRepeat:'repeat', opacity:0.04, mixBlendMode:'multiply' }}/>

      {/* ── CURSOR: dot only ── */}
      <div ref={cursorDotRef} style={{
        position:'fixed', top:0, left:0, width:8, height:8,
        background:DARK, borderRadius:'50%', pointerEvents:'none', zIndex:9999, transform:'translate(-50%,-50%)',
      }}/>
      <div ref={cursorBoxRef} style={{ display:'none' }}/>

      {/* ── LOGO (outside nav so mix-blend-mode works against the page, not the nav's isolated backdrop-filter stacking context) ── */}
      <a ref={logoWrapRef} href="#hero" style={{
        position:'fixed', top:0, left:56, zIndex:101,
        display:'inline-block', lineHeight:0, mixBlendMode:'multiply',
      }}>
        <img src={logo} alt="O'Leary Homes" style={{ height:160, width:'auto', display:'block' }}/>
      </a>

      {/* ── NAV ── */}
      <nav ref={navRef} style={{
        position:'fixed', top:0, width:'100%', zIndex:100,
        minHeight:176, padding:'8px 56px', display:'flex', alignItems:'center', justifyContent:'space-between',
        background:`rgba(245,241,235,0.03)`, backdropFilter:'blur(20px) saturate(1.5)', WebkitBackdropFilter:'blur(20px) saturate(1.5)',
        borderBottom:'1px solid transparent', transition:'background .3s, border-color .3s, box-shadow .3s, backdrop-filter .3s',
      }}>
        {/* spacer so nav links don't overlap the logo */}
        <div style={{ width:220, flexShrink:0 }}/>
        <ul className="nav-links" style={{ display:'flex', gap:36, listStyle:'none' }}>
          {navLinks.map(([label,href]) => (
            <li key={label}>
              <a href={href} style={{ fontFamily:"'Space Mono',monospace", color:MUTED, fontSize:'0.72rem', letterSpacing:'0.12em', textTransform:'uppercase', transition:'color .2s' }}
                onMouseEnter={e=>e.target.style.color=DARK} onMouseLeave={e=>e.target.style.color=MUTED}>{label}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="nav-cta" style={{
          fontFamily:"'Space Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase',
          padding:'10px 24px', background:DARK, color:BG, borderRadius:100, transition:'background .2s', display:'inline-block',
        }}
        onMouseEnter={e=>e.currentTarget.style.background=SAGE}
        onMouseLeave={e=>e.currentTarget.style.background=DARK}>Enquire</a>

        <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)} style={{ display:'none', flexDirection:'column', gap:5, background:'none', border:'none', cursor:'pointer', padding:4 }}>
          <span style={{ display:'block', width:22, height:2, background:DARK, borderRadius:2, transition:'all .3s', transform:menuOpen?'rotate(45deg) translate(5px,5px)':'none' }}/>
          <span style={{ display:'block', width:22, height:2, background:DARK, borderRadius:2, transition:'all .3s', opacity:menuOpen?0:1 }}/>
          <span style={{ display:'block', width:22, height:2, background:DARK, borderRadius:2, transition:'all .3s', transform:menuOpen?'rotate(-45deg) translate(5px,-5px)':'none' }}/>
        </button>
      </nav>

      {menuOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:99, background:'rgba(245,241,235,0.97)', backdropFilter:'blur(16px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:36 }}
          onClick={()=>setMenuOpen(false)}>
          {navLinks.map(([label,href]) => (
            <a key={label} href={href} onClick={()=>setMenuOpen(false)} style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'3.5rem', letterSpacing:'0.06em', color:DARK, transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color=STONE} onMouseLeave={e=>e.target.style.color=DARK}>{label}</a>
          ))}
          <img src={logo} alt="O'Leary Homes" style={{ height:300, width:'auto', marginBottom:8, mixBlendMode:'multiply' }}/>
          <a href="#contact" onClick={()=>setMenuOpen(false)} style={{ marginTop:16, fontFamily:"'Space Mono',monospace", fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase', padding:'14px 36px', background:DARK, color:BG, borderRadius:100 }}>Enquire Now</a>
        </div>
      )}

      {/* ════ HERO ════ */}
      <section id="hero" style={{ minHeight:'100vh', background:BG, display:'flex', alignItems:'center', padding:'196px 0 100px 56px', position:'relative', overflow:'hidden', transformOrigin:'center top', gap:48 }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`linear-gradient(${D(0.04)} 1px,transparent 1px),linear-gradient(90deg,${D(0.04)} 1px,transparent 1px)`,
          backgroundSize:'60px 60px',
          maskImage:'radial-gradient(ellipse 70% 90% at 30% 50%,black 30%,transparent 100%)',
          WebkitMaskImage:'radial-gradient(ellipse 70% 90% at 30% 50%,black 30%,transparent 100%)',
        }}/>

        {/* text side */}
        <div style={{ position:'relative', flex:'1 1 0', minWidth:0 }}>
          <div className="h-eyebrow" style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:MUTED, display:'flex', alignItems:'center', gap:16, marginBottom:28, opacity:0 }}>
            <span style={{ display:'block', width:40, height:1, background:MUTED }}/>
            Hawke's Bay · Est. 2004
          </div>

          <h1 style={{ margin:0, lineHeight:0.9, fontFamily:"'Bebas Neue',cursive,sans-serif", letterSpacing:'0.02em' }}>
            <div className="h-l1" style={{ fontSize:'clamp(3.5rem,9vw,10rem)', color:DARK, opacity:0 }}>BUILT</div>
            <div className="h-l2" style={{ fontSize:'clamp(3.5rem,9vw,10rem)', color:SAGE, opacity:0 }}>FOR YOUR</div>
            <div className="h-l3" style={{ fontSize:'clamp(3.5rem,9vw,10rem)', color:DARK, opacity:0 }}>LIFE.</div>
          </h1>

          <p className="h-sub" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(1rem,1.6vw,1.3rem)', color:D(0.45), maxWidth:440, lineHeight:1.8, marginTop:32, marginBottom:48, opacity:0 }}>
            Custom homes built with care, precision, and 20 years of Hawke's Bay expertise. Greg and Kerry O'Leary — building the home you've always imagined.
          </p>

          <div className="h-cta" style={{ display:'flex', gap:14, flexWrap:'wrap', opacity:0 }}>
            <a href="#contact" style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.05rem', letterSpacing:'0.08em', padding:'13px 36px', background:DARK, color:BG, borderRadius:100, transition:'background .2s, transform .2s', display:'inline-block' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=STONE; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e=>{ e.currentTarget.style.background=DARK; e.currentTarget.style.transform='none' }}>Start Your Build</a>
            <a href="#projects" style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.72rem', letterSpacing:'0.12em', textTransform:'uppercase', padding:'13px 32px', background:'transparent', color:DARK, borderRadius:100, border:`1px solid ${BORDER}`, transition:'border-color .2s, transform .2s', display:'inline-block' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=S(0.5); e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.transform='none' }}>View Projects</a>
          </div>

          <div className="h-meta" style={{ display:'flex', gap:32, fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color:MUTED, marginTop:56, opacity:0 }}>
            {['Custom Builds','Renovations','Architectural','Certified Builders'].map((t,i) => (
              <span key={t} style={{ color:i===0?STONE:MUTED }}>{t}</span>
            ))}
          </div>
        </div>

        {/* photo side */}
        <div className="h-photo" style={{ flex:'0 0 45%', alignSelf:'stretch', minHeight:'70vh', position:'relative', overflow:'hidden', borderRadius:'20px 0 0 20px' }}>
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=85"
            alt="O'Leary Homes — modern home build"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }}
          />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(to right,${BG} 0%,transparent 25%)` }}/>
          <div style={{ position:'absolute', bottom:28, left:28, background:'rgba(245,241,235,0.9)', backdropFilter:'blur(12px)', borderRadius:10, padding:'12px 20px' }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color:STONE, marginBottom:3 }}>Featured Build</div>
            <div style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1rem', letterSpacing:'0.05em', color:DARK }}>Havelock North · 2024</div>
          </div>
        </div>
      </section>

      {/* ════ BUILD OPTIONS ════ */}
      <section id="build" className="popout" style={{ background:SURF1, padding:'88px 56px', willChange:'clip-path', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', pointerEvents:'none', background:`radial-gradient(circle,${S(0.07)} 0%,transparent 70%)` }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:64, paddingBottom:40, borderBottom:`1px solid ${BORDER}`, flexWrap:'wrap', gap:20 }}>
          {eyebrow('01','What We Build')}
          <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2rem,3.5vw,3rem)', color:DARK, fontWeight:400, fontStyle:'italic' }}>Every home, uniquely yours.</h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {buildOptions.map(({ num, name, desc, icon }) => (
            <div key={num} className="build-card" style={{ borderRadius:12, border:`1px solid ${BORDER}`, overflow:'hidden', cursor:'default', transition:'transform .3s, box-shadow .3s, border-color .3s, background .3s', opacity:0, background:BG }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow=`0 28px 56px ${S(0.14)}`; e.currentTarget.style.borderColor=S(0.4); e.currentTarget.style.background=SURF2 }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.background=BG }}>
              <div style={{ padding:'32px 28px 0' }}>
                <div style={{ width:52, height:52, borderRadius:12, background:G(0.12), border:`1px solid ${G(0.25)}`, display:'flex', alignItems:'center', justifyContent:'center', color:SAGE, marginBottom:24 }}>
                  {icon}
                </div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.15em', textTransform:'uppercase', color:SAGE, marginBottom:10 }}>{num}</div>
                <h3 style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.6rem', letterSpacing:'0.04em', color:DARK, marginBottom:14, lineHeight:1 }}>{name}</h3>
              </div>
              <div style={{ padding:'0 28px 32px' }}>
                <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.88rem', color:D(0.5), lineHeight:1.75 }}>{desc}</p>
                <div style={{ marginTop:24, display:'flex', alignItems:'center', gap:8, fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.08em', textTransform:'uppercase', color:SAGE }}>
                  Learn more <span style={{ fontSize:'0.8rem' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ PROCESS ════ */}
      <section id="process" className="popout" style={{ background:BG, padding:'88px 56px', willChange:'clip-path', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', bottom:'-5%', right:'5%', width:500, height:500, borderRadius:'50%', pointerEvents:'none', background:`radial-gradient(circle,${S(0.06)} 0%,transparent 70%)` }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:64, paddingBottom:40, borderBottom:`1px solid ${BORDER}`, flexWrap:'wrap', gap:20 }}>
          {eyebrow('02','Our Process')}
          <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2rem,3.5vw,3rem)', color:DARK, fontWeight:400, fontStyle:'italic' }}>Straightforward, from start to keys.</h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, position:'relative' }}>
          {process.map(({ num, step, detail }, i) => (
            <div key={num} className="proc-row" style={{
              padding:'48px 44px', border:`1px solid ${BORDER}`, opacity:0,
              background: i===0||i===3 ? SURF1 : BG,
              borderRadius: i===0?'12px 0 0 0': i===1?'0 12px 0 0': i===2?'0 0 0 12px':'0 0 12px 0',
              transition:'background .25s',
              position:'relative', overflow:'hidden',
            }}
              onMouseEnter={e=>e.currentTarget.style.background=S(0.06)}
              onMouseLeave={e=>e.currentTarget.style.background=(i===0||i===3?SURF1:BG)}>
              <div style={{ position:'absolute', top:24, right:28, fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'5rem', color:D(0.05), lineHeight:1, userSelect:'none', letterSpacing:'0.05em' }}>{num}</div>
              <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:36, height:36, borderRadius:'50%', background:G(0.15), border:`1px solid ${G(0.4)}`, fontFamily:"'Space Mono',monospace", fontSize:'0.65rem', color:SAGE, letterSpacing:'0.05em', marginBottom:24, fontWeight:700 }}>{i+1}</div>
              <h3 style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.8rem', letterSpacing:'0.04em', color:DARK, lineHeight:1.05, marginBottom:16 }}>{step}</h3>
              <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.92rem', color:D(0.5), lineHeight:1.85 }}>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ PROJECTS ════ */}
      <section id="projects" className="popout" style={{ background:SURF1, padding:'88px 56px', willChange:'clip-path' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56, flexWrap:'wrap', gap:20 }}>
          {eyebrow('03','Our Projects')}
          <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2rem,3vw,2.8rem)', color:DARK, fontWeight:400, fontStyle:'italic' }}>Homes we're proud to have built.</h2>
        </div>

        <div className="proj-bento" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.3fr', gridTemplateRows:'260px 260px', gap:12 }}>
          {projects.map(({ label, type, img }, i) => {
            const col = i===0?'1/3':i===1?'3/4':i===2?'1/2':i===3?'2/3':'2/4'
            const row = i===0?'1/2':i===1?'1/3':i===2?'2/3':i===3?'2/3':'2/3'
            return (
              <div key={i} className="p-item" style={{ gridColumn:col, gridRow:row, borderRadius:10, overflow:'hidden', position:'relative', background:SURF2, cursor:'pointer', opacity:0, transition:'transform .3s, box-shadow .3s' }}
                onMouseEnter={e=>{ e.currentTarget.querySelector('.p-cap').style.opacity='1'; e.currentTarget.querySelector('.p-img').style.transform='scale(1.06)'; e.currentTarget.style.boxShadow=`0 24px 48px ${D(0.2)}` }}
                onMouseLeave={e=>{ e.currentTarget.querySelector('.p-cap').style.opacity='0'; e.currentTarget.querySelector('.p-img').style.transform='scale(1)'; e.currentTarget.style.boxShadow='none' }}>
                <img className="p-img" src={img} alt={label} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform .6s ease' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(28,24,20,0.7) 0%,rgba(28,24,20,0.1) 50%,transparent 100%)' }}/>
                <div className="p-cap" style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px 22px', opacity:0, transition:'opacity .3s', transform:'translateY(0)' }}>
                  <div style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.25rem', letterSpacing:'0.06em', color:'#F5F1EB', lineHeight:1.1 }}>{label}</div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.1em', textTransform:'uppercase', color:`rgba(196,184,154,0.85)`, marginTop:5 }}>{type}</div>
                </div>
                <div style={{ position:'absolute', top:16, right:16, fontFamily:"'Space Mono',monospace", fontSize:'0.55rem', letterSpacing:'0.1em', textTransform:'uppercase', background:'rgba(245,241,235,0.9)', color:DARK, padding:'5px 10px', borderRadius:100 }}>{type}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ════ ABOUT ════ */}
      <section id="about" className="popout" style={{ background:SURF2, padding:'88px 56px', willChange:'clip-path', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10%', left:'-5%', width:600, height:600, borderRadius:'50%', pointerEvents:'none', background:`radial-gradient(circle,${S(0.08)} 0%,transparent 70%)` }}/>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:80, alignItems:'start', position:'relative' }}>
          <div>
            {eyebrow("04","About O'Leary Homes")}
            <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2.2rem,4vw,3.8rem)', color:DARK, fontWeight:400, fontStyle:'italic', lineHeight:1.1, marginBottom:32 }}>
              Greg & Kerry O'Leary — building since 2004.
            </h2>
            <p className="reveal" style={{ fontFamily:"'Nunito',sans-serif", color:D(0.5), fontSize:'1rem', lineHeight:1.9, marginBottom:24 }}>
              O'Leary Homes was founded on a simple belief: that building a home should be a positive, straightforward, and enjoyable experience. Greg brings 20+ years of hands-on building and construction management expertise. Kerry keeps the business running with precision.
            </p>
            <p className="reveal" style={{ fontFamily:"'Nunito',sans-serif", color:D(0.5), fontSize:'1rem', lineHeight:1.9, marginBottom:48 }}>
              Together they've built a reputation across Hawke's Bay for quality, honesty, and results that genuinely reflect each client's life and vision.
            </p>
            <div className="reveal" style={{ display:'inline-block', padding:'20px 24px', border:`1px solid ${BORDER}`, borderRadius:10, background:S(0.05) }}>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:'1.05rem', color:DARK, fontStyle:'italic', marginBottom:8 }}>
                "Nothing was a problem, communication was superb, highly recommended."
              </div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color:STONE }}>— Bob and Fiona McElroy</div>
            </div>
          </div>

          <div style={{ paddingTop:60 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, borderTop:`1px solid ${BORDER}`, marginBottom:48 }}>
              {credentials.map(({ stat, label }) => (
                <div key={label} className="reveal" style={{ padding:'28px 0', borderBottom:`1px solid ${BORDER}`, cursor:'default', transition:'background .25s, padding .25s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=S(0.07); e.currentTarget.style.padding='28px 12px' }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.padding='28px 0' }}>
                  <div style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'2.5rem', color:SAGE, lineHeight:1, marginBottom:6 }}>{stat}</div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color:MUTED, whiteSpace:'pre-line' }}>{label}</div>
                </div>
              ))}
            </div>
            {['Certified Builders Platinum Member','Revere Accreditation (gold standard)','NZIA Award-winning builds','20+ years building & construction management',"Hawke's Bay local — we know the land"].map(item => (
              <div key={item} className="reveal" style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 0', borderBottom:`1px solid ${BORDER}` }}>
                <span style={{ width:18, height:18, borderRadius:'50%', background:G(0.15), border:`1px solid ${SAGE}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke={SAGE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.9rem', color:D(0.6) }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CONTACT ════ */}
      <section id="contact" className="popout" style={{ background:SURF1, padding:'100px 56px', willChange:'clip-path', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:700, height:700, borderRadius:'50%', pointerEvents:'none', background:`radial-gradient(circle,${S(0.08)} 0%,transparent 65%)` }}/>
        <div style={{ position:'absolute', bottom:-80, right:-20, fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'clamp(6rem,16vw,14rem)', color:D(0.04), lineHeight:1, userSelect:'none', pointerEvents:'none', letterSpacing:'0.02em' }}>BUILD</div>

        <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start', maxWidth:1100, margin:'0 auto' }}>
          <div>
            {eyebrow('05','Get In Touch')}
            <h2 className="reveal" style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'clamp(3rem,8vw,7rem)', color:DARK, lineHeight:0.95, letterSpacing:'0.01em', marginBottom:40 }}>
              LET'S BUILD<br/><span style={{ color:SAGE }}>SOMETHING.</span>
            </h2>
            <p className="reveal" style={{ fontFamily:"'Nunito',sans-serif", color:D(0.5), fontSize:'1rem', lineHeight:1.85, marginBottom:48 }}>
              Whether you're ready to start or just exploring — reach out. We'll have an honest conversation about your vision, your site, and what's possible.
            </p>
            <div className="reveal" style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[['Phone','021 XXX XXXX'],['Email','info@olearyhomes.co.nz'],['Area',"Hawke's Bay, New Zealand"]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', gap:20, alignItems:'flex-start', padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color:MUTED, paddingTop:3, minWidth:52 }}>{k}</span>
                  <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.95rem', color:DARK }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal">
            {submitted ? (
              <div style={{ padding:'56px 40px', background:SURF2, borderRadius:16, border:`1px solid ${BORDER}`, textAlign:'center' }}>
                <div style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'3rem', color:STONE, letterSpacing:'0.04em', marginBottom:12 }}>THANKS!</div>
                <p style={{ fontFamily:"'Nunito',sans-serif", color:D(0.5) }}>Greg or Kerry will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={e=>{ e.preventDefault(); setSubmitted(true) }} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                {[
                  { name:'name',  label:'Full Name', type:'text',  ph:'Jane Smith' },
                  { name:'email', label:'Email',     type:'email', ph:'jane@email.com' },
                  { name:'phone', label:'Phone',     type:'tel',   ph:'021 000 0000' },
                ].map(({ name, label, type, ph }) => (
                  <div key={name}>
                    <label style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, display:'block', marginBottom:8 }}>{label}</label>
                    <input type={type} placeholder={ph} required value={formData[name]}
                      onChange={e=>setFormData(p=>({ ...p, [name]:e.target.value }))}
                      style={inp} onFocus={e=>e.target.style.borderColor=S(0.5)} onBlur={e=>e.target.style.borderColor=BORDER}/>
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, display:'block', marginBottom:8 }}>Build Type</label>
                  <select value={formData.build} onChange={e=>setFormData(p=>({ ...p, build:e.target.value }))} style={{ ...inp, appearance:'none' }}>
                    <option value="">Select...</option>
                    {['Custom Home','Renovation / Extension','Architectural Build','For Sale Enquiry','Not sure yet'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, display:'block', marginBottom:8 }}>Tell Us About Your Project</label>
                  <textarea placeholder="Location, size, timeframe, budget..." rows={4} value={formData.message}
                    onChange={e=>setFormData(p=>({ ...p, message:e.target.value }))}
                    style={{ ...inp, resize:'vertical' }}
                    onFocus={e=>e.target.style.borderColor=S(0.5)} onBlur={e=>e.target.style.borderColor=BORDER}/>
                </div>
                <button type="submit" style={{ padding:'15px 40px', background:DARK, color:BG, borderRadius:100, border:'none', fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.1rem', letterSpacing:'0.08em', cursor:'pointer', transition:'background .2s', alignSelf:'flex-start', marginTop:4 }}
                  onMouseEnter={e=>e.currentTarget.style.background=STONE}
                  onMouseLeave={e=>e.currentTarget.style.background=DARK}>Send Enquiry</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:SURF1, borderTop:`1px solid ${BORDER}`, position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${SAGE},${STONE},${DARK})` }}/>

        {/* main row: brand left, links right */}
        <div style={{ padding:'48px 56px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:32 }}>
          <a href="#hero" style={{ display:'inline-block', lineHeight:0 }}>
            <img src={logo} alt="O'Leary Homes" style={{ height:300, width:'auto', display:'block', mixBlendMode:'multiply' }}/>
          </a>

          <div style={{ display:'flex', alignItems:'center', gap:0, flexWrap:'wrap' }}>
            {navLinks.map(([label,href], i) => (
              <span key={label} style={{ display:'flex', alignItems:'center' }}>
                <a href={href} style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:MUTED, padding:'6px 16px', borderRadius:100, border:'1px solid transparent', transition:'all .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.color=DARK; e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.background=BG }}
                  onMouseLeave={e=>{ e.currentTarget.style.color=MUTED; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent' }}>{label}</a>
                {i < navLinks.length - 1 && <span style={{ width:1, height:12, background:BORDER, display:'inline-block', flexShrink:0 }}/>}
              </span>
            ))}
            <a href="#contact" style={{ marginLeft:20, fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1rem', letterSpacing:'0.08em', padding:'10px 28px', background:SAGE, color:BG, borderRadius:100, transition:'background .2s', display:'inline-block' }}
              onMouseEnter={e=>e.currentTarget.style.background=DARK}
              onMouseLeave={e=>e.currentTarget.style.background=SAGE}>Start a Project</a>
          </div>
        </div>

        {/* bottom strip */}
        <div style={{ borderTop:`1px solid ${BORDER}`, padding:'18px 56px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.6rem', letterSpacing:'0.08em', textTransform:'uppercase', color:MUTED }}>
            © 2026 O&apos;Leary Homes Ltd · All rights reserved
          </span>
          <div style={{ display:'flex', gap:20 }}>
            {["Certified Builders","NZIA Member","Hawke's Bay"].map(t => (
              <span key={t} style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.08em', textTransform:'uppercase', color:S(0.5) }}>{t}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        nav a { position:relative; }
        nav a::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:${STONE}; transition:width .25s; }
        nav a:hover::after { width:100%; }
        .nav-cta { cursor:pointer; }
        @keyframes runline { 0%{top:-100%} 100%{top:100%} }

        @media(max-width:900px){
          .nav-links,.nav-cta { display:none !important }
          .hamburger { display:flex !important }
          #hero { flex-direction:column !important; padding:196px 32px 60px !important; gap:32px !important }
          .h-photo { flex:none !important; width:100% !important; min-height:300px !important; border-radius:16px !important; align-self:auto !important }
          #build,#process,#projects,#about,#contact { padding-left:32px !important; padding-right:32px !important }
          #build > div:last-child { grid-template-columns:1fr 1fr !important }
          #about > div { grid-template-columns:1fr !important; gap:48px !important }
          #about > div > div:last-child { padding-top:0 !important }
          #contact > div { grid-template-columns:1fr !important; gap:48px !important }
          #process > div:last-child { grid-template-columns:1fr !important }
          #process > div:last-child > div { border-radius:8px !important }
          .proj-bento { grid-template-columns:1fr 1fr !important; grid-template-rows:auto !important }
          .proj-bento > div { grid-column:auto !important; grid-row:auto !important; height:180px }
          footer { padding:24px 32px !important }
        }
        @media(max-width:540px){
          #build > div:last-child { grid-template-columns:1fr !important }
          .proj-bento { grid-template-columns:1fr !important }
          .proj-bento > div { height:220px }
          #hero { padding:196px 20px 48px !important }
          #build,#process,#projects,#about,#contact { padding-left:20px !important; padding-right:20px !important }
          nav { padding:14px 20px !important }
          footer { flex-direction:column; align-items:flex-start !important; padding:20px !important }
          footer > div:last-child { display:none }
          .h-meta { display:none !important }
        }
        @media(prefers-reduced-motion:reduce){
          *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important }
        }
      `}</style>
    </>
  )
}
