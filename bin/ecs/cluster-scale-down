#!/usr/bin/bash

CLUSTER_NAME="cruddur"
# SERVICE="backend-flask"

# Scale down backend
# aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE --desired-count 0

# SERVICE="frontend-react-js"
# Scale down frontend
# aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE --desired-count 0

# Scale down all services in the cluster
for service in $(aws ecs list-services --cluster $CLUSTER_NAME --output text | awk '{print $2}'); do aws ecs update-service --cluster $CLUSTER_NAME --service $service --desired-count 0; done