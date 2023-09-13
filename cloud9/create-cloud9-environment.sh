#!/bin/bash

# 우선 Workshop Studio 콘솔에서 "Get AWS CLI credentials"를 통해 AWS Credentials 환경 변수를 설정한 후 실행할 것.
aws cloud9 create-environment-ec2 --name cloud9-workspace --instance-type c5.9xlarge --automatic-stop-time-minutes 10080
