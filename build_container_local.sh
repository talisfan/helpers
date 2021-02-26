sudo docker logout
sudo docker image rm -f products-integration-customers:latest
sudo docker build -t products-integration-customers .
sudo docker tag products-integration-customers:latest
sudo docker run --name products-integration-customers -d products-integration-customers

# Access terminal
#sudo docker exec -it products-integration-customers /bin/bash