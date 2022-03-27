import java.text.SimpleDateFormat

def dateFormat = new SimpleDateFormat("yyyyMMddHHmm")
def date = new Date()
def BUILD_TIMESTAMP = dateFormat.format(date)

pipeline {
    
    agent {
        label 'main'
    }

    environment {
        BUILD_TIMESTAMP = "${BUILD_TIMESTAMP}"
        NODE_CONTAINER_UP = "${sh(script:'if [ -z $(docker ps -q -f name=hms-app) ]; then echo \"0\"; else echo \"1\"; fi', returnStdout: true).trim()}"
    }

    stages {
        stage('Stop and remove container if exists') {
            when {
                allOf {
                    expression{env.NODE_CONTAINER_UP == '1'}
                }
            }
            steps {
                sh 'docker rm -f hms-app'
            }
        }

        stage('Build the Docker image') {
            steps {
                sh 'docker build -t hms-app .'
            }
        }

        stage('Run the container') {
            steps {
                sh 'docker run --name hms-app -p 80:4567 hms-app'
            }
        }
    }
}