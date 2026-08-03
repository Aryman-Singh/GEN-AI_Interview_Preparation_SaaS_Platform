import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hook/useInterview'
import { useNavigate } from 'react-router'

const Home = () => {
    const { loading, generateReport,reports } = useInterview()
    const charLimit = 5000
    const [jobDesc, setJobDesc] = useState('')
    const [selfDesc, setSelfDesc] = useState('')
    const [resumeName, setResumeName] = useState(null)
    const fileInputRef = useRef(null)

    const navigate = useNavigate()

    const handleGemerateReport = async ()=>{
        const resumeFile = fileInputRef.current?.files[0];
       const data=  await generateReport({ resume: resumeFile, selfDescription: selfDesc, jobDescription: jobDesc });
        navigate(`/interview/${data._id}`);
    }
     

    if(loading) {
        return <main className='loading-screen'>
            <h1>Loading...</h1>
        </main>
    }

    return (
        <main className="interview-page">
            <div className="container">
                <div className="hero">
                    <h1 className="title">Create Your Custom <span>Interview Plan</span></h1>
                    <p className="subtitle">Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
                </div>

                <section className="card">
                    <div className="panels-row">
                        <div className="panel left">
                            <div className="panel-meta">
                                <div className="panel-title">💼 Target Job Description</div>
                                <div className="chip required">REQUIRED</div>
                            </div>

                            <textarea
                                id="jobDescription"
                                className="job-input"
                                placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"}
                                value={jobDesc}
                                onChange={(e) => setJobDesc(e.target.value)}
                                maxLength={charLimit}
                            />

                            <div className="bottom-row">
                                <div className="char-count">{jobDesc.length} / {charLimit} chars</div>
                            </div>
                        </div>

                        <aside className="panel right">
                            <div className="panel-meta">
                                <div className="panel-title">👤 Your Profile</div>
                            </div>

                            <div className="label-row">
                                <span>Upload Resume</span>
                                <div className="chip best">BEST RESULTS</div>
                            </div>

                            <label className="upload-box" htmlFor="resumeInput">
                                <input 
                                    id="resumeInput"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    ref={fileInputRef}
                                    onChange={(e) => setResumeName(e.target.files[0]?.name)}
                                />
                                <div className="upload-content">
                                    <div className="upload-icon">📤</div>
                                    <div className="upload-text">Click to upload or drag &amp; drop</div>
                                    <div className="upload-sub">PDF or DOCX (Max 3MB)</div>
                                    {resumeName && <div className="uploaded-name">Selected: {resumeName}</div>}
                                </div>
                            </label>

                            <div className="or-sep">OR</div>

                            <div className="self-desc-group">
                                <label htmlFor="selfDescription">Quick Self-Description</label>
                                <textarea
                                    id="selfDescription"
                                    className="self-input"
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                    value={selfDesc}
                                    onChange={(e) => setSelfDesc(e.target.value)}
                                />
                            </div>

                            <div className="note">
                                <span>ℹ️</span>
                                <span>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</span>
                            </div>
                        </aside>
                    </div>

                    <div className="card-footer">
                        <div className="hint">AI-Powered Strategy Generation · Approx 30s</div>
                        <button className="generate-btn" onClick={handleGemerateReport}>
                            ★ Generate My Interview Strategy
                        </button>
                    </div>
                </section>

           {reports.length > 0 && (
    <section className="card previous-reports">
        <div className="reports-header">
            <h2>Previous Reports</h2>
            <span>{reports.length} Reports</span>
        </div>

        <div className="report-list">
            {reports.map((report) => (
                <div key={report._id} className="report-item">
                    <div className="report-info" onClick={() => navigate(`/interview/${report._id}`)}>
                        <h3>{report.title}</h3>
                        <p>AI Interview Report</p>
                    </div>

                    <div className="report-score"> 
                        {report.matchScore}%
                    </div>
                </div>
            ))}
        </div>
    </section>
)}

            </div>
        </main>
    )
}

export default Home 