import urllib.request
import re

js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app/_next/static/immutable/chunks/35yqwhe3mk867.js").read().decode('utf-8')
matches_localhost = re.findall(r'.{0,50}localhost.{0,50}', js)
for m in matches_localhost:
    print("Localhost:", m)

matches_render = re.findall(r'.{0,50}onrender.{0,50}', js)
for m in matches_render:
    print("Render:", m)
