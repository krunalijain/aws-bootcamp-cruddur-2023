# Week 2 — Distributed Tracing

## Required Homework
**- Attended Live session : Observability** and understood the use of **Honeycomb**, which is an application used for logging and tracing data. Also used OTEL-Open Telemetry open source observability framework with Honeycomb to instrument traces and logs. 

I created my Honeycomb account and created an environment and used that environments API Key to connect my Cruddur application data with Honeycomb.
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

 

