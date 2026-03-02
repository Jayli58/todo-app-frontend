## Todo List

Todo List is a fast, mobile-friendly task manager built with Next.js (React) App Router, MUI + Tailwind UI styling, Cognito authentication, and email reminders to keep work on track.

<table>
  <tr>
    <td><img src="./docs/todo-app-screenshot-1.png" alt="Todo app screenshot" width="320" /></td>
    <td><img src="./docs/todo-app-screenshot-2.png" alt="Todo reminder screenshot" width="320" /></td>
  </tr>
</table>

### TL;DR

![Architecture](./docs/todo-arch-layout.svg)

### Repo contents

- `app/`: Next.js App Router routes, layouts, and UI.
- `app/config/`: Cognito auth and pagination configuration.
- `docs/`: Architecture sketch and screenshots used by the README.
- `.github/workflows/deploy.yml`: CI build + deployment (syncs `out/` to S3, then invalidates CloudFront).
- `public/`: Static assets served by Next.js.

### Tech stack

- Next.js (React) App Router
- MUI + Tailwind CSS
- AWS Cognito authentication
- Email reminders
- Jest tests

## Features

- Add, complete, search, and remove todos
- Cognito-based authentication
- Email reminders
- Mobile-friendly layout

## Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run lint checks

## Testing

Unit tests use Jest and live under `__test__`. Run them with:

```bash
npm run test
```

## Environment Variables

Create a `.env.local` file based on `.env.local.example`.

- `NEXT_PUBLIC_AWS_COGNITO_REGION` - AWS region for Cognito
- `NEXT_PUBLIC_AWS_COGNITO_POOL_ID` - Cognito user pool ID
- `NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID` - Cognito app client ID
- `NEXT_PUBLIC_BASE_URL` - backend base URL
- `NEXT_PUBLIC_FRONTEND_URL` - frontend base URL

## Deployment

Deployment is handled via a CDK project targeting S3 + CloudFront. The infrastructure repo lives at [todo-app-infra](https://github.com/Jayli58/todo-app-infra). Run `npm run build` to produce the latest frontend artifact consumed by the pipeline.
