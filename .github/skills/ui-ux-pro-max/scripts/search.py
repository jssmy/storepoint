#!/usr/bin/env python3
"""
UI/UX Pro Max — Design Intelligence Search Tool
Usage: python3 search.py "<query>" [--domain <domain>] [--design-system] [--stack <stack>]
                                    [--persist] [--page <page>] [-p <project>]
                                    [-f ascii|markdown] [-n <max_results>]
"""

import csv
import argparse
import sys
from pathlib import Path

SKILL_DIR = Path(__file__).parent.parent
DATA_DIR = SKILL_DIR / "data"

DOMAIN_TO_FILE = {
    "product":      "products.csv",
    "style":        "styles.csv",
    "color":        "colors.csv",
    "typography":   "typography.csv",
    "landing":      "landing.csv",
    "chart":        "charts.csv",
    "ux":           "ux-rules.csv",
    "google-fonts": "google-fonts.csv",
    "react":        "react-rules.csv",
    "web":          "web-rules.csv",
    "prompt":       "prompts.csv",
}

STACK_TO_FILE = {
    "react-native": "react-native.csv",
}

DESIGN_SYSTEM_DOMAINS = ["product", "style", "color", "typography"]


# ── Data loading ─────────────────────────────────────────────────────────────

def load_csv(path: Path) -> list:
    if not path.exists():
        print(f"[warn] Data file not found: {path}", file=sys.stderr)
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def score_row(row: dict, keywords: list) -> int:
    text = " ".join(str(v) for v in row.values()).lower()
    return sum(1 for kw in keywords if kw in text)


def search_domain(domain: str, keywords: list, max_results: int = 5) -> list:
    filename = DOMAIN_TO_FILE.get(domain)
    if not filename:
        return []
    rows = load_csv(DATA_DIR / filename)
    scored = [(score_row(r, keywords), r) for r in rows]
    scored = [(s, r) for s, r in scored if s > 0]
    scored.sort(key=lambda x: -x[0])
    return [r for _, r in scored[:max_results]]


def best_match(domain: str, keywords: list) -> dict:
    results = search_domain(domain, keywords, 1)
    return results[0] if results else {}


# ── Formatting ────────────────────────────────────────────────────────────────

def _row_lines(row: dict, indent: int = 2) -> list:
    pad = " " * indent
    return [f"{pad}{k}: {v}" for k, v in row.items() if v and v.strip()]


def format_ascii(title: str, rows: list) -> str:
    w = 64
    bar = "─" * w
    lines = [f"┌{bar}┐", f"│ {title:<{w - 1}}│", f"├{bar}┤"]
    for i, row in enumerate(rows):
        if i > 0:
            lines.append(f"├{bar}┤")
        name = row.get("name") or row.get("type") or row.get("rule_name") or "—"
        lines.append(f"│  ▸ {name:<{w - 4}}│")
        for line in _row_lines(row, 4):
            # Truncate long lines to fit box
            content = line[:w - 2]
            lines.append(f"│{content:<{w}}│")
    lines.append(f"└{bar}┘")
    return "\n".join(lines)


def format_markdown_section(title: str, rows: list) -> str:
    lines = [f"## {title}\n"]
    for row in rows:
        name = row.get("name") or row.get("type") or row.get("rule_name") or "Result"
        lines.append(f"### {name}\n")
        for k, v in row.items():
            if v and v.strip() and k not in ("name", "type", "rule_name"):
                lines.append(f"- **{k}**: {v}")
        lines.append("")
    return "\n".join(lines)


# ── Design system generation ──────────────────────────────────────────────────

def generate_design_system(query: str, project_name: str, fmt: str) -> str:
    keywords = [kw.strip().lower() for kw in query.split()]

    # Load reasoning rules for cross-domain override
    reasoning_rows = load_csv(DATA_DIR / "ui-reasoning.csv")
    best_reason = max(
        reasoning_rows,
        key=lambda r: score_row(r, keywords),
        default={}
    ) if reasoning_rows else {}
    best_reason_score = score_row(best_reason, keywords) if best_reason else 0

    sections: dict = {}

    # Product pattern
    product = best_match("product", keywords)
    sections["Product Pattern"] = product

    # Style (allow reasoning override)
    style_keywords = keywords
    if best_reason_score > 0 and best_reason.get("style_match"):
        style_keywords = best_reason["style_match"].lower().split() + keywords
    style = best_match("style", style_keywords)
    sections["Recommended Style"] = style

    # Color palette (allow reasoning override)
    color_keywords = keywords
    if best_reason_score > 0 and best_reason.get("color_match"):
        color_keywords = best_reason["color_match"].lower().split() + keywords
    color = best_match("color", color_keywords)
    sections["Color Palette"] = color

    # Typography
    typography = best_match("typography", keywords)
    sections["Typography"] = typography

    # Anti-patterns from reasoning
    anti = best_reason.get("anti_patterns", "") if best_reason else ""
    nav = best_reason.get("nav_pattern", product.get("nav_pattern", "")) if best_reason_score > 0 else product.get("nav_pattern", "")
    ux_focus = best_reason.get("ux_focus", product.get("ux_focus", "")) if best_reason_score > 0 else product.get("ux_focus", "")

    # Build output
    label = f"Design System: {project_name}" if project_name else "Design System"
    result_lines: list = []

    if fmt == "markdown":
        result_lines.append(f"# {label}\n")
        result_lines.append(f"> Query: _{query}_\n")
        if nav:
            result_lines.append(f"**Recommended nav pattern:** {nav}\n")
        if ux_focus:
            result_lines.append(f"**UX focus:** {ux_focus}\n")
        if anti:
            result_lines.append(f"**Anti-patterns to avoid:** {anti}\n")
        result_lines.append("")
        for section_name, data in sections.items():
            result_lines.append(format_markdown_section(section_name, [data] if data else []))
    else:
        w = 64
        bar = "═" * w
        result_lines.append(f"\n╔{bar}╗")
        result_lines.append(f"║  {label:<{w - 2}}║")
        result_lines.append(f"║  Query: {query:<{w - 9}}║")
        result_lines.append(f"╚{bar}╝")
        if nav:
            result_lines.append(f"\n  Nav pattern  : {nav}")
        if ux_focus:
            result_lines.append(f"  UX focus     : {ux_focus}")
        if anti:
            result_lines.append(f"  Avoid        : {anti}")
        for section_name, data in sections.items():
            result_lines.append(f"\n{'─' * 66}")
            result_lines.append(f"  {section_name}")
            result_lines.append(f"{'─' * 66}")
            if data:
                for line in _row_lines(data, 4):
                    result_lines.append(line)
            else:
                result_lines.append("    (no match — try different keywords)")
        result_lines.append("")

    return "\n".join(result_lines)


