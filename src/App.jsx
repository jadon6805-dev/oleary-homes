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

const BG     = '#F5F1EB'
const SURF1  = '#EDE8DF'
const SURF2  = '#E5DDD3'
const DARK   = '#3D3C38'
const STONE  = '#8B6F47'
const SAGE   = '#8A9B6C'
const MUTED  = '#7A6E62'
const BORDER = 'rgba(70,68,63,0.1)'
const S = (a) => `rgba(139,111,71,${a})`
const G = (a) => `rgba(138,155,108,${a})`
const D = (a) => `rgba(70,68,63,${a})`

const services = [
  {
    num:'01', name:'New Home Builds',
    desc:'Fully managed custom home builds from foundation to final coat. LBP licensed and Certified Builders accredited — your project is protected at every stage.',
    icon:(
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 13L15 4L26 13V26H4V13Z"/>
        <rect x="11" y="18" width="8" height="8"/>
        <line x1="19" y1="4" x2="19" y2="8"/>
        <rect x="19" y="1" width="3" height="5" rx="0.5"/>
        <rect x="5.5" y="15" width="5" height="5" rx="0.5"/>
        <line x1="8" y1="15" x2="8" y2="20"/>
        <line x1="5.5" y1="17.5" x2="10.5" y2="17.5"/>
      </svg>
    ),
  },
  {
    num:'02', name:'Renovations',
    desc:'Considered renovations that respect the existing structure while elevating the whole home. We manage every trade, every timeline, and every detail — no surprises.',
    icon:(
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 14L11 6L20 14V26H2V14Z"/>
        <rect x="13" y="19" width="6" height="7"/>
        <path d="M18 18H26V26H18" strokeDasharray="2 1.5"/>
        <path d="M18 18L22 14L26 18"/>
        <circle cx="24" cy="8" r="2.5"/>
        <line x1="22" y1="10" x2="19" y2="13"/>
      </svg>
    ),
  },
  {
    num:'03', name:'Extensions',
    desc:'Need more space? We design and build seamless extensions that feel like they were always there — matching materials, craftsmanship, and character.',
    icon:(
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16L10 8L18 16V26H2V16Z"/>
        <rect x="7" y="20" width="5" height="6"/>
        <path d="M18 16H26V26H18"/>
        <line x1="18" y1="16" x2="22" y2="12"/>
        <line x1="22" y1="12" x2="26" y2="16"/>
        <line x1="22" y1="19" x2="22" y2="23"/>
        <line x1="20" y1="21" x2="24" y2="21"/>
      </svg>
    ),
  },
  {
    num:'04', name:'Architectural Builds',
    desc:'High-specification builds in partnership with leading Hawke\'s Bay architects. If you have the plans, we have the expertise to deliver them with precision.',
    icon:(
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="26" height="26" rx="1"/>
        <line x1="2" y1="10" x2="28" y2="10" strokeOpacity="0.35"/>
        <line x1="2" y1="18" x2="28" y2="18" strokeOpacity="0.35"/>
        <line x1="10" y1="2" x2="10" y2="28" strokeOpacity="0.35"/>
        <line x1="18" y1="2" x2="18" y2="28" strokeOpacity="0.35"/>
        <rect x="6" y="12" width="18" height="11" rx="0.5"/>
        <line x1="6" y1="12" x2="24" y2="12"/>
        <rect x="10" y="17" width="4" height="6"/>
        <rect x="16" y="14" width="5" height="3"/>
      </svg>
    ),
  },
]

const steps = [
  { num:'01', step:'Free Consultation', detail:"We meet on-site or at our office, listen to your vision, review your section, and give you an honest assessment — no obligation, no pressure. Just straight talk about what's possible." },
  { num:'02', step:'Design & Planning',  detail:'Working with your architect or ours, we develop buildable, beautiful plans that hit your budget. We flag problems before they cost money and keep the process moving.' },
  { num:'03', step:'Transparent Pricing', detail:'You get a clear, itemised quote with no hidden costs. We walk through every line item, answer every question, and only proceed when you are completely confident.' },
  { num:'04', step:'The Build',           detail:'Our team manages every trade, every schedule, and every site visit — providing regular photo updates and keeping you in the loop at every stage of construction.' },
  { num:'05', step:'Handover & Warranty', detail:'A thorough walk-through, full snag-list sign-off, and the keys to your new home. Backed by a 10-year Certified Builders guarantee for complete peace of mind.' },
]

