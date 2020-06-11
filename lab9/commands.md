kubectl cluster-info
kubectl create -f nginx-deployment.yml
kubectl get deployment
kubectl get deploy
kubectl get replicaset
kubectl get rs
kubectl describe deploy my-nginx-deployment
kubectl get pods
kubectl describe pod my-nginx-deployment-7689db8f-6zq24
kubectl create -f myapp-service-nodeport.yml
kubectl describe service my-app-service
kubectl delete svc mybackend-service
kubectl delete deploy
kubectl exec -ti dnsutils -- nslookup redis-service