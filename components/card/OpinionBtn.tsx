import { MessageCircle } from "lucide-react";

interface OpinionBtnProps {
  count: number;
  onClick?: () => void;
}

const OpinionBtn = ({ count, onClick }: OpinionBtnProps) => {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-1.5"
      onClick={onClick}
    >
      <MessageCircle className="w-4.5 h-4.5 text-muted-foreground" />
      <div className="flex items-center gap-1">
        <p className="typography-action-sm-reg">의견</p>
        <span className="typography-action-sm-bold">{count}</span>
      </div>
    </button>
  );
};

export default OpinionBtn;
