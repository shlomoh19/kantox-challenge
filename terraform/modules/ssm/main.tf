# SSM Parameter Store module
# Creates parameters for application configuration

resource "aws_ssm_parameter" "parameters" {
  for_each = var.parameters
  
  name        = each.key
  description = each.value.description
  type        = each.value.type
  value       = each.value.value
  
  tags = {
    Environment = var.environment
    Project     = "kantox-challenge"
    ManagedBy   = "terraform"
  }
}