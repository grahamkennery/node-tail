pipeline {
  agent {
    label 'node'
  }
  tools {
    node 'node8'
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
