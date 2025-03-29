# Pokedex Monorepo

Ce monorepo contient tous les projets liés à l'application Pokedex.

## Structure

- `apps/` - Applications complètes
  - `backend/` - API NestJS pour le Pokedex
- `packages/` - Bibliothèques partagées

## Installation

```bash
pnpm install
```

## Développement

Pour démarrer le développement sur l'application backend :

```bash
pnpm start:dev
```

## Tests

Pour exécuter les tests sur tous les projets :

```bash
pnpm test
```

Pour exécuter les tests sur un projet spécifique :

```bash
pnpm --filter backend test
```

## Construction

Pour construire tous les projets :

```bash
pnpm build
```

Pour construire un projet spécifique :

```bash
pnpm --filter backend build
```
