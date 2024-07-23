terraform {
  backend "s3" {
    bucket = "applaud-terraform-state"
    key    = "staging/vpc/terraform.tfstate"
    region = "us-west-2"
    dynamodb_table = "terraform-state-locking"
  }
}