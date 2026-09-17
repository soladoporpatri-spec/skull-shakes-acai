# -*- coding: utf-8 -*-
with open('web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the motion.div from main
old_motion = '''      <main className="relative min-h-screen w-full selection:bg-brand selection:text-white font-sans bg-black">
        <CartButton />
        
        {/* Solid background color that transitions smoothly */}
        <motion.div 
          className="fixed inset-0 z-0 pointer-events-none"
          initial={false}
          animate={{ backgroundColor: activeHero.theme.bg }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
  
        {/* Hero Showcase Section - Editorial Composition */}
        <section 
          onClick={nextHero}
          className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center overflow-hidden cursor-pointer"
        >'''

new_motion = '''      <main className="relative min-h-screen w-full selection:bg-brand selection:text-white font-sans bg-black">
        <CartButton />
  
        {/* Hero Showcase Section - Editorial Composition */}
        <section 
          onClick={nextHero}
          className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center overflow-hidden cursor-pointer"
        >
          {/* Solid background color that transitions smoothly */}
          <motion.div 
            className="absolute inset-0 z-0 pointer-events-none"
            initial={false}
            animate={{ backgroundColor: activeHero.theme.bg }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />'''

content = content.replace(old_motion, new_motion)

# 2. Add relative z-10 to footer just in case
old_footer = '''      <footer className="w-full bg-black border-t border-white/10 py-12 px-6">'''
new_footer = '''      <footer className="w-full bg-black border-t border-white/10 py-12 px-6 relative z-10">'''

content = content.replace(old_footer, new_footer)

with open('web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
