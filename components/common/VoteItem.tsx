'use client';

import { useState } from 'react';
import PickPass from './PickPass';

interface VoteItemProps {
  type: 'pick' | 'pass';
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
  onClick?: () => void;
}

export default function VoteItem({ 
  type, 
  isActive: initialActive = false,
  onToggle,
  onClick 
}: VoteItemProps) {
  const [isActive, setIsActive] = useState(initialActive);

  const handleContainerClick = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    onToggle?.(newActive);
    onClick?.();
  };

  return (
    <div
      onClick={handleContainerClick}
      className="inline-flex h-9 min-w-0 shrink flex-[85] cursor-pointer items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors hover:bg-[#E0F2FE]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleContainerClick();
        }
      }}
    >
      <PickPass 
        type={type} 
        active={isActive}
        onToggle={(newActive) => {
          setIsActive(newActive);
          onToggle?.(newActive);
        }}
      />
    </div>
  );
}
