export class InfrastructureEnvironment {
  readonly stackNamePrefix: string;
  readonly vpcCidr: string;
  // Use Karpenter for EKS autoscaling.
  readonly useKarpenter?: boolean = true;
  // Will it be okay one public and private subnet per each AZ?
  readonly cidrPublicSubnetAZa?: string;
  readonly cidrPublicSubnetAZb?: string;
  readonly cidrPublicSubnetAZc?: string;
  readonly cidrPrivateSubnetAZa?: string;
  readonly cidrPrivateSubnetAZb?: string;
  readonly cidrPrivateSubnetAZc?: string;
  readonly eksClusterAdminIamUsers?: string[];
  readonly eksClusterAdminIamRoles?: string[];
}
