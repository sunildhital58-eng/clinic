import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LucideIcon from './LucideIcon';

interface ReadMoreTextProps {
  text: string;
  limit?: number;
}

export default function ReadMoreText({ text, limit = 120 }: ReadMoreTextProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!text) return null;

  // If text is within reasonable limit, render normally with no toggle
  if (text.length <= limit) {
    return <span className="text-slate-600 font-sans leading-relaxed">{text}</span>;
  }

  const previewText = text.substring(0, limit);
  const remainingText = text.substring(limit);

  return (
    <span className="font-sans text-slate-600 leading-relaxed inline">
      <span>{previewText}</span>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, filter: 'blur(3px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(3px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="inline"
          >
            {remainingText}
          </motion.span>
        )}
      </AnimatePresence>

      {!isExpanded && <span className="text-slate-400 font-mono select-none">...</span>}

      <span className="inline-block ml-2 align-middle">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-100 text-[10px] font-black uppercase tracking-wider text-brand-700 hover:text-brand-800 transition-all shadow-2xs hover:shadow-xs active:scale-[0.96] cursor-pointer"
        >
          <span>{isExpanded ? 'Less' : 'Read More'}</span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="flex items-center justify-center text-brand-500"
          >
            <LucideIcon name="ChevronDown" size={10} className="stroke-[3]" />
          </motion.span>
        </button>
      </span>
    </span>
  );
}
