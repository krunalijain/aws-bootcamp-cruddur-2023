# Week 2 — Distributed Tracing

## Required Homework
**- Attended Live session : Observability** and understood the use of **Honeycomb**, which is an application used for logging and tracing data. Also used OTEL-Open Telemetry open source observability framework with Honeycomb to instrument traces and logs.

## HONEYCOMB 

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
Honeycomb Code in my `home_activites.py` which is in `backend-flask`
```
from datetime import datetime, timedelta, timezone
from opentelemetry import trace
import logging

tracer = trace.get_tracer("home.activities")

class HomeActivities:
  def run():
   logger.info("HomeActivities")
   with tracer.start_as_current_span("home-activities-mock-data"):
    span = trace.get_current_span()
    now = datetime.now(timezone.utc).astimezone()
    span.set_attribute("app.now", now.isoformat())
    results = [{
      'uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
      'handle':  'Andrew Brown',
      'message': 'Cloud is fun!',
      'created_at': (now - timedelta(days=2)).isoformat(),
      'expires_at': (now + timedelta(days=5)).isoformat(),
      'likes_count': 5,
      'replies_count': 1,
      'reposts_count': 0,
      'replies': [{
        'uuid': '26e12864-1c26-5c3a-9658-97a10f8fea67',
        'reply_to_activity_uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
        'handle':  'Worf',
        'message': 'This post has no honor!',
        'likes_count': 0,
        'replies_count': 0,
        'reposts_count': 0,
        'created_at': (now - timedelta(days=2)).isoformat()
      }],
    },
    {
      'uuid': '66e12864-8c26-4c3a-9658-95a10f8fea67',
      'handle':  'Worf',
      'message': 'I am out of prune juice',
      'created_at': (now - timedelta(days=7)).isoformat(),
      'expires_at': (now + timedelta(days=9)).isoformat(),
      'likes': 0,
      'replies': []
    },
    {
      'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
      'handle':  'Garek',
      'message': 'My dear doctor, I am just simple tailor',
      'created_at': (now - timedelta(hours=1)).isoformat(),
      'expires_at': (now + timedelta(hours=12)).isoformat(),
      'likes': 0,
      'replies': []
    }
    ]
    span.set_attribute("app.result_length", len(results))
    return results
  ```
**NOTE: I have not defined 'Logger' because I had to proceed with further tasks. So once my work was done I have chnanged the code.**

 

