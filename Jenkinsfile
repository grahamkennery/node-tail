pipeline {
  agent {
    label 'node'
  }
  tools {
    nodejs 'node8'
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
