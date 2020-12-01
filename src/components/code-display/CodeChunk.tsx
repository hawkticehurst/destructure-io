import React, { useState, useEffect } from "react";
import CodeLine from "./CodeLine";

/**
 * Required Props:
 * code {Object} - The chunk of codes data as described in CodeDisplay.js
 * language {String} - "java", "javascript", etc
 * lineNumberStart {number} - the first line number in the code
 *
 * Optional Props:
 * isHidden {Boolean} - Defaults to false, if true it shows as "grayed out"
 * selectedLine {number} - Number of selected line. If undefined or -1 is passed, no lines are selected
 */
type FixMeLater = any;

type Props = {
  code: FixMeLater;
  language: string;
  lineNumberStart: number;
  isHidden?: boolean;
  selectedLine?: number;
};

function CodeChunk({
  code,
  language,
  lineNumberStart,
  isHidden,
  selectedLine,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(isHidden);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    const calcHeight = () => {
      const codeContent: HTMLDivElement | null = document.querySelector(
        ".code-content"
      );
      if (codeContent) {
        return codeContent.offsetHeight;
      }
    };

    const setMaxHeightOneLine = () => {
      const height = calcHeight();
      if (height) {
        setMaxHeight(height);
      }
    };

    if (isCollapsed) {
      setMaxHeightOneLine();
      window.addEventListener("resize", setMaxHeightOneLine);
    } else if (code.length > 1) {
      window.removeEventListener("resize", setMaxHeightOneLine);
      const height = calcHeight();
      if (height) {
        setMaxHeight(height * code.length);
      }
    }

    return () => {
      window.removeEventListener("resize", setMaxHeightOneLine);
    };
  }, [isCollapsed, code.length]);

  const codeLines = code.map((lineData: FixMeLater, index: number) => {
    const lineNumber = index + lineNumberStart;
    return (
      <CodeLine
        language={language}
        code={lineData.given}
        lineNumber={lineNumber}
        onChevronClick={index === 0 ? () => setIsCollapsed(!isCollapsed) : null}
        isCollapsed={isCollapsed}
        isHidden={isHidden}
        isSelected={selectedLine === lineNumber}
        tooltip={lineData.tooltip}
        key={index}
      />
    );
  });

  let className = "chunk";
  if (isCollapsed) {
    className += " chunk-collapsed";
  } else {
    className += " chunk-open";
  }
  if (isHidden) {
    className += " hidden-chunk";
  }

  // const style = maxHeight > 0 ? {
  //   {"maxHeight": maxHeight}
  // } : null;

  let codeChunk: JSX.Element;

  if (maxHeight > 0) {
    codeChunk = (
      <div className={className} style={{ maxHeight: maxHeight }}>
        {codeLines}
      </div>
    );
  } else {
    codeChunk = <div className={className}>{codeLines}</div>;
  }

  return codeChunk;
}

export default CodeChunk;
