# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import { Button } from "@/components/ui/button";',
    '''import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { useStoreStatus, useUpdateStoreStatus } from "@/hooks/useStoreStatus";'''
)

content = content.replace(
    'const title = pageTitles[pathname] || "Dashboard";',
    '''const title = pageTitles[pathname] || "Dashboard";
  const { data: status, isLoading } = useStoreStatus();
  const updateStatus = useUpdateStoreStatus();
  
  const handleToggle = () => {
    if (status) {
      updateStatus.mutate(!status.isAberta);
    }
  };'''
)

content = content.replace(
    '''        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">
          Skull Shakes Admin / {title}
        </p>
      </div>
    </header>''',
    '''        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">
          Skull Shakes Admin / {title}
        </p>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        {!isLoading && status && (
          <Button
            variant={status.isAberta ? "default" : "destructive"}
            size="sm"
            onClick={handleToggle}
            disabled={updateStatus.isPending}
            className="font-bold flex items-center gap-2"
          >
            <Store className="w-4 h-4" />
            {status.isAberta ? "Loja Aberta" : "Loja Fechada"}
          </Button>
        )}
      </div>
    </header>'''
)

with open('skull-shakes-admin/src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
