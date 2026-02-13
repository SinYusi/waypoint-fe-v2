'use client';

import PickPass from './PickPass';

interface VoteItemProps {
  type: 'pick' | 'pass';
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
  onClick?: () => void;
}

export default function VoteItem({ 
  type, 
  isActive = false,
  onToggle,
  onClick 
}: VoteItemProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex h-9 w-21.25 min-w-21.25 items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors hover:bg-[#E0F2FE]"
    >
      <PickPass 
        type={type} 
        defaultActive={isActive}
        onToggle={onToggle}
      />
    </div>
  );
}
