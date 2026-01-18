import React from 'react';

type ContentRendererProps = {
  content: string;
};

const parseLine = (line: string) => {
  const parts = line.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  // Normalize line endings and then split by horizontal rule
  const sections = content.replace(/\r\n/g, '\n').split(/\n\s*---\s*\n/);

  return (
    <div className="space-y-6 text-foreground/90">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          {section.split('\n').map((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') {
              return null;
            }
            if (trimmedLine.startsWith('### ')) {
              return (
                <h3 key={lineIndex} className="text-lg font-headline font-semibold text-primary mt-4">
                  {trimmedLine.substring(4)}
                </h3>
              );
            }
            if (trimmedLine.startsWith('> ')) {
              return (
                <blockquote key={lineIndex} className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                  {parseLine(trimmedLine.substring(2))}
                </blockquote>
              );
            }
            return (
              <p key={lineIndex} className="whitespace-pre-wrap leading-relaxed">
                {parseLine(line)}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ContentRenderer;
