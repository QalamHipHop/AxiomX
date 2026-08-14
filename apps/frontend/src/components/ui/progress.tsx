import * as React from 'react';

export const Progress = ({ value = 0, className = '', ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: number }) => (
  <div role="progressbar" aria-valuenow={value} className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
    <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: `translateX(-${100 - Math.max(0, Math.min(100, value))}%)` }} />
  </div>
);

