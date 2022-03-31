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
    }

    stages {

        // stage('Build test container and run tests') {
        //     steps {
        //         sh 'docker build -t hms-app-test -f Dockerfile.test .'
        //         sh 'docker run --rm --name hms-app-test -p 4567:4567 hms-app-test'
        //     }
        // }

        stage('Building the production Docker image') {
            steps {
                sh 'docker build -t hms-app -f Dockerfile.production .'
            }
        }

        stage ('Kubernetes Cluster Deployment') {
            steps {
                sh 'minikube image load hms-app'
                sh 'kubectl apply -f kube'
            }
        }       
    }
}
