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
              //  sh ("cp home/.kube/config ")
                sh(" cp -i /m.conf $HOME/.kube/config")
                sh("kubectl cluster-info")
                sh("chown $(id -u):$(id -g) $HOME/.kube/config")
                  echo "Deploy to kubernetes"
           //       sh('curl -X POST -H "Content-Type: application/json" --header "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkZWZhdWx0LXRva2VuLXBqZGJyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImRlZmF1bHQiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJjY2E1NTRjZi05ZWVjLTExZTctYTNiZS00NDhhNWI1ZGQ0ZTIiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06ZGVmYXVsdCJ9.SjkLG7m8m7yGWdRh_J0VAPZEmNUA7mL9CEwBDbd92YY5qFo5yql_s2aVN9ag5WOTrco0ttcMWQ7h5OGMcq8R6OJvNJYgvtLnsWpgNM1NqU6xYVXZnj3is7V8Ugq83fcMe4Ude56OC8Emaucjm45xF5SvysStnQWYN9vGnDO8u9y0GgNLsj5OzqFzXtUXwcx0p52SabAI_5ViKVPqwVn-DF0rApEL_XR6_eN9TJlP19nThUMmOGJDIsx81ep5YOWqo_PeQJ0Xd3TSfWOQj0dysZ7pkYkfNSDN-nnuSWFb-insecure" --3lS7NhisRLGXijG4KftGcCdpaFRiu0oSMd1xG3a1vmtEg -k https://88.198.14.182:6443/apis/extensions/v1beta1/namespaces/default/deployments -d \'{"apiVersion" : "extensions/v1beta1","kind": "Deployment","metadata": {"name" : "nginx-deployment"},"spec": {"replicas": 3,"template": {"metadata": {"labels": {"app": "nginx"}},"spec": {"containers" : [{"name": "nginx","image": "nginx:1.7.9","ports": [{"containerPort": 80}]}]}}}}\'')
                  
                
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

