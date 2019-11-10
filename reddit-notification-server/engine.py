# Ref:
# https://www.shanelynn.ie/asynchronous-updates-to-a-webpage-with-flask-and-socket-io/
# https://gist.github.com/ericremoreynolds/dbea9361a97179379f3b
# https://stackoverflow.com/questions/45918818/how-to-send-message-from-server-to-client-using-flask-socket-io
# https://github.com/etmoore/socketio-flask-react-chat/blob/master/server/server/server.py
# https://github.com/etmoore/socketio-flask-react-chat/blob/master/client/src/App.js
# https://flask-socketio.readthedocs.io/en/latest/
# https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent

import praw
import pprint
import requests
import time
from flask import Flask
from flask_socketio import SocketIO, emit
from threading import Thread, Event
import os

CLIENT_ID=os.getenv('client_id')
CLIENT_SECRET=os.getenv('client_secret')
USER_AGENT=os.getenv('user_agent')
USERNAME=os.getenv('username')
PASSWORD=os.getenv('password')

# export PYTHONWARNINGS="ignore:Unverified HTTPS request"
session = requests.Session()    # https://stackoverflow.com/questions/21655478/sslerror-with-praw
session.verify = False          # Disable SSL


subreddits = [       
              # Canada
              'canada',
              'ontario',
              'quebec',

              # Alaska
              'alaska',

              # Arizona
              'arizona',
              'phoenix',

              # California
              'california',
              'sanfrancisco',
              'bayarea',
              'sanjose'
              'berkeley',
              'losangeles',

              # Colorado
              'colorado',
              'denver',

              # Connecticut
              'connecticut',

              # DC
              'washingtondc',

              # Florida
              'florida',

              # Illinois
              'chicago',

              # Maryland
              'baltimore',

              # Massachusetts
              'boston',

              # Michigan
              'detroit',

              # Minnesota
              'minnesota',

              # Nevada
              'vegas',
              
              # New Jersey
              'newjersey',

              # New York
              'nyc',

              # Oregon
              'portland',

              # Pennsylvania
              'philadelphia',
              'pittsburgh'

              # Texas
              'texas',
              'austin',
              'dallas',
              'houston',

              # Washington
              'seattle',
              'seattleWA'
             ]

# ***** THREADING ***** #

thread = Thread()
thread_stop_event = Event()

class ActivityMonitorPublisherThread(Thread):
    def __init__(self):
        self.delay = 0.5
        super(ActivityMonitorPublisherThread, self).__init__()

    def combine(self, list): 
        return '+'.join(list)

    # *****  REDDIT API ***** #

    def publish(self): 
        incrementer = 0
        reddit = praw.Reddit(client_id=CLIENT_ID,
                            client_secret=CLIENT_SECRET,
                            user_agent=USER_AGENT,
                            username=USERNAME,
                            password=PASSWORD,
                            requestor_kwargs={'session' : session})
        subreddit = reddit.subreddit(self.combine(subreddits))
        for comment in subreddit.stream.comments():
            # wait
            time.sleep(self.delay)

            # construct & send
            print(comment.subreddit.display_name + ' : ' + str(incrementer))
            message = {
                'subreddit' : comment.subreddit.display_name,
                'id' : incrementer
            }
            socketio.emit('message', message)

            incrementer = incrementer + 1
    
    def run(self):
        self.publish()


# ***** SOCKET API ***** #

app = Flask(__name__)
socketio = SocketIO(app)

@socketio.on('connect')
def connect():
    global thread
    print('connected')

    if not thread.isAlive():
        thread = ActivityMonitorPublisherThread()
        thread.start()

@socketio.on('disconnect')
def disconnect():
    print('disconnected')

if __name__ == "__main__":
    socketio.run(app)