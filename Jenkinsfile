pipeline {
  agent {
    node {
      label '8'
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