import React from 'react';

/**
 * TODO: Update component to use JSON or Markdown file to render text content
 * 
 * Required Props:
 * contentTitleString {String} – String representing the title a sub module
 * 
 * Optional props:
 * contentFirstParagraph {String} – String representing the first paragraph of content of a sub module
 * contentSecondParagraph {String} – String representing the second paragraph of content of a sub module
 * contentThirdParagraph {String} – String representing the third paragraph of content of a sub module
 * codeDisplay {React Component} - Component for displaying code
 */
function TextContent(props) {
  const { contentTitleString, contentFirstParagraph, contentSecondParagraph, contentThirdParagraph, codeDisplay } = props;

  return (
    <div className="text-content-container">
      <h1>{contentTitleString}</h1>
      <p>{contentFirstParagraph}</p>
      <p>{contentSecondParagraph}</p>
      <p>{contentThirdParagraph}</p>
      <h2>{contentTitleString} Code</h2>
      {codeDisplay}
    </div>
  );
}

export default TextContent;
