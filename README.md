# Trainer Management App

A full-stack serverless trainer management application built with React and AWS.

## Live Demo

https://main.d1ta3qxnastzr0.amplifyapp.com

---

# Features

## Client Management
- Create clients
- Edit clients
- Delete clients
- Search clients
- Client status tracking

## Appointment Management
- Create appointments
- Edit appointments
- Delete appointments
- Appointment validation
- Overlap prevention
- Date and time validation
- Status tracking

## Dashboard
- Total clients
- Active clients
- Today’s appointments
- Upcoming appointments

## Authentication & Security
- Amazon Cognito authentication
- Protected API Gateway routes
- JWT authorization
- Secure serverless backend

---

# Tech Stack

## Frontend
- React
- Vite
- AWS Amplify Hosting

## Backend
- AWS Lambda
- Amazon API Gateway

## Database
- Amazon DynamoDB

## Authentication
- Amazon Cognito

## DevOps
- GitHub
- CI/CD with Amplify

---

# Architecture

```text
React Frontend
↓
AWS Amplify Hosting
↓
API Gateway (JWT Protected)
↓
AWS Lambda
↓
DynamoDB
```

---

# AWS Services Used

- AWS Amplify Hosting
- Amazon Cognito
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon CloudWatch

---

# Security

- Cognito authentication
- Protected API endpoints
- JWT token validation
- CORS configuration
- Environment variables for configuration

---

# Local Development

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

## Build production version

```bash
npm run build
```

---

# Environment Variables

Create a `.env` file:

```env
VITE_API_URL=your_api_url
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_APP_CLIENT_ID=your_app_client_id
```

---

# Future Improvements

- Google Calendar integration
- Mobile responsive improvements
- Push notifications
- Trainer notes
- Workout plans
- Analytics dashboard
- Multi-trainer support

---

# Deployment

The frontend is deployed using AWS Amplify Hosting with automatic CI/CD deployments from GitHub.

---

# Author

Costin Nitu