import { useState } from 'react'

type Page = 'home' | 'explore' | 'projects' | 'project' | 'messages' | 'notifications'
type ProjectTab = 'overview' | 'timeline' | 'gallery' | 'payments' | 'messages' | 'documents'

const images = {
  hero: 'https://images.unsplash.com/photo-1727430256509-0f897d6f4765?auto=format&fit=crop&w=1800&q=88',
  couple: 'https://images.unsplash.com/photo-1630526720753-aa4e71acf67d?auto=format&fit=crop&w=1200&q=85',
  bride: 'https://images.unsplash.com/photo-1583878545126-2f1ca0142714?auto=format&fit=crop&w=1200&q=85',
  editorial: 'https://images.unsplash.com/photo-1665960213530-3fb10da1f25e?auto=format&fit=crop&w=1200&q=85',
  ceremony: 'https://images.unsplash.com/photo-1633104502699-b2ecf0fee294?auto=format&fit=crop&w=1200&q=85',
  portrait: 'https://images.unsplash.com/photo-1610173826608-bd1f53a52db1?auto=format&fit=crop&w=1200&q=85',
  detail: 'https://images.unsplash.com/photo-1698419193331-5b2fb90a6304?auto=format&fit=crop&w=1200&q=85',
}

const Icon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18" /></>,
    message: <><path d="M21 14a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    shield: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10" /><path d="m9 12 2 2 4-4" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M5 21h14" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    send: <path d="m22 2-7 20-4-9-9-4ZM22 2 11 13" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Button({ children, variant = 'primary', icon, onClick, className = '' }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; icon?: string; onClick?: () => void; className?: string }) {
  return <button className={`button button-${variant} ${className}`} onClick={onClick}>{icon && <Icon name={icon} size={18} />}{children}</button>
}

function Logo({ onClick }: { onClick: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="Luma home"><span className="logo-mark">L</span><span>Luma</span></button>
}

function Header({ page, navigate, openCreate }: { page: Page; navigate: (p: Page) => void; openCreate: () => void }) {
  const nav = [['Explore', 'explore'], ['Projects', 'projects'], ['Messages', 'messages']] as const
  return <header className="topbar">
    <div className="nav-wrap">
      <Logo onClick={() => navigate('home')} />
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([label, target]) => <button key={target} onClick={() => navigate(target)} className={page === target ? 'active' : ''}>{label}</button>)}
      </nav>
      <div className="header-actions">
        <Button icon="plus" onClick={openCreate}>Create a project</Button>
        <button className="icon-button" onClick={() => navigate('notifications')} aria-label="Notifications"><Icon name="bell" /><span className="notification-dot" /></button>
        <button className="avatar-button" aria-label="Account menu"><span>AM</span><span className="profile-copy"><strong>Aanya Mehta</strong><small>Customer</small></span><Icon name="chevron" size={15} /></button>
      </div>
    </div>
  </header>
}

function MobileNav({ page, navigate, openCreate }: { page: Page; navigate: (p: Page) => void; openCreate: () => void }) {
  const items: [string, string, Page][] = [['Home', 'home', 'home'], ['Explore', 'compass', 'explore'], ['Projects', 'briefcase', 'projects'], ['Messages', 'message', 'messages']]
  return <nav className="mobile-nav">
    {items.map(([label, icon, target]) => <button key={target} className={page === target ? 'active' : ''} onClick={() => navigate(target)}><Icon name={icon} /><span>{label}</span></button>)}
    <button onClick={openCreate}><span className="mobile-create"><Icon name="plus" /></span><span>Create</span></button>
  </nav>
}

function TrustStrip() {
  return <div className="trust-strip">
    <div><Icon name="shield" /><span><strong>Verified professionals</strong><small>Identity and portfolio checks</small></span></div>
    <div><Icon name="lock" /><span><strong>Protected milestone payments</strong><small>Pay only as work progresses</small></span></div>
    <div><Icon name="heart" /><span><strong>Private media delivery</strong><small>Your memories stay secure</small></span></div>
  </div>
}

