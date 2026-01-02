# Root Terraform configuration
# Calls all modules to create complete infrastructure

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 bucket for application data
module "s3" {
  source = "./modules/s3"
  
  bucket_name = var.bucket_name
  environment = var.environment
}

# SSM parameters for configuration
module "ssm" {
  source = "./modules/ssm"
  
  parameters  = var.ssm_parameters
  environment = var.environment
}

# IAM role for service access
module "iam" {
  source = "./modules/iam"
  
  role_name   = var.iam_role_name
  environment = var.environment
}