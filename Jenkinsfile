pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                dir("ololol")
                echo 'Building..'
                bat "run.bat"
                echo pwd()
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