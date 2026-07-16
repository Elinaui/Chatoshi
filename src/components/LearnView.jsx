import { useState, useEffect } from 'react'
import logo1 from '../../Logo/Logo1.png'
import logo2 from '../../Logo/Logo2.png'
import cheerUp from '../../Logo/Cheer up.png'
import quizLogo from '../../Logo/Quiz logo.png'
import cardStatus from '../../assets/icons/●CardStatus.svg'
import './LearnView.css'

/* ─── Lesson slide data ─────────────────────────────────────── */
const LESSON_SLIDES = {
  '1-1': [
    {
      id: 1, title: 'Why money exists', type: 'text-example',
      body: [
        'Money exists to make trade easier.',
        'Without money, people would have to barter (trade item-for-item), which is slow and awkward.',
      ],
      example: {
        heading: 'Example',
        parts: [
          { text: "If you have bread and want shoes, you'd need to find someone who wants bread " },
          { text: 'and', italic: true },
          { text: ' has shoes. Money removes that problem.' },
        ],
      },
    },
    {
      id: 2, title: 'The 3 Jobs Money Does', type: 'bullets-bold',
      intro: 'Money is a tool that helps society function by doing three key jobs:',
      items: [
        { bold: 'Medium of exchange:', rest: ' used to pay for things' },
        { bold: 'Unit of account:', rest: ' measures value (prices)' },
        { bold: 'Store of value:', rest: ' holds value over time' },
      ],
    },
    {
      id: 3, title: 'What Makes Good Money?', type: 'bullets-bold',
      intro: 'Not everything can serve as money. Good money needs specific properties:',
      items: [
        { bold: 'Scarce:', rest: ' limited supply keeps it valuable' },
        { bold: 'Durable:', rest: " doesn't decay or break down" },
        { bold: 'Portable:', rest: ' easy to carry and transfer' },
        { bold: 'Divisible:', rest: ' can be split into smaller units' },
      ],
    },
    {
      id: 4, title: "The Problem with Today's Money", type: 'text-example',
      body: [
        'Modern money is controlled by governments and banks.',
        'They can print more of it, freeze accounts, or reverse transactions — often without your input.',
      ],
      example: {
        heading: 'Why this matters',
        parts: [{ text: 'Inflation silently reduces your purchasing power. In 1970, $1 could buy what costs ~$8 today.' }],
      },
    },
    {
      id: 5, title: 'Where Crypto Fits', type: 'bullets-teaser',
      introParts: [
        { text: 'Crypto can be understood as a form of ' },
        { text: 'digital money.', bold: true },
      ],
      items: [
        { parts: [{ text: 'It can be used to ' }, { text: 'transfer value digitally', bold: true }] },
        { parts: [{ text: 'Some crypto tries to be money; others power apps/networks' }] },
        { parts: [{ text: "It's not \"just an app\" — it's a system for tracking ownership/value digitally" }] },
      ],
      teaser: 'a few quick questions to help this sink in. There are no right or wrong attempts here',
    },
  ],
}

const CHEER_TEXTS = [
  'Nice progress!',
  "You're doing great so far",
  "You're on the right track",
  'This is starting to connect',
  'Good thinking',
  "You've made solid progress",
  "You're building real understanding",
  "You're doing well",
  'This is an important concept',
  "You're almost there",
  'Great momentum',
]

/* ─── Quiz data ─────────────────────────────────────────────── */
const QUIZ_DATA = {
  '1-1': [
    {
      id: 1,
      question: 'Money is mainly a tool for:',
      options: [
        { id: 'a', text: 'Watching videos' },
        { id: 'b', text: 'Measuring and exchanging value', correct: true },
        { id: 'c', text: 'Saving contacts' },
        { id: 'd', text: 'Storing photos' },
      ],
    },
    {
      id: 2,
      question: 'Which of these is NOT a typical property of good money?',
      options: [
        { id: 'a', text: 'Durable' },
        { id: 'b', text: 'Easily divisible' },
        { id: 'c', text: 'Easy to fake', correct: true },
        { id: 'd', text: 'Accepted by many people' },
      ],
    },
  ],
}

