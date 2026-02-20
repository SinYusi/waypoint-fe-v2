/**
 * 1~20자
 * 한글/영문/숫자
 * 특수문자: ' _ 공백만 허용
 * 이모지 허용
 */
export const validateCollectionTitle = (raw: string) => {
  const title = raw.trim();

  // 빈 문자열 방지
  if (title.length === 0) {
    return {
      ok: false as const,
      message: "보관함 이름을 입력해 주세요.",
    };
  }

  if (title.length > 20)
    return {
      ok: false as const,
      message: "보관함 이름은 20자 이내로 입력해 주세요.",
    };

  // 금지: 따옴표('), 언더스코어(_), 공백 외의 특수문자만 거르기(이모지는 통과)
  const forbiddenAsciiSymbol = /[!"#$%&()*+,\-./:;<=>?@[\\\]^`{|}~]/;
  if (forbiddenAsciiSymbol.test(title)) {
    return {
      ok: false as const,
      message: "특수문자는 ' , _ , 공백만 사용할 수 있어요.",
    };
  }

  return { ok: true as const, value: title };
};
