variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "bucket_name" {
  description = "S3 bucket name"
  type        = string
}

variable "iam_role_name" {
  description = "IAM role name"
  type        = string
  default     = "kantox-service-role"
}

variable "ssm_parameters" {
  description = "SSM parameters to create"
  type = map(object({
    description = string
    type        = string
    value       = string
  }))
}