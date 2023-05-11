# Cadmus Graph Studio

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.7.

This is a minimalist editor for helping users build their graph mapping rules.

- [library overview](./projects/myrmidon/cadmus-mapping-builder/README.md)
- 👉 [documentation](https://myrmex.github.io/overview/cadmus/graph-studio/graph-studio/)

🐋 Docker:

1. `npm run build-lib`;
2. update [env.js](./src/env.js) version number and version numbers in [docker compose](docker-compose.yml);
3. `ng build`;
4. build image like (change version number accordingly):

```bash
docker build . -t vedph2020/cadmus-graph-studio-app:0.0.4 -t vedph2020/cadmus-graph-studio-app:latest
```

## History

- 2023-05-11:
  - updated Angular and packages.
  - fix to node to string in output.

### 0.0.4

- 2023-05-10: fixes to node parsing for labels.

### 0.0.3

- 2023-05-09: refactored import/export.

### 0.0.2

- 2023-05-09:
  - fixes to triples serialization for object literals.
  - improved sample presets.
  - more details in object literal output.
- 2023-05-08: upgraded to Angular 16.

### 0.0.1

- 2023-05-07: initial release.
