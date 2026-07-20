#!/usr/bin/env bash

set -euo pipefail

echo "========================================================="
echo "Standardizing Kubernetes & Developer Tooling on Ubuntu"
echo "========================================================="

# 1. Update and install basic dependencies
echo "--> Updating system packages..."
sudo apt-get update -y
sudo apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git

# 2. Install Docker Engine
echo "--> Installing Docker Engine..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Configure Docker permissions for current user (avoid running docker with sudo)
echo "--> Configuring Docker permissions..."
if ! getent group docker > /dev/null; then
  sudo groupadd docker
fi
sudo usermod -aG docker "$USER"

# 3. Install kubectl
echo "--> Installing kubectl..."
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg --yes
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y kubectl

# 4. Install Minikube
echo "--> Installing Minikube..."
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64

# 5. Install Skaffold
echo "--> Installing Skaffold..."
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64
sudo install skaffold /usr/local/bin/skaffold
rm skaffold

echo "========================================================="
echo "Verification of Installed Versions:"
echo "========================================================="
docker --version
docker compose version
kubectl version --client
minikube version
skaffold version
echo "========================================================="
echo "Success! Please log out and log back in (or run 'newgrp docker')"
echo "to apply Docker permissions, then start Minikube:"
echo "  minikube start --driver=docker"
echo "========================================================="
