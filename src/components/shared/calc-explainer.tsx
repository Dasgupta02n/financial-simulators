interface Props {
  children: React.ReactNode;
}

export function CalcExplainer({ children }: Props) {
  return (
    <div className="text-xs text-text-secondary leading-relaxed space-y-1.5 p-3 bg-surface/50 rounded-lg border border-border">
      {children}
    </div>
  );
}