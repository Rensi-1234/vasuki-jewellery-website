pipeline {
    agent any

    environment {
        DOCKERHUB_NAMESPACE = 'rensi1234'
        BACKEND_IMAGE = "${DOCKERHUB_NAMESPACE}/vasuki-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_NAMESPACE}/vasuki-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out VASUKI source code from GitHub...'
            }
        }

        stage('Frontend CI') {
            steps {
                dir('vasuki-frontend') {
                    bat 'npm ci'
                    bat 'npm run lint'
                    bat 'npm run build'
                }
            }
        }

        stage('Backend CI') {
            steps {
                dir('vasuki-backend') {
                    bat 'npm ci'
                    bat 'npm run check'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %BACKEND_IMAGE%:%BUILD_NUMBER% -t %BACKEND_IMAGE%:latest ./vasuki-backend'

                bat 'docker build --build-arg VITE_API_URL=http://localhost:5000/api --build-arg VITE_USE_DEMO_DATA=true -t %FRONTEND_IMAGE%:%BUILD_NUMBER% -t %FRONTEND_IMAGE%:latest ./vasuki-frontend'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    bat 'echo %DOCKER_TOKEN%| docker login -u "%DOCKER_USER%" --password-stdin'

                    bat 'docker push %BACKEND_IMAGE%:%BUILD_NUMBER%'
                    bat 'docker push %BACKEND_IMAGE%:latest'

                    bat 'docker push %FRONTEND_IMAGE%:%BUILD_NUMBER%'
                    bat 'docker push %FRONTEND_IMAGE%:latest'
                }
            }
        }
    }

    post {
        always {
            bat 'docker logout || exit /b 0'
        }
    }
}