output "role_arn" {
  description = "ARN of created IAM role"
  value       = aws_iam_role.service_role.arn
}

output "role_name" {
  description = "Name of created IAM role"
  value       = aws_iam_role.service_role.name
}