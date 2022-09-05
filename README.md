# Learning Hour: Kubectl basic skills (AWS EKS version)

## Login via your AWS account to a cluster by name


1. Ensure you're logged in with correct AWS account first (with `$ aws configure`)
2. `$ aws eks --region {aws-region} update-kubeconfig --name {cluster-name}`

## Switch to the context by name

View all contexts available:

```
$ kubectl config get-contexts
```

Switch to the specific context:

```
$ kubectl config use-context arn:aws:eks:{aws-region}:cluster/{cluster-name}
```

## Switch to the namespace for this learning hour

```
$ kubectl config set-context --current --namespace=learning-hour
```

*You can use this command to switch to any named namespace that you have access to.*

## List namespaces

```
$ kubectl get namespaces
```

## Get the list of deployments

*Deployment — the configuration of the running application on the cluster. Controls & manages the actual pods and containers.*

```
$ kubect get deployments
```

You should see something like:

```
NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
hello-world-deployment   1/1     1            1           8m31s
```

## Describe the details of the deployment

```
$ kubectl describe deployment hello-world-deployment
```

You should see something like:

```
Name:                   hello-world-deployment
Namespace:              learning-hour
CreationTimestamp:      Mon, 05 Sep 2022 09:32:41 +0200
Labels:                 app=hello-world
Annotations:            deployment.kubernetes.io/revision: 1
Selector:               app=hello-world
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=hello-world
  Containers:
   server:
    Image:      tddfellow/nodejs-hello-world:latest
    Port:       8080/TCP
    Host Port:  0/TCP
    Environment:
      PORT:  8080
    Mounts:  <none>
  Volumes:   <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   hello-world-deployment-7c76b9b7f4 (1/1 replicas created)
Events:
  Type    Reason             Age    From                   Message
  ----    ------             ----   ----                   -------
  Normal  ScalingReplicaSet  9m13s  deployment-controller  Scaled up replica set hello-world-deployment-7c76b9b7f4 to 1
```

## Get the list of pods

*Pod — an actual instance of the application running on the cluster. It can have 1 or more docker containers running inside of it.*

```
$ kubectl get pods
```

You should see something like:

```
NAME                                      READY   STATUS    RESTARTS   AGE
hello-world-deployment-7c76b9b7f4-xcl48   1/1     Running   0          10m
```

The part `7c76b9b7f4-xcl48` might differ. When deployment restarts the pod it generates a new unique value every time.

## Describe the pod

```
$ kubectl describe pod {pod-name}
```

*Usually, you have to copy the pod name from the pod list.*

You should see something like this:

```
Name:         hello-world-deployment-7c76b9b7f4-xcl48
Namespace:    learning-hour
Priority:     0
Node:         ip-##-##-##-###.############.compute.internal/##.##.##.###
Start Time:   Mon, 05 Sep 2022 09:32:41 +0200
Labels:       app=hello-world
              pod-template-hash=7c76b9b7f4
Annotations:  kubernetes.io/psp: eks.privileged
Status:       Running
IP:           ##-##-##-###
IPs:
  IP:           ##-##-##-###
Controlled By:  ReplicaSet/hello-world-deployment-7c76b9b7f4
Containers:
  server:
    Container ID:   docker://##############################################
    Image:          tddfellow/nodejs-hello-world:latest
    Image ID:       docker-pullable://tddfellow/nodejs-hello-world@sha256:##############################################
    Port:           8080/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Mon, 05 Sep 2022 09:32:47 +0200
    Ready:          True
    Restart Count:  0
    Environment:
      PORT:  8080
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-45rpb (ro)
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
Volumes:
  default-token-45rpb:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-45rpb
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                 node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  13m   default-scheduler  Successfully assigned learning-hour/hello-world-deployment-7c76b9b7f4-xcl48 to ip-##-##-##-###.###########.compute.internal
  Normal  Pulling    12m   kubelet            Pulling image "tddfellow/nodejs-hello-world:latest"
  Normal  Pulled     12m   kubelet            Successfully pulled image "tddfellow/nodejs-hello-world:latest" in 4.385947268s
  Normal  Created    12m   kubelet            Created container server
  Normal  Started    12m   kubelet            Started container server
```

## View the pod's logs

Output the latest logs just once and exit:

```
$ kubectl logs {pod-name}
```

Follow (or tail) the logs continuously (until interrupted with CTRL+C):

```
$ kubectl logs --follow {pod-name}
```

You should see something like this:

```
yarn run v1.22.19
$ node ./hello-world.js
Listening on port :8080
received GET /hello with name=world
```

## Kill the pod

If the pod for some reason becomes unresponsive, you may want to kill it:

```
$ kubectl delete pod {pod-name}
```

You should see the following output:

```
pod "hello-world-deployment-7c76b9b7f4-xcl48" deleted
```

However, if you list the pods again (`kubectl get pods`), you'll see that the pod is back up again under different name. That's a deployment ensuring that there is at least minimum number of instances of your application.

Important note: killing pod in such a manner may cause downtime. It's a very abrupt way to restart the pod.

## Restarting the pod properly

If you have a deployment ensuring 2 or more instances, then you can perform a much safer restart (without or close to without any downtime):

```
$ kubectl rollout restart deployment hello-world-deployment
```

It will start the new instance(s) first, and then kill the old one(s). If you do `kubectl get pods` shortly after, you should see something like this:

```
NAME                                      READY   STATUS        RESTARTS   AGE
hello-world-deployment-58f747644d-2xzcr   1/1     Running       0          8s
hello-world-deployment-7c76b9b7f4-l2f56   0/1     Terminating   0          2m46s
```

## Execute commands inside of the pod

Let's say, something isn't working and you're struggling to identify why. Last resort would be to drop into the pod's shell and start investigating why. You can do this with the following command:

```
$ kubectl exec -it {pod-name} -- sh
```

In a pinch, this can be used to run scripts from inside of the container:

```
/app # node example-script.js
```

If you've done everything correctly, you should see the following output:

```
Congratulations! You've run the example script successfully!
/app #
```

## Get list of services

*Service — an exposed container port (not necessarily to the world, but at least to other containers of the cluster, and some AWS resources.*

```
$ kubectl get services
```

You should see something like this:

```
NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
hello-world-service   ClusterIP   172.20.76.241   <none>        8080/TCP,9090/TCP   37m
```

## Describe a service

```
$ kubectl describe service hello-world-service
```

You should see something like this:

```
Name:              hello-world-service
Namespace:         learning-hour
Labels:            app=hello-world
Annotations:       <none>
Selector:          app=hello-world
Type:              ClusterIP
IP Families:       <none>
IP:                ###.##.##.###
IPs:               ###.##.##.###
Port:              http  8080/TCP
TargetPort:        8080/TCP
Endpoints:         ###.##.##.###:8080
Port:              secret  9090/TCP
TargetPort:        9090/TCP
Endpoints:         ###.##.##.###:9090
Session Affinity:  None
Events:            <none>
```

## Port-forward a service's port to your localhost

The example application has 2 ports, one public and one "secret." The secret port can be used only by internal parts of the cloud. You can also gain temporary access to this secret port via port-forwarding:

```
$ kubectl port-forward service/hello-world-service 9090:9090
```

And then try accessing http://localhost:9090/secret. You should see:

```
{"message":"this is a secret endpoint!"}
```

You can stop port-forwarding by interrupting the `kubectl port-forward` process with CTRL+C.
