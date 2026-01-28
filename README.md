# Three-Tier Application Deployment on AWS EKS (ECR + ALB)

This project demonstrates a complete **Three-Tier Web Application Deployment** on AWS using:

- **Frontend:** React JS  
- **Backend:** Node.js (Express API)  
- **Database:** MongoDB  
- **Containerization:** Docker  
- **Container Registry:** Amazon ECR  
- **Orchestration:** Amazon EKS  
- **Ingress & Load Balancer:** AWS Load Balancer Controller + ALB  

---

## Architecture Diagram

```
 GitHub Repo
     |
     v
+-------------------+
|  React Frontend   |
+-------------------+
        |
        v
+-------------------+
| Node.js Backend   |
+-------------------+
        |
        v
+-------------------+
|   MongoDB DB      |
+-------------------+

 Docker Build Images
        |
        v
   Push to AWS ECR
        |
        v
+-----------------------------+
|        AWS EKS Cluster      |
|  Frontend Pod + Service     |
|  Backend Pod + Service      |
|  MongoDB Pod + Service      |
+-----------------------------+
        |
        v
  AWS ALB Ingress Controller
        |
        v
     Public URL Access
```

---

# Step-by-Step Deployment Guide

---

## 1. Clone Repository

```bash
git clone https://github.com/adminstrartor/three-tier-app-k8s-ecr-alb.git
cd three-tier-app-k8s-ecr-alb
```

---

## 2. Build Docker Images

### Frontend Image

```bash
cd frontend
docker build -t three-tier-frontend .
```

### Backend Image

```bash
cd ../backend
docker build -t three-tier-backend .
```

---

## 3. Create Amazon ECR Repositories

```bash
aws ecr create-repository --repository-name three-tier-frontend
aws ecr create-repository --repository-name three-tier-backend
```

---

## 4. Authenticate Docker with ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

---

## 5. Tag and Push Images to ECR

### Frontend Push

```bash
docker tag three-tier-frontend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/three-tier-frontend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/three-tier-frontend:latest
```

### Backend Push

```bash
docker tag three-tier-backend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/three-tier-backend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/three-tier-backend:latest
```

---

## 6. Create EKS Cluster (eksctl + kubectl)

### Install kubectl (Kubernetes CLI)

```bash
curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.29.0/2024-01-04/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

Verify kubectl:

```bash
kubectl version --client
```

---

### Install eksctl (EKS Cluster Management Tool)

```bash
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_Linux_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```

Verify eksctl:

```bash
eksctl version
```

---

### Create EKS Cluster

```bash
eksctl create cluster --name three-tier-cluster --region us-east-1 --nodegroup-name standard-workers --node-type t3.medium --nodes 2 --managed
```

 Cluster creation takes around **1520 minutes**.

---

### Update kubeconfig (Connect kubectl to EKS Cluster)

```bash
aws eks update-kubeconfig --region us-east-1 --name three-tier-cluster
```

---

### Check Worker Nodes

```bash
kubectl get nodes
```

---

### Useful Debug Commands

```bash
kubectl get pods -A
kubectl logs <pod-name> -n three-tier
kubectl describe pod <pod-name> -n three-tier
kubectl rollout restart deployment backend -n three-tier
```

---



Install eksctl:

```bash
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```

Create Cluster:

```bash
eksctl create cluster --name three-tier-cluster --region us-east-1 --nodegroup-name standard-workers --node-type t3.medium --nodes 2 --managed
```

Check Nodes:

```bash
kubectl get nodes
```

---

## 7. Deploy Kubernetes Manifests

### Create Namespace

```bash
kubectl apply -f k8s-manifests/namespace.yaml
```

### Deploy MongoDB

```bash
kubectl apply -f k8s-manifests/mongo.yaml
```

### Deploy Backend

```bash
kubectl apply -f k8s-manifests/backend.yaml
```

### Deploy Frontend

```bash
kubectl apply -f k8s-manifests/frontend.yaml
```

Verify Pods:

```bash
kubectl get pods -n three-tier
```

---

## 8. Install AWS Load Balancer Controller

### Create IAM Policy

```bash
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json
```

### Associate OIDC Provider

```bash
eksctl utils associate-iam-oidc-provider --region us-east-1 --cluster three-tier-cluster --approve
```

### Create Service Account

```bash
eksctl create iamserviceaccount --cluster three-tier-cluster --namespace kube-system --name aws-load-balancer-controller --attach-policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy --approve
```

---

## 9. Install Helm and Controller

Install Helm:

```bash
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Add Repo:

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
```

Install Controller:

```bash
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=three-tier-cluster --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller
```

Verify:

```bash
kubectl get pods -n kube-system | grep load-balancer
```

---

## 10. Create ALB Ingress

Apply ingress:

```bash
kubectl apply -f ingress.yaml
```

Get ALB URL:

```bash
kubectl get ingress -n three-tier
```

---

## 11. Test Application

Frontend:

```
http://<ALB-DNS>
```

Backend Health API:

```
http://<ALB-DNS>/api/health
```

---

# GitHub Push Commands (After Changes)

```bash
git add .
git commit -m "Added EKS deployment manifests and fixed backend/frontend"
git pull --rebase origin main
git push origin main
```
---

# Author

**Ashwini Nagare**  
AWS DevOps Engineer  

