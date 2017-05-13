pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                bat "run.bat"
                echo pwd()
                echo env.BRANCH_NAME
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....' 
            }
        }
    }
}