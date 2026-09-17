import urllib.request
import os

url = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
target = 'skull-shakes-admin/public/notification.mp3' # Browser handles OGG well, but we can save as mp3 ext or just download an actual mp3.

# Better yet, a base64 encoded tiny mp3 to avoid external dependencies.
base64_mp3 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU5LjE2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAOAAAAOAAJCRkZGRkZGRkZISEhISEhISEhITIyMjIyMjIyMjI8PDw8PDw8PDw8RERE\nRERERERERFBQUFBQUFBQUFBcXFxcXFxcXFxcZGRkZGRkZGRkZHBwcHBwcHBw\ncHB4eHh4eHh4eHh4gICA\ngICAgICAgICQkJCQkJCQkJCQoKCgoKCgoKCgoKio\nqKioqKioqKioqLCwsLCwsLCwsLC4uLi4uLi4uLi4yMjIyMjIyMjIyMjQ0NDQ\n0NDQ0NDQ4ODg4ODg4ODg4ODw8PDw8PDw8PDw+Pj4+Pj4+Pj4+Pj/////////////\n/////////////////////wAATGF2YzU5LjE4AAAAAAAAAAAAAAAAJAAAAAAAAAAA\nAAAAAAD/84QQAAAAAABAAAAA//OEEDAAAAGx8gQAABAAgIBgYGBgABQAIAAAAY\nCAYGBgYGAP/zhBBoAAAbHyBAAAEACAgGBgYGAAFAAgAAABgIBgYGBgY=" # truncated snippet

import base64
import random

# Download from freesound or just generate a simple data URI for beep
