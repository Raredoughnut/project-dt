type Props = {
  message: string;
};

export function DataErrorView({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-32 text-center">
      <p className="text-base font-semibold text-foreground">
        문제가 발생했습니다
      </p>
      <p className="text-[13px] text-muted-foreground">{message}</p>
    </div>
  );
}
