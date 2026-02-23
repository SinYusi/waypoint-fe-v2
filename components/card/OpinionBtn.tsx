import { MessageCircle } from "lucide-react";

interface OpinionBtnProps {
  count: number;
  onClick?: () => void;
}

const OpinionBtn = ({ count, onClick }: OpinionBtnProps) => {
  return (
    <button
      type="button"
      className="flex items-center gap-1 border border-[#e2e2e2] rounded-lg px-2.5 py-1.5"
      onClick={onClick}
    >
      <MessageCircle className="size-4" />
      <span className="typography-body-sm-reg">의견</span>
      <span className="typography-body-sm-bold">{count}</span>
    </button>
  );
};

export default OpinionBtn;
