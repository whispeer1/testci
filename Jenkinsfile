pipeline{
    agent any
    
    //передавать как параметры джоба
    environment{
        PROJECT_NAME = 'bitrix'
        FLOCK_BOT_URL = 'http://88.198.14.182:8009'
        K8S_MASTER_URL = 'https://88.198.14.182:6443'
        TASK_NAME = 'task666'
    }

    stages{
        stage('Pre-Build'){
            steps{ 
                script{  
                    echo "Merge with RC"
                    try{   
                        echo "--copy default repository state "
                        sh("\\cp -R /home/hlbx.ru/* .")
                        sh("git checkout master")
                        sh("git pull origin")
                      //  notifyAboutSuccessStep("PRE_BUILD")
                    }catch(error){
                       // notifyAboutFailedStep("PRE_BUILD")
                        throw error
                    }
                }
            }
        }
        stage('Build'){
            steps {
                script{
                    echo "Build"
                   // notifyAboutSuccessStep("BUILD");
                }
            }
        }
//        stage('Unit-Test'){
//            steps {
//                echo "Unit-Test"
//                sh("nodejs node_modules/mocha/bin/mocha")
//                notifyAboutSuccessStep("UNIT_TEST");
//            }
//        }
        stage('Create And Push Docker Image'){
            steps {
                script{
                    echo "Docker Build"
                    def dockerImage = docker.build "${PROJECT_NAME}:${TASK_NAME}"    
                    echo "Docker Push"
                    docker.withRegistry("http://localhost:5000"){
                        dockerImage.push "${TASK_NAME}"
                    }              
                }
            }
        }
      stage("Deploy to K8S"){
          steps{
                script{
                    sh("cp ../depl_bitrix.yaml .")
                    sh("sed -i -e 's/deployment_name/bitrix/g' depl_bitrix.yaml")
                    sh("sed -i -e 's/image_name/bitrix:${TASK_NAME}/g' depl_bitrix.yaml")
                    sh("kubectl --kubeconfig='/var/lib/jenkins/workspace/admin.conf' create -f depl_bitrix.yaml")
                   // sh("kubectl --kubeconfig='/var/lib/jenkins/workspace/admin.conf' create -f serv_sql.yaml")
                    echo "Deploy to kubernetes"

                  //notifyAboutSuccessStep("DEPLOY")
                }
          }
      }
        stage("Approve"){
            steps{
                script{
                    waitUntil {    
                        echo "request"
                        sleep 10
                        def req =  httpRequest FLOCK_BOT_URL+'/jenkins?taskName=task123'
                        if (req.content == "ok"){
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
    sh('curl -H "Content-Type: application/json" -k -X PUT -d \'{"stageResult": "'+ stageResult +'", "stage" : "'+ stageName +'"}\' ${FLOCK_BOT_URL}/task?name=${taskName}')
}

def notifyAboutSuccessStep(stage){
    notifyFlockBot(TASK_NAME, "done", stage, "")
}
def notifyAboutFailedStep(stage){
    notifyFlockBot(TASK_NAME, "fail", stage, "")
}

