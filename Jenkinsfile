pipeline {
  agent {
    label 'node'
  }
  stages {
    stage('Test') {
      steps {
        nodejs(nodeJSInstallationName: 'node8', configId: null) {
          sh 'echo "PATH = ${PATH}"';
          sh 'which npm'
          sh 'which node'
          sh 'which nodejs'
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
  }
}
