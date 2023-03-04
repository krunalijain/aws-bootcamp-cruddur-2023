# Week 2 — Distributed Tracing

## Required Homework
**- Attended Live session : Observability** and understood the use of **Honeycomb**, which is an application used for logging and tracing data. Also used OTEL-Open Telemetry open source observability framework with Honeycomb to instrument traces and logs.

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

**- To get required packages** 
```
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
```
**- Initialize tracing and an exporter that can send data to Honeycomb**
```
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)
```
**- Add inside the 'app' to  Initialize automatic instrumentation with Flask**
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

To get your application traced in AWS X-RAY you need to install aws-xray-sdk module. You cn do so by running the below command.
```
pip install aws-xray-sdk
```
But in our bootcamp project we had added this module in our `requirements.txt` file and installed. 


