[Type: Fix]
[Context: Project: top-heroes-companion | Issue: tsconfig node types]
[Summary: Installed dependencies to resolve missing 'node' type definitions.]
[Details:
- Ran `npm install`, which installed @types/node and other deps.
- `node_modules/@types/node` now present; tsconfig types['node'] should resolve.
]
[References: tsconfig.json, package.json]