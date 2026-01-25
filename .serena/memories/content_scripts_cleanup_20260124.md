[Type: Decision]
[Context: Project: top-heroes-companion | Scripts cleanup]
[Summary: Root Python scripts reorganized; content updates consolidated into a single CLI.]
[Details:
- New CLI: scripts/content/update_content.py (flags: --heroes-json, --guides, --fandom, --all; delay configurable).
- npm script added: package.json -> content:update runs python3 scripts/content/update_content.py --all.
- Script folders: scripts/content (prod), scripts/debug, scripts/inspect, scripts/legacy.
- Requests added to pyproject.toml dependencies.
- docs: scripts/README.md, README content updates mention npm run content:update.
- Legacy pipeline preserved in scripts/legacy (docs-based, not used by app).
]
[References: scripts/content/update_content.py, scripts/README.md, package.json, pyproject.toml, README.md]