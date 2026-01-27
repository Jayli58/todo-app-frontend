Todo List

Simple, fast todo app built with Next.js and the App Router, featuring MUI + Tailwind styling, Cognito authentication, and email reminders to keep tasks on track across desktop and mobile.

Features
- Add, complete, search, and remove todos
- Cognito-based authentication
- Email reminders
- Mobile-friendly layout

Scripts
- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run lint checks

Testing
Unit tests use Jest and live under `__test__`. Run them with:

```bash
npm run test
```

Environment Variables
Create a `.env.local` file based on `.env.local.example`.
- `NEXT_PUBLIC_AWS_COGNITO_REGION` - AWS region for Cognito
- `NEXT_PUBLIC_AWS_COGNITO_POOL_ID` - Cognito user pool ID
- `NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID` - Cognito app client ID
- `NEXT_PUBLIC_BASE_URL` - backend base URL
- `NEXT_PUBLIC_FRONTEND_URL` - frontend base URL

Deployment
Deployment is handled via a CDK project targeting S3 + CloudFront. Run `npm run build` to produce the latest frontend artifact consumed by the pipeline.
