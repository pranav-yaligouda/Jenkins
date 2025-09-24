# 🚀 Jenkins CI/CD Learning Project

A comprehensive hands-on project demonstrating **Jenkins Pipeline automation** for building and deploying a **Node.js Express API** using **Docker containers** and **DockerHub registry**.

![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

## 📋 Project Overview

This project implements a **complete CI/CD pipeline** that automatically:
- 📥 **Pulls** source code from GitHub
- 🐳 **Builds** Docker images from Dockerfile
- 🧪 **Tests** containerized application
- 📤 **Pushes** images to DockerHub registry
- 🧹 **Cleans up** resources automatically

## 🏗️ Architecture

```
GitHub Repository → Jenkins Pipeline → Docker Build → Container Test → DockerHub Push
```

## 📁 Project Structure

```
📦 Jenkins-CI-CD-Project/
├── 📄 index.js              # Express.js API server
├── 📄 package.json          # Node.js dependencies
├── 📄 Dockerfile            # Container definition
├── 📄 Jenkinsfile           # CI/CD Pipeline definition
├── 📄 .env                  # Environment variables
├── 📄 .dockerignore         # Docker ignore rules
├── 📁 config/
│   └── 📄 envconfig.js      # Environment configuration
└── 📁 node_modules/         # Dependencies (auto-generated)
```

## 🛠️ Technology Stack

### **Backend:**
- **Node.js** (v22) - JavaScript runtime
- **Express.js** (v5.1.0) - Web framework
- **ES6 Modules** - Modern JavaScript syntax

### **DevOps:**
- **Jenkins** - CI/CD automation server
- **Docker** - Containerization platform
- **DockerHub** - Container registry
- **Git/GitHub** - Version control

### **Configuration:**
- **dotenv** - Environment variable management
- **Alpine Linux** - Lightweight container base

## 🚀 Application Features

### **API Endpoints:**
```javascript
GET /              # Welcome message
GET /health        # Health check endpoint
```

### **Sample Response:**
```json
{
  "message": "Welcome to the Express Server with Jenkins CI/CD"
}
```

### **Health Check:**
```json
{
  "status": "ok",
  "uptime": 123.45
}
```

## 🐳 Docker Implementation

### **Dockerfile Best Practices:**
- ✅ **Multi-layer optimization** - Separate dependency and code layers
- ✅ **Security hardening** - Non-root user (`appuser`)
- ✅ **Minimal base image** - Alpine Linux (lightweight)
- ✅ **Production build** - Uses `npm ci --omit=dev`
- ✅ **Port exposure** - Configurable port (8080)

### **Container Details:**
- **Base Image**: `node:22-alpine`
- **User**: `appuser` (non-root)
- **Port**: `8080`
- **Size**: ~150-200MB

## 🔄 Jenkins Pipeline Stages

### **1. 📥 Checkout Stage**
```groovy
stage('Checkout') {
    steps {
        echo '📥 Checking out source code...'
        checkout scm
    }
}
```
**Purpose**: Clones the latest code from GitHub repository

### **2. 🐳 Build Docker Image Stage**
```groovy
stage('Build Docker Image') {
    steps {
        echo '🐳 Building Docker image...'
        sh "docker build -t pranavyaligouda/express-app-jenkins:${BUILD_NUMBER} ."
    }
}
```
**Purpose**: Creates Docker image using the Dockerfile

### **3. 🧪 Test Container Stage**
```groovy
stage('Test Container') {
    steps {
        script {
            sh "docker run -d --name test-${BUILD_NUMBER} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
            sleep(time: 10, unit: 'SECONDS')
            def containerIP = sh(returnStdout: true, script: "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' test-${BUILD_NUMBER}").trim()
            sh "curl -f http://${containerIP}:8080/ || exit 1"
        }
    }
}
```
**Purpose**: Validates that the container starts and responds correctly

### **4. 📤 Push to DockerHub Stage**
```groovy
stage('Push to DockerHub') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                        usernameVariable: 'DOCKER_USER', 
                                        passwordVariable: 'DOCKER_PASS')]) {
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
            sh "docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
            sh "docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest"
            sh 'docker logout'
        }
    }
}
```
**Purpose**: Uploads the tested image to DockerHub registry

### **5. 🧹 Cleanup Stage**
```groovy
post {
    always {
        sh "docker rmi ${IMAGE_NAME} || true"
    }
}
```
**Purpose**: Removes local images to save disk space

## ⚙️ Environment Configuration

### **Environment Variables:**
```javascript
// .env file
NODE_ENV=development
PORT=8080
```

### **Jenkins Environment:**
```groovy
environment {
    DOCKERHUB_USERNAME = 'pranavyaligouda'
    IMAGE_NAME = 'express-app-jenkins'
    IMAGE_TAG = "${BUILD_NUMBER}"
}
```

## 🎯 Learning Objectives Achieved

### **Jenkins Fundamentals:**
- ✅ **What is Jenkins**: Open-source automation server for CI/CD
- ✅ **Jenkins in CI/CD**: Automated build, test, and deployment pipeline
- ✅ **Pipeline Types**: Declarative vs Scripted pipelines
- ✅ **Jenkinsfile**: Pipeline as Code stored in source control

### **Pipeline Development:**
- ✅ **Stage Organization**: Logical separation of build steps
- ✅ **Error Handling**: Proper cleanup and failure management
- ✅ **Credential Management**: Secure handling of DockerHub credentials
- ✅ **Environment Variables**: Configuration management

### **Common Pipeline Stages:**
1. **Source Code Checkout** - Get latest code
2. **Build** - Compile/package application
3. **Test** - Validate functionality
4. **Security Scan** - Check for vulnerabilities
5. **Deploy** - Push to registry/deploy to environment
6. **Cleanup** - Resource management

### **Declarative vs Scripted Pipelines:**

| Aspect | Declarative | Scripted |
|--------|-------------|----------|
| **Syntax** | YAML-like structure | Groovy script |
| **Learning Curve** | ⭐⭐ Beginner-friendly | ⭐⭐⭐⭐ Advanced |
| **Error Handling** | Built-in validation | Manual implementation |
| **Flexibility** | Structured approach | Full programming power |
| **Best Practice** | ✅ Recommended | Legacy support |

## 🔧 Setup Instructions

### **Prerequisites:**
- ✅ Docker Desktop installed
- ✅ Git installed  
- ✅ DockerHub account
- ✅ Basic understanding of containers

### **1. Clone Repository:**
```bash
git clone https://github.com/pranav-yaligouda/Jenkins.git
cd Jenkins
```

### **2. Start Jenkins with Docker:**
```powershell
# Create Jenkins home directory
mkdir C:\jenkins_home

# Run Jenkins container with Docker access
docker run -d `
  --name jenkins `
  -p 8080:8080 `
  -p 50000:50000 `
  -v C:\jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock `
  jenkins/jenkins:lts
```

### **3. Access Jenkins:**
1. Open: `http://localhost:8080`
2. Get password: `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`
3. Install suggested plugins
4. Create admin user

### **4. Configure DockerHub Credentials:**
1. **Manage Jenkins** → **Manage Credentials**
2. **Add Credentials**:
   - **Kind**: Username with password
   - **ID**: `dockerhub-credentials`
   - **Username**: Your DockerHub username
   - **Password**: Your DockerHub password

### **5. Create Pipeline Job:**
1. **New Item** → **Pipeline**
2. **Pipeline Definition**: Pipeline script from SCM
3. **Repository URL**: `https://github.com/pranav-yaligouda/Jenkins.git`
4. **Branch**: `*/main`
5. **Script Path**: `Jenkinsfile`

### **6. Run Pipeline:**
Click **"Build Now"** and monitor the console output!

## 🧪 Testing the Application

### **Local Development:**
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Test endpoints
curl http://localhost:8080/
curl http://localhost:8080/health
```

### **Docker Testing:**
```bash
# Build image
docker build -t nodejs-express-app .

# Run container
docker run -p 8080:8080 nodejs-express-app

# Test application
curl http://localhost:8080/
```

### **DockerHub Testing:**
```bash
# Pull from registry
docker pull pranavyaligouda/express-app-jenkins:latest

# Run pulled image
docker run -p 8080:8080 pranavyaligouda/express-app-jenkins:latest
```

## 📊 Build Metrics

### **Typical Build Performance:**
- ⏱️ **Build Duration**: 2-5 minutes
- 📦 **Image Size**: 150-200MB
- 🔄 **Pipeline Stages**: 4 main stages
- ✅ **Success Rate**: 95%+ after initial setup

### **Build Artifacts:**
- 🐳 **Docker Image**: `pranavyaligouda/express-app-jenkins:BUILD_NUMBER`
- 🏷️ **Latest Tag**: `pranavyaligouda/express-app-jenkins:latest`
- 📋 **Build Logs**: Available in Jenkins console

## 🔍 Troubleshooting

### **Common Issues:**

**1. Docker not found in Jenkins:**
```bash
# Install Docker CLI in Jenkins container
docker exec -u 0 jenkins sh -c "apt-get update && apt-get install -y docker.io"
```

**2. Permission denied:**
```bash
# Add Jenkins user to docker group
docker exec -u 0 jenkins usermod -aG docker jenkins
```

**3. Port already in use:**
```bash
# Clean up test containers
docker ps -a | grep test- | awk '{print $1}' | xargs docker rm -f
```

**4. Credential not found:**
- Ensure credential ID is exactly `dockerhub-credentials`
- Verify DockerHub username/password are correct

## 🎉 Success Indicators

### **Successful Pipeline Shows:**
- ✅ All stages completed (green checkmarks)
- ✅ "SUCCESS! Image pushed to DockerHub" message
- ✅ No error messages in console output
- ✅ Image available on DockerHub

### **Verification Steps:**
1. **Check DockerHub**: Visit `https://hub.docker.com/r/pranavyaligouda/express-app-jenkins`
2. **Test Image**: `docker run -p 8080:8080 pranavyaligouda/express-app-jenkins:latest`
3. **Verify Response**: `curl http://localhost:8080/`

## 🚀 Next Steps & Enhancements

### **Advanced Features to Implement:**
- 🧪 **Unit Testing**: Add Jest/Mocha test suite
- 🔒 **Security Scanning**: Integrate Snyk/Trivy
- 📈 **Code Quality**: ESLint, SonarQube integration
- 🌍 **Multi-environment**: Dev/Staging/Production deployments
- 📢 **Notifications**: Slack/Email integration
- 🔄 **Auto-triggers**: Webhook-based builds
- 📊 **Monitoring**: Prometheus/Grafana integration

### **Infrastructure Improvements:**
- ☁️ **Cloud Deployment**: AWS ECS, Google Cloud Run
- 🔄 **GitOps**: ArgoCD integration
- 📦 **Helm Charts**: Kubernetes deployment
- 🔐 **Secret Management**: HashiCorp Vault

## 📚 Learning Resources

### **Jenkins:**
- [Jenkins Official Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax Reference](https://www.jenkins.io/doc/book/pipeline/syntax/)

### **Docker:**
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

### **CI/CD:**
- [CI/CD Principles](https://www.redhat.com/en/topics/devops/what-is-ci-cd)
- [DevOps Practices](https://aws.amazon.com/devops/what-is-devops/)

## 👤 Author

**Pranav Yaligouda**
- 📧 Email: [Contact via GitHub](https://github.com/pranav-yaligouda)
- 🐙 GitHub: [@pranav-yaligouda](https://github.com/pranav-yaligouda)
- 🐳 DockerHub: [pranavyaligouda](https://hub.docker.com/u/pranavyaligouda)

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Jenkins Community** for excellent documentation
- **Docker Team** for containerization technology
- **Node.js Foundation** for the runtime environment
- **Express.js Team** for the web framework

---

**⭐ Star this repository if it helped you learn Jenkins CI/CD!**

**🔗 [Live Demo](http://localhost:8080)** | **🐳 [DockerHub](https://hub.docker.com/r/pranavyaligouda/express-app-jenkins)** | **📖 [Documentation](README.md)**