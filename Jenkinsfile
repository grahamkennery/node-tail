pipeline {
  agent {
    label 'node'
  }
  stages {
    stage('Test') {
      steps {
        nodejs(nodeJSInstallationName: 'node8', configId: null) {
          env.NODEJS_HOME = "${tool node8}"
          env.PATH="${env.NODEJS_HOME}:${env.PATH}"
          echo ${env.PATH}
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
  }
}
