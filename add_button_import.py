# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/app/(admin)/fechamento/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import { Input } from "@/components/ui/input";', 'import { Input } from "@/components/ui/input";\nimport { Button } from "@/components/ui/button";')

with open('skull-shakes-admin/src/app/(admin)/fechamento/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
