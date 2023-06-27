import * as cdk from 'aws-cdk-lib';
import {aws_ec2, aws_elasticache, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {ISubnet} from "aws-cdk-lib/aws-ec2";

export class RedisStack extends Stack {

    readonly ecClusterReplicationGroup: aws_elasticache.CfnReplicationGroup;

    constructor(scope: Construct, id: string, vpc: aws_ec2.Vpc, sourceSecurityGroup: aws_ec2.SecurityGroup, subnets?: ISubnet[], props?: StackProps) {
        super(scope, id, props);

        /**
         * ElastiCache for Redis
         */
        // Security Group.
        const ecSecurityGroup = new aws_ec2.SecurityGroup(
            this,
            `${id}-RedisSG`,
            {
                vpc: vpc,
                description: 'SecurityGroup associated with the ElastiCache Redis Cluster',
                allowAllOutbound: true
            }
        );

        /**
         * 식별된 소스 범위를 나열할 것.
         * https://ap-northeast-2.console.aws.amazon.com/vpc/home?region=ap-northeast-2#securityGroups:group-id=sg-012df501fb6a869db
         */
        ecSecurityGroup.connections.allowFrom(sourceSecurityGroup, aws_ec2.Port.tcp(6379), 'Reactive application server');

        let privateSubnets: string[] = [];
        if (vpc.privateSubnets?.length > 0) {
            vpc.privateSubnets.forEach(
                function(subnet) {
                    privateSubnets.push(subnet.subnetId)
                }
            );
        } else if (subnets && subnets.length > 0) {
            /**
             * Fallback to the created subnets in network stack if privateSubnets attribute does not have any.
             */
            subnets.forEach(
                function(subnet) {
                    privateSubnets.push(subnet.subnetId)
                }
            );
        } else {
            // What if nothing else?
        }

        const ecSubnetGroup = new aws_elasticache.CfnSubnetGroup(
            this,
            `${id}-RedisClusterPrivateSubnetGroup`,
            {
                cacheSubnetGroupName: `${id}-RedisSubnetGroup`,
                subnetIds: privateSubnets,
                description: "ElastiCache Redis Subnet Group",
            }
        );

        this.ecClusterReplicationGroup = new aws_elasticache.CfnReplicationGroup(
            this,
            `${id}-RedisReplicaGroup`,
            {
                replicationGroupId: `${id}-RedisReplicaGroup`,
                replicationGroupDescription: "RedisReplicationGroup",
                // atRestEncryptionEnabled: true,
                multiAzEnabled: true,
                // cacheNodeType: "cache.t3.medium",       // TODO: Parameterized.
                cacheNodeType: "cache.m5.large",
                // cacheNodeType: "cache.m5.xlarge",
                // cacheNodeType: "cache.t3.small",
                cacheSubnetGroupName: ecSubnetGroup.cacheSubnetGroupName,
                engine: "Redis",
                // engineVersion: '6.x',
                numNodeGroups: 1,
                // kmsKeyId: ecKmsKey.keyId,
                replicasPerNodeGroup: 2,
                securityGroupIds: [ecSecurityGroup.securityGroupId],
                // automaticFailoverEnabled: true,
                // autoMinorVersionUpgrade: true,
                // transitEncryptionEnabled: true,
            }
        );
        this.ecClusterReplicationGroup.addDependency(ecSubnetGroup);
/*
        const redisCluster = new elasticache.CfnCacheCluster(
            this,
            `${id}-RedisCluster`,
            {
                engine: "redis",
                cacheNodeType: "cache.m5.large",
                // azMode: "cross-az",      // Memcached Only.
                numCacheNodes: 1,
                clusterName: `${id}-RedisCluster`,
                vpcSecurityGroupIds: [ecSecurityGroup.securityGroupId],
                cacheSubnetGroupName: ecSubnetGroup.cacheSubnetGroupName
            }
        );
        redisCluster.addDependsOn(ecSubnetGroup);
*/

        /**
         * Print the output.
         */

        // Redis.
        new cdk.CfnOutput(
            this,
            `${id}-RedisURL`,
            {
                value: this.ecClusterReplicationGroup.attrPrimaryEndPointAddress
            }
        );

        new cdk.CfnOutput(
            this,
            `${id}-RedisPort`,
            {
                value: this.ecClusterReplicationGroup.attrPrimaryEndPointPort
            }
        );
    }
}
