export function splitColorTag(color: string) {
  const [rawHexes, ...nameParts] = color.split("|");
  const name = nameParts.join("|").trim();
  const hexes = rawHexes.trim().split(",").map(h => h.trim());
  return {
    hex: hexes[0] || "",
    hex2: hexes[1] || "", // may be empty if single color
    name: name || color.trim()
  };
}

export function makeColorTag(hex1: string, hex2: string, name: string) {
  const rawHexes = hex2 ? `${hex1},${hex2}` : hex1;
  return `${rawHexes}|${name.trim() || "Nova cor"}`;
}

export function colorCss(color: string) {
  const { hex, hex2 } = splitColorTag(color);
  
  const parseHex = (swatch: string) => {
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(swatch)) return swatch;
    const v = swatch.toLowerCase();
    if (v.includes("preto")) return "#111111";
    if (v.includes("branco") || v.includes("off-white")) return "#f4f0e8";
    if (v.includes("marrom")) return "#5a3727";
    if (v.includes("cinza") || v.includes("prata")) return "#9aa0a6";
    if (v.includes("rosa")) return "#f4a8bc";
    if (v.includes("vermelho")) return "#c8102e";
    if (v.includes("bege")) return "#c7aa83";
    if (v.includes("verde")) return "#0d6b43";
    if (v.includes("vinho")) return "#5b1230";
    if (v.includes("azul")) return "#15285f";
    if (v.includes("dourado")) return "#c9a84c";
    return "transparent";
  };

  const color1 = parseHex(hex);
  
  if (hex2) {
    const color2 = parseHex(hex2);
    // Return a diagonal split
    return `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;
  }
  
  return color1;
}
