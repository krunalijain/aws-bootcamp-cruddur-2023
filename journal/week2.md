# Week 2 — Distributed Tracing

## Table of Contents
- [Required Homework](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#required-homework)
- [HONEYCOMB](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#1-honeycomb)
    - [To get required packages](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#1-honeycomb:~:text=To%20get%20required%20packages)
    - [Initialize tracing and an exporter that can send data to Honeycomb](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#1-honeycomb:~:text=Initialize%20tracing%20and%20an%20exporter%20that%20can%20send%20data%20to%20Honeycomb)
    - [Add inside the 'app' to Initialize automatic instrumentation with Flask](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#1-honeycomb:~:text=Add%20inside%20the%20%27app%27%20to%20Initialize%20automatic%20instrumentation%20with%20Flask)
    - [Trace spans by hardcode](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#1-honeycomb:~:text=Trace%20spans%20by%20hardcode)
- [AWS X-RAY](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#2-aws-x-ray)
    - [Create a new group for tracing and analyzing errors and faults in a Flask application](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#1-honeycomb:~:text=create%20a%20new%20group%20for%20tracing%20and%20analyzing%20errors%20and%20faults%20in%20a%20Flask%20application.)
    - [Install Daemon Service](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#1-honeycomb:~:text=Install%20Daemon%20Service)
- [My X-RAY Error](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#my-x-ray-error)
- [AWS X-RAY Subsegments](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#aws-x-ray-subsegments)
- [CloudWatch](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#3-cloudwatch)
    - [Configured LOGGER to use CloudWatch](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#1-honeycomb:~:text=Configured%20LOGGER%20to%20use%20CloudWatch)
- [ROLLBAR](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#4-rollbar)
- [Rollbar Error](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#rollbar-error)
- [Pricing and Security Consideration Videos](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week2.md#5-watched-pricing-and-security-consideration-videos)

## Required Homework
**Attended Live session : Observability** and understood the use of **Honeycomb**, which is an application used for logging and tracing data. Also used OTEL-Open Telemetry open source observability framework with Honeycomb to instrument traces and logs.

## #1 HONEYCOMB 

I created my Honeycomb account and created an environment and used that environment's API Key to connect my Cruddur application data with Honeycomb.
To set the Honeycomb API Key as an environment variable in Gitpod I used these commands. 
```bash
export HONEYCOMB_API_KEY="<your API key>"
gp env HONEYCOMB_API_KEY="<your API key>"
```
Then used this API Key in my `backend-flask` -> `docker-compose.yml` file 
```yaml
OTEL_SERVICE_NAME: 'backend-flask'
      OTEL_EXPORTER_OTLP_ENDPOINT: "https://api.honeycomb.io"
      OTEL_EXPORTER_OTLP_HEADERS: "x-honeycomb-team=${HONEYCOMB_API_KEY}"
```
Added these code lines in `backend-flask` -> `requirements.txt` to install required packages to use OTEL services.
```txt
opentelemetry-api 
opentelemetry-sdk 
opentelemetry-exporter-otlp-proto-http 
opentelemetry-instrumentation-flask 
opentelemetry-instrumentation-requests
```
Here's my `app.py` code required for Honeycomb

- **To get required packages** 
```py
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
```
- **Initialize tracing and an exporter that can send data to Honeycomb**
```py
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)
```
- **Add inside the 'app' to  Initialize automatic instrumentation with Flask**
```py
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
```json
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
```py
FLASK_ADDRESS="https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
aws xray create-group \
   --group-name "Cruddur" \
   --filter-expression "service(\"$FLASK_ADDRESS\")"
```
The above code is useful for setting up monitoring for a specific Flask service using AWS X-Ray. It creates a group that can be used to visualize and analyze traces for that service, helping developers identify and resolve issues more quickly.

Then run this command to get the above code executed 
```bash
aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json
```
- **Install Daemon Service**
Then I had to add X-RAY Daemon Service for that I added this part of code in my `docker-compose.yml` file.
```yaml
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
```yaml
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
```py
@app.route("/api/activities/<string:activity_uuid>", methods=['GET'])
@xray_recorder.capture('activities_show')
def data_show_activity(activity_uuid):
  data = ShowActivity.run(activity_uuid=activity_uuid)
  return data, 200
```
After adding I got subsegments 
![](https://user-images.githubusercontent.com/115455157/222913066-40649d6e-d80b-49d4-8654-e2ee37a7fe83.jpg)

## #3 CloudWatch
For CLoudWatch I installed `watchtower` and imported `watchtower`, `logging` and `strftime from time`.
Also set env vars in backend flask in `docker-compose.yml` 
```yaml
      AWS_DEFAULT_REGION: "${AWS_DEFAULT_REGION}"
      AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
      AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
```

- **Configured LOGGER to use CloudWatch**
```py
# Configuring Logger to Use CloudWatch
LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
cw_handler = watchtower.CloudWatchLogHandler(log_group='cruddur')
LOGGER.addHandler(console_handler)
LOGGER.addHandler(cw_handler)
LOGGER.info("some message")
```
```py
@app.after_request
def after_request(response):
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    LOGGER.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
    return response
```
We randomly logged in API endpoint
```
LOGGER.info('Hello Cloudwatch! from  /api/activities/home')
```

## #4 ROLLBAR
Rollbar is used to **track errors** and monitor application if any error is there it track and helps to debug. Provides detail information about the Error.
- **Created my Rollbar account** ->  https://rollbar.com/
- **Then created a new Rollbar Project** : It asks you to setup your project , you get chance to select your SDK and also provides instructions on how to start. 
- **Access token** is provided for your new Rollbar Project.
- **Installed** `blinker` and `rollbar`.
- Set my access token 
```
export ROLLBAR_ACCESS_TOKEN=""
gp env ROLLBAR_ACCESS_TOKEN=""
```
- **Added to backend-flask for `docker-compose.yml`**
```yaml
ROLLBAR_ACCESS_TOKEN: "${ROLLBAR_ACCESS_TOKEN}"
```
- **Imported** for Rollbar
```py
import rollbar
import rollbar.contrib.flask
from flask import got_request_exception
```
```py
rollbar_access_token = os.getenv('ROLLBAR_ACCESS_TOKEN')
@app.before_first_request
def init_rollbar():
    """init rollbar module"""
    rollbar.init(
        # access token
        rollbar_access_token,
        # environment name
        'production',
        # server root directory, makes tracebacks prettier
        root=os.path.dirname(os.path.realpath(__file__)),
        # flask already sets up logging
        allow_logging_basic_config=False)

    # send exceptions from `app` to rollbar, using flask's signal system.
    got_request_exception.connect(rollbar.contrib.flask.report_exception, app)
```
- **Added an endpoint just for testing rollbar to `app.py`**
```py
@app.route('/rollbar/test')
def rollbar_test():
    rollbar.report_message('Hello World!', 'warning')
    return "Hello World!"
```

## Rollbar Error
I was facing poblem while checking data in my Rollbar account. When I clicked on `Items` tab it was redirecting me to the `Dashboard` page only. 

## Solved Rollbar Issue
There will be a deafult project available in the rollbar account `FirstPorject`. As there is only one project so I had to create another one so that it will give me options to select between. But this helped only to access `Items` tab but it was fetching data.

After checking I found that I was using the **wrong project access token** so then I changed that and it was all good. TheN I created a error to check whethe rit's working and it was working. I could see a *Traceback Error*.

## #5 Watched Pricing and Security Consideration Videos
- **Security** : Got to know about the Observability and Monitoring tools and how they are useful for our project, security maintainence and debugging purpose. Also attended the quiz. Here's the link for Ashish's video : https://www.youtube.com/watch?v=bOf4ITxAcXc&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=31 
- **Pricing** : In Chirag's pricing video I explored the pricing structure of Honeycomb, X-RA, CLoudWatch, Rollbar. Where I got to know which services of Amazon are under free-tier and what monthly capacity is being provided to us. Also these service charges varies from region to region. Then attended the Pricing quizz. Here's the link to the Price consideration video : https://www.youtube.com/watch?v=2W3KeqCjtDY


