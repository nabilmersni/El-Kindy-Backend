pipeline{ 
    agent any
    environment { 
        registryCredentials = "nexus" 
        registry = "172.16.8.124:8083" 
    }
    stages { 
        stage('Install dependencies') { 
            steps{ 
                script { 
                    sh('npm install') 
                } 
            } 
        } 
        stage('Unit Test') { 
            steps{
                script { 
                    sh('npm test') 
                } 
            } 
        }
        stage('SonarQube Analysis') { 
            steps{ 
                script {   
                    def scannerHome = tool 'scanner' 
                    withSonarQubeEnv { 
                        sh "${scannerHome}/bin/sonar-scanner" 
                    } 
                }  
            }   
        } 
        stage('Build application') { 
            steps{ 
                script { 
                    sh('npm run build-dev') 
                } 
            } 
        }
        stage('Building images (node)') { 
            steps{ 
                script { 
                    sh('docker-compose build') 
                } 
            } 
        }
        stage('Deploy  to Nexus') { 
            steps{   
                script { 
                    docker.withRegistry("http://"+registry,registryCredentials ) { 
                        sh('docker push $registry/elkindynodeapp:6.0 ') 
                    } 
                } 
            } 
        }
        stage('Run application ') { 
            steps{   
                script { 
                    docker.withRegistry("http://"+registry, registryCredentials) { 
                        sh('docker pull $registry/elkindynodeapp:6.0 ') 
                        sh('docker-compose up -d ') 
                    } 
                } 
            } 
        } 
    } 
}