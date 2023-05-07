# Cadmus Graph Studio

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.7.

This is a minimalist editor for helping users build their graph mapping rules.

- [library overview](./projects/myrmidon/cadmus-mapping-builder/README.md)
- 👉 [documentation](https://myrmex.github.io/overview/cadmus/graph-studio/graph-studio/)

🐋 Docker:

1. `npm run build-lib`;
2. update [env.js](./src/env.js) version number;
3. `ng build`;
4. build image like (change version number accordingly):

```bash
docker build . -t vedph2020/cadmus-graph-studio-app:0.0.1 -t vedph2020/cadmus-graph-studio-app:latest
```
