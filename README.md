# Concert Diary

This is a [React Router](https://reactrouter.com/start/modes#framework) application that serves as a personal diary for concert and festival experiences. 

## Development

Install dependencies:

```sh
pnpm install
```

Create a `.env` file in the root directory and add any necessary environment variables.

```shell
cp .env.example .env
```

Start the development server:

```sh
pnpm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
pnpm run build
```

Then run the app in production mode:

```sh
pnpm start
```
