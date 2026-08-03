import React, { use, useEffect, useMemo, useState } from 'react'
import "../style/interview.scss"
import { useInterview } from '../hook/useInterview'
import { useParams } from 'react-router'

 

const Interview = () => {
  const [activeSection, setActiveSection] = useState('technical')
  const { report,getReportById,loading } = useInterview()
  const { interviewId } = useParams()
 useEffect(() => {
   if(interviewId){
    getReportById(interviewId)
   }
 }, [interviewId])
 

  const navItems = useMemo(() => [
    { id: 'technical', label: 'Technical Questions', count: report?.technicalQuestions?.length ?? 0 },
    { id: 'behavioral', label: 'Behavioral Questions', count: report?.behavioralQuestions?.length ?? 0 },
    { id: 'roadmap', label: 'Road Map', count: report?.preparationPlan?.length ?? 0 }
  ], [report])

  const sectionContent = useMemo(() => {
    if (!report) return { title: '', items: [] }
    if (activeSection === 'behavioral') return { title: 'Behavioral Questions', items: report.behavioralQuestions }
    if (activeSection === 'roadmap') return { title: 'Preparation Road Map', items: report.preparationPlan }
    return { title: 'Technical Questions', items: report.technicalQuestions }
  }, [activeSection, report])

  const resumePreview = useMemo(() => report?.resume?.split('\n').slice(0, 5).join(' • ') ?? '', [report])
  

  if(loading || !report) {
    return <main><h1>loading...</h1></main>
  }

  return (
    <main className="interview-overview">
      <div className="interview-grid">
        <aside className="sidebar">
          <div className="sidebar-head">
            <span>Explore</span>
            <strong>Interview flow</strong>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span>{item.label}</span>
              <span>{item.count}</span>
            </button>
          ))}
        </aside>

        <section className="main-panel">
          <div className="hero-card">
            <div>
              <div className="hero-title">Interview dashboard</div>
              <div className="hero-meta">Use the document data to review your resume match, skills gaps, and the questions you should prepare.</div>
            </div>
            <div className="match-circle">
              <div className="match-number">{report.matchScore}%</div>
              <div className="match-label">Match</div>
            </div>
          </div>

          <div className="content-surface">
            <h3 className="content-title">{sectionContent.title}</h3>
            <div className="content-list">
              {sectionContent.items.map((item, index) => (
                <article key={index} className="item-card">
                  <div className="item-title">
                    {activeSection === 'roadmap' ? `Day ${item.day}: ${item.focus}` : item.question}
                  </div>
                  <div className="item-subtitle">
                    {activeSection === 'roadmap' ? item.tasks : item.intention}
                  </div>
                  {activeSection !== 'roadmap' && <p className="item-body">{item.answer}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="right-panel">
          <div className="info-card">
            <div className="info-head"><span>Skill Gaps</span><span>{report.skillGaps.length}</span></div>
            <div className="tags">
              {report.skillGaps.map((gap) => (
                <span key={gap.skill} className={`tag ${gap.severity.toLowerCase()}`}><strong>{gap.skill}</strong></span>
              ))}
            </div>
          </div>

          <div className="info-card">
            <div className="info-head"><span>Resume Snapshot</span></div>
            <p className="resume-preview">{resumePreview}</p>
          </div>

          <div className="info-card">
            <div className="info-head"><span>Self Description</span></div>
            <p className="resume-preview">{report.selfDescription.slice(0, 200)}...</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Interview