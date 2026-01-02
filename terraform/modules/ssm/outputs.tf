output "parameter_names" {
  description = "Names of created parameters"
  value       = [for param in aws_ssm_parameter.parameters : param.name]
}