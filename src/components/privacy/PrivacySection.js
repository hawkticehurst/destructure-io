import React from 'react';

function PrivacySection(props) {
  const { title, text } = props
  return (
      <div className="privacy-section">
        <h2>{title}</h2>
        {
          Array.isArray(text) ? (
            text.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          ) : <p>{text}</p>
        }
      </div>
  );
}

export default PrivacySection;