const projects = [
  {
    id:'01', name:'Havelock North Residence', location:"Havelock North, Hawke's Bay",
    type:'Custom Build', size:'320m²', year:'2024',
    img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
  },
  {
    id:'02', name:'Napier Architectural Home', location:"Napier, Hawke's Bay",
    type:'Architectural', size:'410m²', year:'2023',
    img:'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&auto=format&fit=crop&q=80',
  },
  {
    id:'03', name:'Bay View Coastal Renovation', location:"Bay View, Napier",
    type:'Renovation', size:'185m²', year:'2024',
    img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&auto=format&fit=crop&q=80',
  },
  {
    id:'04', name:'Taradale Family Home', location:"Taradale, Hawke's Bay",
    type:'Custom Build', size:'265m²', year:'2023',
    img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop&q=80',
  },
  {
    id:'05', name:'Ahuriri Rear Extension', location:"Ahuriri, Napier",
    type:'Extension', size:'+80m²', year:'2022',
    img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80',
  },
  {
    id:'06', name:'Hastings Contemporary', location:"Hastings, Hawke's Bay",
    type:'Architectural', size:'395m²', year:'2022',
    img:'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&auto=format&fit=crop&q=80',
  },
]

const testimonials = [
  {
    name:'Bob & Fiona McElroy', location:'Havelock North', project:'Custom Build · 320m²',
    quote:"Greg and Kerry were exceptional from start to finish. Nothing was a problem — the communication was superb throughout the entire build. Our home was delivered on time, on budget, and the quality of the finish is outstanding. Highly recommended without hesitation.",
  },
  {
    name:'Mark & Rachel Davies', location:'Napier', project:'Architectural Build · 410m²',
    quote:"We went with O'Leary Homes after getting three quotes. They weren't the cheapest but they were clearly the most experienced and honest. Greg's knowledge of the Hawke's Bay climate meant we avoided several costly mistakes. The result is exactly what we dreamed of.",
  },
  {
    name:'Sarah Thornton', location:'Taradale', project:'Renovation & Extension',
    quote:"I was nervous about a full renovation after hearing horror stories. But Greg's team were tidy, professional, and genuinely cared about the detail. Kerry kept me updated every week without me having to chase anyone. Our 1970s house has been completely transformed.",
  },
]

const credentials = [
  { stat:'20+',  label:'Years Experience' },
  { stat:'150+', label:'Homes Completed' },
  { stat:'★',    label:'NZIA Award Winner' },
  { stat:'★★',   label:"Certified Builders\nPlatinum + Revere" },
]

const trustBadges = [
  'LBP Licensed & Insured',
  'Certified Builders Platinum',
  '150+ Homes Completed',
  '10-Year Guarantee',
]

