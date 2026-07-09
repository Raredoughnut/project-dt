export function ChoiceButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-card px-4 py-4 text-left text-sm font-medium text-foreground transition-[background,border-color,transform] hover:border-primary hover:bg-primary-lighter active:scale-[0.99]"
    >
      {label}
    </button>
  );
}
