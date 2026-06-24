import React from "react";

function parseAttrs(attrStr: string): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = {};
  const re =
    /([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>/]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrStr)) !== null) {
    const [, name, dq, sq, uq] = m;
    if (!name) continue;
    result[name] =
      dq !== undefined
        ? dq
        : sq !== undefined
          ? sq
          : uq !== undefined
            ? uq
            : true;
  }
  return result;
}

export function parseScriptHtml(
  html: string,
  key: number,
): React.ReactNode {
  const s = html.trim();

  // <meta ... />
  const metaM = s.match(/^<meta(\s[^>]*)?\/?>/i);
  if (metaM) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <meta key={key} {...(parseAttrs(metaM[1] ?? "") as any)} />;
  }

  // <script ...>...</script>
  const scriptM = s.match(/^<script(\s[^>]*)?>([^]*?)<\/script>/i);
  if (scriptM) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrs = parseAttrs(scriptM[1] ?? "") as any;
    if (attrs.src && attrs.async === undefined && attrs.defer === undefined) {
      attrs.defer = true;
    }
    const content = scriptM[2] ?? "";
    if (content.trim()) {
      return (
        <script
          key={key}
          {...attrs}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return <script key={key} {...attrs} />;
  }

  // <noscript>...</noscript>
  const noscriptM = s.match(/^<noscript[^>]*>([\s\S]*?)<\/noscript>/i);
  if (noscriptM) {
    return (
      <noscript
        key={key}
        dangerouslySetInnerHTML={{ __html: noscriptM[1] }}
      />
    );
  }

  return null;
}
