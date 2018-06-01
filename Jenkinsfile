pipeline {
  agent {
    label 'node'
  }
  environment {
    NODEJS_HOME = "${tool node8}"
    PATH="${NODEJS_HOME}:${PATH}"
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