function HomePage({ navigate, openCreate }: { navigate: (p: Page) => void; openCreate: () => void }) {
  const categories = [
    ['Wedding', images.couple], ['Portraits', images.bride], ['Celebrations', images.ceremony], ['Commercial', images.editorial],
  ]
  return <main>
    <section className="hero">
      <img src={images.hero} alt="Couple celebrating beneath a floral canopy" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow light">Photography, thoughtfully handled</span>
        <h1>Find your creative team.<br />Keep every moment.</h1>
        <p>Discover verified photographers, compare proposals, manage payments and receive your final gallery—all in one trusted place.</p>
        <div className="hero-actions"><Button onClick={() => navigate('explore')}>Find a photographer</Button><Button variant="secondary" onClick={openCreate}>Create a project</Button></div>
      </div>
      <div className="search-panel">
        <button onClick={() => navigate('explore')}><span><small>Service</small><strong>Wedding photography</strong></span><Icon name="chevron" /></button>
        <button onClick={() => navigate('explore')}><span><small>Location</small><strong>Udaipur, Rajasthan</strong></span><Icon name="pin" /></button>
        <button onClick={() => navigate('explore')}><span><small>Date</small><strong>18 Jan 2026</strong></span><Icon name="calendar" /></button>
        <Button icon="search" onClick={() => navigate('explore')}>Search</Button>
      </div>
    </section>
    <TrustStrip />
    <section className="content-section">
      <div className="section-heading"><div><span className="eyebrow">Explore by occasion</span><h2>Made for moments that matter</h2></div><button className="text-link" onClick={() => navigate('explore')}>View all categories <Icon name="arrow" size={16} /></button></div>
      <div className="category-grid">{categories.map(([name, src]) => <button className="category-card" key={name} onClick={() => navigate('explore')}><img src={src} alt={`${name} photography`} /><span>{name}</span></button>)}</div>
    </section>
    <section className="content-section featured">
      <div className="section-heading"><div><span className="eyebrow">Chosen for their craft</span><h2>Featured professionals</h2></div><button className="text-link" onClick={() => navigate('explore')}>Explore all <Icon name="arrow" size={16} /></button></div>
      <div className="provider-grid">
        <ProviderCard image={images.editorial} name="The House of Stories" city="Mumbai · Travels nationwide" rating="4.9" price="₹65,000" onClick={() => navigate('explore')} />
        <ProviderCard image={images.couple} name="Rhea Kapoor Studio" city="Delhi · Jaipur" rating="4.8" price="₹48,000" onClick={() => navigate('explore')} />
        <ProviderCard image={images.bride} name="Mysa Collective" city="Bengaluru · Goa" rating="5.0" price="₹72,000" onClick={() => navigate('explore')} />
      </div>
    </section>
    <section className="how-section">
      <div><span className="eyebrow light">From search to final delivery</span><h2>One calm place for the whole project.</h2><p>No scattered chats, unclear payments or missing files. Luma keeps every agreement, milestone and memory together.</p><Button variant="secondary" onClick={openCreate}>Start your project</Button></div>
      <ol><li><span>01</span><div><strong>Share your vision</strong><p>Create a clear brief in a few guided steps.</p></div></li><li><span>02</span><div><strong>Choose with confidence</strong><p>Compare verified proposals without the spreadsheet.</p></div></li><li><span>03</span><div><strong>Manage every milestone</strong><p>Track scope, conversations and protected payments.</p></div></li><li><span>04</span><div><strong>Receive it beautifully</strong><p>Review, select and download in a private gallery.</p></div></li></ol>
    </section>
  </main>
}

function ProviderCard({ image, name, city, rating, price, onClick }: { image: string; name: string; city: string; rating: string; price: string; onClick: () => void }) {
  return <article className="provider-card">
    <button className="provider-image" onClick={onClick}><img src={image} alt={`Portfolio by ${name}`} /><span className="available">Available in January</span><span className="save"><Icon name="heart" size={18} /></span></button>
    <div className="provider-copy">
      <div><h3>{name} <span className="verified"><Icon name="check" size={11} /></span></h3><span className="rating"><Icon name="star" size={14} /> {rating} <small>(124)</small></span></div>
      <p>{city}</p><p className="tags">Editorial weddings · Film · Portraits</p>
      <div className="card-footer"><span>Projects from <strong>{price}</strong></span><button onClick={onClick}>View profile <Icon name="arrow" size={15} /></button></div>
    </div>
  </article>
}

function ExplorePage({ navigate }: { navigate: (p: Page) => void }) {
  return <main className="page-shell">
    <div className="page-intro"><span className="eyebrow">Discover professionals</span><h1>Photography that feels like you.</h1><p>24 verified teams match your search in Udaipur.</p></div>
    <div className="explore-search"><div><Icon name="search" /><span><small>What are you planning?</small><strong>Wedding photography</strong></span></div><div><Icon name="pin" /><span><small>Where?</small><strong>Udaipur, Rajasthan</strong></span></div><div><Icon name="calendar" /><span><small>When?</small><strong>18–20 Jan 2026</strong></span></div><Button>Search</Button></div>
    <div className="mobile-filter-row"><Button variant="secondary" icon="filter">Filters</Button><Button variant="ghost">Recommended <Icon name="chevron" size={16} /></Button></div>
    <div className="results-layout">
      <aside className="filters"><div className="filter-title"><strong>Filters</strong><button>Clear all</button></div>
        <Filter title="Category" options={['Wedding', 'Pre-wedding', 'Portraits']} />
        <Filter title="Budget" options={['Under ₹50,000', '₹50,000–₹1,00,000', '₹1,00,000+']} />
        <Filter title="Provider" options={['Verified only', 'Studio', 'Independent']} />
        <Filter title="Style" options={['Editorial', 'Documentary', 'Traditional']} />
      </aside>
      <section className="results"><div className="results-header"><p><strong>24 professionals</strong> available</p><button>Recommended <Icon name="chevron" size={16} /></button></div>
        <div className="results-grid">
          <ProviderCard image={images.editorial} name="The House of Stories" city="Mumbai · Travels nationwide" rating="4.9" price="₹65,000" onClick={() => navigate('project')} />
          <ProviderCard image={images.couple} name="Rhea Kapoor Studio" city="Delhi · Jaipur" rating="4.8" price="₹48,000" onClick={() => navigate('project')} />
          <ProviderCard image={images.bride} name="Mysa Collective" city="Bengaluru · Goa" rating="5.0" price="₹72,000" onClick={() => navigate('project')} />
          <ProviderCard image={images.detail} name="Nivaan Visuals" city="Ahmedabad · Udaipur" rating="4.9" price="₹55,000" onClick={() => navigate('project')} />
        </div>
      </section>
    </div>
  </main>
}

function Filter({ title, options }: { title: string; options: string[] }) {
  return <div className="filter-group"><h4>{title}</h4>{options.map((option, i) => <label key={option}><input type="checkbox" defaultChecked={i === 0 && title === 'Provider'} /><span>{option}</span></label>)}</div>
}

function ProjectsPage({ navigate, openCreate }: { navigate: (p: Page) => void; openCreate: () => void }) {
  return <main className="page-shell narrow">
    <div className="page-title-row"><div><span className="eyebrow">Your work, in one place</span><h1>Projects</h1></div><Button icon="plus" onClick={openCreate}>Create project</Button></div>
    <div className="tabs"><button className="active">Active <span>2</span></button><button>Awaiting you <span>1</span></button><button>Completed <span>4</span></button><button>Drafts <span>1</span></button></div>
    <section className="project-list">
      <button className="project-card featured-project" onClick={() => navigate('project')}>
        <img src={images.hero} alt="Aanya and Rohan wedding" />
        <div className="project-card-main"><span className="status-pill active"><span /> Gallery ready</span><h2>Aanya & Rohan — Udaipur Wedding</h2><p>The House of Stories · 18 January 2026</p><div className="next-action"><span><Icon name="heart" /></span><div><small>Your next action</small><strong>Review 120 preview photos</strong></div><Icon name="arrow" /></div></div>
        <div className="project-progress"><span>Project progress</span><strong>8 of 11 steps</strong><div><i /></div><small>Final selection due by 28 January</small></div>
      </button>
      <button className="project-card" onClick={() => navigate('project')}><img src={images.editorial} alt="Jewellery campaign" /><div className="project-card-main"><span className="status-pill amber"><span /> Payment due</span><h2>Amara Fine Jewellery Campaign</h2><p>Mysa Collective · 08 February 2026</p><div className="next-action"><span><Icon name="lock" /></span><div><small>Your next action</small><strong>Pay booking milestone — ₹25,000</strong></div><Icon name="arrow" /></div></div></button>
    </section>
  </main>
}

