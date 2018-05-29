pipeline {
  agent {
    label 'node'
  }
  stages {
    stage('Test') {
      steps {
        nodejs(nodeJSInstallationName: 'node8', configId: null) {
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
  }
}
