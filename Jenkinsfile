pipeline {
    agent any

    environment {
        // Docker registry and image names
        REGISTRY = ""
        FRONTEND_IMAGE = "${REGISTRY}frontend"
        BACKEND_IMAGE = "${REGISTRY}backend"

        // Docker credentials (configure in Jenkins credentials)
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')

        // Application version (can be overridden)
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                // Install dependencies
                sh 'pnpm install --frozen-lockfile'
            }
        }

        stage('Type Check') {
            steps {
                sh 'pnpm run typecheck'
            }
        }

        stage('Test') {
            steps {
                // Add test commands here if you have tests
                // sh 'pnpm run test'
                echo 'Skipping tests for now'
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    // Build frontend Docker image
                    docker.build("${FRONTEND_IMAGE}:${IMAGE_TAG}", "-f artifacts/hiti-tech/Dockerfile artifacts/hiti-tech")
                    // Also tag as latest
                    docker.build("${FRONTEND_IMAGE}:latest", "-f artifacts/hiti-tech/Dockerfile artifacts/hiti-tech")
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    // Build backend Docker image
                    docker.build("${BACKEND_IMAGE}:${IMAGE_TAG}", "-f artifacts/api-server/Dockerfile artifacts/api-server")
                    // Also tag as latest
                    docker.build("${BACKEND_IMAGE}:latest", "-f artifacts/api-server/Dockerfile artifacts/api-server")
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    // Login to Docker registry
                    withCredentials([usernamePassword(credentialsId: '${DOCKER_CREDENTIALS}',
                                                  usernameVariable: 'DOCKER_USER',
                                                  passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        '''
                    }

                    // Push frontend images
                    sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:latest"

                    // Push backend images
                    sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                // This would typically deploy to your staging/production environment
                // For example, using SSH to deploy to a server or triggering a deployment webhook
                echo 'Deploying to environment...'

                // Example: SSH to server and pull new images
                /*
                sshsshagent([sshAgentCredential: 'your-ssh-credential-id']) {
                    sh '''
                    ssh user@your-server.com "
                    cd /path/to/deployment &&
                    docker-compose pull &&
                    docker-compose up -d
                    "
                    '''
                }
                */

                echo 'Deployment triggered'
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build or deployment failed!'
        }
    }
}