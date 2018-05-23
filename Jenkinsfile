pipeline {
  agent any
  stages {
    stage('Test') {
      agent any
      steps {
        nodejs(nodeJSInstallationName: 'Node 8.11.2', configId: '<config-file-provider-id>') {
          sh 'npm test'
        }
      }
    }
  }
}
