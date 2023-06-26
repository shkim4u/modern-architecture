#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import {InfrastructureEnvironment} from "./infrastructure-environment";

const app = new cdk.App();

/**
 * CDK_INTEG_XXX are set when producing the environment-aware values and CDK_DEFAULT_XXX is passed in through from the CLI in actual deployment.
 */
const env = {
    region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
};

/**
 * Basic infrastructure information including some for Amazon EKs cluster.
 * (참고) 아래에서 반드시 EKS Admin User와 Admin Role을 자신의 환경에 맞게 설정한다.
 * (참고) 설정하지 않아도 EKS 클러스터 생성 후에도 kubectl로 접근할 수 있다. 방법은?
 */
const infrastructureEnvironment: InfrastructureEnvironment = {
    stackNamePrefix: "RA",
    vpcCidr: "10.220.0.0/19",
    useKarpenter: true,
    cidrPublicSubnetAZa: "10.220.0.0/22",
    cidrPublicSubnetAZc: "10.220.12.0/22",
    cidrPrivateSubnetAZa: "10.220.4.0/22",
    cidrPrivateSubnetAZc: "10.220.8.0/22",
    eksClusterAdminIamUsers: ["admin"],
    eksClusterAdminIamRoles: ["TeamRole"],
};

new InfrastructureStack(
    app,
    'InfrastructureStack', {
        env
    }
);
