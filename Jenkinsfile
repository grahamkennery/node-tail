pipeline {
  agent {
    label 'node'
  }
  stages {
    stage('Test') {
      steps {
        nodejs(nodeJSInstallationName: 'node8', configId: null) {
          sh 'tool node8'
          sh 'echo "PATH = ${PATH}"';
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
  }
}
