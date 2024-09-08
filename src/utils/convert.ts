const categoryToEnglish = (category?: string | null): string => {
  if (!category) return "default";
  const categoryMap: { [key: string]: string } = {
    한식: "korean",
    카페: "cafe",
    분식: "snack",
    동남아: "southeast_asian",
    양식: "western",
    술집: "pub",
    베이커리: "bakery",
    인도_중동: "indian_middle_eastern",
    중국식: "chinese",
    탕류: "soup",
    일식: "japanese",
    복어취급: "puffer_fish",
    default: "default",
  };

  return categoryMap[category] || "default"; // 매핑되지 않은 경우 기본값 사용
};
export default categoryToEnglish;
