import './LearnView.css'

const courses = [
  {
    id: 1,
    title: 'Crypto Fundamentals',
    desc: 'Learn the basics of cryptocurrency, blockchain, and digital assets.',
    lessons: 12,
    duration: '3h 20m',
    level: 'Beginner',
    color: '#6C7EF7',
  },
  {
    id: 2,
    title: 'DeFi Deep Dive',
    desc: 'Explore decentralized finance protocols, yield farming, and liquidity pools.',
    lessons: 9,
    duration: '2h 45m',
    level: 'Intermediate',
    color: '#22C55E',
  },
  {
    id: 3,
    title: 'Trading Strategies',
    desc: 'Technical analysis, chart patterns, and risk management for crypto trading.',
    lessons: 15,
    duration: '4h 10m',
    level: 'Advanced',
    color: '#F59E0B',
  },
  {
    id: 4,
    title: 'NFTs & Digital Ownership',
    desc: 'Understanding NFTs, their value proposition, and the creator economy.',
    lessons: 7,
    duration: '1h 55m',
    level: 'Beginner',
    color: '#EC4899',
  },
]

export default function LearnView() {
  return (
    <div className="page-view learn-view">
      <div className="page-header">
        <h2>Learn</h2>
        <p className="page-subtitle">Expand your crypto knowledge with curated courses</p>
      </div>

      <div className="learn-content">
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-color-bar" style={{ background: course.color }} />
              <div className="course-body">
                <div className="course-level" style={{ color: course.color, background: `${course.color}18` }}>
                  {course.level}
                </div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.desc}</p>
                <div className="course-meta">
                  <span><BookIcon /> {course.lessons} lessons</span>
                  <span><ClockIcon /> {course.duration}</span>
                </div>
                <button className="course-btn" style={{ background: course.color }}>
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BookIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M2 2h3.5c.83 0 1.5.67 1.5 1.5V10c0-.83-.67-1.5-1.5-1.5H2V2Z" stroke="currentColor" strokeWidth="1.2"/><path d="M10 2H6.5C5.67 2 5 2.67 5 3.5V10c0-.83.67-1.5 1.5-1.5H10V2Z" stroke="currentColor" strokeWidth="1.2"/></svg>
}

function ClockIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
}
