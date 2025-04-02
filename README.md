# Pokedex Monorepo

Ce monorepo contient tous les projets liés à l'application Pokedex.

## Structure

- `apps/` - Applications complètes
  - `backend/` - API NestJS pour le Pokedex
  - `frontend/` - Application React pour le Pokedex
- `packages/` - Bibliothèques partagées
  - `types/` - Types partagés entre les applications

## Fonctionnalités

- Recherche de Pokémon par nom ou ID
- Affichage des détails des Pokémon (stats, types, évolutions, etc.)
- Localisation en français et anglais
- Interface responsive

## Installation

```bash
# Suppression du fichier de lock si sur un OS autre que Windows
rm -rf node_modules
# Installation des dépendances
pnpm install
```

## Développement

```bash
# Démarrer le backend en mode développement
pnpm start:dev:backend

# Démarrer le frontend en mode développement
pnpm start:dev:frontend
```

## Tests

```bash
# Exécuter les tests unitaires sur tous les projets
pnpm test

# Exécuter les tests sur un projet spécifique
pnpm --filter backend test
```

## Technologies utilisées

- **Backend**: NestJS, TypeScript
- **Frontend**: React, TypeScript, Vite, Redux Toolkit
- **Tests**: Jest, Vitest
- **Styles**: Styled Components
- **Localisation**: i18next
