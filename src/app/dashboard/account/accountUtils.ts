export function normalizeLanguage(val: string) {
  if (!val) return "";
  const lower = val.toLowerCase();
  if (["english", "en", "eng", "english"].includes(lower) || val === "English") return "english";
  if (["arabic", "ar", "arab", "العربية"].includes(lower) || val === "العربية") return "arabic";
  if (["chinese", "zh", "中文"].includes(lower) || val === "中文") return "chinese";
  return lower;
} 