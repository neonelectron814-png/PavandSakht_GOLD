import React, { useState, useEffect } from 'react';

interface AnimatedTypewriterTopicProps {
  topic?: string;
  className?: string;
}

export const AnimatedTypewriterTopic: React.FC<AnimatedTypewriterTopicProps> = ({
  topic = 'پروژه‌های عمرانی و ساختمانی',
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fullText = topic && topic.trim() ? topic.trim() : 'پروژه‌های عمرانی و ساختمانی';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const typingSpeed = isDeleting ? 35 : 75;

    if (!isDeleting && displayedText === fullText) {
      // Pause at full text for 3.5 seconds
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3500);
    } else if (isDeleting && displayedText === '') {
      // Finished deleting, brief pause before retyping
      setIsDeleting(false);
      timer = setTimeout(() => {}, 500);
    } else {
      // Type or delete next character
      timer = setTimeout(() => {
        setDisplayedText((prev) => {
          if (isDeleting) {
            return fullText.substring(0, prev.length - 1);
          } else {
            return fullText.substring(0, prev.length + 1);
          }
        });
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, fullText]);

  // Reset when topic prop changes
  useEffect(() => {
    setDisplayedText('');
    setIsDeleting(false);
  }, [topic]);

  return (
    <div className={`inline-flex items-center gap-2 bg-black/85 backdrop-blur-md border border-[#dfc282] px-3.5 py-1.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.7)] text-right select-none ${className}`}>
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
      </span>
      <span className="text-[11px] sm:text-xs font-black text-amber-400 shrink-0">
        موضوع:
      </span>
      <div className="flex items-center text-xs sm:text-[13px] font-black text-white min-h-[20px]">
        <span>{displayedText}</span>
        <span className="inline-block w-1.5 h-3.5 bg-amber-400 mr-1 animate-pulse" />
      </div>
    </div>
  );
};
