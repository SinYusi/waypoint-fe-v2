"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileImage from "@/components/common/ProfileImage";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import AppDialog from "@/components/common/AppDialog";
import CheckBox from "@/components/common/CheckBox";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { FieldDescription } from "@/components/ui/field-description";
import { DialogClose } from "@/components/ui/dialog";
import { useMe } from "@/lib/hooks/use-me";
import { useUpdateMe } from "@/lib/hooks/use-update-me";
import { useUpdatePicture } from "@/lib/hooks/use-update-picture";
import { useDeletePicture } from "@/lib/hooks/use-delete-profile-picture";
import { useDeleteMe } from "@/lib/hooks/use-delete-me";
import {
  CheckIcon,
  DoorClosedIcon,
  PencilIcon,
  UploadIcon,
} from "lucide-react";

const WITHDRAWAL_REASONS = [
  "자주 쓰지 않게 돼요",
  "사용이 불편해요",
  "자꾸 멈추거나 오류가 나요",
  "다른 계정으로 새로 만들고 싶어요",
  "기타 (직접 입력)",
];

const EditMyInformationPage = () => {
  const router = useRouter();
  const { data: me } = useMe();
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe({
    onSuccess: () => setIsEditing(false),
  });
  const { mutate: updatePicture, isPending: isUploadingPicture } =
    useUpdatePicture({
      onSuccess: () => {
        setPictureVersion((v) => v + 1);
        setIsProfileImageOpen(false);
      },
    });
  const { mutate: deletePicture, isPending: isDeletingPicture } =
    useDeletePicture({
      onSuccess: () => setIsProfileImageOpen(false),
    });
  const { mutate: deleteMe, isPending: isDeletingMe } = useDeleteMe({
    onSuccess: () => router.replace("/login"),
  });

  const nickname = me?.nickname ?? "";
  const [pictureVersion, setPictureVersion] = useState(0);
  const picture = me?.picture ? `${me.picture}?v=${pictureVersion}` : "";

  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [etcText, setEtcText] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProfileImageOpen, setIsProfileImageOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEtcSelected = selectedReason === "기타 (직접 입력)";
  const isNextDisabled = !selectedReason || (isEtcSelected && !etcText.trim());

  const isNicknameEmpty = isEditing && editNickname.trim() === "";
  const isNicknameTooLong = editNickname.length > 10;
  const hasNicknameError =
    !isNicknameEmpty &&
    !isNicknameTooLong &&
    /[^\w\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/.test(editNickname);

  const toggleReason = (reason: string) => {
    setSelectedReason((prev) => (prev === reason ? "" : reason));
  };

  useEffect(() => {
    if (nickname && !isEditing) setEditNickname(nickname);
  }, [nickname, isEditing]);

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col">
      <div className="flex-1 w-full mt-20 rounded-t-3xl bg-[#f0f0f0] flex flex-col items-center gap-2.5 px-5 pb-18">
        <button
          type="button"
          className="-mt-[43px]"
          onClick={() => setIsProfileImageOpen(true)}
        >
          <ProfileImage
            src={picture}
            alt={nickname || "프로필 이미지"}
            size="lg"
            isOutLine
          />
        </button>
        <Button
          variant="ghost"
          className="pt-[11.5px]"
          onClick={() => setIsProfileImageOpen(true)}
        >
          <p className="typography-action-sm-reg text-[#757575]">
            프로필 사진 수정
          </p>
          <PencilIcon size={16} className="opacity-40" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            updatePicture({ file });
            e.target.value = "";
          }}
        />

        <AppDialog
          open={isProfileImageOpen}
          onOpenChange={setIsProfileImageOpen}
          title="프로필 사진 수정"
          contentClassName="drop-shadow-[0_6px_4px_rgba(0,0,0,0.1)] drop-shadow-[0_10px_-3px_rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-col gap-4">
            <Button
              className="bg-sky-500 hover:bg-sky-500/90 typography-action-base-bold"
              disabled={isUploadingPicture}
              onClick={() => fileInputRef.current?.click()}
              icon={<UploadIcon className="size-6 opacity-40" />}
            >
              이미지 업로드
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="typography-action-base-bold"
                disabled={isDeletingPicture}
                onClick={() => deletePicture()}
              >
                기본 사진으로 변경
              </Button>
            </DialogClose>
          </div>
        </AppDialog>

        <div className="w-full flex-1 rounded-2xl pt-4 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <Label className="typography-action-base-bold">나의 이름</Label>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <InputForm
                    className="flex-1 bg-[#fafafa]"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                  />
                ) : (
                  <p className="flex-1 typography-body-base">{nickname}</p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isUpdating}
                  onClick={() => {
                    if (isEditing) {
                      if (
                        isNicknameEmpty ||
                        isNicknameTooLong ||
                        hasNicknameError
                      )
                        return;
                      updateMe({ nickname: editNickname });
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  {isEditing ? (
                    <CheckIcon className="size-6" />
                  ) : (
                    <PencilIcon className="size-6" />
                  )}
                </Button>
              </div>
              {isNicknameEmpty && (
                <FieldDescription error>이름을 입력해 주세요.</FieldDescription>
              )}
              {isEditing && isNicknameTooLong && (
                <FieldDescription error>
                  이름은 10자 이하로 입력해 주세요.
                </FieldDescription>
              )}
              {isEditing && hasNicknameError && (
                <FieldDescription error>
                  특수문자와 공백은 사용할 수 없습니다.
                </FieldDescription>
              )}
            </div>
          </div>
          <AppAlertDialog
            trigger={
              <Button
                variant="ghost"
                icon={<DoorClosedIcon color="#D93d42" className="opacity-40" />}
              >
                <p className="typography-action-sm-reg text-[#757575]">
                  회원 탈퇴하기
                </p>
              </Button>
            }
            title="회원 탈퇴"
            description={
              "탈퇴하시는 이유를 알려주시면\n 소중한 의견을 담아 더 좋은 트립픽셀을 만들겠습니다."
            }
            actionLabel="다음"
            actionClassName="bg-[#757575] hover:bg-[#757575]/90"
            actionDisabled={isNextDisabled}
            onAction={() => setIsConfirmOpen(true)}
          >
            <div className="flex flex-col gap-3">
              {WITHDRAWAL_REASONS.map((reason) => (
                <div key={reason} className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <CheckBox
                      checked={selectedReason === reason}
                      onCheckedChange={() => toggleReason(reason)}
                    />
                    <span className="typography-body-sm-reg">{reason}</span>
                  </label>
                  {reason === "기타 (직접 입력)" && (
                    <InputForm
                      hideIcon
                      disabled={!isEtcSelected}
                      placeholder="직접 입력해 주세요"
                      value={etcText}
                      onChange={(e) => setEtcText(e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </AppAlertDialog>

          <AppAlertDialog
            open={isConfirmOpen}
            onOpenChange={setIsConfirmOpen}
            title="정말 탈퇴하시겠어요?"
            description={
              "그 동안 차곡차곡 모은 여행 일정과 기록이 모두 사라져요. 그래도 정말 떠나시겠어요?"
            }
            cancelLabel="취소"
            actionLabel="탈퇴"
            onAction={() => {
              const reason = isEtcSelected ? etcText : selectedReason;
              deleteMe({ reason });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditMyInformationPage;
