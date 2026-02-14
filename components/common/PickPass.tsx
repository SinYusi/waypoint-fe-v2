'use client';

import { Heart, SquareX } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PickPassProps {
  type: 'pick' | 'pass';
  defaultActive?: boolean;
  active?: boolean; // controlled mode
  onToggle?: (isActive: boolean) => void;
}

export default function PickPass({ 
  type,
  defaultActive = false,
  active,
  onToggle 
}: PickPassProps) {
  const [internalActive, setInternalActive] = useState(defaultActive);
  
  // controlled vs uncontrolled
  const isControlled = active !== undefined;
  const isActive = isControlled ? active : internalActive;

  const handleClick = () => {
    const newState = !isActive;
    if (!isControlled) {
      setInternalActive(newState);
    }
    onToggle?.(newState);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모로 이벤트 전파 방지
    handleClick();
  };

  const isPick = type === 'pick';
  const label = isPick ? '좋아요' : '다음에요';
  const ariaLabel = isPick 
    ? (isActive ? '좋아요 취소' : '좋아요')
    : (isActive ? '다음에요 취소' : '다음에요');
  const width = isPick ? 'w-15.25 min-w-15.25' : 'w-18.25 min-w-18.25'; // pick: 61px, pass: 73px

  return (
    <Button
      onClick={handleButtonClick}
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
