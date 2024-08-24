# shrinkly - shrink your URLs

## Overview

This project is a backend API for a URL shortener service with advanced features including:
- **URL Shortening** with custom short codes
- **Analytics** for tracking visits
- **Background Jobs** for updating and maintaing Analytics

The API is designed to be robust, scalable, and easy to integrate with other services.

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Request & Response Formats](#request--response-formats)
- [Database Schema](#database-schema)
- [Background Jobs](#background-jobs)

### Prerequisites

- Node.js and npm
- MongoDB
- Redis (for caching and )
- bullmq (for queues and background workers)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```
2. Install dependencies:
```bash
  npm install
```

### API Endpoints
#### POST /url/random
##### Request body:
```
{
  "originalUrl": "https://example.com",
}
 ```
#### POST /url/custom
##### Request body:
```
{
  "originalUrl": "https://example.com",
  "customCode": "my-code",       // Optional
}
 ```
#### GET /url/:shortcode
