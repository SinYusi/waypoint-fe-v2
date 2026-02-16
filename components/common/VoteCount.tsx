'use client';

import { UsersRound } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VoteCountProps {
  count: number;
  onClick?: () => void;
}

export default function VoteCount({ count, onClick }: VoteCountProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`h-9 min-w-0 shrink flex-55 gap-1 rounded-xl bg-transparent px-3 py-2 transition-colors hover:bg-[#E0F2FE] typography-body-sm-sb ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      aria-label={`투표 참여자 ${count}명`}
      variant="ghost"
    >
      <UsersRound
        className="size-4.5 transition-colors"
        strokeWidth={1.5}
        style={{
          stroke: isHovered ? '#757575' : 'rgba(1, 1, 46, 0.13)',
        }}
      />
      <span className="text-[#757575]">
        {count}
      </span>
    </Button>
  );
}