const SUMMARY_DATA = {
  '1-1': {
    question: 'So, what is money?',
    progress: 8,
    points: [
      { parts: ['Money is a tool to store, measure, and exchange value.'] },
      { parts: ['Good money is durable, divisible, and widely accepted.'] },
      { parts: ['Money has value because people agree to use it.'] },
      { parts: ['Crypto is a type of ', { text: 'digital money', bold: true }, ', not a game or app.'] },
    ],
  },
}

/* ─── Shared data ───────────────────────────────────────────── */
const MODULES = [
  {
    id: 1, label: 'Module 1', title: 'What Is Crypto, Really?',
    desc: 'Understand money, crypto, and how blockchain works',
    lessons: [
      { id: 1, title: 'What Is Money?',           desc: 'Understand money, crypto, and how blockchain works' },
      { id: 2, title: 'What Is Cryptocurrency?',  desc: 'Understand money, crypto, and how blockchain works' },
      { id: 3, title: 'Blockchain in One Glance', desc: 'Understand money, crypto, and how blockchain works' },
    ],
  },
  {
    id: 2, label: 'Module 2', title: 'Wallets, Keys & Addresses',
    desc: 'Learn how wallets work and how to safely store and send crypto',
    lessons: [
      { id: 1, title: 'What Is a Wallet?',     desc: 'Learn how wallets work and how to safely store and send crypto' },
      { id: 2, title: 'Public & Private Keys', desc: 'Learn how wallets work and how to safely store and send crypto' },
      { id: 3, title: 'Sending & Receiving',   desc: 'Learn how wallets work and how to safely store and send crypto' },
    ],
  },
  {
    id: 3, label: 'Module 3', title: 'Networks, Blocks & Fees',
    desc: 'Understand blockchains, transactions, and why fees exist',
    lessons: [
      { id: 1, title: 'How Blocks Are Made',   desc: 'Understand blockchains, transactions, and why fees exist' },
      { id: 2, title: 'Transaction Lifecycle', desc: 'Understand blockchains, transactions, and why fees exist' },
      { id: 3, title: 'Why Fees Exist',        desc: 'Understand blockchains, transactions, and why fees exist' },
    ],
  },
  {
    id: 4, label: 'Module 4', title: 'Safety, Use Cases & Myths',
    desc: 'Stay safe, explore real use cases, and avoid common crypto myths',
    lessons: [
      { id: 1, title: 'Common Scams & How to Avoid', desc: 'Stay safe, explore real use cases, and avoid common crypto myths' },
      { id: 2, title: 'Real-World Use Cases',         desc: 'Stay safe, explore real use cases, and avoid common crypto myths' },
      { id: 3, title: 'Debunking Crypto Myths',       desc: 'Stay safe, explore real use cases, and avoid common crypto myths' },
    ],
  },
]

const LEVELS = [
  { id: 1, label: 'Level 1', title: 'Crypto Basics',    bootcampTitle: 'Crypto Basics Bootcamp',    desc: 'Understanding digital assets, blockchain technology, and how cryptocurrencies work.' },
  { id: 2, label: 'Level 2', title: 'Market Mechanics', bootcampTitle: 'Market Mechanics Bootcamp', desc: 'How crypto markets work, reading charts, and understanding price action.' },
  { id: 3, label: 'Level 3', title: 'DeFi & Protocols', bootcampTitle: 'DeFi & Protocols Bootcamp', desc: 'Decentralized finance, liquidity pools, yield farming, and smart contracts.' },
  { id: 4, label: 'Level 4', title: 'Advanced Trading', bootcampTitle: 'Advanced Trading Bootcamp', desc: 'On-chain analysis, alpha signals, and portfolio management strategies.' },
]

/* ─── Shared primitives ─────────────────────────────────────── */
function HexMarker() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <polygon points="8,1.5 14.5,5 14.5,13 8,16.5 1.5,13 1.5,5" fill="white" stroke="#c4cdd4" strokeWidth="1.5" />
    </svg>
  )
}

