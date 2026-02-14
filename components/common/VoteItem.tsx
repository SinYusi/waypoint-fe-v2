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
  return (
    <div
      className="inline-flex h-9 min-w-0 shrink flex-85 items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors hover:bg-[#E0F2FE]"
    >
      <PickPass 
        type={type} 
        isActive={isActive}
        onToggle={onToggle}
      />
    </div>
  );
}
