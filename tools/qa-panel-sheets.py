from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
files=sorted(Path('qa/editorial/panels').glob('*.png'))
for group in range((len(files)+7)//8):
    sheet=Image.new('RGB',(860,2160),'#dde5eb'); draw=ImageDraw.Draw(sheet)
    for j,path in enumerate(files[group*8:group*8+8]):
        x=(j%2)*430; y=(j//2)*540
        draw.text((x+10,y+10),path.stem,fill='black')
        im=ImageOps.contain(Image.open(path).convert('RGB'),(410,505))
        sheet.paste(im,(x+(430-im.width)//2,y+30))
    sheet.save(f'qa/editorial/panels-sheet-{group}.jpg',quality=90)