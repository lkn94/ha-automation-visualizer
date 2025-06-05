import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface Props {
  definition: string;
}

export default function DiagramRenderer({ definition }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      flowchart: { wrap: true },
    });
    const id = `diagram-${Math.random().toString(36).slice(2)}`;
    mermaid
      .render(id, definition)
      .then(({ svg, bindFunctions }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
          bindFunctions?.(ref.current);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [definition]);

  return (
    <div ref={ref} className="mermaid overflow-x-auto flex justify-center" />
  );
}
