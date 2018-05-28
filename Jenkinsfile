pipeline {
  agent {
    label 'node'
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
