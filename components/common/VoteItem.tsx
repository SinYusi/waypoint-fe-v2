'use client';

import PickPass from './PickPass';

interface VoteItemProps {
  type: 'pick' | 'pass';
  isActive: boolean;
  onToggle?: (isActive: boolean) => void;
}

export default function VoteItem({ 
  type, 
  isActive,
  onToggle,
}: VoteItemProps) {
  const label = type === 'pick' ? '좋아요' : '다음에요';

  return (
    <button
      type="button"
      className="inline-flex h-9 min-w-0 shrink flex-85 cursor-pointer items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors hover:bg-[#E0F2FE]"
      onClick={() => onToggle?.(!isActive)}
      aria-label={isActive ? `${label} 취소` : label}
    >
      <PickPass 
        type={type} 
        isActive={isActive}
      />
    </button>
  );
}
