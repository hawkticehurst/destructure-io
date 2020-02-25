import React from 'react';

/**
 * TODO: Update component to use JSON or Markdown file to render text content
 *
 * Required Props:
 * contentTitleString {String} – String representing the title a sub module
 * contentParagraphs {Array} – An array of strings representing paragraphs
 *  of content of a sub module
 *
 * Optional props:
 * codeDisplay {React Component} - Component for displaying code
 */
function LearningContent(props) {
  const { contentTitleString, contentParagraphs, codeDisplay } = props;

  return (
    <div className="text-content-container">
      <h1>{contentTitleString}</h1>
      {
        contentParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
      }
      <h2>{contentTitleString} Code</h2>
      {codeDisplay}
    </div>
  );
}

export default LearningContent;
