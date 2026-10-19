// Focused regression tests for candidate-search filter construction.
// Run with: node --test src/lib/search-filter.test.ts
// (Node 22.6+ strips types natively; no test framework dependency needed.)
import assert from "node:assert/strict";
import { test } from "node:test";

import { buildCandidateSearchFilter } from "./search-filter.ts";

// Split an or() argument the way PostgREST does: commas that are NOT inside
// double quotes separate parts. Used to assert structural validity.
function splitOrParts(filter: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < filter.length; i++) {
    const ch = filter[i];
    if (inQuotes && ch === "\\") {
      current += ch + (filter[i + 1] ?? "");
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
      continue;
    }
    if (ch === "," && !inQuotes) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  assert.equal(inQuotes, false, "filter must end outside a quoted value");
  return parts;
}

// Every part must be `column.ilike."escaped-value"` or
// `skills.cs."{…}"` (the documented quoted-value pattern for cs).
function assertValidParts(filter: string) {
  for (const part of splitOrParts(filter)) {
    const ok =
      /^[a-z_]+\.ilike\."(?:[^"\\]|\\.)*"$/.test(part) ||
      /^skills\.cs\."\{(?:[^"\\]|\\.)*\}"$/.test(part);
    assert.ok(ok, `malformed or-part: ${part}`);
  }
}

const COLUMNS = [
  "name",
  "email",
  "current_title",
  "current_company",
] as const;

function ilikeValue(filter: string, column: string): string {
  const part = splitOrParts(filter).find((p) => p.startsWith(`${column}.`));
  assert.ok(part, `missing ${column} clause`);
  // Strip `column.ilike.` prefix and surrounding quotes, then unescape the
  // PostgREST quoted-value layer to recover what PostgREST hands to LIKE.
  const raw = part.slice(column.length + ".ilike.".length);
  assert.ok(raw.startsWith('"') && raw.endsWith('"'));
  return raw
    .slice(1, -1)
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

test("ordinary search: quoted patterns + skills in both cases", () => {
  const filter = buildCandidateSearchFilter("jane");
  assert.ok(filter);
  assertValidParts(filter);
  const parts = splitOrParts(filter);
  assert.equal(parts.length, 6);
  for (const col of COLUMNS) assert.equal(ilikeValue(filter, col), "%jane%");
  assert.ok(parts.includes('skills.cs."{jane}"'));
  assert.ok(parts.includes('skills.cs."{jane}"'), "exact case kept");
});

test("empty and whitespace-only search returns null", () => {
  assert.equal(buildCandidateSearchFilter(""), null);
  assert.equal(buildCandidateSearchFilter("   "), null);
});

test("comma: stays inside the quoted value, never splits or-parts", () => {
  const filter = buildCandidateSearchFilter("doe, john");
  assert.ok(filter);
  assertValidParts(filter);
  // 4 text clauses; skills clauses dropped (comma is array-literal structural).
  assert.equal(splitOrParts(filter).length, 4);
  for (const col of COLUMNS) {
    assert.equal(ilikeValue(filter, col), "%doe, john%");
  }
});

test("double quote: escaped as \\\" inside the quoted value", () => {
  const filter = buildCandidateSearchFilter('say "hi"');
  assert.ok(filter);
  assertValidParts(filter);
  assert.ok(filter.includes('\\"hi\\"'), "quotes must be backslash-escaped");
  assert.equal(splitOrParts(filter).length, 4);
  for (const col of COLUMNS) {
    assert.equal(ilikeValue(filter, col), '%say "hi"%');
  }
});

test("braces: quoted for text columns, skills clause dropped", () => {
  const filter = buildCandidateSearchFilter("foo{bar}");
  assert.ok(filter);
  assertValidParts(filter);
  assert.equal(splitOrParts(filter).length, 4);
  for (const col of COLUMNS) {
    assert.equal(ilikeValue(filter, col), "%foo{bar}%");
  }
});

test("backslash: doubled for LIKE then doubled again for the grammar", () => {
  const filter = buildCandidateSearchFilter("a\\b");
  assert.ok(filter);
  assertValidParts(filter);
  // LIKE layer makes it literal (`a\\b`), grammar layer doubles each slash.
  assert.ok(filter.includes("%a\\\\\\\\b%"), `unexpected encoding: ${filter}`);
  // Unescaping the grammar layer must yield the LIKE-escaped form.
  assert.equal(ilikeValue(filter, "name"), "%a\\\\b%");
});

test("percent and underscore stay LIKE-escaped inside quotes", () => {
  const filter = buildCandidateSearchFilter("50%_off");
  assert.ok(filter);
  assertValidParts(filter);
  // After removing the grammar layer, LIKE sees \% and \_ as literals.
  assert.equal(ilikeValue(filter, "name"), "%50\\%\\_off%");
});

test("skills matching: plain terms produce exact + lowercase containment", () => {
  const filter = buildCandidateSearchFilter("React");
  assert.ok(filter);
  const parts = splitOrParts(filter);
  assert.ok(parts.includes('skills.cs."{React}"'), "exact case kept");
  assert.ok(parts.includes('skills.cs."{react}"'), "lowercase variant added");
});

test("skills: term with array-structural chars drops skills, keeps text", () => {
  for (const term of ['a,b', 'a{b', 'a}b', 'a"b', 'a\\b']) {
    const filter = buildCandidateSearchFilter(term);
    assert.ok(filter, `filter for ${term}`);
    assert.ok(!filter.includes("skills.cs"), `skills must drop for ${term}`);
    assert.equal(splitOrParts(filter).length, 4, `4 text clauses for ${term}`);
  }
});

test("skills: non-structural punctuation is kept and quoted", () => {
  const filter = buildCandidateSearchFilter("Node.js");
  assert.ok(filter);
  const parts = splitOrParts(filter);
  assert.ok(parts.includes('skills.cs."{Node.js}"'));
  assert.ok(parts.includes('skills.cs."{node.js}"'));
});

test("reserved characters . : * ( ) are safe inside quoted values", () => {
  const filter = buildCandidateSearchFilter("C++ (senior): staff*");
  assert.ok(filter);
  assertValidParts(filter);
  for (const col of COLUMNS) {
    assert.equal(ilikeValue(filter, col), "%C++ (senior): staff*%");
  }
});
