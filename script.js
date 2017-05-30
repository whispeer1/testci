var newFolder = `<com.cloudbees.hudson.plugins.folder.Folder plugin="cloudbees-folder@6.0.4">
	<actions/>
	<properties/>
	<folderViews class="com.cloudbees.hudson.plugins.folder.views.DefaultFolderViewHolder">
		<views>
			<hudson.model.AllView>
				<owner class="com.cloudbees.hudson.plugins.folder.Folder" reference="../../../.."/>
				<name>All</name>
				<filterExecutors>false</filterExecutors>
				<filterQueue>false</filterQueue>
				<properties class="hudson.model.View$PropertyList"/>
			</hudson.model.AllView>
		</views>
		<tabBar class="hudson.views.DefaultViewsTabBar"/>
	</folderViews>
	<healthMetrics>
		<com.cloudbees.hudson.plugins.folder.health.WorstChildHealthMetric>
		<nonRecursive>false</nonRecursive>
		</com.cloudbees.hudson.plugins.folder.health.WorstChildHealthMetric>
	</healthMetrics>
	<icon class="com.cloudbees.hudson.plugins.folder.icons.StockFolderIcon"/>
</com.cloudbees.hudson.plugins.folder.Folder>`;

var newFrontProject = `<flow-definition plugin="workflow-job@2.11">
	<actions/>
	<description/>
	<keepDependencies>false</keepDependencies>
	<properties>
		<com.coravy.hudson.plugins.github.GithubProjectProperty plugin="github@1.27.0">
			<projectUrl>https://github.com/whispeer1/testci/</projectUrl>
			<displayName/>
		</com.coravy.hudson.plugins.github.GithubProjectProperty>
		<org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
			<triggers/>
		</org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
	</properties>
	<definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.30">
		<scm class="hudson.plugins.git.GitSCM" plugin="git@3.3.0">
			<configVersion>2</configVersion>
			<userRemoteConfigs>
				<hudson.plugins.git.UserRemoteConfig>
					<url>https://github.com/whispeer1/testci</url>
					<credentialsId>e07d765f-31c0-4066-a55b-68cd9375ac78</credentialsId>
				</hudson.plugins.git.UserRemoteConfig>
			</userRemoteConfigs>
			<branches>
				<hudson.plugins.git.BranchSpec>
					<name>*/#BRANCH_NAME#</name>
				</hudson.plugins.git.BranchSpec>
			</branches>
			<doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
			<submoduleCfg class="list"/>
			<extensions/>
		</scm>
		<scriptPath>Jenkinsfile</scriptPath>
		<lightweight>true</lightweight>
	</definition>
	<triggers/>
	<disabled>false</disabled>
</flow-definition>`;

var baseUrl = 'http://localhost:8080';
var project = "job/LPCRM";

//////////////////////////////////////////////////////////////////////////////

function doProjectAction(projectPath, method){
	return new Promise(function(resolve, reject) {
		$.ajax({
		    url: baseUrl+"/"+project+projectPath+"/"+method,
		    type: 'post',
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:83acd592a736ef485a7d4e6e111f91ea"));
		    },
		    headers: {
		        'Content-Type' : 'application/xml',
		        'X-My-Custom-Header': 'lol'
		    },
		    crossDomain: true,
		    success: function (data) {
		        resolve("OK");
		    },
		    error: function(error){
		    	reject(error);
		    }
		});	
	})
}

function pollingProject(projectPath){
	return doProjectAction(projectPath, "polling");
}

function buildProject(projectPath){
	return doProjectAction(projectPath, "build");
}

function createFolder(folderName){
	return new Promise(function(resolve, reject) {
		$.ajax({
		    url: baseUrl+"/"+project+"/createItem?name="+folderName,
		    type: 'post',
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:83acd592a736ef485a7d4e6e111f91ea"));
		    },
		    data: newFolder,
		    headers: {
		        'Content-Type' : 'application/xml',
		        'X-My-Custom-Header': 'lol'
		    },
		    crossDomain: true,
		    dataType: 'xml',
		    success: function (data) {
		        resolve(folderName);
		    },
		    error: function(error){
		    	reject(error);
		    }
		});	
	})
}

function createProject(projectName, branchName){
	return new Promise(function(resolve, reject) {
		var projectTemplate = newFrontProject.replace("#BRANCH_NAME#", branchName);
		var subfolder = "/job/"+branchName;
		$.ajax({
		    url: baseUrl+"/"+project+subfolder+"/createItem?name="+projectName,
		    type: 'post',
		    beforeSend: function (xhr) {
		        xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:83acd592a736ef485a7d4e6e111f91ea"));
		    },
		    data: projectTemplate,
		    headers: {
		        'Content-Type' : 'application/xml',
		        'X-My-Custom-Header': 'lol',
		    },
		    crossDomain: true,
		    dataType: 'xml',
		    success: function (data) {
		        resolve(subfolder+"/job/"+projectName);
		    },
		    error: function(error){
		    	reject(error);
		    }
		});	
	});
}

function checkProject(projectName, branchName){
	return new Promise((resolve, reject) => {	
		$.ajax({
		    url: "http://localhost:8080/job/LPCRM/checkJobName?value=new",
		    type: 'GET',
		    headers: {
		        'X-My-Custom-Header': 'lol',
		        "Authorization" : "Basic " + btoa("admin:83acd592a736ef485a7d4e6e111f91ea")
		    },
		    crossDomain: true,
		    success: function (data) {
		    	if (data.indexOf("уже существует") > -1){
		    		resolve(1);
		    	}else{
		    		resolve(0);
		    	}
		    },
		    error: function(error){
		    	console.log(error);
		    }
		});	
	});
}

function do2() {
	var branchName = $(".text").val();
	createFolder(branchName).then(()=>{
		createProject("front_"+branchName, branchName)
		.then(buildProject);
	});
}