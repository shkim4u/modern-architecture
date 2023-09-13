#!/bin/bash

# [2023-08-03] Cloud9 초기 설정 추가
# 1. AdministratorAccess 권한을 가진 Role 생성
# 2. Instance Profile 생성
# 3. Instance Profile을 Cloud9 EC2 인스턴스와 연결
# (Hmm~) 결론: 아래 동작은 Cloud9에서 동작하지 않으므로 별도의 Bootstrapping 작업에서 수행할 것
#   - AWS 콘솔 혹은 별도의 CLI 환경
#   - 출처: https://docs.aws.amazon.com/cloud9/latest/user-guide/security-iam.html#auth-and-access-control-temporary-managed-credentials

#cd ~/environment
#cat > cloud9-admin-role-trust-policy.json <<EOF
#{
#  "Version": "2012-10-17",
#  "Statement": [
#    {
#      "Sid": "",
#      "Effect": "Allow",
#      "Principal": {
#        "Service": "ec2.amazonaws.com"
#      },
#      "Action": "sts:AssumeRole"
#    }
#  ]
#}
#EOF
#
## Role 생성, AdministratorAccess 권한 부여
#aws iam create-role --role-name cloud9-admin --assume-role-policy-document file://cloud9-admin-role-trust-policy.json
#aws iam attach-role-policy --role-name cloud9-admin --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
#
## 인스턴스 프로파일 생성
#aws iam create-instance-profile --instance-profile-name cloud9-admin-instance-profile
#aws iam add-role-to-instance-profile --role-name cloud9-admin --instance-profile-name cloud9-admin-instance-profile
#
## Cloud9 EC2 인스턴스에 인스턴스 프로파일 부착 (Attach)
#export EC2_INSTANCE_ID=$(aws ec2 describe-instances --filters Name=tag:Name,Values=*cloud9-workspace* --query "Reservations[*].Instances[*].InstanceId" --output text)
#echo $EC2_INSTANCE_ID
#aws ec2 associate-iam-instance-profile --iam-instance-profile Name=cloud9-admin-instance-profile --instance-id $EC2_INSTANCE_ID
#
## 마지막으로 Cloud9 Managed Credentials 비활성화 -> 위에서 생성한 Instance Profile 사용
#aws cloud9 update-environment --environment-id ${C9_PID} --managed-credentials-action DISABLE

# 1. IDE IAM 설정 확인
echo "1. Checking Cloud9 IAM role..."
rm -vf ${HOME}/.aws/credentials
aws sts get-caller-identity --query Arn | grep cloud9-admin

# 2. (Optional for Amazon EKS) EKS 관련 도구
## 2.1. Kubectl
# 설치
echo "2.1. Installing kubectl..."
sudo curl -o /usr/local/bin/kubectl  \
   https://s3.us-west-2.amazonaws.com/amazon-eks/1.27.1/2023-04-19/bin/linux/amd64/kubectl
# 실행 모드 변경
sudo chmod +x /usr/local/bin/kubectl
# 설치 확인
kubectl version --short --client

## 2.2. eksctl 설치
echo "2.2. Installing eksctl..."
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv -v /tmp/eksctl /usr/local/bin
eksctl version

## 2.3. k9s 설치
echo "2.3. Installing k9s..."
curl -sL https://github.com/derailed/k9s/releases/download/v0.27.4/k9s_Linux_amd64.tar.gz | sudo tar xfz - -C /usr/local/bin
k9s version

## 2.4 Helm 설치
echo "2.4. Installing Helm..."
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version --short

## 3. Upgrade AWS CLI.
## [2023-09-13] 새로 생성되는 Cloud9 환경의 AWS CLI가 Version 2로 업그레이드 되었으므로 더 이상 수행할 필요가 없음.
echo "3. AWS CLI now supports version 2 by default at new Cloud9 environment launch. Skipping the AWS CLI upgrade process..."

#echo "3. Upgrading AWS CLI..."
#aws --version

#echo "3.1. Removing the AWS CLI Version 1..."
#sudo rm /usr/bin/aws
#sudo rm /usr/bin/aws_completer
#sudo rm -rf /usr/local/aws-cli

#echo "3.1. Installing AWS CLI Version 2..."
#rm -rf ./aws | true
#curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
#unzip -q awscliv2.zip
#sudo ./aws/install
#hash -d aws
#aws --version

## 4. Upgrade AWS CDK.
echo "4. Upgrading AWS CDK..."
## First, install the LTS version.
#nvm install --lts
## Then, uninstall the EOL'ed node version 16.20.0
#nvm uninstall 16.20.2
## Set default node to LTS.
#nvm use --lts
#
npm uninstall -g aws-cdk
rm -rf $(which cdk)
npm install -g aws-cdk
cdk --version

## 5. Installing Misc.
echo "5. Installing miscellaneous tools..."

echo "5.1. Installing AWS SSM Session Manager..."
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm" -o "session-manager-plugin.rpm"
sudo yum install -y session-manager-plugin.rpm

echo "5.2. Installing AWS Cloud9 CLI..."
npm install -g c9

echo "5.3. Installing jq..."
sudo yum install -y jq

echo "5.4. Installing yq..."
sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
sudo chmod a+x /usr/local/bin/yq
yq --version

echo "5.5. Installing bash-completion..."
sudo yum install -y bash-completion

## 6. Addition Cloud9 configurations.
echo "6. Additional Cloud9 configurations..."

echo "6.1. Configuring AWS_REGION..."
export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')

echo "export AWS_REGION=${AWS_REGION}" | tee -a ~/.bash_profile

aws configure set default.region ${AWS_REGION}

# 확인
aws configure get default.region

echo "6.2. Configuring AWS ACCOUNT_ID..."
export ACCOUNT_ID=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.accountId')

echo "export ACCOUNT_ID=${ACCOUNT_ID}" | tee -a ~/.bash_profile

## 7. Extend disk size.
echo "7. Extending disk size..."
curl -fsSL https://raw.githubusercontent.com/shkim4u/kubernetes-misc/main/aws-cloud9/resize.sh | bash
df -h

