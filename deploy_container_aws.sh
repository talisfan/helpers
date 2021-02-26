# Code from ECR push commands

aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin 981476327087.dkr.ecr.us-east-1.amazonaws.com
sudo docker image rm -f products-integration-customers:latest 981476327087.dkr.ecr.us-east-1.amazonaws.com/products-integration-customers:latest
sudo docker build -t products-integration-customers .
sudo docker tag products-integration-customers:latest 981476327087.dkr.ecr.us-east-1.amazonaws.com/products-integration-customers:latest
sudo docker push 981476327087.dkr.ecr.us-east-1.amazonaws.com/products-integration-customers:latest
