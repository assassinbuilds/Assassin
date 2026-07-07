"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = {
  question: string;
  answer: string;
};

const FAQAccordion = ({ items }: { items: FAQ[] }) => (
  <Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-3">
    {items.map((item, index) => (
      <AccordionItem
        key={item.question}
        value={`item-${index}`}
        className="rounded-lg border border-slate-200 bg-white px-6 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.8)]"
      >
        <AccordionTrigger className="py-5 text-left font-heading text-base font-black text-slate-950 hover:no-underline">
          {item.question}
        </AccordionTrigger>
        <AccordionContent className="pb-5 text-sm font-medium leading-7 text-slate-600">
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default FAQAccordion;