function LessonBadge({ num }) {
  return (
    <div className="lv-lesson-badge">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polygon points="14,2 24.5,8 24.5,20 14,26 3.5,20 3.5,8" fill="#ebeef0" stroke="#dadfe3" strokeWidth="1" />
      </svg>
      <span className="lv-lesson-badge-num">{num}</span>
    </div>
  )
}

/* ─── Splash animation ──────────────────────────────────────── */
export default function LearnView() {
  const [step, setStep] = useState(1)

  useEffect(() => {
    const t2 = setTimeout(() => setStep(2), 800)
    const t3 = setTimeout(() => setStep(3), 1600)
    const t4 = setTimeout(() => setStep(4), 2400)
    return () => { clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  if (step === 4) return <EducationNav />

  return (
    <div className="lv-splash">
      {step === 1 && <img src={logo1} alt="Chatoshi" className="lv-logo-static lv-logo-in" />}
      {step === 2 && <img src={logo2} alt="Chatoshi" className="lv-logo-static lv-logo-swap" />}
      {step === 3 && (
        <>
          <img src={logo2} alt="" className="lv-morph-logo" />
          <div className="lv-morph-circle" />
        </>
      )}
    </div>
  )
}

/* ─── Top-level navigator ───────────────────────────────────── */
function EducationNav() {
  const [view, setView]             = useState('levels')
  const [selectedLevel, setLevel]   = useState(null)
  const [selectedModule, setModule] = useState(null)
  const [selectedLesson, setLesson] = useState(null)

  if (view === 'lesson-content') {
    return (
      <LessonContentView
        level={selectedLevel}
        module={selectedModule}
        lesson={selectedLesson}
        onClose={() => setView('lessons')}
      />
    )
  }
  if (view === 'lessons') {
    return (
      <LessonsView
        level={selectedLevel}
        module={selectedModule}
        onBack={() => setView('modules')}
        onLessonClick={lesson => { setLesson(lesson); setView('lesson-content') }}
      />
    )
  }
  if (view === 'modules') {
    return (
      <ModulesView
        level={selectedLevel}
        onBack={() => setView('levels')}
        onModuleClick={mod => { setModule(mod); setView('lessons') }}
      />
    )
  }
  return <LevelsView onLevelClick={lvl => { setLevel(lvl); setView('modules') }} />
}

/* ─── View 1: Education Levels ──────────────────────────────── */
function LevelsView({ onLevelClick }) {
  return (
    <div className="lv-shell lv-shell--enter">
      <div className="lv-topbar">
        <h1 className="lv-heading">Education</h1>
      </div>
      <div className="lv-body">
        <div className="lv-inner">
          <div className="lv-program">
            <div className="lv-bar-line" />
            {LEVELS.map(level => (
              <div key={level.id} className="lv-level-row" onClick={() => onLevelClick(level)} style={{ cursor: 'pointer' }}>
                <div className="lv-marker-col"><HexMarker /></div>
                <div className="lv-edu-card">
                  <span className="lv-level-label">{level.label}</span>
                  <div className="lv-module-info">
                    <h3 className="lv-module-title">{level.title}</h3>
                    <p className="lv-module-desc">{level.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── View 2: Level Modules ─────────────────────────────────── */
function ModulesView({ level, onBack, onModuleClick }) {
  return (
    <div className="lv-shell lv-shell--enter">
      <div className="lv-topbar lv-topbar--breadcrumb">
        <nav className="lv-breadcrumb">
          <span className="lv-crumb lv-crumb--dim">Education</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb">{level.label}: {level.bootcampTitle}</span>
        </nav>
      </div>
      <div className="lv-body">
        <div className="lv-inner">
          <div className="lv-detail-content">
            <button className="lv-back-btn" onClick={onBack}>
              <span className="msi">arrow_left_alt</span>
            </button>
            <div className="lv-program">
              <div className="lv-bar-line" />
              {MODULES.map(mod => (
                <div key={mod.id} className="lv-level-row" onClick={() => onModuleClick(mod)} style={{ cursor: 'pointer' }}>
                  <div className="lv-marker-col"><HexMarker /></div>
                  <div className="lv-edu-card lv-edu-card--row">
                    <div className="lv-module-card-left">
                      <span className="lv-level-label">{mod.label}</span>
                      <div className="lv-module-info">
                        <h3 className="lv-module-title">{mod.title}</h3>
                        <p className="lv-module-desc">{mod.desc}</p>
                      </div>
                    </div>
                    <div className="lv-lesson-badges">
                      {mod.lessons.map(l => <LessonBadge key={l.id} num={l.id} />)}
                    </div>
                    <button className="lv-start-btn" onClick={e => { e.stopPropagation(); onModuleClick(mod) }}>
                      Start {mod.label}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── View 3: Module Lessons ────────────────────────────────── */
function LessonsView({ level, module, onBack, onLessonClick }) {
  return (
    <div className="lv-shell lv-shell--enter">
      <div className="lv-topbar lv-topbar--breadcrumb">
        <nav className="lv-breadcrumb">
          <span className="lv-crumb lv-crumb--dim">Education</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb lv-crumb--dim">{level.label}: {level.bootcampTitle}</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb">{module.label}: {module.title}</span>
        </nav>
      </div>
      <div className="lv-body">
        <div className="lv-inner">
          <div className="lv-detail-content">
            <button className="lv-back-btn" onClick={onBack}>
              <span className="msi">arrow_left_alt</span>
            </button>
            <div className="lv-program">
              <div className="lv-bar-line" />
              {module.lessons.map(lesson => (
                <div key={lesson.id} className="lv-level-row">
                  <div className="lv-marker-col"><HexMarker /></div>
                  <div className="lv-edu-card lv-edu-card--row lv-edu-card--lesson">
                    <LessonBadge num={lesson.id} />
                    <div className="lv-module-info" style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="lv-module-title">{lesson.title}</h3>
                      <p className="lv-module-desc">{lesson.desc}</p>
                    </div>
                    <button className="lv-start-btn" onClick={() => onLessonClick(lesson)}>
                      Start lesson {lesson.id}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Slide content renderer ────────────────────────────────── */
function SlideContent({ slide }) {
  if (slide.type === 'text-example') {
    return (
      <div className="lv-slide-options">
        <div className="lv-slide-top">
          {slide.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <hr className="lv-slide-divider" />
        <div className="lv-slide-example">
          <h5 className="lv-slide-example-h">{slide.example.heading}</h5>
          <p>
            {slide.example.parts.map((part, i) =>
              part.italic ? <em key={i}>{part.text}</em> : <span key={i}>{part.text}</span>
            )}
          </p>
        </div>
      </div>
    )
  }

  if (slide.type === 'bullets-bold') {
    return (
      <div className="lv-slide-options">
        <div className="lv-slide-top">
          <p>{slide.intro}</p>
          <ul className="lv-slide-bullets">
            {slide.items.map((item, i) => (
              <li key={i}><strong>{item.bold}</strong>{item.rest}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  if (slide.type === 'bullets-teaser') {
    return (
      <div className="lv-slide-options">
        <div className="lv-slide-top">
          <p>
            {slide.introParts.map((p, i) =>
              p.bold ? <strong key={i}>{p.text}</strong> : <span key={i}>{p.text}</span>
            )}
          </p>
          <ul className="lv-slide-bullets">
            {slide.items.map((item, i) => (
              <li key={i}>
                {item.parts.map((p, j) =>
                  p.bold ? <strong key={j}>{p.text}</strong> : <span key={j}>{p.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="lv-slide-teaser">
          <img src={cheerUp} alt="" className="lv-slide-teaser-img" />
          <p><strong>Up next:</strong> {slide.teaser}</p>
        </div>
      </div>
    )
  }

  return null
}

/* ─── View 4: Lesson Content ────────────────────────────────── */
function LessonContentView({ level, module, lesson, onClose }) {
  const slides   = LESSON_SLIDES[`${module.id}-${lesson.id}`] || []
  const quizzes  = QUIZ_DATA[`${module.id}-${lesson.id}`] || []
  const summary  = SUMMARY_DATA[`${module.id}-${lesson.id}`]
  const total    = slides.length || 1
  const [mode, setMode]   = useState('content') // 'content' | 'cheer' | 'quiz' | 'summary'
  const [page, setPage]   = useState(1)
  const [qIdx, setQIdx]   = useState(0)

  const key = `${module.id}-${lesson.id}`

  if (mode === 'cheer') {
    return <CheerView lessonId={lesson.id} onDone={() => setMode('quiz')} />
  }
  if (mode === 'quiz') {
    return (
      <QuizView
        level={level} module={module} lesson={lesson}
        quizzes={quizzes} qIdx={qIdx}
        totalPages={total + quizzes.length}
        pageOffset={total}
        onClose={onClose}
        onNext={() => {
          if (qIdx + 1 < quizzes.length) setQIdx(q => q + 1)
          else setMode('summary')
        }}
      />
    )
  }
  if (mode === 'summary') {
    return (
      <SummaryView
        lesson={lesson} lessonNum={lesson.id}
        summaryData={summary}
        onContinue={onClose}
      />
    )
  }

  const slide   = slides[page - 1] || { id: page, title: lesson.title, type: 'text-example', body: ['Content coming soon.'], example: { heading: 'Note', parts: [{ text: 'More content will be added here.' }] } }
  const isFirst = page === 1
  const isLast  = page === total

  return (
    <div className="lv-shell lv-shell--enter">
      <div className="lv-topbar lv-topbar--breadcrumb">
        <nav className="lv-breadcrumb">
          <span className="lv-crumb lv-crumb--dim">Education</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb lv-crumb--dim">{level.label}: {level.bootcampTitle}</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb lv-crumb--dim">{module.label}: {module.title}</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb">{lesson.title}</span>
        </nav>
      </div>

      <div className="lv-lesson-progress">
        <div className="lv-lesson-track">
          <div className="lv-lesson-fill" style={{ width: `${(page / (total + quizzes.length)) * 100}%` }} />
        </div>
        <span className="lv-lesson-count">{page}/{total + quizzes.length}</span>
        <button className="lv-lesson-close" onClick={onClose}>
          <span className="msi">close</span>
        </button>
      </div>

      <div className="lv-lesson-area">
        <div className="lv-lesson-inner">
          <h3 className="lv-slide-title">{slide.title}</h3>
          <SlideContent slide={slide} />
          <div className={`lv-lesson-actions${isFirst ? ' lv-lesson-actions--end' : ''}`}>
            {!isFirst && (
              <button className="lv-btn lv-btn--outline" onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
            )}
            {isLast ? (
              <button className="lv-btn lv-btn--primary lv-btn--icon" onClick={() => setMode('cheer')}>
                Let's practice <span className="msi">play_arrow</span>
              </button>
            ) : (
              <button className="lv-btn lv-btn--primary" onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Cheer screen ──────────────────────────────────────────── */
function CheerView({ lessonId, onDone }) {
  const text = CHEER_TEXTS[(lessonId - 1) % CHEER_TEXTS.length]

  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="lv-cheer" onClick={onDone}>
      <img src={cheerUp} alt="" className="lv-cheer-mascot" />
      <p className="lv-cheer-text">{text}</p>
    </div>
  )
}

/* ─── Quiz screen ───────────────────────────────────────────── */
function QuizView({ level, module, lesson, quizzes, qIdx, totalPages, pageOffset, onClose, onNext }) {
  const quiz             = quizzes[qIdx]
  const [selected, setSelected] = useState(null)
  const [checked, setChecked]   = useState(false)

  const correctId  = quiz?.options.find(o => o.correct)?.id
  const isCorrect  = selected === correctId
  const wrongOpt   = checked && !isCorrect ? quiz.options.find(o => o.id === selected) : null
  const pageNum    = pageOffset + qIdx + 1

  function handleNext() {
    setSelected(null)
    setChecked(false)
    onNext()
  }

  function optionClass(opt) {
    if (!checked) return selected === opt.id ? 'lv-qopt lv-qopt--selected' : 'lv-qopt'
    if (opt.correct) return 'lv-qopt lv-qopt--correct'
    if (opt.id === selected && !opt.correct) return 'lv-qopt lv-qopt--wrong'
    return 'lv-qopt'
  }

  return (
    <div className="lv-shell lv-shell--enter">
      <div className="lv-topbar lv-topbar--breadcrumb">
        <nav className="lv-breadcrumb">
          <span className="lv-crumb lv-crumb--dim">Education</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb lv-crumb--dim">{level.label}: {level.bootcampTitle}</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb lv-crumb--dim">{module.label}: {module.title}</span>
          <span className="lv-crumb-sep">/</span>
          <span className="lv-crumb">{lesson.title}</span>
        </nav>
      </div>

      <div className="lv-lesson-progress">
        <div className="lv-lesson-track">
          <div className="lv-lesson-fill" style={{ width: `${(pageNum / totalPages) * 100}%` }} />
        </div>
        <span className="lv-lesson-count">{pageNum}/{totalPages}</span>
        <button className="lv-lesson-close" onClick={onClose}>
          <span className="msi">close</span>
        </button>
      </div>

      <div className="lv-lesson-area">
        <div className="lv-lesson-inner lv-lesson-inner--quiz">
          <div className="lv-quiz-content">
            <h3 className="lv-slide-title">{quiz.question}</h3>
            <div className="lv-quiz-options">
              {quiz.options.map(opt => (
                <button
                  key={opt.id}
                  className={optionClass(opt)}
                  onClick={() => !checked && setSelected(opt.id)}
                  disabled={checked}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          <div className="lv-quiz-footer">
            {checked && !isCorrect && (
              <div className="lv-quiz-feedback lv-quiz-feedback--wrong">
                <img src={quizLogo} alt="" className="lv-quiz-feedback-img" />
                <div className="lv-quiz-feedback-text">
                  <p className="lv-quiz-feedback-title">Oops, incorrect.</p>
                  <p className="lv-quiz-feedback-body">
                    <strong>{wrongOpt?.text}</strong> is not a typical property of a good money.
                  </p>
                </div>
              </div>
            )}
            {!checked ? (
              <button
                className="lv-btn lv-btn--primary"
                disabled={!selected}
                onClick={() => setChecked(true)}
              >
                Check
              </button>
            ) : (
              <button className="lv-btn lv-btn--primary" onClick={handleNext}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Summary screen ────────────────────────────────────────── */
function SummaryView({ lesson, lessonNum, summaryData, onContinue }) {
  const data = summaryData || {
    question: `So, what did you learn?`,
    progress: 8,
    points: [{ parts: ['Great work completing this lesson!'] }],
  }

  return (
    <div className="lv-shell lv-shell--enter">
      <div className="lv-summary-area">
        <div className="lv-summary-inner">
          <div className="lv-summary-top">
            <img src={quizLogo} alt="" className="lv-summary-mascot" />
            <p className="lv-summary-title">Lesson {lessonNum} complete!</p>
            <div className="lv-summary-progress-row">
              <span className="lv-summary-progress-label">Your learning progress</span>
              <div className="lv-summary-momentum">
                <span className="msi" style={{ color: '#1d4ed8', fontSize: 24 }}>rocket_launch</span>
                <span className="lv-summary-pct">{data.progress}%</span>
              </div>
            </div>
          </div>

          <hr className="lv-summary-divider" />

          <div className="lv-summary-bottom">
            <h3 className="lv-summary-subtitle">{data.question}</h3>
            <ul className="lv-summary-points">
              {data.points.map((point, i) => (
                <li key={i} className="lv-summary-point">
                  <img src={cardStatus} alt="" className="lv-summary-check" />
                  <span>
                    {point.parts.map((p, j) =>
                      typeof p === 'string' ? p : <strong key={j}>{p.text}</strong>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <button className="lv-btn lv-btn--primary lv-btn--full" onClick={onContinue}>
              Continue to lesson {lessonNum + 1}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
