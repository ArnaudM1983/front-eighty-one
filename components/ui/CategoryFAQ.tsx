
interface FAQItem {
    question: string;
    answer: string;
}

interface CategoryFAQProps {
    items: FAQItem[];
    title?: string;
    subtitle?: string;
}

const CategoryFAQ = ({ 
    items, 
    title = "Les questions posées au shop", 
    subtitle = "FAQ Technique" 
}: CategoryFAQProps) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="max-w-4xl mx-auto px-6 pb-24 mt-16">
            <div className="bg-gray-50 py-12 px-8 md:px-12 rounded-3xl border border-gray-100 shadow-sm">
                <div className="mb-10">
                    <span className="text-(--primary) text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
                        {subtitle}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-black tracking-tighter leading-none">
                        {title}
                    </h2>
                </div>
                
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <details 
                            key={index} 
                            className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300 hover:border-(--primary)/30"
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-gray-800 list-none">
                                <span className="pr-4">{item.question}</span>
                                <span className="text-(--primary) transition-transform duration-300 group-open:rotate-180 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4 italic">
                                {item.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryFAQ;