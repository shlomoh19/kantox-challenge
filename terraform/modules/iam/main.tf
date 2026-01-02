# IAM role for Kubernetes service accounts
# Allows pods to access AWS without hardcoded credentials

resource "aws_iam_role" "service_role" {
  name = var.role_name
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
  
  tags = {
    Name        = var.role_name
    Environment = var.environment
    Project     = "kantox-challenge"
    ManagedBy   = "terraform"
  }
}

# Policy: Allow S3 read access
resource "aws_iam_role_policy" "s3_read_policy" {
  name = "${var.role_name}-s3-read"
  role = aws_iam_role.service_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:ListBucket",
        "s3:ListAllMyBuckets"
      ]
      Resource = "*"
    }]
  })
}

# Policy: Allow SSM read access
resource "aws_iam_role_policy" "ssm_read_policy" {
  name = "${var.role_name}-ssm-read"
  role = aws_iam_role.service_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ]
      Resource = "arn:aws:ssm:*:*:parameter/*"
    }]
  })
}