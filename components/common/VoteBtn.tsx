'use client';

import VoteItem from './VoteItem';
import VoteCount from './VoteCount';

interface VoteBtnProps {
  type: 'pick' | 'pass';
  count: number;
  isActive: boolean;
  onToggle?: (isActive: boolean) => void;
  onCountClick?: () => void;
}

export default function VoteBtn({ 
  type,
  count,
  isActive,
  onToggle,
  onCountClick
}: VoteBtnProps) {
  return (
    <div
      className={`inline-flex h-11 w-full min-w-0 shrink items-center gap-1 rounded-2xl px-1 backdrop-blur-md ${
        isActive ? 'border-2 border-[#757575]' : 'border border-[#E2E2E2]'
      }`}
    >
      <VoteItem 
        type={type}
        isActive={isActive}
        onToggle={onToggle}
      />
      
      {/* Divider */}
      <div className="h-4.5 w-px shrink-0 bg-[rgba(1,1,46,0.13)]" />
      
      <VoteCount 
        count={count}
        onClick={onCountClick}
      />
    </div>
  );
}
