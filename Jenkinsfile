pipeline{
    agent any
    
    //передавать как параметры джоба
    environment{
        PROJECT_NAME = 'some_project'
        FLOCK_BOT_URL = 'http://88.198.14.182:8009'
        K8S_MASTER_URL = 'https://88.198.14.182:6443'
        TASK_NAME = 'task123'
    }

    stages{
        stage('Pre-Build'){
            steps{ 
                script{  
                    echo "Merge with RC"
                    try{   
                        echo "npm install"
                        // copy default repository state 
                        //sh("mkdir ")
                        sh("\cp -R /home/hlbx.ru/* .")
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
      //  stage('Create And Push Docker Image'){
      //      steps {
      //          script{
      //              echo "Docker Build"
      //              def dockerImage = docker.build "whispeer/${PROJECT_NAME}:${params.taskName}"    
      //              echo "Docker Push"
      //              docker.withRegistry("", '2a6aae12-b4d2-49c5-b002-be8980fb8142'){
      //                  dockerImage.push params.taskName
      //              }   
      //              notifyAboutSuccessStep("DOCKER");              
      //          }
      //      }
      //  }
    //    stage("Deploy to K8S"){
    //        steps{
    //            script{
    //                echo "Deploy to kubernetes"
    //                sh('curl -X POST -H "Content-Type: application/json" -k https://35.192.233.50/apis/extensions/v1beta1/namespaces/default/deployments -d \'{"apiVersion" : "extensions/v1beta1","kind": "Deployment","metadata": {"name" : "nginx-deployment"},"spec": {"replicas": 3,"template": {"metadata": {"labels": {"app": "nginx"}},"spec": {"containers" : [{"name": "nginx","image": "nginx:1.7.9","ports": [{"containerPort": 80}]}]}}}}\'')
    //                
    //                waitUntil{    
    //                    sleep 5
    //                    sh('curl -X GET https://35.192.233.50/apis/extensions/v1beta1/namespaces/default/deployments -k  > result ')
    //                    def output = readFile('result').trim()
    //                    if (output.indexOf("Available") > -1) {
    //                        return true
    //                    }else{
    //                        return false
    //                    }
    //                    
    //                }
    //                notifyAboutSuccessStep("DEPLOY")
    //            }
    //        }
    //    }
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

