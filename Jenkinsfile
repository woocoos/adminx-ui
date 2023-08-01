pipeline{
    agent any
    environment {
        DOCKER_BUILDKIT = "1"
        NEXUS_HOST= "nexus.hycapital.hk:192.168.0.14"
        REGISTRY_SERVER = "registry.hycapital.hk"
        ADMINX_IMAGE_NAME = "woocoos/adminx-ui"
        VERSION = "v0.0.1"
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
