import * as React from 'react';

type TabsContextValue = { value: string; onValueChange: (value: string) => void };
const TabsContext = React.createContext<TabsContextValue | null>(null);

export const Tabs = ({ defaultValue, value, onValueChange, className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (value: string) => void }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const activeValue = value ?? internalValue;
  const update = (next: string) => { setInternalValue(next); onValueChange?.(next); };
  return <TabsContext.Provider value={{ value: activeValue, onValueChange: update }}><div className={className} {...props}>{children}</div></TabsContext.Provider>;
};

export const TabsList = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`} {...props} />;

export const TabsTrigger = ({ value, className = '', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) => {
  const context = React.useContext(TabsContext);
  const active = context?.value === value;
  return <button type="button" aria-selected={active} onClick={() => context?.onValueChange(value)} className={`inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${active ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50'} ${className}`} {...props}>{children}</button>;
};

export const TabsContent = ({ value, className = '', ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) => {
  const context = React.useContext(TabsContext);
  if (context?.value !== value) return null;
  return <div className={`mt-2 ring-offset-background focus-visible:outline-none ${className}`} {...props} />;
};