const timeline = [
  ['Project created', '12 Dec 2025', true], ['Proposal accepted', '15 Dec 2025', true], ['Contract signed', '16 Dec 2025', true], ['Booking payment', '16 Dec 2025', true], ['Wedding shoot', '18 Jan 2026', true], ['Preview gallery ready', 'Today, 10:42 AM', true], ['Submit photo selection', 'Due 28 Jan', false], ['Final delivery', 'Expected 08 Feb', false],
]

function ProjectPage({ initialTab = 'overview' }: { initialTab?: ProjectTab }) {
  const [tab, setTab] = useState<ProjectTab>(initialTab)
  const tabs: [ProjectTab, string][] = [['overview', 'Overview'], ['timeline', 'Timeline'], ['messages', 'Messages'], ['gallery', 'Gallery'], ['payments', 'Payments'], ['documents', 'Documents']]
  return <main className="project-shell">
    <section className="project-hero"><div><span className="status-pill active"><span /> Gallery ready</span><h1>Aanya & Rohan — Udaipur Wedding</h1><p><Icon name="calendar" size={16} /> 18 January 2026 <span>·</span> <Icon name="pin" size={16} /> The Leela Palace, Udaipur</p></div><div className="provider-mini"><img src={images.editorial} alt="" /><span><small>Your photography team</small><strong>The House of Stories <i className="verified"><Icon name="check" size={10} /></i></strong></span><Button variant="secondary">Contact</Button></div></section>
    <nav className="project-tabs">{tabs.map(([key, label]) => <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}{key === 'gallery' && <span>120</span>}{key === 'messages' && <i />}</button>)}</nav>
    {tab === 'overview' && <Overview onGallery={() => setTab('gallery')} onPayments={() => setTab('payments')} />}
    {tab === 'timeline' && <Timeline />}
    {tab === 'gallery' && <Gallery />}
    {tab === 'payments' && <Payments />}
    {tab === 'messages' && <Messages embedded />}
    {tab === 'documents' && <Documents />}
  </main>
}

function Overview({ onGallery, onPayments }: { onGallery: () => void; onPayments: () => void }) {
  return <div className="workspace-grid">
    <section className="workspace-main">
      <div className="action-banner"><div className="action-icon"><Icon name="heart" /></div><div><span className="eyebrow">Your next action</span><h2>Your preview gallery is ready</h2><p>Review 120 photos, mark your favourites and submit your selection by 28 January.</p></div><Button onClick={onGallery}>Review photos</Button></div>
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">Project progress</span><h2>Almost ready for final delivery</h2></div><button onClick={() => {}}>View full timeline <Icon name="arrow" size={15} /></button></div><div className="mini-timeline">{timeline.slice(3, 8).map(([name, date, done], i) => <div className={`${done ? 'done' : ''} ${i === 2 ? 'current' : ''}`} key={String(name)}><span>{done ? <Icon name="check" size={13} /> : i + 4}</span><strong>{name}</strong><small>{date}</small></div>)}</div></div>
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">Recent activity</span><h2>What’s happening</h2></div></div><div className="activity-list"><Activity icon="heart" title="Preview gallery was published" text="The House of Stories added 120 photographs." time="Today, 10:42 AM" /><Activity icon="message" title="New message from Kabir" text="We hope these previews bring you right back to the day." time="Today, 10:39 AM" /><Activity icon="check" title="Shoot marked as complete" text="Wedding photography and cinematography completed." time="18 Jan, 11:30 PM" /></div></div>
    </section>
    <aside className="workspace-side">
      <div className="panel milestone-card"><span className="eyebrow">Payment summary</span><div className="money-row"><span><small>Project total</small><strong>₹85,000</strong></span><span><small>Paid</small><strong>₹55,000</strong></span></div><div className="payment-progress"><i /></div><p><Icon name="shield" size={17} /> Payments are protected until each milestone is approved.</p><button onClick={onPayments}>View payment details <Icon name="arrow" size={15} /></button></div>
      <div className="panel details-card"><span className="eyebrow">Project details</span><dl><div><dt>Package</dt><dd>Signature Wedding Story</dd></div><div><dt>Coverage</dt><dd>2 days · 2 photographers</dd></div><div><dt>Deliverables</dt><dd>350 edited photos · 8 min film</dd></div><div><dt>Revisions</dt><dd>1 round included</dd></div></dl></div>
      <button className="help-card"><Icon name="shield" /><span><strong>Need help?</strong><small>Our project support team is here.</small></span><Icon name="arrow" /></button>
    </aside>
  </div>
}

