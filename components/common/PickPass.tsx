'use client';

import { Heart, SquareX } from 'lucide-react';

interface PickPassProps {
  type: 'pick' | 'pass';
  isActive: boolean;
}

export default function PickPass({ 
  type,
  isActive,
}: PickPassProps) {
  const isPick = type === 'pick';
  const label = isPick ? '좋아요' : '다음에요';
  const width = isPick ? 'w-15.25 min-w-15.25' : 'w-18.25 min-w-18.25'; // pick: 61px, pass: 73px

  return (
    <div className={`inline-flex h-5 ${width} items-center justify-center gap-1`}>
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
    </div>
  );
}
