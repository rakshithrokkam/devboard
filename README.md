# DevBoard

DevBoard is a real-time developer job board built specifically for developers, where companies can post openings and candidates can browse, filter by tech stack or role, and get instant notifications. 

What makes DevBoard different from a typical MERN CRUD project is everything around the app itself — the entire deployment pipeline is production-grade. The infrastructure is intentionally the centerpiece of the project, highlighting a full DevOps lifecycle.

## Tech Stack & Architecture

- **Frontend:** React (Vite-based) with modern Glassmorphism, vanilla CSS styling.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Real-Time Alerts:** Socket.io handles instant notifications for matching stack/role filters.
- **DevOps & Infrastructure:**
  - **Docker Compose:** Multi-container orchestration isolating React, Node API, and MongoDB components.
  - **Nginx Reverse Proxy:** Routes all incoming traffic optimally on Port 80 to respective backend API and frontend static build services.
  - **CI/CD:** Automated GitHub Actions pipeline configured for testing (Jest & Supertest), Docker image builds/pushes to **AWS ECR**, and zero-downtime SSH deployment to **AWS EC2**.

## Getting Started

To run the full stack locally:

1. Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop) is installed and running on your machine.
2. Clone the repository and navigate into the project root:
   ```bash
   cd DevBoard
   ```
3. Boot up the full multi-container application:
   ```bash
   docker-compose up --build -d
   ```
4. Open your browser and navigate to `http://localhost`.

## Project Features

- **Job Listings CRUD:** Post, edit, delete, and view developer jobs dynamically. Filtering by Role and Tech Stack.
- **Real-time Live Alerts:** When a candidate filters by a specific tech stack (e.g., "React, Node"), they are dynamically subscribed via `socket.io`. If a company posts a job matching those filters, an instant toast notification slides into the UI!
- **Zero-Config DevOps Setup:** A fully functional `deploy.yml` CI/CD file combined with Dockerization showcases absolute DevOps competence.

## Resume Highlights (Ready to Copy-Paste)

- Built DevBoard, a real-time developer job board on MERN stack with Socket.io live notifications, containerised using Docker Compose with separate React, Node, and MongoDB services behind an Nginx reverse proxy
- Implemented a complete CI/CD pipeline with GitHub Actions — automated tests (Jest + Supertest) on every PR, Docker image build and push to AWS ECR, and zero-downtime deploy to EC2 via SSH
- Managed production secrets using GitHub Actions encrypted secrets and AWS Systems Manager Parameter Store; app live at custom domain with HTTPS via Let's Encrypt
