#!/bin/bash

# 우선 Workshop Studio 콘솔에서 "Get AWS CLI credentials"를 통해 AWS Credentials 환경 변수를 설정한 후 실행할 것.
# 그리고 create-cloud9-environment.sh 스크립트를 먼저 실행한 후 수행할 것.
# Reference: https://docs.aws.amazon.com/ko_kr/cloud9/latest/user-guide/credentials.html
#cd ~/environment
cat > cloud9-admin-role-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Role 생성, AdministratorAccess 권한 부여
aws iam create-role --role-name cloud9-admin --assume-role-policy-document file://cloud9-admin-role-trust-policy.json
aws iam attach-role-policy --role-name cloud9-admin --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# 인스턴스 프로파일 생성
aws iam create-instance-profile --instance-profile-name cloud9-admin-instance-profile
aws iam add-role-to-instance-profile --role-name cloud9-admin --instance-profile-name cloud9-admin-instance-profile

# Cloud9 EC2 인스턴스에 인스턴스 프로파일 부착 (Attach)
export EC2_INSTANCE_ID=$(aws ec2 describe-instances --filters Name=tag:Name,Values="*cloud9-workspace*" Name=instance-state-name,Values=running --query "Reservations[*].Instances[*].InstanceId" --output text)
echo $EC2_INSTANCE_ID
aws ec2 associate-iam-instance-profile --iam-instance-profile Name=cloud9-admin-instance-profile --instance-id $EC2_INSTANCE_ID

# 마지막으로 Cloud9 Managed Credentials 비활성화 -> 위에서 생성한 Instance Profile 사용
#aws cloud9 update-environment --environment-id ${C9_PID} --managed-credentials-action DISABLE
