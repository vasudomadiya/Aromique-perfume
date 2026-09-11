import React from 'react';

const About = () => {
   const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  };

    const socialBtnStyle = {
        display: 'inline-block',
        margin: '10px',
        padding: '10px 20px',
        background: '#27272a',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'all 0.3s ease',    
    };

return (
    <div style={containerStyle}>
        <img src="https://avatars.githubusercontent.com/u/12345678?v=4" alt="Profile" style={{ width: '150px', borderRadius: '50%' }} />
        
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#fff' }}>About Me</h2>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f97316' }}>Domadiya Vasu</h3>

        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 30px auto' }}>
            <strong>Join the community and grow together!</strong> Welcome to my platform where we build, deploy, and scale highly engineered system.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <a href="https://vasudomadiya.vercel.app" target="_blank" rel="noreferrer" style={socialBtnStyle}>Website</a>
                <a href="https://youtube.com/@thedomadiyavasu" target="_blank" rel="noreferrer" style={socialBtnStyle}>YouTube</a>
                <a href="https://www.instagram.com/vasu_patel_009?stkn=OXBkczc1ZXlZN2Y1" target="_blank" rel="noreferrer" style={socialBtnStyle}>Instagram</a>
            </div>
      
    </div>
);
}

export default About;