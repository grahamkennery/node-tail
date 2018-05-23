pipeline {
  agent any
  stages {
    stage('Test') {
      agent any
      steps {
        nodejs(nodeJSInstallationName: 'Node 8.x', configId: '<config-file-provider-id>') {
          sh 'npm test'
        }
      }
    }
  }
}
