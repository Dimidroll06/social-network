export const Loader = ({ className }: { className?: string }) => {
  className = className || '';
  return (
    <div
      className={`inline-block w-max aspect-square animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
      role="status"
    ></div>
  );
};
