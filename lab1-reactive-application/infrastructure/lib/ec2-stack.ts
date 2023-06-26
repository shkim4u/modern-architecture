import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {aws_ec2, Stack, StackProps} from "aws-cdk-lib";
import {Role} from "aws-cdk-lib/aws-iam";

export class Ec2Stack extends Stack {
    readonly ec2Instance: aws_ec2.Instance;
    readonly ec2InstanceSecurityGroup: aws_ec2.SecurityGroup;

    constructor(
        scope: Construct,
        id: string,
        vpc: aws_ec2.IVpc,
        publicSubnets: aws_ec2.ISubnet[],
        role: Role,
        props: StackProps
    ) {
        super(scope, id, props);

        /*
         * Create a security group for an EC2 instance.
         */
        this.ec2InstanceSecurityGroup = new aws_ec2.SecurityGroup(
            this,
            `${id}-EC2-Server-SecurityGroup`,
            {
                vpc,
                allowAllOutbound: true,
                description: 'Security group for a server host',
            }
        );

        /*
         * Create an EC2 instance.
         */
        this.ec2Instance = new aws_ec2.Instance(
            this,
            `${id}-${props?.env?.region}-EC2-Server`,
            {
                instanceName: `${id}-${props?.env?.region}-EC2-Server`,
                vpc: vpc,
                vpcSubnets: {
                    // subnetType: aws_ec2.SubnetType.PUBLIC,
                    subnets: [
                        publicSubnets[0]
                    ]
                },
                role: role,
                securityGroup: this.ec2InstanceSecurityGroup,
                instanceType: aws_ec2.InstanceType.of(
                    aws_ec2.InstanceClass.M5,
                    aws_ec2.InstanceSize.XLARGE4,
                ),
                machineImage: new aws_ec2.AmazonLinuxImage(
                    {
                        generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
                    }
                ),
            }
        );
        this.ec2Instance.node.addDependency(this.ec2InstanceSecurityGroup);

        /**
         * Outputs
         */
        new cdk.CfnOutput(
            this,
            `${id}-Rds-Bastion-PublicIp`, {
                value: this.ec2Instance.instancePublicIp
            }
        );

        new cdk.CfnOutput(
            this,
            `${id}-Rds-Bastion-PrivateIp`, {
                value: this.ec2Instance.instancePrivateIp
            }
        );

    }
}
