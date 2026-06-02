pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                // Checkout repository from Git SCM
                checkout scm
            }
        }

        stage('Configure Environment') {
            steps {
                // Copy the secure production .env file from a safe location on the Jenkins host.
                // In production, you would typically manage this file on the Jenkins controller
                // or retrieve secrets dynamically using a Credentials plugin or Vault plugin.
                script {
                    if (fileExists('/var/lib/jenkins/env_file')) {
                        sh 'cp /var/lib/jenkins/env_file/.env.hiti .env'
                    } else {
                        echo 'Warning: /var/lib/jenkins/.env.hiti-tech not found. Creating fallback from .env.example'
                        sh 'cp .env.example .env'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                // Recreate containers and build the new images.
                // Docker Compose automatically reads and interpolates variables from the .env file.
                sh 'docker compose up -d --build --force-recreate --remove-orphans'
            }
        }

        stage('Clean Up') {
            steps {
                // Remove dangling images left behind from the build process to free up disk space
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo 'Deployment successfully finished!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