function Activity({ icon, title, text, time }: { icon: string; title: string; text: string; time: string }) {
  return <div className="activity"><span><Icon name={icon} size={18} /></span><div><strong>{title}</strong><p>{text}</p></div><small>{time}</small></div>
}

function Timeline() {
  return <section className="single-panel"><div className="panel-intro"><span className="eyebrow">Project timeline</span><h2>Every milestone, clearly tracked</h2><p>You are currently reviewing preview photographs. Upcoming steps may change after your selection.</p></div><div className="full-timeline">{timeline.map(([name, date, done], i) => <div className={`${done ? 'done' : ''} ${i === 5 ? 'current' : ''}`} key={String(name)}><span className="line-dot">{done ? <Icon name="check" size={14} /> : i + 1}</span><div><strong>{name}</strong><small>{date}</small></div>{i === 5 && <span className="you-are-here">You are here</span>}</div>)}</div></section>
}

function Gallery() {
  const [selected, setSelected] = useState<number[]>([1, 4, 6])
  const gallery = [images.hero, images.couple, images.bride, images.ceremony, images.editorial, images.portrait, images.detail, images.couple]
  const toggle = (i: number) => setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])
  return <div className="gallery-view">
    <div className="gallery-cover"><img src={images.hero} alt="Wedding gallery cover" /><div /><span>THE WEDDING OF</span><h2>Aanya & Rohan</h2><p>Udaipur · 18 January 2026</p><small><Icon name="lock" size={14} /> Private gallery</small></div>
    <div className="gallery-toolbar"><div><span className="eyebrow">Preview collection</span><h2>Wedding highlights</h2><p>120 photographs · 18 selected</p></div><div><Button variant="secondary" icon="heart">{selected.length} favourites</Button><Button icon="check">Submit selection</Button></div></div>
    <div className="collection-tabs"><button className="active">Highlights <span>42</span></button><button>Ceremony <span>38</span></button><button>Portraits <span>24</span></button><button>Reception <span>16</span></button></div>
    <div className="photo-grid">{gallery.map((src, i) => <button key={i} className={`photo ${selected.includes(i) ? 'selected' : ''}`} onClick={() => toggle(i)}><img src={src} alt={`Wedding photograph ${i + 1}`} /><span className="photo-heart"><Icon name="heart" size={18} /></span>{selected.includes(i) && <span className="selected-label"><Icon name="check" size={13} /> Selected</span>}</button>)}</div>
  </div>
}

function Payments() {
  const milestones = [['Booking', '₹30,000', 'Paid 16 Dec 2025', true], ['Shoot completion', '₹25,000', 'Paid 19 Jan 2026', true], ['Final delivery', '₹30,000', 'Due after approval', false]]
  return <div className="payments-layout"><section className="panel payment-overview"><span className="eyebrow">Payment overview</span><h2>₹55,000 of ₹85,000 paid</h2><div className="payment-progress large"><i /></div><div className="payment-stats"><span><small>Project total</small><strong>₹85,000</strong></span><span><small>Paid</small><strong>₹55,000</strong></span><span><small>Remaining</small><strong>₹30,000</strong></span></div><div className="secure-note"><Icon name="shield" /><p><strong>Your payment is protected.</strong><br />Funds are released only after each agreed milestone.</p></div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">Milestones</span><h2>Payment schedule</h2></div><button><Icon name="download" size={17} /> Download invoice</button></div><div className="milestones">{milestones.map(([name, amount, detail, paid], i) => <div key={String(name)}><span className={paid ? 'paid' : ''}>{paid ? <Icon name="check" size={15} /> : i + 1}</span><div><strong>{name}</strong><small>{detail}</small></div><b>{amount}</b><em className={paid ? 'paid-label' : ''}>{paid ? 'Paid' : 'Upcoming'}</em></div>)}</div></section></div>
}

