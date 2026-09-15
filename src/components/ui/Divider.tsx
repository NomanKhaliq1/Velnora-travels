export function DiamondDivider({
  className = "flex items-center justify-center gap-3",
  lineClassName = "w-12 h-[1px] bg-velnora-gold-luxury/40",
  iconClassName = "text-[7px] text-velnora-gold-luxury/40",
}: {
  className?: string;
  lineClassName?: string;
  iconClassName?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      <span className={lineClassName} />
      <i className={`fa-solid fa-diamond ${iconClassName}`} />
      <span className={lineClassName} />
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 mb-3 ${className}`}>
      <span className="w-8 h-[1px] bg-velnora-gold-luxury" />
      <span className="text-xs font-bold tracking-[3px] text-velnora-gold-luxury uppercase flex items-center gap-1.5">
        {children}
      </span>
      <span className="w-8 h-[1px] bg-velnora-gold-luxury" />
    </div>
  );
}
