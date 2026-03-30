import React from 'react';

const Skills = () => {
  const categories = [
    {
      title: 'Frontend',
      skills: ['React.js', 'TypeScript', 'Redux Toolkit', 'Next.js', 'React Flow', 'JavaScript ES6+'],
      color: 'pill-blue'
    },
    {
      title: 'UI & Styling',
      skills: ['Tailwind CSS', 'Material UI', 'Bootstrap 5', 'SASS/SCSS', 'HTML5', 'CSS3'],
      color: 'pill-violet'
    },
    {
      title: 'Backend',
      skills: ['Node.js', 'Express.js', 'Python', 'FastAPI', 'REST APIs', 'JWT Auth', 'WebSockets'],
      color: 'pill-cyan'
    },
    // Add more categories as needed from the HTML source...
  ];

  return (
    <div id="skills" style={{ background: 'rgba(8,13,26,0.5)', padding: '5rem clamp(1.5rem, 5vw, 4rem)' }}>
      <div className="skills-section-wrap reveal">
        <div className="section-tag">Tech Arsenal</div>
        <h2 className="section-title">Tools I <span>Wield Daily</span></h2>
        <div className="skills-categories" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '2rem' }}>
          {categories.map((cat, idx) => (
            <div key={idx} className="reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
              <div className="skill-category-title" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {cat.title}
              </div>
              <div className="skills-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {cat.skills.map((skill, sIdx) => (
                  <span key={sIdx} className={`skill-pill ${cat.color}`}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
