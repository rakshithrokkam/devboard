<div align="center">
  <img src="https://img.icons8.com/?size=100&id=42721&format=png&color=3B82F6" alt="Logo" width="80" height="80">
  <h1 align="center">DevBoard</h1>
  <p align="center">
    <strong>Real-time developer job board with full production infrastructure.</strong>
    <br />
    <br />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
    <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
  </p>
</div>

<hr />

## 📖 About The Project

DevBoard is a job listing platform built specifically for developers, where companies can post openings and candidates can browse or filter by tech stack and role.

**What makes DevBoard different from a typical MERN CRUD project is everything around the app itself.** The entire deployment pipeline is production-grade. The infrastructure is intentionally the centerpiece of the project, demonstrating a highly scalable architecture that most portfolios completely lack.

### The Problem It Solves
Generic job boards are not tailored to developers — they lack stack-based filtering and real-time alerts. DevBoard addresses this while also serving as a showcase for the full DevOps lifecycle. This domain was deliberately chosen because it is highly relatable to hiring managers evaluating the project.

---

## 🏗️ Architecture & DevOps Infrastructure

This project demonstrates end-to-end DevOps competence atop a MERN application. 

- **Docker Multi-Container Orchestration:** The React UI, Node/Express API, and MongoDB instance operate in completely isolated containers governed by `docker-compose.yml`.
- **Nginx Reverse Proxy:** Traffic on port 80 is intercepted by an Nginx container. Root requests (`/`) are passed to the statically served React frontend container, while HTTP API (`/api`) and WebSocket (`/socket.io`) connections are seamlessly upgraded and passed to the backend API container.
- **Automated CI/CD:** Powered by a robust `.github/workflows/deploy.yml` pipeline:
  1. Triggered on push to `main`.
  2. Runs automated API tests via **Jest** and **Supertest**.
  3. Builds container images and securely authenticates with **Amazon ECR** to push the latest versions.
  4. Deploys with **zero downtime** to an **AWS EC2** instance via automated SSH triggers.
- **Secure Secrets Management:** Leverages GitHub encrypted secrets and AWS Systems Manager Parameter Store.

---

## ⚡ Core Features

- **Job Listings CRUD:** Post, edit, delete, and filter by role, stack, or location through a comprehensive REST API.
- **Real-Time Live Alerts:** Users connected to the frontend immediately receive `socket.io` sliding toast notifications when a newly posted job matches their specific "Tech Stack" or "Role" filters. No page refreshing required.
- **Premium Responsive UI:** High-end, tailored CSS utilizing dark layouts, glassmorphism, and modern typography customized for a tech audience.

---

## 🚀 Quick Start (Local Setup)

To spin up the multi-container application locally, you only need [Docker](https://www.docker.com/products/docker-desktop) installed.

1. **Clone the repo**
   ```bash
   git clone https://github.com/rakshithrokkam/devboard.git
   cd devboard
   ```

2. **Boot the network via Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the Application**
   - The React Frontend and API are collectively abstracted behind Nginx. 
   - Open your browser to `http://localhost`.

---


