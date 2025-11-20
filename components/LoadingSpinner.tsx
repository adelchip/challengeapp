/**
 * Configurable loading spinner component using DaisyUI
 * 
 * @component
 * @example
 * // Default (large) spinner
 * <LoadingSpinner />
 * 
 * // Small spinner with custom className
 * <LoadingSpinner size="sm" className="my-4" />
 * 
 * @param size - Spinner size: 'sm', 'md', or 'lg' (default: 'lg')
 * @param className - Optional additional CSS classes
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
 * Full-page loading spinner component
 * 
 * Displays a large centered spinner with minimum height of 60vh.
 * Use this for page-level loading states.
 * 
 * @component
 * @example
 * if (loading) return <PageLoader />;
 */
export function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}
