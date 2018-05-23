pipeline {
  agent {
    docker {
      image 'node:8-alpine'
    }

  }
  stages {
    stage('Test') {
      agent any
      steps {
        sh 'npm test'
      }
    }
  }
}