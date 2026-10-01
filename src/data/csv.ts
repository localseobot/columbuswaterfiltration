/** Minimal RFC-style CSV parser. Fields may be quoted and contain commas. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        cur += c;
      }
      continue;
    }
    if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c !== "\r") {
      cur += c;
    }
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((r) => r.some((cell) => cell.length > 0));
  if (!header) return [];
  return body.map((cells) => {
    const record: Record<string, string> = {};
    header.forEach((key, i) => {
      record[key] = cells[i] ?? "";
    });
    return record;
  });
}
