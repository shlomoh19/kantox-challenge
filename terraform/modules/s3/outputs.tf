# Outputs from S3 module

output "bucket_name" {
  description = "Name of created S3 bucket"
  value       = aws_s3_bucket.app_bucket.id
}

output "bucket_arn" {
  description = "ARN of created S3 bucket"
  value       = aws_s3_bucket.app_bucket.arn
}