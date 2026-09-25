const ALIASES: Record<string, string> = {
  "bolivia": "BO",
  "bosnia and herzegovina": "BA",
  "brunei darussalam": "BN",
  "cape verde": "CV",
  "congo": "CG",
  "congo, the democratic republic of the": "CD",
  "cote d'ivoire": "CI",
  "falkland islands (malvinas)": "FK",
  "heard island and mcdonald islands": "HM",
  "holy see (vatican city state)": "VA",
  "iran, islamic republic of": "IR",
  "korea, democratic people's republic of": "KP",
  "korea, republic of": "KR",
  "lao people's democratic republic": "LA",
  "libyan arab jamahiriya": "LY",
  "macedonia, the former yugoslav republic of": "MK",
  "micronesia, federated states of": "FM",
  "moldova, republic of": "MD",
  "netherlands antilles": "AN",
  "palestinian territory, occupied": "PS",
  "pitcairn": "PN",
  "reunion": "RE",
  "russian federation": "RU",
  "saint helena": "SH",
  "serbia and montenegro": "RS",
  "syrian arab republic": "SY",
  "taiwan, province of china": "TW",
  "tanzania, united republic of": "TZ",
  "united arab emirates": "AE",
  "united kingdom": "GB",
  "united states": "US",
  "united states minor outlying islands": "UM",
  "venezuela": "VE",
  "viet nam": "VN",
  "virgin islands, british": "VG",
  "virgin islands, u.s.": "VI",
};

let intlIndex: Map<string, string> | null = null;

function buildIntlIndex() {
  const display = new Intl.DisplayNames(["en"], { type: "region" });
  const map = new Map<string, string>();
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      const label = display.of(code);
      if (label && label !== code) map.set(label.toLowerCase(), code);
    }
  }
  return map;
}

export function countryNameToIso(name: string): string | null {
  const key = name.trim().toLowerCase();
  if (!key) return null;
  if (ALIASES[key]) return ALIASES[key];
  if (!intlIndex) intlIndex = buildIntlIndex();
  return intlIndex.get(key) ?? null;
}
