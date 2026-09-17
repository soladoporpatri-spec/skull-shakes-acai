# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
old_fetch = r"const fallbackUrl = process\.env\.NEXT_PUBLIC_API_URL \|\| 'http://localhost:5210';\s*if \(fallbackUrl\.includes\(\"localhost\"\)\) \{.*?\n\s*return;\s*\}\s*const response = await fetch\(\$\{fallbackUrl\}/pedidos, \{"

new_fetch = """const response = await fetch('/api/pedidos', {"""

# wait, fallbackUrl is used in the alert below it in the catch block!
# Let's just do a clean replace using Python text replacement.

