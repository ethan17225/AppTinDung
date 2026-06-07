# Running App Tín Dụng with Docker

The whole stack (MySQL + ASP.NET Core API + Angular UI) runs with a single command.

## Prerequisites
- Docker Desktop (or Docker Engine + Compose v2)

## Start everything

```bash
docker compose up --build
```

That builds and starts three containers:

| Service    | Container          | URL / Port                          |
|------------|--------------------|-------------------------------------|
| `frontend` | `tindung-frontend` | http://localhost:4200 (Angular/Nginx) |
| `backend`  | `tindung-backend`  | http://localhost:5285 (API + Swagger at `/swagger`) |
| `mysql`    | `tindung-mysql`    | localhost:3307 (host) → 3306 (container) |

Open http://localhost:4200 in the browser. The Nginx container serves the built
Angular app and reverse-proxies `/api/*` to the backend, so there are no CORS issues.

## Stop

```bash
docker compose down
```

To also wipe the database volume:

```bash
docker compose down -v
```

## Configuration
- DB credentials and name can be overridden via a `.env` file (see `.env.example`).
- The backend reads its connection string from the `ConnectionStrings__MySql`
  environment variable defined in `docker-compose.yml`.
- The schema is created automatically on first run (`EnsureCreated`) and the admin
  account is seeded.
