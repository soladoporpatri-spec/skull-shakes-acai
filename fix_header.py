# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_render = r"""    </header>"""

new_render = """      <div className="ml-auto flex items-center gap-4">
        {!isLoading && status && (
          <Button
            variant={status.isAberta ? "default" : "destructive"}
            size="sm"
            onClick={handleToggle}
            className={status.isAberta ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            <Store className="h-4 w-4 mr-2" />
            {status.isAberta ? "Loja Aberta" : "Loja Fechada"}
          </Button>
        )}
      </div>
    </header>"""

content = re.sub(old_render, new_render, content)

with open('skull-shakes-admin/src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
