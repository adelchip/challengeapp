/**
 * Reusable loading spinner component
 */
export function LoadingSpinner({ 
  size = 'lg',
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
}) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <span className={`loading loading-spinner loading-${size}`}></span>
    </div>
  );
}

/**
 * Full-page loading spinner
 */
export function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}
