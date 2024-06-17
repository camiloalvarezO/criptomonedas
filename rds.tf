 resource "aws_db_instance" "myrds" {
    allocated_storage   = 20
   storage_type        = "gp2"
   identifier          = "rdstf"
   engine              = "mysql"
   engine_version      = "8.0.35"
   instance_class      = "db.t3.micro"
   username            = "admin"
   password            = "1234qwer"
   publicly_accessible = false
   skip_final_snapshot = true
   endpoint = "rdstf.mondongo123.us-west-2.rds.amazonaws.com"
   tags = {
     Name = "MyRDS"
   }
 }


 resource "aws_s3_bucket" "b" {
  bucket = "my-tf-pets-bucket"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    Name        = "My bucket"
    
  }
}