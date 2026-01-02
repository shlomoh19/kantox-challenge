variable "parameters" {
  description = "Map of SSM parameters to create"
  type = map(object({
    description = string
    type        = string
    value       = string
  }))
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}