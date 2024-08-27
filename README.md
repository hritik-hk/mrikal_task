# shrinkly - shrink your URLs

## Overview

This project is a backend API for a URL shortener service with advanced features including:
- **URL Shortening** with custom short codes
- **Analytics** for tracking visits
- **Caching** for optimizing performance
- **API Rate Limiting** to prevent abuse
- **Background Jobs** for updating and maintaing Analytics

The API is designed to be robust, scalable, and easy to integrate with other services.

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Redis Caching](#redis-caching)
- [API Rate Limiting](#api-rate-limiting)
- [Background Workers](#background-workers)

### Getting Started
#### Prerequisites

- Node.js and npm
- MongoDB
- Redis (for caching and queue)
- bullmq (for queues and background workers)

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hritik-hk/shrinkly.git
   cd shrinkly
   ```
2. Install dependencies:
```bash
  npm install
```
3. Set up environment variables in a .env file:
```
DB_URL=<your-mongodb-uri>
REDIS_URL=<your-redis-url>
PORT=8080
```

### API Endpoints
#### POST /random
Request body:
```
{
  "originalUrl": "https://example.com",
}
 ```
#### POST /custom
Request body:
```
{
  "originalUrl": "https://example.com",
  "customCode": "mycodex", 
}
 ```
#### GET /:shortCode
Redirect to the original URL and track analytics.
Response:
-302 Redirect to the original URL
-404 if the URL does not exist

#### GET /analytics/:shortCode
Response:
```
{
 "deviceTypes": {
    "desktop": number,
    "mobile": number
  },
shortCode": string,
  "originalUrl":  string,
  "totalVisits": number,
  "uniqueVisits": number,
  "visitHistory": {"clientIp":string, "timeStamp":datetime, "userAgent":string}[]
}
```
### Redis Caching
- caches frequency used results in memory redis database/store

### API Rate Limiting
- API rate limiting on basis of requested URL and IP address
- used redis to maintain request count and TTL

### Background Workers
- processes jobs/updates from queue and updates database asynchronously
- implemented using bullmq

