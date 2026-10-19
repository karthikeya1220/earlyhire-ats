// Builds the PostgREST or() filter for candidate search.
//
// Two escaping layers are applied to the user's term, in order:
//
// 1. LIKE layer — the ilike patterns keep their `%…%` wildcards, but any
//    `\`, `%`, or `_` inside the term is backslash-prefixed so PostgreSQL
//    treats it as a literal (default LIKE escape character is `\`).
//
// 2. Filter-grammar layer — PostgREST reserves `,` `(` `)` `.` `:` `*` and
//    double-quote as structural characters in filter values, so every pattern
//    is wrapped in double quotes. Inside a quoted value, PostgREST un-escapes
//    `\"` to `"` and `\\` to `\` (URL-grammar "Reserved characters"), so the
//    LIKE-layer backslashes are doubled and any literal `"` becomes `\"`.
//    Quoting only affects parsing — wildcards inside quotes still work.
//
// The skills column is text[] and can only take an array-containment (@@/cs)
// filter, whose value is a Postgres array literal `{…}` where `,` separates
// elements and `\` is an escape character. User input cannot be embedded there
// safely, so the skills clauses are included only when the term contains no
// array-literal structural characters (`,`, `{`, `}`, `"`, `\`); otherwise
// they are dropped and the text columns still match the term.

const LIKE_SPECIAL = /[\\%_]/g;
const ARRAY_STRUCTURAL = /[{},"\\]/;

// LIKE layer: make `\`, `%`, `_` in the term literal.
function escapeLikeLiteral(term: string): string {
  return term.replace(LIKE_SPECIAL, (m) => `\\${m}`);
}

// Grammar layer: wrap a value in double quotes, escaping `"` and `\` for
// PostgREST's quoted-value parser.
function quoteFilterValue(value: string): string {
  const escaped = value.replace(/[\\"]/g, (m) => `\\${m}`);
  return `"${escaped}"`;
}

// Skills layer: return the array-literal element for the term, or null when
// the term contains characters that are structural in a Postgres array
// literal (`,` separates elements; `{` `}` nest; `"` quotes; `\` escapes).
// Such terms still search the text columns above — only the skills clauses
// are dropped.
function skillsElementFor(term: string): string | null {
  if (ARRAY_STRUCTURAL.test(term)) return null;
  return term;
}

// Returns the full or() argument for the given search term, or null when the
// term is empty (no filter should be applied).
export function buildCandidateSearchFilter(term: string): string | null {
  const trimmed = term.trim();
  if (!trimmed) return null;

  const pattern = quoteFilterValue(`%${escapeLikeLiteral(trimmed)}%`);
  const orParts = [
    `name.ilike.${pattern}`,
    `email.ilike.${pattern}`,
    `current_title.ilike.${pattern}`,
    `current_company.ilike.${pattern}`,
  ];

  const skillsElement = skillsElementFor(trimmed);
  if (skillsElement !== null) {
    // The array literal itself is grammar-quoted, matching the documented
    // pattern `age_range.cs."[30,35]"`, so reserved characters that are safe
    // in an array element (e.g. `.` in "Node.js") can't break parsing.
    const skillsValue = quoteFilterValue(`{${skillsElement}}`);
    orParts.push(
      `skills.cs.${skillsValue}`,
      `skills.cs.${quoteFilterValue(`{${skillsElement.toLowerCase()}}`)}`,
    );
  }

  return orParts.join(",");
}
