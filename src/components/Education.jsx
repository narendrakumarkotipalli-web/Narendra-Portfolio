import React from 'react';

const Education = () => {
  const education = [
    {
      degree: 'B.Tech — Mechanical Engineering',
      college: 'Aditya College of Engineering, Surampalem',
      year: 'July 2018 — May 2021',
      note: '"Transitioned from Mechanical Engineering to Full Stack Development through self-driven learning, passion for technology, and real-world project experience."'
    }
  ];

  return (
    <section id="education" className="reveal">
       <div className="section-tag">Academic Background</div>
       <h2 className="section-title">Education</h2>
       <div className="edu-card reveal" style={{ marginTop: '3rem' }}>
          <div className="edu-icon">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
             </svg>
          </div>
          <div>
             <div className="edu-degree" style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>{education[0].degree}</div>
             <div className="edu-college" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{education[0].college}</div>
             <div className="edu-year" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--blue-light)', background: 'rgba(59,130,246,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{education[0].year}</div>
             <div className="edu-note" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontStyle: 'italic' }}>{education[0].note}</div>
          </div>
       </div>
    </section>
  );
};

export default Education;
