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
        stage('Delete the existing Kubernetes resources') {
            steps {
                sh 'kubectl delete -f kube'
            }
        }

        stage('Build the Docker image') {
            steps {
                sh 'eval $(minikube docker-env)'
                sh 'docker build -t hms-app .'
            }
        }

        stage('Delete Existing Kubernetes Services'){
            steps{
                sh 'kubectl delete services -l app.kubernetes.io/name=hms-app'
            }
        }

        stage('Delete Existing Kubernetes Deployment'){
            steps{
                sh 'kubectl delete deployment -l app.kubernetes.io/name=hms-app'
            }
        }

        stage('Apply Kubernetes Deployment') {
            steps {
                sh 'kubectl apply -f hms-deployment.yaml'
            }
        }

        stage('Expose Kubernetes Service') {
            steps {
                sh 'kubectl expose deployment hms-app --type=NodePort --name=hms-app-svc'
            }
        }
    }
}
