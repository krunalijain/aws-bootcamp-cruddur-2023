# Week 2 — Distributed Tracing

## Required Homework
**Attended Live session : Observability** and understood the use of **Honeycomb**, which is an application used for logging and tracing data. Also used OTEL-Open Telemetry open source observability framework with Honeycomb to instrument traces and logs.

## #1 HONEYCOMB 

I created my Honeycomb account and created an environment and used that environment's API Key to connect my Cruddur application data with Honeycomb.
To set the Honeycomb API Key as an environment variable in Gitpod I used these commands. 
```
export HONEYCOMB_API_KEY="<your API key>"
gp env HONEYCOMB_API_KEY="<your API key>"
```
Then used this API Key in my `backend-flask` -> `docker-compose.yml` file 
```
OTEL_SERVICE_NAME: 'backend-flask'
      OTEL_EXPORTER_OTLP_ENDPOINT: "https://api.honeycomb.io"
      OTEL_EXPORTER_OTLP_HEADERS: "x-honeycomb-team=${HONEYCOMB_API_KEY}"
```
Added these code lines in `backend-flask` -> `requirements.txt` to install required packages to use OTEL services.
```
opentelemetry-api 
opentelemetry-sdk 
opentelemetry-exporter-otlp-proto-http 
opentelemetry-instrumentation-flask 
opentelemetry-instrumentation-requests
```
Here's my `app.py` code required for Honeycomb

- **To get required packages** 
```
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
```
- **Initialize tracing and an exporter that can send data to Honeycomb**
```
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)
```
- **Add inside the 'app' to  Initialize automatic instrumentation with Flask**
```
FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()

frontend = os.getenv('FRONTEND_URL')
backend = os.getenv('BACKEND_URL')
origins = [frontend, backend]
cors = CORS(
  app, 
  resources={r"/api/*": {"origins": origins}},
  expose_headers="location,link",
  allow_headers="content-type,if-modified-since",
  methods="OPTIONS,GET,HEAD,POST"
)
```
 **Trace spans by hardcode**

![](https://user-images.githubusercontent.com/115455157/222894554-155e2821-7bf0-4bdb-a2bb-3bf8cad82ab5.jpg)

## #2 AWS X-RAY
Amazon provides us another service called X-RAY which is helpful to trace requests of microservices. Analyzes and Debugs application running on distributed environment. I created segements and subsegments by following the instructional videos. 

- To get your application traced in AWS X-RAY you need to install aws-xray-sdk module. You can do this by running the below command.
```
pip install aws-xray-sdk
```
But in our bootcamp project we had added this module in our `requirements.txt` file and installed. 

- Created our own Sampling Rule name 'Cruddur'. This code was written in `aws/json/xray.json` file
```
{
  "SamplingRule": {
      "RuleName": "Cruddur",
      "ResourceARN": "*",
      "Priority": 9000,
      "FixedRate": 0.1,
      "ReservoirSize": 5,
      "ServiceName": "Cruddur",
      "ServiceType": "*",
      "Host": "*",
      "HTTPMethod": "*",
      "URLPath": "*",
      "Version": 1
  }
}
```
- **To create a new group for tracing and analyzing errors and faults in a Flask application.**
```
FLASK_ADDRESS="https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
aws xray create-group \
   --group-name "Cruddur" \
   --filter-expression "service(\"$FLASK_ADDRESS\")"
```
The above code is useful for setting up monitoring for a specific Flask service using AWS X-Ray. It creates a group that can be used to visualize and analyze traces for that service, helping developers identify and resolve issues more quickly.

Then run this command to get the above code executed 
```
aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json
```
- **Install Daemon Service**
Then I had to add X-RAY Daemon Service for that I added this part of code in my `docker-compose.yml` file.
```
 xray-daemon:
    image: "amazon/aws-xray-daemon"
    environment:
      AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
      AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
      AWS_REGION: "us-east-1"
    command:
      - "xray -o -b xray-daemon:2000"
    ports:
      - 2000:2000/udp
```
Also added Environment Variables :
```
   AWS_XRAY_URL: "*4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}*"
   AWS_XRAY_DAEMON_ADDRESS: "xray-daemon:2000"
```

## My X-RAY Error 
When I was creatigna sampling rule then at te end after setting all the things when I had to run the last coomand `aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json` to create a sampling rule I faced `Error parsing parameter` and `Error2: No such file or directory found`. 

![](https://user-images.githubusercontent.com/115455157/222896456-3dbf8ad5-d29c-46cd-a023-b1642e354692.jpg)

## Solved X-RAY Error

So, I was in the wrong directory (frontend-react-js) while performing this task. I **changed my directory to `backend-flask`** and it was working all good. 

## AWS X-RAY Subsegments
There was a problem faced while creating subsegments in AWS X-RAY. But then one of our bootcamper (Olga Timofeeva) tried to figure it out and that somewhat helped. So we added `capture` method to get subsgements and closed the segment in the end by using `end-subsegment`. Below is the code that we added additionally to bring subsegments.
```
@app.route("/api/activities/<string:activity_uuid>", methods=['GET'])
@xray_recorder.capture('activities_show')
def data_show_activity(activity_uuid):
  data = ShowActivity.run(activity_uuid=activity_uuid)
  return data, 200
```
After adding I got subsegments 
![](https://user-images.githubusercontent.com/115455157/222913066-40649d6e-d80b-49d4-8654-e2ee37a7fe83.jpg)

