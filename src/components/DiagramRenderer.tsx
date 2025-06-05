import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface Props {
  definition: string;
}

export default function DiagramRenderer({ definition }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
    mermaid.render('diagram', definition).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg;
    });
  }, [definition]);

  return <div ref={ref} className="mermaid" />;
}
