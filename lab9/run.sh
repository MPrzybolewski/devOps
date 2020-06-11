#!/bin/sh

cd mybackend
docker build -t marekprzybolewski/mybackend
docker push marekprzybolewski/mybackend
cd ..

kubectl apply -f redis-deployment.yml
kubectl apply -f redis-service-clusterip.yml
kubectl apply -f postgres-secret.yml
kubectl apply -f myapp-configmap.yml
kubectl apply -f postgres-pvc.yml
kubectl apply -f postgres-deployment.yml
kubectl apply -f postgres-service-clusterip.yml
kubectl apply -f mybackend-deployment.yml
kubectl apply -f mybackend-service-nodeport.yml

