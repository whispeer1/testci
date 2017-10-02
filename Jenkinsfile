pipeline{
    agent any
    
    //передавать как параметры джоба
    environment{
        PROJECT_NAME = 'bitrix'
        FLOCK_BOT_URL = 'https://5b1ff981.ngrok.io'
        K8S_MASTER_URL = 'https://88.198.14.182:6443'
        TOKEN = "1234567890"
    }

    stages{
        stage('Pre build'){
            steps{ 
                script{  
                    notifyAboutStartStep("PRE_BUILD")
                    echo "Merge with RC"
                    try{   
                        echo "--copy default repository state "
                        sh("\\cp -R /home/docker/www/* .")
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
                    notifyAboutStartStep("DOCKER")
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
                    notifyAboutStartStep("DEPLOY")
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
    httpRequest  contentType: 'APPLICATION_JSON', httpMode: 'PUT', requestBody: '{"stageResult": "'+ stageResult +'", "stage" : "'+ stageName +'"}', url: 'https://5b1ff981.ngrok.io/task?name=' + taskName


 //   sh('curl -H "Content-Type: application/json" -k -X PUT -d \'{"stageResult": "'+ stageResult +'", "stage" : "'+ stageName +'"}\' ${FLOCK_BOT_URL}/task?name=' + taskName + "&token=${TOKEN}")
}

def notifyAboutSuccessStep(stage){
    notifyFlockBot(params.taskName, "done", stage, "")
}
def notifyAboutStartStep(stage){
    notifyFlockBot(params.taskName, "start", stage, "")
}
def notifyAboutFailedStep(stage){
    notifyFlockBot(params.taskName, "fail", stage, "")
}
def notifyAboutReadyTo(stage){
    notifyFlockBot(params.taskName, "waiting", stage, "")
}

