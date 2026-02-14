'use client';

import { Heart, SquareX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PickPassProps {
  type: 'pick' | 'pass';
  isActive: boolean;
  onToggle?: (isActive: boolean) => void;
}

export default function PickPass({ 
  type,
  isActive,
  onToggle 
}: PickPassProps) {
  const handleClick = () => {
    const newState = !isActive;
    onToggle?.(newState);
  };

  const isPick = type === 'pick';
  const label = isPick ? '좋아요' : '다음에요';
  const ariaLabel = isPick 
    ? (isActive ? '좋아요 취소' : '좋아요')
    : (isActive ? '다음에요 취소' : '다음에요');
  const width = isPick ? 'w-15.25 min-w-15.25' : 'w-18.25 min-w-18.25'; // pick: 61px, pass: 73px

  return (
    <Button
      onClick={handleClick}
      className={`h-5 ${width} cursor-pointer gap-1 bg-transparent p-0 hover:bg-transparent`}
      type="button"
      aria-label={ariaLabel}
      variant="ghost"
    >
      {isPick ? (
        <Heart
          className="w-5 h-5 transition-colors"
          strokeWidth={isActive ? 0 : 2}
          style={{
            stroke: isActive ? 'none' : 'var(--foreground, #1C2024)',
            fill: isActive ? 'var(--red-500, #EF4444)' : 'none',
          }}
        />
      ) : (
        <SquareX
          className="w-5 h-5 transition-colors"
          strokeWidth={2}
          style={{
            stroke: isActive ? '#FFFFFF' : 'var(--foreground, #1C2024)',
            fill: isActive ? 'var(--purple-500, #A855F7)' : 'none',
          }}
        />
      )}
      <span
        className={`transition-all ${
          isActive ? 'typography-body-sm-sb' : 'typography-body-sm-reg'
        }`}
        style={{ color: 'var(--foreground, #1C2024)' }}
      >
        {label}
      </span>
    </Button>
  );
}
