# immo-scan

High level infrastructure for the immo-scan project.

## Structure

```
immo-scan/
│
├── apps/
│   ├── scraper/            # Main scraper application
│   ├── backend-api/        # Backend API service (v2)
│   └── frontend/           # Frontend application (MVP optional)
│
├── packages/
│   ├── shared/             # Shared code and utilities
│   ├── config/             # Shared configuration
│   └── integrations/       # External service integrations
│
├── infra/                  # Infrastructure configuration
│
├── tests/                  # End-to-end and integration tests
│
├── .env.example            # Example environment variables
├── docker-compose.yml      # Docker composition for development
└── README.md               # This file
```

## Getting Started

1. Copy `.env.example` to `.env`.
2. Configure your environment variables.
3. Run `docker-compose up` to start services.
