import React, { useLayoutEffect, useRef } from 'react';
import mermaid from 'mermaid';
import "./styles/mermaid.scss"

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = chart;
      mermaid.init(undefined, ref.current);
    }
  }, [chart]);

  return <div className='mermaid-diagram' key={chart} ref={ref}></div>;
};

export default MermaidDiagram;