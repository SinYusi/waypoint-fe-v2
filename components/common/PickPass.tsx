'use client';

import { Heart, SquareX } from 'lucide-react';
import { useState } from 'react';

interface PickPassProps {
  type: 'pick' | 'pass';
  defaultActive?: boolean;
  onToggle?: (isActive: boolean) => void;
}

export default function PickPass({ 
  type,
  defaultActive = false, 
  onToggle 
}: PickPassProps) {
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);
  };

  const isPick = type === 'pick';
  const label = isPick ? '좋아요' : '다음에요';
  const ariaLabel = isPick 
    ? (isActive ? '좋아요 취소' : '좋아요')
    : (isActive ? '다음에요 취소' : '다음에요');

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 h-5"
      type="button"
      aria-label={ariaLabel}
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
    </button>
  );
}