function Messages({ embedded = false }: { embedded?: boolean }) {
  return <main className={embedded ? 'messages-embed' : 'page-shell narrow'}>
    {!embedded && <div className="page-intro compact"><span className="eyebrow">Project conversations</span><h1>Messages</h1></div>}
    <div className="message-layout">
      <aside className="conversations"><div className="conversation-search"><Icon name="search" /><span>Search conversations</span></div><button className="active"><img src={images.editorial} alt="" /><span><strong>The House of Stories</strong><small>Aanya & Rohan — Wedding</small><p>Your preview gallery is ready...</p></span><time>10:39</time></button><button><img src={images.bride} alt="" /><span><strong>Mysa Collective</strong><small>Amara Campaign</small><p>We’ve updated the proposal.</p></span><time>Tue</time></button></aside>
      <section className="chat"><header><img src={images.editorial} alt="" /><span><strong>The House of Stories <i className="verified"><Icon name="check" size={10} /></i></strong><small>Aanya & Rohan — Udaipur Wedding</small></span><button><Icon name="briefcase" size={18} /> Project details</button></header><div className="chat-body"><span className="day">Today</span><div className="bubble provider"><p>Hello Aanya, your preview gallery is now ready. We’ve curated the first 120 photographs from your celebration.</p><time>10:38 AM</time></div><div className="bubble provider"><p>We hope these previews bring you right back to the day. Mark your favourites whenever you’re ready—there’s no need to do it all at once.</p><time>10:39 AM</time></div><div className="gallery-share"><img src={images.hero} alt="" /><span><small>PRIVATE GALLERY</small><strong>Wedding highlights</strong><p>120 photographs</p></span><Button variant="secondary">Open gallery</Button></div><div className="bubble customer"><p>These are beautiful, thank you! We’ll review them with the family this weekend.</p><time>11:04 AM · Read</time></div></div><footer><button><Icon name="plus" /></button><span>Write a message…</span><button className="send"><Icon name="send" /></button></footer></section>
    </div>
  </main>
}

function Documents() {
  return <section className="single-panel"><div className="panel-intro"><span className="eyebrow">Documents</span><h2>Contracts, invoices and receipts</h2><p>All important project records are securely stored here.</p></div><div className="document-list">{['Signed project agreement', 'Booking payment invoice', 'Shoot completion receipt'].map((name, i) => <div key={name}><span className="doc-icon">PDF</span><span><strong>{name}</strong><small>{i === 0 ? 'Signed 16 Dec 2025' : 'Issued 19 Jan 2026'}</small></span><button><Icon name="download" /> Download</button></div>)}</div></section>
}

function Notifications() {
  return <main className="page-shell notification-page"><div className="page-title-row"><div><span className="eyebrow">Stay up to date</span><h1>Notifications</h1></div><button className="text-link">Mark all as read</button></div><div className="notification-list"><Activity icon="heart" title="Your preview gallery is ready" text="The House of Stories added 120 photographs to Aanya & Rohan — Udaipur Wedding." time="10 minutes ago" /><Activity icon="message" title="New message from Kabir" text="We hope these previews bring you right back to the day." time="13 minutes ago" /><Activity icon="lock" title="Payment received" text="Your ₹25,000 shoot completion payment was received and protected." time="Yesterday" /><Activity icon="check" title="Contract accepted" text="Your agreement with The House of Stories is now active." time="16 Dec 2025" /></div></main>
}

