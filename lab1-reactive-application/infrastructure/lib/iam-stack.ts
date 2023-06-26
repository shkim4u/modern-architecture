import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {aws_iam, Stack, StackProps} from "aws-cdk-lib";
import {Role} from "aws-cdk-lib/aws-iam";

export class IamStack extends Stack {
  readonly adminRole: Role;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const ec2AdminRole = new aws_iam.Role(
      this,
      `${id}-${props?.env?.region}-AdminRole`,
      {
        roleName: "ec2-admin",
        assumedBy: new aws_iam.ServicePrincipal('ec2.amazonaws.com')
      }
    );
    ec2AdminRole.addManagedPolicy(aws_iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));

    new aws_iam.CfnInstanceProfile(
      this,
      `${id}-${props?.env?.region}-AdminInstanceProfile`,
      {
        instanceProfileName: "ec2-admin",
        roles: [ec2AdminRole.roleName]
      }
    );

    this.adminRole = ec2AdminRole;

    // Print.
    new cdk.CfnOutput(
      this,
      `EC2 Admin Role ARN`, {
        value: ec2AdminRole.roleArn
      }
    );
  }
}
