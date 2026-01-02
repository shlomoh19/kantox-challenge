# Kantox Challenge – Implementation

## Overview

This project implements a containerized, microservices-based application deployed on Kubernetes, with infrastructure provisioned using Terraform and a GitOps-based CI/CD workflow using GitHub Actions and Argo CD.

The solution demonstrates:

* Infrastructure as Code (IaC)
* Secure configuration management
* Containerized microservices
* Automated CI/CD pipelines
* GitOps deployment principles
* Kubernetes self-healing and scalability

---

## Terraform Infrastructure

The Terraform configuration is organized into three modules: **S3**, **SSM**, and **IAM**, each responsible for a single infrastructure concern.

```
terraform/
├── main.tf          # Root configuration composing all modules
├── variables.tf     # Input variable definitions
├── terraform.tfvars # Environment-specific values
└── modules/
    ├── s3/          # S3 bucket provisioning and security configuration
    ├── ssm/         # SSM Parameter Store configuration
    └── iam/         # IAM roles and policies
```

This structure enforces separation of concerns and enables reuse across environments.

---

### Module: S3

**Purpose**
Provision a production-ready S3 bucket with baseline security controls enabled by default.

**Design Rationale**
S3 bucket configuration in Terraform is split across multiple resources. This module explicitly defines versioning, encryption, and public access controls as separate resources to ensure security settings are declarative, visible, and independently managed.

**Resources**

* **aws_s3_bucket**
  Core storage resource used by the application.

* **aws_s3_bucket_versioning**
  Enables versioning to protect against accidental overwrites or deletions.

* **aws_s3_bucket_server_side_encryption_configuration**
  Enforces encryption at rest using SSE-S3 (AES256). This avoids KMS operational overhead while still ensuring encrypted storage, which is sufficient for the scope of this challenge.

* **aws_s3_bucket_public_access_block**
  Blocks all forms of public access to prevent accidental data exposure. All four block options are enabled.

**Variables**

* **bucket_name** – Externalized to support environment-specific buckets (e.g. dev, staging, prod).
* **environment** – Used for tagging and resource organization.

---

### Module: SSM

**Purpose**
Centralized storage for application configuration such as database URLs, API keys, and feature flags.

**Design Rationale**
Configuration is stored externally to avoid hardcoding values in application code and to allow updates without redeployment.

**Resources**

* **aws_ssm_parameter (for_each)**
  Uses a map-based `for_each` approach to create multiple parameters in a consistent and scalable manner.

**Variables**

* **parameters** – Map defining all parameters to be created.
* **environment** – Used for tagging and organization.

---

### Module: IAM

**Purpose**
Define service identity and enforce least-privilege access to AWS resources.

**Resources**

* **aws_iam_role**
  Provides an identity that services can assume to obtain temporary AWS credentials via STS, avoiding hard-coded access keys.

* **aws_iam_role_policy (S3)**
  Grants read-only permissions to list S3 buckets.

* **aws_iam_role_policy (SSM)**
  Grants read-only access to SSM parameters. Write and delete permissions are intentionally excluded.

**Variables**

* **role_name** – Environment-specific role naming.
* **environment** – Used for tagging and tracking.

---

## CI/CD – GitHub Actions + GitOps

The CI/CD pipeline automates image building and deployment using GitHub Actions and Argo CD.

### Workflow Overview

**Flow**
Push to `main` → Build images → Push to Docker Hub → Update manifests → Argo CD syncs cluster

**Trigger Configuration**

* Runs on push to `main`
* Only when files in `services/` or `k8s/` change
* Prevents unnecessary rebuilds

### Pipeline Steps

1. Checkout repository
2. Set up Docker Buildx
3. Authenticate to Docker Hub (credentials stored in GitHub Secrets)
4. Build and push Docker images for both services

   * Images are tagged with:

     * `github.sha` for immutable version tracking
     * `latest` for convenience
5. Update Kubernetes manifests with the new image SHA
6. Commit updated manifests back to Git to trigger Argo CD

**Design Rationale**

* SHA-based tagging ensures traceability
* Git remains the single source of truth
* Deployment responsibility is delegated to Argo CD

---

## Kubernetes Deployment

### Local Environment Setup

**Requirements**

* Docker Desktop
* kind
* kubectl
* Terraform
* AWS CLI
* Node.js 18+
* Git

---

### Part 1: Cluster and Application Deployment

**Create Kubernetes Cluster**

```bash
kind create cluster --name kantox-learning
kubectl get nodes
```

**Provision AWS Infrastructure**

```bash
cd terraform
terraform init
terraform apply
```

This provisions:

* S3 bucket
* SSM parameters
* IAM role and policies

**Build Docker Images**

```bash
docker build -t auxiliary-service:1.0.0 services/auxiliary-service
docker build -t main-api:1.0.0 services/main-api
```

**Load Images into kind**

```bash
kind load docker-image auxiliary-service:1.0.0 --name kantox-learning
kind load docker-image main-api:1.0.0 --name kantox-learning
```

**Deploy Kubernetes Resources**

```bash
kubectl create namespace auxiliary-service
kubectl create namespace main-api
kubectl apply -f k8s/auxiliary-service/
kubectl apply -f k8s/main-api/
```

---

### Part 2: Argo CD Installation and Configuration

```bash
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Applications are registered via Kubernetes manifests. Argo CD continuously keeps in sync cluster state with Git.

---

### Part 3: Verification

* Pod health and readiness
* Service endpoints
* Argo CD application status
* End-to-end API testing
* Kubernetes self-healing
* GitOps synchronization behavior

---

## API Endpoints

### Main API

* `GET /health`
* `GET /api/buckets`
* `GET /api/parameters`
* `GET /version`

All `/api/*` endpoints combine version information from both services.

### Auxiliary Service

* `GET /aws/buckets`
* `GET /aws/parameters`
