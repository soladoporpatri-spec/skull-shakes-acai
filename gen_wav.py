import wave
import struct
import math

sampleRate = 44100.0 # hertz
duration = 0.3       # seconds
frequency = 880.0    # hertz

obj = wave.open('skull-shakes-admin/public/notification.mp3', 'w')
obj.setnchannels(1) # mono
obj.setsampwidth(2)
obj.setframerate(sampleRate)

for i in range(int(duration * sampleRate)):
    # simple sine wave, fading out
    volume = 32767.0 * (1.0 - (i / (duration * sampleRate)))
    value = int(volume * math.sin(frequency * math.pi * 2 * (i / sampleRate)))
    data = struct.pack('<h', value)
    obj.writeframesraw(data)

obj.close()