def persist_design_system(content: str, project_name: str, page: str) -> None:
    ds_dir = Path("design-system")
    if page:
        target_dir = ds_dir / "pages"
        target_dir.mkdir(parents=True, exist_ok=True)
        target = target_dir / f"{page.lower().replace(' ', '-')}.md"
    else:
        ds_dir.mkdir(parents=True, exist_ok=True)
        target = ds_dir / "MASTER.md"

    with open(target, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"\n✓ Saved to {target}")


# ── Stack search ──────────────────────────────────────────────────────────────

def search_stack(stack: str, keywords: list, max_results: int, fmt: str) -> None:
    filename = STACK_TO_FILE.get(stack)
    if not filename:
        print(f"[error] Unknown stack '{stack}'. Available: {', '.join(STACK_TO_FILE)}", file=sys.stderr)
        sys.exit(1)

    rows = load_csv(DATA_DIR / filename)
    scored = sorted(
        [(score_row(r, keywords), r) for r in rows if score_row(r, keywords) > 0],
        key=lambda x: -x[0]
    )
    results = [r for _, r in scored[:max_results]]

    if not results:
        print(f"No results for query in stack '{stack}'")
        return

    if fmt == "markdown":
        print(format_markdown_section(f"Stack: {stack}", results))
    else:
        print(format_ascii(f"Stack: {stack}", results))


# ── Domain search ─────────────────────────────────────────────────────────────

def search_and_print(query: str, domain: str, max_results: int, fmt: str) -> None:
    keywords = [kw.strip().lower() for kw in query.split()]
    results = search_domain(domain, keywords, max_results)

    if not results:
        print(f"No results for '{query}' in domain '{domain}'.")
        print(f"  Data file: {DATA_DIR / DOMAIN_TO_FILE.get(domain, '?')}")
        return

    if fmt == "markdown":
        print(format_markdown_section(f"{domain} | {query}", results))
    else:
        print(format_ascii(f"{domain} | {query}", results))


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="UI/UX Pro Max — Design Intelligence Search Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("query", help="Keywords describing the product or feature")
    parser.add_argument(
        "--domain", "-d",
        help="Domain to search: " + " | ".join(DOMAIN_TO_FILE),
    )
    parser.add_argument(
        "--design-system", action="store_true",
        help="Generate full design system (product + style + color + typography)",
    )
    parser.add_argument(
        "--stack", "-s",
        help="Stack-specific guidelines: " + " | ".join(STACK_TO_FILE),
    )
    parser.add_argument(
        "--persist", action="store_true",
        help="Save design system output to design-system/MASTER.md (or pages/<page>.md)",
    )
    parser.add_argument("--page", default="", help="Page name for design-system/pages/<page>.md override")
    parser.add_argument("-p", "--project", default="", help="Project name (used in design system header)")
    parser.add_argument("-f", "--format", default="ascii", choices=["ascii", "markdown"], help="Output format")
    parser.add_argument("-n", "--max-results", type=int, default=5, help="Max results per domain")

    args = parser.parse_args()
    keywords = [kw.strip().lower() for kw in args.query.split()]

    if args.design_system:
        output = generate_design_system(args.query, args.project, args.format)
        print(output)
        if args.persist:
            persist_design_system(output, args.project, args.page)

    elif args.stack:
        search_stack(args.stack, keywords, args.max_results, args.format)

    elif args.domain:
        search_and_print(args.query, args.domain, args.max_results, args.format)

    else:
        # Broad search across all domains
        print(f"\nSearching all domains for: {args.query}\n")
        found_any = False
        for domain in DOMAIN_TO_FILE:
            results = search_domain(domain, keywords, 2)
            if results:
                found_any = True
                names = [
                    r.get("name") or r.get("type") or r.get("rule_name") or "—"
                    for r in results
                ]
                print(f"  [{domain}]")
                for n in names:
                    print(f"    • {n}")
        if not found_any:
            print("No results found. Try different keywords.")


if __name__ == "__main__":
    main()
