import React from 'react';

const Experience = () => {
  const experiences = [
    {
      role: 'Full Stack Developer',
      company: '@ FISClouds Pvt. Ltd.',
      location: ' · Hyderabad, India',
      date: 'Jan 2023 — Present',
      points: [
          'Led a 3-member UI team delivering complex enterprise frontend systems end-to-end',
          'Architected scalable React applications with TypeScript and Redux Toolkit for AI platforms',
          'Built secure FastAPI backends with JWT authentication, WebSockets, and RESTful APIs',
          'Reduced production defects by 30% through rigorous code review practices and testing',
          'Shipped two full AI platforms: Gurita AI and Curie from 0 to production',
          'Integrated Docker, GCP, and GitLab CI/CD pipelines for consistent, fast deployments'
      ]
    }
  ];

  return (
    <section id="experience" className="reveal">
       <div className="section-tag">Career Path</div>
       <h2 className="section-title">Work <span>Experience</span></h2>
       <div className="timeline-container" style={{ position: 'relative', paddingLeft: '3rem', marginTop: '3rem' }}>
          <div className="timeline-line visible"></div>
          {experiences.map((exp, idx) => (
             <div key={idx} className="timeline-item reveal" style={{ position: 'relative', marginBottom: '3rem' }}>
                <div className="timeline-node"></div>
                <div className="timeline-card">
                   <div className="timeline-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div className="timeline-role" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>{exp.role}</div>
                      <div className="timeline-date">{exp.date}</div>
                   </div>
                   <div className="timeline-company" style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      <strong>{exp.company}</strong>{exp.location}
                   </div>
                   <div className="timeline-points" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {exp.points.map((pt, pIdx) => (
                         <div key={pIdx} className="timeline-point" style={{ display: 'flex', gap: '0.75rem', fontSize: '0.87rem', color: 'var(--text-secondary)' }}>
                            <div className="timeline-point-dot"></div>
                            {pt}
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          ))}
       </div>
    </section>
  );
};

export default Experience;
