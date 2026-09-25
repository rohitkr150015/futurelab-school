from pathlib import Path
from PIL import Image, ImageDraw
import json

root=Path(__file__).resolve().parents[1]
svg='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#0b1730"/><g fill="none" stroke="#20d9ec" stroke-width="2"><ellipse cx="32" cy="32" rx="23" ry="9"/><ellipse cx="32" cy="32" rx="23" ry="9" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="23" ry="9" transform="rotate(120 32 32)"/></g><circle cx="32" cy="32" r="4" fill="#20d9ec"/></svg>'''
(root/'public/favicon.svg').write_text(svg,encoding='utf-8')
for size in [192,512]:
 image=Image.new('RGB',(size,size),'#0b1730')
 for angle in [0,60,120]:
  layer=Image.new('RGBA',(size,size),(0,0,0,0))
  draw=ImageDraw.Draw(layer)
  draw.ellipse((size*.15,size*.37,size*.85,size*.63),outline='#20d9ec',width=max(2,int(size*.023)))
  rotated=layer.rotate(angle,resample=Image.Resampling.BICUBIC)
  image.paste(rotated,(0,0),rotated)
 draw=ImageDraw.Draw(image);draw.ellipse((size*.45,size*.45,size*.55,size*.55),fill='#20d9ec')
 image.save(root/f'public/icon-{size}.png')
# Remove only unused Vite starter files inside this new project.
for name in ['src/App.tsx','src/App.css','src/index.css','src/assets/react.svg','src/assets/vite.svg','src/assets/hero.png','public/vite.svg','public/icons.svg']:
 p=(root/name).resolve()
 if p.is_relative_to(root) and p.is_file():p.unlink()
package=json.loads((root/'package.json').read_text())
package['version']='1.0.0'
package['scripts'].update({'test':'vitest run tests/unit','test:e2e':'playwright test','test:visual':'node scripts/visual-check.mjs','typecheck':'tsc -b'})
(root/'package.json').write_text(json.dumps(package,indent=2)+'\n')
print('Generated brand icons and removed unused starter assets.')
