pipeline {
    agent any
    
    environment {
        DOCKERHUB_USERNAME = 'pranavyaligouda'
        IMAGE_NAME = 'express-app-jenkins'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh "docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest"
            }
        }
        
        stage('Test Container') {
            steps {
                echo '🧪 Testing Docker container...'
                script {
                    // Start test container
                    sh "docker run -d --name test-${BUILD_NUMBER} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
                    
                    // Wait for app to start
                    sleep(time: 10, unit: 'SECONDS')
                    
                    // Get container IP and test directly
                    def containerIP = sh(returnStdout: true, script: "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' test-${BUILD_NUMBER}").trim()
                    sh "curl -f http://${containerIP}:8080/ || exit 1"
                    
                    // Cleanup test container
                    sh "docker stop test-${BUILD_NUMBER} && docker rm test-${BUILD_NUMBER}"
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing to DockerHub...'
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
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            sh "docker rmi ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker rmi ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest || true"
        }
        success {
            echo '🎉 SUCCESS! Image pushed to DockerHub'
            echo "🐳 Run with: docker run -p 8080:8080 ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest"
        }
        failure {
            echo '❌ Build failed - check logs above'
        }
    }
}