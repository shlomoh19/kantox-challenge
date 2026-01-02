variable "role_name" {
  description = "IAM role name"
  type        = string
}

variable "environment" {
  description = "Environment"
  type        = string
  default     = "dev"
}