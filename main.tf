terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0.0"
    }
  }
}
provider "aws" {
  region = "us-west-2"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public_subnet" {
  cidr_block              = "10.0.1.0/24"
  vpc_id                  = aws_vpc.main.id
  availability_zone       = "us-west-2a"
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "app_sg" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

variable "ami" {
  default = "ami-0b20a6f09484773af"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  default = "llaves"  # Cambia esto por el nombre de tu par de claves
}

resource "aws_launch_configuration" "users_lc" {
  name          = "users-lc"
  image_id      = var.ami
  instance_type = var.instance_type
  security_groups = [
    aws_security_group.app_sg.id
  ]
  key_name = var.key_name
  user_data = <<-EOF
              #!/bin/bash
              mysql -h ${aws_db_instance.myrds.endpoint} -u admin -p1234qwer
              EOF
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_launch_configuration" "pets_lc" {
  name          = "pets-lc"
  image_id      = var.ami
  instance_type = var.instance_type
  security_groups = [
    aws_security_group.app_sg.id
  ]
  key_name = var.key_name
  user_data = <<-EOF
              #!/bin/bash
              mysql -h ${aws_db_instance.myrds.endpoint} -u admin -p1234qwer
              EOF
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_launch_configuration" "adoptions_lc" {
  name          = "adoptions-lc"
  image_id      = var.ami
  instance_type = var.instance_type
  security_groups = [
    aws_security_group.app_sg.id
  ]
  key_name = var.key_name
   user_data = <<-EOF
              #!/bin/bash
              mysql -h ${aws_db_instance.myrds.endpoint} -u admin -p1234qwer
              EOF
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "users_asg" {
  desired_capacity     = 1
  max_size             = 2
  min_size             = 1
  launch_configuration = aws_launch_configuration.users_lc.id
  vpc_zone_identifier  = [aws_subnet.public_subnet.id]

  tag {
    key                 = "Name"
    value               = "users-instance"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_group" "pets_asg" {
  desired_capacity     = 1
  max_size             = 2
  min_size             = 1
  launch_configuration = aws_launch_configuration.pets_lc.id
  vpc_zone_identifier  = [aws_subnet.public_subnet.id]

  tag {
    key                 = "Name"
    value               = "pets-instance"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_group" "adoptions_asg" {
  desired_capacity     = 1
  max_size             = 2
  min_size             = 1
  launch_configuration = aws_launch_configuration.adoptions_lc.id
  vpc_zone_identifier  = [aws_subnet.public_subnet.id]

  tag {
    key                 = "Name"
    value               = "adoptions-instance"
    propagate_at_launch = true
  }
}

resource "aws_elb" "service_elb" {
  name            = "service-elb"
  subnets         = [aws_subnet.public_subnet.id]
  security_groups = [aws_security_group.app_sg.id]

  listener {
    instance_port     = 80
    instance_protocol = "HTTP"
    lb_port           = 80
    lb_protocol       = "HTTP"
  }

  health_check {
    target              = "HTTP:80/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  instances = []

  tags = {
    Name = "service-elb"
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "subnet_id" {
  value = aws_subnet.public_subnet.id
}

output "security_group_id" {
  value = aws_security_group.app_sg.id
}