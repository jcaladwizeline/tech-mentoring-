################################################################################
# Supporting Resources
################################################################################

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 2"

  name = "test_vpc"
  cidr = "10.99.0.0/18"

  azs              = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets   = ["10.99.0.0/24", "10.99.1.0/24", "10.99.2.0/24"]
  private_subnets  = ["10.99.3.0/24", "10.99.4.0/24", "10.99.5.0/24"]
  database_subnets = ["10.99.7.0/24", "10.99.8.0/24", "10.99.9.0/24"]

  create_database_subnet_group           = true
  create_database_subnet_route_table     = true
  create_database_internet_gateway_route = true

  enable_dns_hostnames = true
  enable_dns_support   = true

}

module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4"

  name        = "mentoring_security_group"
  description = "Mentoring PostgreSQL security group"
  vpc_id      = module.vpc.vpc_id

  # ingress
  ingress_with_cidr_blocks = [
    {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      description = "PostgreSQL access from within VPC"
      cidr_blocks = module.vpc.vpc_cidr_block
    },
    {
      from_port   = 0
      to_port     = 0
      protocol    = -1
      description = "all"
      cidr_blocks = "0.0.0.0/0"
    },
  ]

}


################################################################################
# RDS Module
################################################################################
module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 3.0"

  identifier = "mentoring"

  # All available versions: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts
  engine               = "postgres"
  engine_version       = "12.9"
  family               = "postgres12" # DB parameter group
  major_engine_version = "12"         # DB option group
  instance_class       = "db.t2.micro"
  skip_final_snapshot  = true

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = false
  publicly_accessible   = true

  # NOTE: Do NOT use 'user' as the value for 'username' as it throws:
  # "Error creating DB Instance: InvalidParameterValue: MasterUsername
  # user cannot be used as it is a reserved word used by the engine"
  name     = "postgres"
  username = "postgres"
  password = "postgres"
  port     = 5432

  subnet_ids             = module.vpc.public_subnets
  vpc_security_group_ids = [module.security_group.security_group_id]

}
