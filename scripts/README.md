# Scripts

## Content updates

Run all content updates:

```bash
python3 scripts/content/update_content.py --all
```

Individual updates:

```bash
python3 scripts/content/update_content.py --heroes-json
python3 scripts/content/update_content.py --guides
python3 scripts/content/update_content.py --fandom
```

## Folders

- `scripts/content`: production update scripts
- `scripts/debug`: temporary scraping experiments
- `scripts/inspect`: local HTML inspection helpers
- `scripts/legacy`: older docs-based pipeline (not used by app)
