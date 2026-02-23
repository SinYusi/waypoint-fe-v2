import { cn } from "@/lib/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileImageProps {
  size?: "sm" | "md" | "lg";
  src: string;
  alt: string;
  isOutLine?: boolean;
  className?: string;
}

const ProfileImage = ({
  size = "sm",
  src,
  alt,
  isOutLine = false,
  className,
}: ProfileImageProps) => {
  return (
    <Avatar
      className={cn(
        size === "sm" && "size-7",
        size === "md" && "w-[60px] h-[60px]",
        size === "lg" && "w-[86px] h-[86px]",
        isOutLine && "ring-8 ring-[#f0f0f0]",
        className,
      )}
    >
      <AvatarImage src={src ? src.replace(/^http:\/\//, "https://") : undefined} alt={alt} />
      <AvatarFallback className="bg-gray-300 typography-label-sm-sb text-foreground">
        {alt.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileImage;
