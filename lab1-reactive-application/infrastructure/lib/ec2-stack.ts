import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {
    aws_ec2,
    aws_elasticloadbalancingv2,
    aws_elasticloadbalancingv2_targets,
    Duration,
    Stack,
    StackProps
} from "aws-cdk-lib";
import {Role} from "aws-cdk-lib/aws-iam";
import {ApplicationProtocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class Ec2Stack extends Stack {
    readonly ec2Instance: aws_ec2.Instance;
    readonly ec2InstanceSecurityGroup: aws_ec2.SecurityGroup;
    readonly albInstanceSecurityGroup: aws_ec2.SecurityGroup;

    constructor(
        scope: Construct,
        id: string,
        vpc: aws_ec2.IVpc,
        publicSubnets: aws_ec2.ISubnet[],
        privateSubnets: aws_ec2.ISubnet[],
        role: Role,
        props: StackProps
    ) {
        super(scope, id, props);

        /*
         * Create a security group for ALB.
         */
        this.albInstanceSecurityGroup = new aws_ec2.SecurityGroup(
            this,
            `${id}-ALB-SecurityGroup`,
            {
                vpc,
                allowAllOutbound: true,
                description: 'Security group for ALB',
            }
        );
        this.albInstanceSecurityGroup.addIngressRule(
            aws_ec2.Peer.anyIpv4(),
            aws_ec2.Port.tcp(80),
            'Allow HTTP for ALB',
        );

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
        this.ec2InstanceSecurityGroup.addIngressRule(this.albInstanceSecurityGroup, aws_ec2.Port.tcp(8080), 'Allow 8080 for EC2');

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
                        privateSubnets[0]
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

        const alb = new aws_elasticloadbalancingv2.ApplicationLoadBalancer(
            this,
            `${id}-ALB`,
            {
                loadBalancerName: `${id}-ALB`,
                vpc: vpc,
                vpcSubnets: {
                    subnets: publicSubnets
                },
                internetFacing: true,
                securityGroup: this.albInstanceSecurityGroup,
            }
        );
        alb.node.addDependency(this.ec2Instance);

        const listener = alb.addListener(
            `${id}-ALB-Listener`,
            {
                protocol: ApplicationProtocol.HTTP,
                port: 80,
                open: true
            }
        );
        listener.addTargets(
            `${id}-ALB-Target`,
            {
                port: 8080,
                targets: [new aws_elasticloadbalancingv2_targets.InstanceTarget(this.ec2Instance)],
                healthCheck: {
                    path: '/',
                    unhealthyThresholdCount: 2,
                    healthyThresholdCount: 5,
                    interval: cdk.Duration.seconds(30),
                    healthyHttpCodes: '200,301,302,404'
                },
            }
        );

        /**
         * Outputs
         */
        // new cdk.CfnOutput(
        //     this,
        //     `${id}-EC2-Server-PublicIp`, {
        //         value: this.ec2Instance.instancePublicIp
        //     }
        // );

        new cdk.CfnOutput(
            this,
            `${id}-EC2-Server-PrivateIp`, {
                value: this.ec2Instance.instancePrivateIp
            }
        );

        new cdk.CfnOutput(
            this,
            `${id}-ALB-DnsName`, {
                value: alb.loadBalancerDnsName
            }
        );
    }
}
