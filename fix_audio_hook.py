# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/hooks/useOrderNotification.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'/notification.mp3'", "'/notification.wav'")

with open('skull-shakes-admin/src/hooks/useOrderNotification.ts', 'w', encoding='utf-8') as f:
    f.write(content)
