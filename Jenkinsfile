pipeline{
    agent any
    environment {
        DOCKER_BUILDKIT = "1"
        ADMINX_IMAGE_NAME = "woocoos/adminx-ui"
        VERSION = "v0.0.1"
        GitTag = ""
    }
    stages{
        stage("build") {
            steps {
                script {
                    env.GitCommitID = sh (script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    try{
                        env.GitTag = sh (script: "git describe --tags ${env.GitCommitID}", returnStdout: true).trim()
                    } catch(exception) {
                        echo 'there is no tag in repo'
                    }
                    // 根据分支覆盖.env
                    def tagName = env.GitTag
                    if (tagName.startsWith("uat-")){
                      // uat
                    } else {
                      // dev
                      sh "echo 'ICE_APP_CODE=resource' > .env"
                      sh "echo 'ICE_LOGIN_URL=/login' >> .env"
                    }
                }
            }
        }
        stage("adminx-ui-build") {
            steps {
                script {
                    def tagName = ""
                    docker.withRegistry("http://${REGISTRY_SERVER}") {
                        if (env.GitTag) {
                            tagName = env.GitTag
                        } else {
                            tagName = "${VERSION}.${env.GitCommitID}"
                        }
                        def image = docker.build("${ADMINX_IMAGE_NAME}:${tagName}","--add-host ${NEXUS_HOST} -f Dockerfile .")
                        image.push()
                    }
                    if (tagName) {
                        sh "docker rmi ${REGISTRY_SERVER}/${ADMINX_IMAGE_NAME}:${tagName}"
                    }
                }
            }
        }
    }
}
