// ======================================================
//  Functions/Utils/calculateSecretScore.ts
// ======================================================

// 入力値を受け取り、判定結果と点数を返す関数

type UserData = {
  userId: string;
  birthDate: string;
};

export function calculateScore(
  secretId: string,
  userData: UserData
) {
  const userId = userData.userId || "";
  const birthDate = userData.birthDate || "";

  // 誕生日分解
  const year = birthDate.split("-")[0] || "";
  const month = birthDate.split("-")[1] || "";
  const day = birthDate.split("-")[2] || "";

  const mmdd = month + day;

  // 条件判定
  const hasUserId = userId !== "" && secretId.includes(userId);
  const hasYear = year !== "" && secretId.includes(year);
  const hasBirthday = mmdd !== "" && secretId.includes(mmdd);

  // ノイズ文字
  const noiseText = secretId
    .replaceAll(userId, "")
    .replaceAll(year, "")
    .replaceAll(mmdd, "");

  const noiseCount = noiseText.length;
  const hasNoise = noiseCount > 0;

  // 全達成
  const isValid =
    hasUserId &&
    hasYear &&
    hasBirthday &&
    hasNoise;

  // 点数
  let score = 0;

  if (hasUserId) score += 20;
  if (hasYear) score += 25;
  if (hasBirthday) score += 25;

  score += noiseCount * 8;

  // バー表示
  const progress = Math.min(score, 100);

  return {
    hasUserId,
    hasYear,
    hasBirthday,
    hasNoise,
    isValid,
    score,
    progress,
  };
}