function CreateProject({ close, submitted, setSubmitted }: { close: () => void; submitted: boolean; setSubmitted: (v: boolean) => void }) {
  const [step, setStep] = useState(1)
  if (submitted) return <div className="modal-backdrop"><div className="modal success-modal"><button className="modal-close" onClick={close}>×</button><span className="success-icon"><Icon name="check" size={28} /></span><span className="eyebrow">Project submitted</span><h2>Your project is now live.</h2><p>Eligible verified professionals can review your requirements and send proposals. We’ll notify you as soon as a match responds.</p><Button onClick={close}>View your project</Button><button className="text-link" onClick={close}>Return home</button></div></div>
  const types = ['Wedding', 'Portrait', 'Event', 'Commercial', 'Product', 'Corporate']
  return <div className="modal-backdrop"><div className="modal project-modal"><button className="modal-close" onClick={close}>×</button><div className="step-label"><span>STEP {step} OF 3</span><small>{step === 1 ? 'Project type' : step === 2 ? 'Project details' : 'Review'}</small></div><div className="step-progress"><i style={{ width: `${step * 33.33}%` }} /></div>
    {step === 1 && <div className="form-step"><span className="eyebrow">Let’s begin</span><h2>What are you planning?</h2><p>Choose the option that best matches your project.</p><div className="type-grid">{types.map((type, i) => <button className={i === 0 ? 'selected' : ''} key={type}><span><Icon name={i === 0 ? 'heart' : i === 1 ? 'user' : 'briefcase'} /></span>{type}{i === 0 && <Icon name="check" size={16} />}</button>)}</div></div>}
    {step === 2 && <div className="form-step"><span className="eyebrow">The essentials</span><h2>Tell us about the day</h2><p>You can add more detail after your project is created.</p><div className="form-grid"><label><span>Project title</span><input defaultValue="Aanya & Rohan's wedding" /></label><label><span>Event date</span><input type="date" defaultValue="2026-01-18" /></label><label className="wide"><span>Location</span><input defaultValue="The Leela Palace, Udaipur" /></label><label><span>Estimated budget</span><select defaultValue="mid"><option value="mid">₹50,000–₹1,00,000</option></select></label><label><span>Coverage needed</span><select><option>Photography + video</option></select></label></div></div>}
    {step === 3 && <div className="form-step"><span className="eyebrow">Review your brief</span><h2>Everything look right?</h2><p>Professionals will use this information to prepare accurate proposals.</p><div className="review-card"><div><small>PROJECT</small><strong>Aanya & Rohan’s wedding</strong></div><div><small>DATE & PLACE</small><strong>18 January 2026 · Udaipur</strong></div><div><small>SERVICE</small><strong>Wedding photography + video</strong></div><div><small>BUDGET</small><strong>₹50,000–₹1,00,000</strong></div></div><div className="scope-note"><Icon name="shield" /><span><strong>Your contact details stay private.</strong><small>They’re shared only after you choose a provider.</small></span></div></div>}
    <div className="modal-footer">{step > 1 ? <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button> : <span />}<Button onClick={() => step < 3 ? setStep(step + 1) : setSubmitted(true)}>{step === 3 ? 'Submit project request' : 'Continue'} <Icon name="arrow" size={16} /></Button></div>
  </div></div>
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [createOpen, setCreateOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = (next: Page) => { setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return <div className="app">
    <Header page={page} navigate={navigate} openCreate={() => { setSubmitted(false); setCreateOpen(true) }} />
    {page === 'home' && <HomePage navigate={navigate} openCreate={() => setCreateOpen(true)} />}
    {page === 'explore' && <ExplorePage navigate={navigate} />}
    {page === 'projects' && <ProjectsPage navigate={navigate} openCreate={() => setCreateOpen(true)} />}
    {page === 'project' && <ProjectPage />}
    {page === 'messages' && <Messages />}
    {page === 'notifications' && <Notifications />}
    <MobileNav page={page} navigate={navigate} openCreate={() => setCreateOpen(true)} />
    {createOpen && <CreateProject close={() => setCreateOpen(false)} submitted={submitted} setSubmitted={setSubmitted} />}
  </div>
}
