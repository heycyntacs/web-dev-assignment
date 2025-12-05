import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  text?: string;
}
export default function Loading({ className, text }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
    >
      <Loader2 className={cn('size-6 animate-spin')} />
      {text && <p className="text-sm">{text}</p>}
    </div>
  );
}
