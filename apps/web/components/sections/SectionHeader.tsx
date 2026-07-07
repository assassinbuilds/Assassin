"use client";
type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

const SectionHeader = ({ eyebrow, title, description, align = "center" }: SectionHeaderProps) => (
  <div className={align === "center" ? "mx-auto mb-12 max-w-4xl text-center" : "mb-10 max-w-3xl"}>
    {eyebrow && (
      <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-red-600">
        {eyebrow}
      </p>
    )}
    <h2 className="text-[2.1rem] font-black leading-tight text-slate-950 sm:text-[2.65rem] md:text-[3.1rem]">
      {title}
    </h2>
    {description && (
      <p className="mt-5 text-base font-medium leading-8 text-slate-600 md:text-lg">
        {description}
      </p>
    )}
  </div>
);

export default SectionHeader;

