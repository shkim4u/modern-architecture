import * as cdk from 'aws-cdk-lib';
import {aws_ec2, Stack, StackProps} from 'aws-cdk-lib';
import {CfnEIP, CfnNatGateway, CfnRoute, ISubnet} from "aws-cdk-lib/aws-ec2";
import {Construct} from "constructs";
import {InfrastructureEnvironment} from "../bin/infrastructure-environment";

export class NetworkStack extends Stack {
    readonly vpc: aws_ec2.Vpc;
    readonly eksPublicSubnets: ISubnet[];
    readonly eksPrivateSubnets: ISubnet[];
    readonly eksAllSubnets: ISubnet[];

    constructor(
        scope: Construct,
        id: string,
        networkInformation: InfrastructureEnvironment,
        props?: StackProps
    ) {
        super(scope, id, props);

        this.vpc = new aws_ec2.Vpc(
            this,
            `${id}-VPC`,
            {
                // cidr: networkInformation.vpcCidr,  // Deprecated.
                ipAddresses: aws_ec2.IpAddresses.cidr(networkInformation.vpcCidr),
                maxAzs: 3,
                subnetConfiguration: []
            }
        );

        const igw = new aws_ec2.CfnInternetGateway(
            this,
            `${id}-IGW`,
            {}
        );
        const igwAttachment = new aws_ec2.CfnVPCGatewayAttachment(
            this,
            `${id}-VPCGWA`,
            {
                vpcId: this.vpc.vpcId,
                internetGatewayId: igw.ref
            }
        );
        const publicSubnetA = new aws_ec2.PublicSubnet(
            this,
            `${id}-PublicSubnet-a`,
            {
                availabilityZone: `${props?.env?.region}a`,
                cidrBlock: networkInformation.cidrPublicSubnetAZa ?? "10.220.0.0/22",
                vpcId: this.vpc.vpcId,
                mapPublicIpOnLaunch: true,
            }
        );
        publicSubnetA.addDefaultInternetRoute(igw.ref, igwAttachment);

        const publicSubnetC = new aws_ec2.PublicSubnet(
            this,
            `${id}-PublicSubnet-c`,
            {
                availabilityZone: `${props?.env?.region}c`,
                cidrBlock: networkInformation.cidrPublicSubnetAZc ?? "10.220.12.0/22",
                vpcId: this.vpc.vpcId,
                mapPublicIpOnLaunch: true
            }
        );
        publicSubnetC.addDefaultInternetRoute(igw.ref, igwAttachment);

        // Create a NAT gateway in this public subnet-a.
        const ngwA = new CfnNatGateway(
            this,
            `${id}-NATGateway-a`,
            {
                subnetId: publicSubnetA.subnetId,
                allocationId: new CfnEIP(
                    this,
                    `${id}-NATGatewayEIP-a`,
                    {
                        domain: 'vpc'
                    }
                ).attrAllocationId,
            }
        );

        // Create another NAT gateway in this public subnet-c.
        const ngwC = new CfnNatGateway(
            this,
            `${id}-NATGateway-c`,
            {
                subnetId: publicSubnetC.subnetId,
                allocationId: new CfnEIP(
                    this,
                    `${id}-NATGatewayEIP-c`,
                    {
                        domain: 'vpc'
                    }
                ).attrAllocationId,
            }
        );

        console.log(`Region: ${props?.env?.region}`);

        // Private subnet 1 on AZ-a.
        const privateSubnetA = new aws_ec2.PrivateSubnet(
            this,
            `${id}-PrivateSubnet-a`,
            {
                availabilityZone: `${props?.env?.region}a`,
                cidrBlock: networkInformation.cidrPrivateSubnetAZa ?? "10.220.4.0/22",
                vpcId: this.vpc.vpcId,
                mapPublicIpOnLaunch: false
            }
        );

        // Private subnet 2 on AZ-c.
        const privateSubnetC = new aws_ec2.PrivateSubnet(
            this,
            `${id}-PrivateSubnet-c`,
            {
                availabilityZone: `${props?.env?.region}c`,
                cidrBlock: networkInformation.cidrPrivateSubnetAZc ?? "10.220.8.0/22",
                vpcId: this.vpc.vpcId,
                mapPublicIpOnLaunch: false
            }
        );

        this.eksPublicSubnets = [publicSubnetA, publicSubnetC];
        this.eksPrivateSubnets = [privateSubnetA, privateSubnetC];
        this.eksAllSubnets = this.eksPublicSubnets.concat(this.eksPrivateSubnets);

        // Attach route table for each private subnets.
        this.eksPrivateSubnets.forEach(
            ({routeTable: {routeTableId}}, index) => {
                new CfnRoute(
                    this,
                    id + '-private-natgw-route-' + index,
                    {
                        destinationCidrBlock: '0.0.0.0/0',
                        routeTableId: routeTableId,
                        natGatewayId: (index == 0 ? ngwA.ref : ngwC.ref)
                    }
                );
            }
        );

        // Define arrow function that tags subnets.
        const tagAllSubnets = (
            subnets: aws_ec2.ISubnet[],
            tagName: string,
            tagValue: string,
        ) => {
            for (const subnet of subnets) {
                cdk.Tags.of(subnet).add(
                    tagName,
                    `${tagValue}`,
                );
            }
        };
        /*
         * Tag target private subnets to hold necessary tag values.
         * - Key: kubernetes.io/role/internal-elb
         * - Value: 1
         * https://aws.amazon.com/ko/premiumsupport/knowledge-center/eks-vpc-subnet-discovery/
         */
        tagAllSubnets(this.eksPrivateSubnets, 'kubernetes.io/role/internal-elb', '1');
        // For Karpenter
        tagAllSubnets(this.eksPrivateSubnets, `karpenter.sh/discovery/${networkInformation.stackNamePrefix}-EksCluster`, '1');

        /**
         * Fix missing tag for public subnet.
         * (Note) This is for ALB/NLB attached to the public subnet in the past and backward compatibility.
         */
        cdk.Tags.of(publicSubnetA).add(
            'kubernetes.io/role/elb', '1'
        );
        cdk.Tags.of(publicSubnetA).add(
            'aws-cdk:subnet-type',
            'Public'
        );
        cdk.Tags.of(publicSubnetC).add(
            'kubernetes.io/role/elb', '1'
        );
        cdk.Tags.of(publicSubnetC).add(
            'aws-cdk:subnet-type',
            'Public'
        );
        // Print outputs.
        // Stack
        new cdk.CfnOutput(
            this,
            `${id}-StackId`, {
                value: this.stackId
            });

        new cdk.CfnOutput(
            this,
            `${id}-StackName`, {
                value: this.stackName
            });

        // VPC ID.
        new cdk.CfnOutput(
            this,
            `${id}-VPCId`, {
                value: this.vpc.vpcId
            }
        );
        // VPC.
        new cdk.CfnOutput(
            this,
            `${id}-VPCCidr`, {
                exportName: "NetworkStackVPCCidr",
                value: this.vpc.vpcCidrBlock
            }
        );

        // Subnets.
        this.eksPublicSubnets.forEach(
            (subnet, index) => {
                new cdk.CfnOutput(
                    this,
                    `${id}-PublicSubnet-${index}`, {
                        value: subnet.ipv4CidrBlock
                    }
                )
            }
        );
        this.eksPrivateSubnets.forEach(
            (subnet, index) => {
                new cdk.CfnOutput(
                    this,
                    `${id}-PrivateSubnet-${index}`, {
                        value: subnet.ipv4CidrBlock
                    }
                )
            }
        );
    }

}
