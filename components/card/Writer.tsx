import ProfileImage from "@/components/common/ProfileImage";

interface WriterProps {
  nickname: string;
  profileImageUrl: string;
}

const Writer = ({ nickname, profileImageUrl }: WriterProps) => {
  const displayName =
    nickname.length >= 7 ? `${nickname.slice(0, 6)}...` : nickname;

  return (
    <div className="flex items-center gap-1 pt-1">
      <ProfileImage src={profileImageUrl} alt={nickname} className="size-4" />
      <span className="typography-caption-xs-reg text-foreground">
        {displayName}
      </span>
    </div>
  );
};

export default Writer;
