import {
  Utensils,
  Coffee,
  IceCreamCone,
  Wine,
  Music,
  ShoppingBag,
  BedDouble,
  Bus,
  Sparkles,
  Dumbbell,
  FerrisWheel,
  Church,
  Leaf,
  Bird,
  Trees,
  Palette,
  Camera,
  Store,
  MoreHorizontal,
  Film,
  type LucideProps,
} from "lucide-react";

export type PlaceType =
  | "식당"
  | "카페"
  | "디저트"
  | "주점"
  | "유흥"
  | "쇼핑"
  | "숙소"
  | "교통"
  | "스파"
  | "액티비티"
  | "테마파크"
  | "종교시설"
  | "자연"
  | "공원"
  | "자유시간"
  | "문화예술"
  | "관광명소"
  | "관람"
  | "편의시설"
  | "기타";

type TypeConfig = {
  icon: React.ComponentType<LucideProps>;
  bg: string;
  border: string;
  iconColor: string;
};

const typeConfigMap: Record<PlaceType, TypeConfig> = {
  식당: {
    icon: Utensils,
    bg: "#fff7ed",
    border: "#fed7aa",
    iconColor: "#f97316",
  },
  카페: {
    icon: Coffee,
    bg: "#fefce8",
    border: "#fde68a",
    iconColor: "#ca8a04",
  },
  디저트: {
    icon: IceCreamCone,
    bg: "#fdf2f8",
    border: "#f9a8d4",
    iconColor: "#ec4899",
  },
  주점: { icon: Wine, bg: "#faf5ff", border: "#d8b4fe", iconColor: "#a855f7" },
  유흥: { icon: Music, bg: "#f5f3ff", border: "#c4b5fd", iconColor: "#7c3aed" },
  쇼핑: {
    icon: ShoppingBag,
    bg: "#fff1f2",
    border: "#fecdd3",
    iconColor: "#f43f5e",
  },
  숙소: {
    icon: BedDouble,
    bg: "#f0f9ff",
    border: "#bae6fd",
    iconColor: "#0ea5e9",
  },
  교통: { icon: Bus, bg: "#f8fafc", border: "#cbd5e1", iconColor: "#64748b" },
  스파: {
    icon: Sparkles,
    bg: "#f0fdfa",
    border: "#99f6e4",
    iconColor: "#14b8a6",
  },
  액티비티: {
    icon: Dumbbell,
    bg: "#f7fee7",
    border: "#bef264",
    iconColor: "#65a30d",
  },
  테마파크: {
    icon: FerrisWheel,
    bg: "#fffbeb",
    border: "#fde68a",
    iconColor: "#f59e0b",
  },
  종교시설: {
    icon: Church,
    bg: "#fafaf9",
    border: "#d6d3d1",
    iconColor: "#78716c",
  },
  자연: { icon: Leaf, bg: "#f0fdf4", border: "#bbf7d0", iconColor: "#22c55e" },
  공원: { icon: Trees, bg: "#edfce7", border: "#b9efc1", iconColor: "#6adb60" },
  자유시간: { icon: Bird, bg: "#edfce7", border: "#b9efc1", iconColor: "#6adb60" },
  문화예술: {
    icon: Palette,
    bg: "#fdf4ff",
    border: "#f0abfc",
    iconColor: "#d946ef",
  },
  관광명소: {
    icon: Camera,
    bg: "#fce7f3",
    border: "#fccee8",
    iconColor: "#e60076",
  },
  관람: { icon: Film, bg: "#eef2ff", border: "#c7d2fe", iconColor: "#6366f1" },
  편의시설: {
    icon: Store,
    bg: "#f9fafb",
    border: "#e5e7eb",
    iconColor: "#6b7280",
  },
  기타: {
    icon: MoreHorizontal,
    bg: "#f9fafb",
    border: "#e5e7eb",
    iconColor: "#9ca3af",
  },
};

interface PlaceTypeIconProps {
  type: PlaceType;
}

const PlaceTypeIcon = ({ type }: PlaceTypeIconProps) => {
  const config = typeConfigMap[type] ?? typeConfigMap["기타"];
  const Icon = config.icon;

  return (
    <div
      className="size-6 rounded-full flex items-center justify-center border"
      style={{ backgroundColor: config.bg, borderColor: config.border }}
    >
      <Icon className="size-3.5" style={{ color: config.iconColor }} />
    </div>
  );
};

export default PlaceTypeIcon;
