bucket_name    = "kantox-app-bucket-prod"
environment    = "production"
iam_role_name  = "kantox-service-role"

ssm_parameters = {
  "/kantox/prod/database-url" = {
    description = "Database connection string"
    type        = "String"
    value       = "postgresql://prod-db:5432/kantox"
  }
  "/kantox/prod/api-key" = {
    description = "External API key"
    type        = "String"
    value       = "prod-api-key-secure-12345"
  }
  "/kantox/prod/feature-flag" = {
    description = "Feature toggle"
    type        = "String"
    value       = "true"
  }
}