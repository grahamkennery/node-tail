pipeline {
  agent {
    label 'node'
  }
  stages {
    stage('Test') {
      steps {
        nodejs(nodeJSInstallationName: 'node8', configId: '<config-file-provider-id>' {
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
  }
}