export default function App() {
  const cursorDotRef = useRef(null)
  const navRef       = useRef(null)
  const logoWrapRef  = useRef(null)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [formData,  setFormData]  = useState({ name:'', email:'', phone:'', build:'', budget:'', startDate:'', message:'' })
  const [submitted, setSubmitted] = useState(false)

  const navLinks = [['Services','#build'],['Process','#process'],['Projects','#projects'],['About','#about'],['Contact','#contact']]

  useEffect(() => {
    const dot = cursorDotRef.current
    const onMove = e => {
      gsap.set(dot, { x:e.clientX, y:e.clientY })
      const over = !!e.target.closest('a,button,.build-card,.p-item,.testi-card')
      gsap.to(dot, { scale:over?3.5:1, background:over?STONE:DARK, duration:.15 })
    }
    document.addEventListener('mousemove', onMove)

    const nav = navRef.current
    const onScroll = () => {
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

    const bar = document.createElement('div')
    bar.style.cssText=`position:fixed;top:0;left:0;height:2px;width:0%;background:linear-gradient(90deg,${SAGE},${STONE},${DARK});z-index:9999;pointer-events:none;`
    document.body.appendChild(bar)
    const updateBar = () => { bar.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%' }
    window.addEventListener('scroll', updateBar, { passive:true })

    gsap.fromTo('.h-eyebrow', { opacity:0, y:20 }, { opacity:1, y:0, duration:.8, delay:.3 })
    gsap.fromTo('.h-l1',      { opacity:0, y:70 }, { opacity:1, y:0, duration:1.1, delay:.5,  ease:'power3.out' })
    gsap.fromTo('.h-l2',      { opacity:0, y:70 }, { opacity:1, y:0, duration:1.1, delay:.65, ease:'power3.out' })
    gsap.fromTo('.h-l3',      { opacity:0, y:70 }, { opacity:1, y:0, duration:1.1, delay:.8,  ease:'power3.out' })
    gsap.fromTo('.h-sub',     { opacity:0, y:24 }, { opacity:1, y:0, duration:.8,  delay:1.1 })
    gsap.fromTo('.h-cta',     { opacity:0, y:20 }, { opacity:1, y:0, duration:.8,  delay:1.3 })
    gsap.fromTo('.h-trust',   { opacity:0 },       { opacity:1,       duration:.8,  delay:1.6 })

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
    gsap.fromTo('.proc-row', { opacity:0, x:-20 }, { opacity:1, x:0, duration:.6, stagger:.1, ease:'power2.out',
      scrollTrigger:{ trigger:'#process', start:'top 80%' } })
    gsap.fromTo('.p-item', { opacity:0, y:30 }, { opacity:1, y:0, duration:.6, stagger:.08, ease:'power2.out',
      scrollTrigger:{ trigger:'#projects', start:'top 80%' } })
    gsap.fromTo('.testi-card', { opacity:0, y:36 }, { opacity:1, y:0, duration:.7, stagger:.12, ease:'power2.out',
      scrollTrigger:{ trigger:'#testimonials', start:'top 82%' } })
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
      bar.remove()
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
    fontFamily:"'Nunito',sans-serif",
  }
  const labelStyle = { fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, display:'block', marginBottom:8 }

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

      <div style={{ position:'fixed', inset:0, zIndex:9000, pointerEvents:'none', backgroundImage:GRAIN_URL, backgroundRepeat:'repeat', opacity:0.04, mixBlendMode:'multiply' }}/>

      <div ref={cursorDotRef} style={{
        position:'fixed', top:0, left:0, width:8, height:8,
        background:DARK, borderRadius:'50%', pointerEvents:'none', zIndex:9999, transform:'translate(-50%,-50%)',
      }}/>

      {/* ── LOGO ── */}
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
        background:'rgba(245,241,235,0.03)', backdropFilter:'blur(20px) saturate(1.5)', WebkitBackdropFilter:'blur(20px) saturate(1.5)',
        borderBottom:'1px solid transparent', transition:'background .3s, border-color .3s, box-shadow .3s',
      }}>
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
        onMouseLeave={e=>e.currentTarget.style.background=DARK}>Get a Free Quote</a>

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
          <img src={logo} alt="O'Leary Homes" style={{ height:200, width:'auto', marginBottom:8, mixBlendMode:'multiply' }}/>
          <a href="#contact" onClick={()=>setMenuOpen(false)} style={{ marginTop:16, fontFamily:"'Space Mono',monospace", fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase', padding:'14px 36px', background:DARK, color:BG, borderRadius:100 }}>Get a Free Quote</a>
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

        <div style={{ position:'relative', flex:'1 1 0', minWidth:0 }}>
          <div className="h-eyebrow" style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:MUTED, display:'flex', alignItems:'center', gap:16, marginBottom:28, opacity:0 }}>
            <span style={{ display:'block', width:40, height:1, background:MUTED }}/>
            Hawke's Bay · Est. 2004 · LBP Licensed
          </div>

          <h1 style={{ margin:0, lineHeight:0.9, fontFamily:"'Bebas Neue',cursive,sans-serif", letterSpacing:'0.02em' }}>
            <div className="h-l1" style={{ fontSize:'clamp(3.5rem,9vw,10rem)', color:DARK, opacity:0 }}>BUILT</div>
            <div className="h-l2" style={{ fontSize:'clamp(3.5rem,9vw,10rem)', color:SAGE, opacity:0 }}>FOR YOUR</div>
            <div className="h-l3" style={{ fontSize:'clamp(3.5rem,9vw,10rem)', color:DARK, opacity:0 }}>LIFE.</div>
          </h1>

          <p className="h-sub" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(1rem,1.6vw,1.25rem)', color:D(0.5), maxWidth:460, lineHeight:1.85, marginTop:32, marginBottom:40, opacity:0 }}>
            Licensed Building Practitioner with 20+ years of Hawke's Bay experience. Greg and Kerry O'Leary deliver custom homes that are built on time, on budget, and built to last.
          </p>

          <div className="h-cta" style={{ display:'flex', gap:14, flexWrap:'wrap', opacity:0 }}>
            <a href="#contact" style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.05rem', letterSpacing:'0.08em', padding:'14px 40px', background:DARK, color:BG, borderRadius:100, transition:'background .2s, transform .2s', display:'inline-block' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=STONE; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e=>{ e.currentTarget.style.background=DARK; e.currentTarget.style.transform='none' }}>Get a Free Quote</a>
            <a href="#projects" style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.72rem', letterSpacing:'0.12em', textTransform:'uppercase', padding:'14px 32px', background:'transparent', color:DARK, borderRadius:100, border:`1px solid ${BORDER}`, transition:'border-color .2s, transform .2s', display:'inline-block' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=S(0.5); e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.transform='none' }}>View Projects</a>
          </div>

          <div className="h-trust" style={{ display:'flex', flexWrap:'wrap', gap:0, marginTop:48, opacity:0, borderTop:`1px solid ${BORDER}`, paddingTop:24 }}>
            {trustBadges.map((t, i) => (
              <span key={t} style={{ display:'flex', alignItems:'center' }}>
                {i > 0 && <span style={{ width:1, height:10, background:BORDER, display:'inline-block', margin:'0 16px' }}/>}
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.6rem', letterSpacing:'0.08em', textTransform:'uppercase', color:i===0?SAGE:MUTED }}>{t}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="h-photo" style={{ flex:'0 0 45%', alignSelf:'stretch', minHeight:'70vh', position:'relative', overflow:'hidden', borderRadius:'20px 0 0 20px' }}>
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=85"
            alt="O'Leary Homes — Havelock North custom build"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }}
          />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(to right,${BG} 0%,transparent 25%)` }}/>
          <div style={{ position:'absolute', bottom:28, left:28, background:'rgba(245,241,235,0.92)', backdropFilter:'blur(12px)', borderRadius:10, padding:'14px 22px' }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color:STONE, marginBottom:4 }}>Featured Build · 2024</div>
            <div style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.05rem', letterSpacing:'0.05em', color:DARK }}>Havelock North · 320m²</div>
          </div>
        </div>
      </section>

      {/* ════ SERVICES ════ */}
      <section id="build" className="popout" style={{ background:SURF1, padding:'88px 56px', willChange:'clip-path', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', pointerEvents:'none', background:`radial-gradient(circle,${S(0.07)} 0%,transparent 70%)` }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:64, paddingBottom:40, borderBottom:`1px solid ${BORDER}`, flexWrap:'wrap', gap:20 }}>
          {eyebrow('01','What We Build')}
          <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2rem,3.5vw,3rem)', color:DARK, fontWeight:400, fontStyle:'italic' }}>Every home, uniquely yours.</h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {services.map(({ num, name, desc, icon }) => (
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
                <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.88rem', color:D(0.55), lineHeight:1.8 }}>{desc}</p>
                <div style={{ marginTop:24, display:'flex', alignItems:'center', gap:8, fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.08em', textTransform:'uppercase', color:SAGE }}>
                  Enquire <span style={{ fontSize:'0.8rem' }}>→</span>
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
          <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2rem,3.5vw,3rem)', color:DARK, fontWeight:400, fontStyle:'italic' }}>Straightforward, from consult to keys.</h2>
        </div>

        <div style={{ display:'flex', flexDirection:'column' }}>
          {steps.map(({ num, step, detail }, i) => (
            <div key={num} className="proc-row" style={{
              display:'grid', gridTemplateColumns:'220px 1fr', gap:48, alignItems:'start',
              padding:'40px 0', borderBottom: i < steps.length - 1 ? `1px solid ${BORDER}` : 'none',
              opacity:0, transition:'background .25s',
            }}>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:40, height:40, borderRadius:'50%', background:G(0.15), border:`1px solid ${G(0.4)}`, fontFamily:"'Space Mono',monospace", fontSize:'0.65rem', color:SAGE, letterSpacing:'0.05em', marginBottom:20, fontWeight:700 }}>{num}</div>
                <h3 style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.7rem', letterSpacing:'0.04em', color:DARK, lineHeight:1.05 }}>{step}</h3>
              </div>
              <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.95rem', color:D(0.5), lineHeight:1.9, paddingTop:4 }}>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ PROJECTS ════ */}
      <section id="projects" className="popout" style={{ background:SURF1, padding:'88px 56px', willChange:'clip-path' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56, flexWrap:'wrap', gap:20 }}>
          {eyebrow('03','Our Projects')}
          <div style={{ textAlign:'right' }}>
            <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2rem,3vw,2.8rem)', color:DARK, fontWeight:400, fontStyle:'italic', marginBottom:8 }}>Homes we're proud to have built.</h2>
            <p className="reveal" style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.9rem', color:D(0.45) }}>Hawke's Bay · 2018–2024 · 150+ completed builds</p>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {projects.map(({ id, name, location, type, size, year, img }) => (
            <div key={id} className="p-item" style={{ borderRadius:12, overflow:'hidden', background:SURF2, cursor:'pointer', opacity:0, transition:'transform .3s, box-shadow .3s', border:`1px solid ${BORDER}` }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 24px 48px ${D(0.15)}` }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{ position:'relative', height:220, overflow:'hidden' }}>
                <img className="p-img" src={img} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform .6s ease' }}
                  onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(28,24,20,0.3) 0%,transparent 60%)' }}/>
                <div style={{ position:'absolute', top:14, right:14, fontFamily:"'Space Mono',monospace", fontSize:'0.55rem', letterSpacing:'0.1em', textTransform:'uppercase', background:'rgba(245,241,235,0.92)', color:DARK, padding:'5px 11px', borderRadius:100 }}>{type}</div>
              </div>
              <div style={{ padding:'22px 24px 26px' }}>
                <h3 style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.35rem', letterSpacing:'0.04em', color:DARK, lineHeight:1.1, marginBottom:8 }}>{name}</h3>
                <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.82rem', color:D(0.45), marginBottom:16 }}>{location}</div>
                <div style={{ display:'flex', gap:12, borderTop:`1px solid ${BORDER}`, paddingTop:16 }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.08em', textTransform:'uppercase', color:STONE, background:S(0.08), padding:'4px 10px', borderRadius:100 }}>{size}</span>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.08em', textTransform:'uppercase', color:MUTED, background:D(0.06), padding:'4px 10px', borderRadius:100 }}>{year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop:48, textAlign:'center' }}>
          <a href="#contact" style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', padding:'13px 36px', background:'transparent', color:DARK, borderRadius:100, border:`1px solid ${BORDER}`, transition:'border-color .2s, background .2s', display:'inline-block' }}
            onMouseEnter={e=>{ e.currentTarget.style.background=DARK; e.currentTarget.style.color=BG; e.currentTarget.style.borderColor=DARK }}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=DARK; e.currentTarget.style.borderColor=BORDER }}>Discuss Your Project →</a>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section id="testimonials" className="popout" style={{ background:DARK, padding:'88px 56px', willChange:'clip-path', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:600, height:600, borderRadius:'50%', pointerEvents:'none', background:`radial-gradient(circle,${G(0.08)} 0%,transparent 70%)` }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56, paddingBottom:40, borderBottom:'1px solid rgba(245,241,235,0.1)', flexWrap:'wrap', gap:20 }}>
          {/* custom eyebrow for dark bg */}
          <div className="reveal" style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.68rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(245,241,235,0.45)', display:'flex', alignItems:'center', gap:12, marginBottom:0 }}>
            <span className="draw-line" style={{ display:'block', width:24, height:1, background:SAGE }}/>
            04 / What Clients Say
          </div>
          <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2rem,3vw,2.8rem)', color:BG, fontWeight:400, fontStyle:'italic' }}>Real projects. Real people. Real results.</h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {testimonials.map(({ name, location, project, quote }) => (
            <div key={name} className="testi-card" style={{ background:'rgba(245,241,235,0.05)', border:'1px solid rgba(245,241,235,0.1)', borderRadius:12, padding:'36px 32px', cursor:'default', transition:'background .3s', opacity:0 }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(245,241,235,0.09)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(245,241,235,0.05)'}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'2rem', color:SAGE, lineHeight:1, marginBottom:20, opacity:0.6 }}>"</div>
              <p style={{ fontFamily:"'Instrument Serif',serif", fontSize:'1.02rem', color:'rgba(245,241,235,0.85)', lineHeight:1.85, marginBottom:32 }}>{quote}</p>
              <div style={{ borderTop:'1px solid rgba(245,241,235,0.1)', paddingTop:24 }}>
                <div style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.1rem', letterSpacing:'0.06em', color:BG, marginBottom:4 }}>{name}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color:SAGE }}>{location} · {project}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop:48, display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap' }}>
          {[['Google', '5.0 ★★★★★ · 24 reviews'], ['Houzz', '5.0 ★★★★★ · 11 reviews'], ['Certified Builders', 'Platinum Member']].map(([platform, detail]) => (
            <div key={platform} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(245,241,235,0.4)' }}>{platform}</span>
              <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.85rem', color:SAGE }}>{detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ ABOUT ════ */}
      <section id="about" className="popout" style={{ background:SURF2, padding:'88px 56px', willChange:'clip-path', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10%', left:'-5%', width:600, height:600, borderRadius:'50%', pointerEvents:'none', background:`radial-gradient(circle,${S(0.08)} 0%,transparent 70%)` }}/>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:80, alignItems:'start', position:'relative' }}>
          <div>
            {eyebrow('05',"About O'Leary Homes")}
            <h2 className="reveal" style={{ fontFamily:"'Instrument Serif',serif", fontSize:'clamp(2.2rem,4vw,3.8rem)', color:DARK, fontWeight:400, fontStyle:'italic', lineHeight:1.1, marginBottom:32 }}>
              Greg & Kerry O'Leary — building since 2004.
            </h2>
            <p className="reveal" style={{ fontFamily:"'Nunito',sans-serif", color:D(0.5), fontSize:'1rem', lineHeight:1.9, marginBottom:24 }}>
              O'Leary Homes was founded on a simple belief: that building a home should be a positive, straightforward experience. As a Licensed Building Practitioner (LBP) with 20+ years of hands-on experience, Greg brings construction management expertise that protects your investment at every stage.
            </p>
            <p className="reveal" style={{ fontFamily:"'Nunito',sans-serif", color:D(0.5), fontSize:'1rem', lineHeight:1.9, marginBottom:48 }}>
              Kerry manages the business with precision — ensuring every client is communicated with clearly and every project runs to schedule. Together they've built 150+ homes across Hawke's Bay, earning a reputation for quality, honesty, and results that genuinely reflect each client's life.
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
            {[
              'Licensed Building Practitioner (LBP #123456)',
              'Certified Builders Platinum Member',
              'Revere Accreditation (gold standard)',
              'Fully insured — public liability & contract works',
              'NZIA Award-winning builds',
              "Hawke's Bay local — we know the land",
            ].map(item => (
              <div key={item} className="reveal" style={{ display:'flex', alignItems:'center', gap:16, padding:'15px 0', borderBottom:`1px solid ${BORDER}` }}>
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

        <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start', maxWidth:1200, margin:'0 auto' }}>
          <div>
            {eyebrow('06','Get In Touch')}
            <h2 className="reveal" style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'clamp(3rem,8vw,7rem)', color:DARK, lineHeight:0.95, letterSpacing:'0.01em', marginBottom:32 }}>
              LET'S BUILD<br/><span style={{ color:SAGE }}>SOMETHING.</span>
            </h2>
            <p className="reveal" style={{ fontFamily:"'Nunito',sans-serif", color:D(0.5), fontSize:'1rem', lineHeight:1.85, marginBottom:40 }}>
              Whether you're ready to start or just exploring — reach out. We'll have an honest conversation about your vision, your site, and what's genuinely possible within your budget.
            </p>

            <div className="reveal" style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:48 }}>
              {[
                ['Phone','021 XXX XXXX'],
                ['Email','info@olearyhomes.co.nz'],
                ["Hawke's Bay",'Napier · Hastings · Havelock North · Taradale'],
                ['LBP','Licensed Building Practitioner · Certified Builders Platinum'],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', gap:20, alignItems:'flex-start', padding:'18px 0', borderBottom:`1px solid ${BORDER}` }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color:MUTED, paddingTop:3, minWidth:80, flexShrink:0 }}>{k}</span>
                  <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.9rem', color:DARK }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
              {[['Facebook','f'],['Instagram','in'],['Houzz','h']].map(([name, abbr]) => (
                <div key={name} style={{ width:40, height:40, borderRadius:'50%', border:`1px solid ${BORDER}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'border-color .2s, background .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=SAGE; e.currentTarget.style.background=G(0.1) }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.background='transparent' }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.6rem', color:MUTED }}>{abbr}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal">
            {submitted ? (
              <div style={{ padding:'56px 40px', background:SURF2, borderRadius:16, border:`1px solid ${BORDER}`, textAlign:'center' }}>
                <div style={{ fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'3rem', color:STONE, letterSpacing:'0.04em', marginBottom:12 }}>THANKS!</div>
                <p style={{ fontFamily:"'Nunito',sans-serif", color:D(0.5), lineHeight:1.8 }}>Greg or Kerry will be in touch within 24 hours to discuss your project.</p>
              </div>
            ) : (
              <form onSubmit={e=>{ e.preventDefault(); setSubmitted(true) }} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input type="text" placeholder="Jane Smith" required value={formData.name}
                      onChange={e=>setFormData(p=>({ ...p, name:e.target.value }))}
                      style={inp} onFocus={e=>e.target.style.borderColor=S(0.5)} onBlur={e=>e.target.style.borderColor=BORDER}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input type="tel" placeholder="021 000 0000" required value={formData.phone}
                      onChange={e=>setFormData(p=>({ ...p, phone:e.target.value }))}
                      style={inp} onFocus={e=>e.target.style.borderColor=S(0.5)} onBlur={e=>e.target.style.borderColor=BORDER}/>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" placeholder="jane@email.com" required value={formData.email}
                    onChange={e=>setFormData(p=>({ ...p, email:e.target.value }))}
                    style={inp} onFocus={e=>e.target.style.borderColor=S(0.5)} onBlur={e=>e.target.style.borderColor=BORDER}/>
                </div>
                <div>
                  <label style={labelStyle}>Project Type *</label>
                  <select required value={formData.build} onChange={e=>setFormData(p=>({ ...p, build:e.target.value }))} style={{ ...inp, appearance:'none' }}>
                    <option value="">Select a project type...</option>
                    {['New Home Build','Renovation','Extension','Architectural Build','Not sure yet'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
                  <div>
                    <label style={labelStyle}>Budget Range</label>
                    <select value={formData.budget} onChange={e=>setFormData(p=>({ ...p, budget:e.target.value }))} style={{ ...inp, appearance:'none' }}>
                      <option value="">Select range...</option>
                      {['Under $500k','$500k – $750k','$750k – $1m','$1m – $1.5m','Over $1.5m','Not sure yet'].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>When to Start</label>
                    <select value={formData.startDate} onChange={e=>setFormData(p=>({ ...p, startDate:e.target.value }))} style={{ ...inp, appearance:'none' }}>
                      <option value="">Select timeframe...</option>
                      {['As soon as possible','3 – 6 months','6 – 12 months','12+ months','Just planning'].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Tell Us About Your Project</label>
                  <textarea placeholder="Location, land size, number of bedrooms, any specific requirements or ideas..." rows={4} value={formData.message}
                    onChange={e=>setFormData(p=>({ ...p, message:e.target.value }))}
                    style={{ ...inp, resize:'vertical' }}
                    onFocus={e=>e.target.style.borderColor=S(0.5)} onBlur={e=>e.target.style.borderColor=BORDER}/>
                </div>
                <button type="submit" style={{ padding:'15px 40px', background:DARK, color:BG, borderRadius:100, border:'none', fontFamily:"'Bebas Neue',cursive,sans-serif", fontSize:'1.1rem', letterSpacing:'0.08em', cursor:'pointer', transition:'background .2s', alignSelf:'flex-start', marginTop:4 }}
                  onMouseEnter={e=>e.currentTarget.style.background=STONE}
                  onMouseLeave={e=>e.currentTarget.style.background=DARK}>Send Enquiry →</button>
                <p style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.06em', color:MUTED, marginTop:4 }}>We respond within 24 hours. Your details are never shared.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:DARK, position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${SAGE},${STONE},${BG})` }}/>

        <div style={{ padding:'64px 56px 48px', display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:48 }}>
          {/* brand */}
          <div>
            <a href="#hero" style={{ display:'inline-block', lineHeight:0, marginBottom:20 }}>
              <img src={logo} alt="O'Leary Homes" style={{ height:140, width:'auto', display:'block', mixBlendMode:'multiply', filter:'brightness(0) invert(1)', opacity:0.9 }}/>
            </a>
            <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.88rem', color:'rgba(245,241,235,0.45)', lineHeight:1.8, maxWidth:240, marginBottom:28 }}>
              Licensed Building Practitioner building quality custom homes across Hawke's Bay since 2004.
            </p>
            <div style={{ display:'flex', gap:12 }}>
              {['f','in','h'].map(abbr => (
                <div key={abbr} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid rgba(245,241,235,0.15)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'border-color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=SAGE}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(245,241,235,0.15)'}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.6rem', color:'rgba(245,241,235,0.5)' }}>{abbr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:SAGE, marginBottom:24 }}>Quick Links</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[...navLinks, ['Get a Free Quote','#contact']].map(([label,href]) => (
                <a key={label} href={href} style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.88rem', color:'rgba(245,241,235,0.5)', transition:'color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color=BG}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(245,241,235,0.5)'}>{label}</a>
              ))}
            </div>
          </div>

          {/* contact */}
          <div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:SAGE, marginBottom:24 }}>Contact</div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[['Phone','021 XXX XXXX'],['Email','info@olearyhomes.co.nz'],['Office',"Hawke's Bay, New Zealand"]].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.55rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(245,241,235,0.3)', marginBottom:4 }}>{k}</div>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.88rem', color:'rgba(245,241,235,0.6)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* service areas */}
          <div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:SAGE, marginBottom:24 }}>Service Areas</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['Napier City','Hastings','Havelock North','Taradale','Bay View','Waipawa & Waipukurau','Wairoa & surrounds'].map(area => (
                <span key={area} style={{ fontFamily:"'Nunito',sans-serif", fontSize:'0.85rem', color:'rgba(245,241,235,0.45)' }}>{area}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(245,241,235,0.08)', padding:'20px 56px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(245,241,235,0.3)' }}>
            © 2026 O&apos;Leary Homes Ltd · All rights reserved
          </span>
          <div style={{ display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' }}>
            {['Privacy Policy','Terms of Use'].map(t => (
              <a key={t} href="#" style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.55rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(245,241,235,0.25)', transition:'color .2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='rgba(245,241,235,0.6)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(245,241,235,0.25)'}>{t}</a>
            ))}
            {['LBP Licensed','Certified Builders','NZIA Member'].map(t => (
              <span key={t} style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.55rem', letterSpacing:'0.08em', textTransform:'uppercase', color:G(0.5) }}>{t}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        nav a { position:relative; }
        nav a::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:${STONE}; transition:width .25s; }
        nav a:hover::after { width:100%; }
        .nav-cta { cursor:pointer; }

        @media(max-width:1100px){
          #projects > div:nth-child(2) { grid-template-columns:1fr 1fr !important }
          footer > div:first-of-type { grid-template-columns:1fr 1fr !important }
        }
        @media(max-width:900px){
          .nav-links,.nav-cta { display:none !important }
          .hamburger { display:flex !important }
          #hero { flex-direction:column !important; padding:196px 32px 60px !important; gap:32px !important }
          .h-photo { flex:none !important; width:100% !important; min-height:300px !important; border-radius:16px !important; align-self:auto !important }
          #build,#process,#projects,#testimonials,#about,#contact { padding-left:32px !important; padding-right:32px !important }
          #build > div:last-child { grid-template-columns:1fr 1fr !important }
          #about > div { grid-template-columns:1fr !important; gap:48px !important }
          #about > div > div:last-child { padding-top:0 !important }
          #contact > div { grid-template-columns:1fr !important; gap:48px !important }
          #testimonials > div:nth-child(2) { grid-template-columns:1fr !important }
          #projects > div:nth-child(2) { grid-template-columns:1fr 1fr !important }
          footer > div:first-of-type { grid-template-columns:1fr 1fr !important; gap:32px !important }
        }
        @media(max-width:540px){
          #build > div:last-child { grid-template-columns:1fr !important }
          #projects > div:nth-child(2) { grid-template-columns:1fr !important }
          #hero { padding:196px 20px 48px !important }
          #build,#process,#projects,#testimonials,#about,#contact { padding-left:20px !important; padding-right:20px !important }
          nav { padding:14px 20px !important }
          .h-trust { display:none !important }
          #contact form > div:first-child { grid-template-columns:1fr !important }
          #contact form > div:nth-child(4) { grid-template-columns:1fr !important }
          footer > div:first-of-type { grid-template-columns:1fr !important }
          #process .proc-row { grid-template-columns:1fr !important; gap:16px !important }
        }
        @media(prefers-reduced-motion:reduce){
          *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important }
        }
      `}</style>
    </>
  )
}
