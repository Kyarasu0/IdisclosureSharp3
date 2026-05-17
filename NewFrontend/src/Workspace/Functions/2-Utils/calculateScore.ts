// ======================================================
//  Functions/Utils/calculateScore.ts
// ======================================================

type UserData = {
  userId: string;
  birthDate: string;
};

export function calculateScore(
  secretId: string,
  userData: UserData,
  costs: Record<string, number>,
) {
  // CostとScoreの設定
  const initialScore = costs.initialScore;
  const userIdCost = costs.userIdCost;
  const birthYearCost = costs.birthYearCost;
  const birthDayCost = costs.birthDayCost;
  const noiseCost = costs.noiseCost;


  const userId = userData.userId || "";
  const birthDate = userData.birthDate || "";

  const [year, month, day] = birthDate.split("-");

  const mmdd = `${month || ""}${day || ""}`;

  // -----------------------------------
  // 出現回数を数える関数
  // -----------------------------------
  const countOccurrences = (text: string, pattern: string) => {
    if (!pattern) return 0;
    return text.split(pattern).length - 1;
  };

  // -----------------------------------
  // 各カウント
  // -----------------------------------
  const userIdCount = countOccurrences(secretId, userId);
  const birthYearCount = countOccurrences(secretId, year);
  const birthDayCount = countOccurrences(secretId, mmdd);

  // -----------------------------------
  // ノイズ（削除残り）
  // -----------------------------------
  let noiseText = secretId;

  if (userId) noiseText = noiseText.replaceAll(userId, "");
  if (year) noiseText = noiseText.replaceAll(year, "");
  if (mmdd) noiseText = noiseText.replaceAll(mmdd, "");

  const noiseCount = noiseText.length;

  // -----------------------------------
  // スコア
  // -----------------------------------
  const userIdTotalCost = userIdCount * (userIdCost ? userIdCost : 1);
  const birthYearTotalCost = birthYearCount * (birthYearCost ? birthYearCost : 1);
  const birthDayTotalCost = birthDayCount * (birthDayCost ? birthDayCost : 1);
  const noiseTotalCost = (noiseCost ? noiseCost : 1) ** noiseCount - 1;
  const cost = userIdTotalCost + birthYearTotalCost + birthDayTotalCost + noiseTotalCost;

  const score = Math.floor((initialScore ? initialScore : 1) / (cost !== 0 ? cost : 1))
  const progress = (Math.floor(score * 100 / (initialScore ? initialScore : 1)));

  return {
    userIdTotalCost,
    birthYearTotalCost,
    birthDayTotalCost,
    noiseTotalCost,
    score,
    progress,
  };
}