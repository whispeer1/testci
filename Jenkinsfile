pipeline{
    agent any
    
    //передавать как параметры джоба
    environment{
        PROJECT_NAME = 'bitrix'
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
    //    stage('Create And Push Docker Image'){
    //        steps {
    //            script{
    //                echo "Docker Build"
    //                def dockerImage = docker.build "${PROJECT_NAME}:task123"    
    //                echo "Docker Push"
    //                docker.withRegistry("http://localhost:5000"){
    //                    dockerImage.push "task123"
    //                }   
    //                //notifyAboutSuccessStep("DOCKER");              
    //            }
    //        }
    //    }
      stage("Deploy to K8S"){
          steps{
              script{
                  echo "Deploy to kubernetes"
                  sh('curl -X POST -H "Content-Type: application/json" --header "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImRlZmF1bHQtdG9rZW4tcGo0ZjIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZGVmYXVsdCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImNjYWNmOGE5LTllZWMtMTFlNy1hM2JlLTQ0OGE1YjVkZDRlMiIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZWZhdWx0OmRlZmF1bHQifQ.FrLMRVlk7gYLvdaCWPo0NkWeR5NS7J9rLr0jQyKwixMYNMCijcyiENdh6MjlFliUM_Ugy8n6i3R88J8_lwlAbWbPsoyG75Bg_xYbYsozbz1cAqxptRag0RpnvO2vwDHwFC9Iw7uv_B_mEmgEKvsgUUGFkLiH3iOa1brSwGhBLVnZcpHA-mkxximavkP-cAkcppXg7gbM-EoEFZ2kwQ9vFnnWeYwS38Ogv7XCh_kzkTBCQFvs2oU4nid5aRwyvLmb2Hj7QDC0o0aHn9U5p4-i9Rmh7u3zkhzQaIj3r2zX-LkBUnBee-zoZFFf9DbEllTjiVDybp8EwMtu15mhy05Qag" --insecure -k https://88.198.14.182:6443/apis/extensions/v1beta1/namespaces/default/deployments -d \'{"apiVersion" : "extensions/v1beta1","kind": "Deployment","metadata": {"name" : "nginx-deployment"},"spec": {"replicas": 3,"template": {"metadata": {"labels": {"app": "nginx"}},"spec": {"containers" : [{"name": "nginx","image": "nginx:1.7.9","ports": [{"containerPort": 80}]}]}}}}\'')
                  
                  waitUntil{    
                      sleep 5
                      sh('curl -X GET https://88.198.14.182:6443/apis/extensions/v1beta1/namespaces/default/deployments -k  > result ')
                      def output = readFile('result').trim()
                      if (output.indexOf("Available") > -1) {
                          return true
                      }else{
                          return false
                      }
                      
                  }
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

