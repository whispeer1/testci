pipeline{
    agent any
    
    //передавать как параметры джоба
    environment{
        PROJECT_NAME = 'bitrix'
        FLOCK_BOT_URL = 'http://88.198.14.182:8009'
        K8S_MASTER_URL = 'https://88.198.14.182:6443'
        TOKEN = "1234567890"
    }

    stages{
        stage('Pre build'){
            steps{ gasrgw
                script{  1
                    echo "Merge with RC"
                    try{   
                        echo "--copy default repository state "
                        sh("\\cp -R /home/hlbx.ru/* .")
                        sh("git checkout master")
                        sh("git pull origin")
                    //    sh("git merge ${params.taskName} --squash > git_result") 
                    //    def output = readFile('git_result').trim()
                    //    if (output.indexOf("Automatic merge failed") > -1) {
                    //        throw new IOException();
                    //    }
                        notifyAboutSuccessStep("PRE_BUILD")
                    }catch(error){
                        notifyAboutFailedStep("PRE_BUILD")
                        throw error
                    }
                }
            }
        }
        stage('Create And Push Docker Image'){
            steps {
                script{
                    try{
                        echo "Docker Build"
                        def dockerImage = docker.build "${PROJECT_NAME}:${params.taskName}"    
                        echo "Docker Push"
                        docker.withRegistry("http://localhost:5000"){
                            dockerImage.push "${params.taskName}"
                        }   
                        notifyAboutSuccessStep("DOCKER")
                    }catch(error){
                        notifyAboutFailedStep("DOCKER")
                        throw error
                    }           
                }
            }
        }
        stage("Deploy to K8S"){
            steps{
                script{
                    try {
                        sh("kubectl --kubeconfig='/var/lib/jenkins/workspace/admin.conf' create namespace ${params.taskName}")
                        sh("kubectl --kubeconfig='/var/lib/jenkins/workspace/admin.conf' --namespace=${params.taskName} run bitrix --image=localhost:5000/bitrix:${params.taskName} --port=8080")
                        sh("kubectl --kubeconfig='/var/lib/jenkins/workspace/admin.conf' --namespace=${params.taskName} run mysql-bitrix --image=localhost:5000/db_v32 --port=3306")
                        sh("kubectl --kubeconfig='/var/lib/jenkins/workspace/admin.conf' --namespace=${params.taskName} expose deployment/mysql-bitrix --type='NodePort' --port 3306")

                        sleep 60
                        echo "Deploy to kubernetes"
                        notifyAboutSuccessStep("DEPLOY")                        
                    }catch(error) {
                        echo "error DEPLOY"
                        notifyAboutFailedStep("DEPLOY")
                        throw error
                    }
                }
            }
        }
        stage("Approve"){
            steps{
                script{
                    waitUntil {    
                        echo "request"
                        sleep 10
                        def req =  httpRequest FLOCK_BOT_URL+'/jenkins?taskName=' + params.taskName + "&token=${TOKEN}"
                        if (req.content == "ok"){
                            notifyAboutSuccessStep("APPROVE")
                            return true
                        }else{
                            return false
                        }   
                       
                    }
                }
            }
        }
    }
}

def notifyFlockBot(taskName, stageResult, stageName, attachment){
    sh('curl -H "Content-Type: application/json" -k -X PUT -d \'{"stageResult": "'+ stageResult +'", "stage" : "'+ stageName +'"}\' ${FLOCK_BOT_URL}/task?name=' + taskName + "&token=${TOKEN}")
}

def notifyAboutSuccessStep(stage){
    notifyFlockBot("task999", "done", stage, "")
}
def notifyAboutFailedStep(stage){
    notifyFlockBot("task999", "fail", stage, "")
}

