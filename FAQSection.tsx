import React from 'react';
import { FAQItem } from '../types';
import LucideIcon from './LucideIcon';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq-section" className="py-20 px-4 bg-slate-100 border-t border-b border-slate-200">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <LucideIcon name="HelpCircle" size={13} />
            <span>FAQs & Support</span>
          </div>
          <h2 className="text-2xl sm:text-3.xl font-extrabold font-display text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Hami bare dherai jaso sodhiyeka jigyasaharu ko uttar haru yeta read garna saknuhunchha. FAQ settings can be updated live.
          </p>
        </div>

        {/* FAQs List Accordion */}
        {faqs.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-400">
            No FAQs retrieved. Initialize via Admin Dashboard.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = expandedId === faq.id;
              return (
                <div 
                  key={faq.id || index}
                  className="bg-white border border-slate-200 rounded-2xl transition-all duration-200 hover:shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 select-none hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-slate-800 text-sm sm:text-base pr-2">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-lg transition-transform ${isOpen ? 'bg-brand-50 text-brand-600 rotate-180' : 'bg-slate-100 text-slate-500'}`}>
                      <LucideIcon name="ChevronDown" size={16} />
                    </div>
                  </button>

                  {/* Answer slide-out */}
                  <div 
                    className={`transition-all duration-300 ease-in-out border-slate-100 overflow-hidden ${
                      isOpen ? 'max-h-96 border-t opacity-100 py-5 px-6 bg-slate-50/50' : 'max-h-0 opacity-0 border-t-0'
                    }`}
                  >
                    <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
