pipeline {
    agent any

    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0-SNAPSHOT', description: 'Version de la release ou snapshot')
        choice(name: 'ENVIRONMENT', choices: ['dev', 'int', 'prod'], description: 'Environnement de déploiement')
        booleanParam(name: 'ONLY_BUILD', defaultValue: false, description: 'Si coché, effectue uniquement le build et l\'analyse Sonar (pas de déploiement)')
        booleanParam(name: 'SKIP_SONAR', defaultValue: false, description: 'Si coché, ignore l\'analyse SonarQube')
    }

    environment {
        PATH = "/usr/local/bin:/opt/sonar-scanner/bin:${env.PATH}"
        DOCKER_HOST = "unix:///var/run/docker.sock"
    }

    stages {
        stage('🔌 Checkout Project') {
            steps {
                checkout scm
            }
        }

        stage('🧪 Quality Analysis - ad-manager-web (SonarQube)') {
            when {
                expression { params.SKIP_SONAR == false }
            }
            steps {
                dir('ad-manager-web') {
                    sh """
                        sonar-scanner \
                            -Dsonar.projectKey=ad-manager-web \
                            -Dsonar.projectName='Ad Manager Web' \
                            -Dsonar.projectVersion=${params.VERSION} \
                            -Dsonar.sources=src \
                            -Dsonar.host.url=http://sonarqube:9000 \
                            -Dsonar.login=admin \
                            -Dsonar.password=admin123 \
                            -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/*.test.js
                    """
                }
            }
        }

        stage('🧪 Quality Analysis - ad-manager-api (SonarQube)') {
            when {
                expression { params.SKIP_SONAR == false }
            }
            steps {
                dir('ad-manager-api') {
                    sh """
                        sonar-scanner \
                            -Dsonar.projectKey=ad-manager-api \
                            -Dsonar.projectName='Ad Manager API' \
                            -Dsonar.projectVersion=${params.VERSION} \
                            -Dsonar.sources=src \
                            -Dsonar.host.url=http://sonarqube:9000 \
                            -Dsonar.login=admin \
                            -Dsonar.password=admin123 \
                            -Dsonar.exclusions=**/node_modules/**,**/logs/**,**/*.test.js
                    """
                }
            }
        }

        stage('🐳 Docker Build - ad-manager-web') {
            steps {
                dir('ad-manager-web') {
                    sh """
                        docker build -t ad-manager-web:${params.VERSION} .
                        docker tag ad-manager-web:${params.VERSION} ad-manager-web:latest
                    """
                }
            }
        }

        stage('🐳 Docker Build - ad-manager-api') {
            steps {
                dir('ad-manager-api') {
                    sh """
                        docker build -t ad-manager-api:${params.VERSION} .
                        docker tag ad-manager-api:${params.VERSION} ad-manager-api:latest
                    """
                }
            }
        }

        stage('🚀 Deploy to Colima (Helm)') {
            when {
                expression { params.ONLY_BUILD == false }
            }
            steps {
                echo "Récupération des configurations Helm (Monorepo)..."
                dir('helm') {
                    checkout([$class: 'GitSCM', 
                        branches: [[name: '*/main']], 
                        userRemoteConfigs: [[
                            credentialsId: 'github-pat', 
                            url: 'https://github.com/Ads10045/helm'
                        ]]
                    ])
                }
                
                script {
                    def services = ['ad-manager-api', 'ad-manager-web']
                    def namespace = "ads-${params.ENVIRONMENT}"
                    def envPath = params.ENVIRONMENT == 'prod' ? 'helm-prod' : 'helm-int'
                    def secretPath = params.ENVIRONMENT == 'prod' ? 'helm-secret-prod' : 'helm-secret-int'
                    
                    // Créer le namespace s'il n'existe pas
                    sh "kubectl create namespace ${namespace} --dry-run=client -o yaml | kubectl apply -f -"
                    
                    services.each { service ->
                        echo "🚀 Déploiement de ${service} dans ${namespace}..."
                        sh """
                            helm upgrade --install ${service} ./helm/helm-main/${service} \
                            --namespace ${namespace} \
                            --set image.tag=${params.VERSION} \
                            --set image.pullPolicy=Never \
                            -f ./helm/${envPath}/${service}/application-variable.properties \
                            -f ./helm/${secretPath}/${service}/${service}.secret \
                            --wait --timeout=300s
                        """
                    }
                }
            }
        }

        stage('✅ Verify Deployment') {
            when {
                expression { params.ONLY_BUILD == false }
            }
            steps {
                script {
                    def namespace = "ads-${params.ENVIRONMENT}"
                    sh """
                        echo "=== État des pods ==="
                        kubectl get pods -n ${namespace}
                        echo ""
                        echo "=== État des services ==="
                        kubectl get svc -n ${namespace}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline terminé avec succès pour ${params.VERSION}"
        }
        failure {
            echo "❌ Le pipeline a échoué. Vérifiez les logs ci-dessus."
        }
        always {
            cleanWs()
        }
    }
}
