pipeline {
  agent {
    docker { image 'node:8-alpine }
  }
  stages {
    stage('Test') {
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }
  }
}
