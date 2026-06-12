# 将领头像生成批次与提示词策略

## 全局基础提示词

Use case: historical-scene  
Asset type: Three Kingdoms strategy game general portrait, 1:1 PNG  
Style/medium: realistic painted bust portrait, dark gold and sepia parchment-map palette, compatible with an ancient Chinese parchment world map UI  
Composition/framing: centered head-and-shoulders portrait, safe margins around headgear, shoulders and beard, readable in both large side-panel portrait frame and small modal portrait thumbnail  
Lighting/mood: low-saturation cinematic warm gold light, smoky brown shadows, solemn historical strategy-game mood  
Scene/backdrop: plain deep umber background, no scenery, no text  
Constraints: no modern elements, no watermark, no logo, no bright fantasy colors, no anime style, no photorealistic studio-photo look  
De-homogenization rule: every portrait must vary face shape, age, clothing, headgear, facial hair, pose, and regional/faction motifs; if two portraits look like the same person in different clothing, regenerate the later one with a more specific prompt.

## 批次 A：曹魏与曹操相关人物

名单：曹休、程昱、典韦、董昭、郭嘉、满宠、于禁、许褚、荀彧、刘晔、徐晃、陈群、钟繇、杨修、王忠、臧霸

差异化规则：曹魏人物需要区分宗族武将、宿卫猛将、军纪型将领、老成谋士、清雅谋士与法度官僚。不要全部做成黑金重甲中年武将。

### 曹休 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/曹休.png`
- 最终提示词：
  > Use case: historical-scene. Asset type: Three Kingdoms strategy game general portrait, 1:1 PNG. Primary request: A portrait of Cao Xiu, a young and capable Cao clan cavalry commander. Subject: youthful but disciplined noble-warrior face, clean trimmed mustache, alert eyes, sleek dark bronze cavalry armor with restrained Cao clan gold details, tied hair under a compact military headpiece; confident without arrogance. Style/medium: realistic painted bust portrait, dark gold and sepia parchment-map palette, compatible with an ancient Chinese parchment world map UI. Composition/framing: centered head-and-shoulders portrait, safe margins around headgear and shoulders, readable in both large side-panel portrait frame and small modal portrait thumbnail. Lighting/mood: low-saturation cinematic warm gold light, smoky brown shadows, solemn historical strategy-game mood. Scene/backdrop: plain deep umber background, no scenery. Constraints: no text, no logo, no watermark, no modern elements, no bright fantasy colors, no anime style, no photorealistic studio-photo look. Avoid: bulky veteran beard, same armor silhouette as Dian Wei or Cao Hong.

### 程昱 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/程昱.png`
- 最终提示词：
  > Use case: historical-scene. Asset type: Three Kingdoms strategy game general portrait, 1:1 PNG. Primary request: Cheng Yu, an elderly, sharp-minded strategist serving Cao Cao in the Three Kingdoms era. Subject: thin aged face, deep-set eyes, long narrow grey beard, stern calculating expression, dark scholar-official robes with subtle black-gold trim, no heavy armor. Style/medium: realistic painted bust portrait, low-saturation dark gold and sepia palette matching an ancient parchment map UI. Composition/framing: centered head-and-shoulders portrait, safe margins, readable as both large side-panel portrait and small modal thumbnail. Lighting/mood: warm dim gold light, smoky brown shadows, solemn historical strategy-game mood. Scene/backdrop: plain deep umber background. Constraints: no text, no logo, no watermark, no modern elements, no bright colors, no anime style, no photographic studio look. Avoid: warrior armor, youthful face, same silhouette as Xun You or Li Ru.

### 典韦 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/典韦.png`
- 最终提示词：
  > Use case: historical-scene. Asset type: Three Kingdoms strategy game general portrait, 1:1 PNG. Primary request: A portrait of Dian Wei, a towering and brutally loyal bodyguard general of Cao Cao, known for raw physical strength. Subject: broad square face, thick neck, fierce but loyal eyes, heavy short beard, massive warrior shoulders, dark iron armor with worn bronze beast details; imposing but not monstrous. Style/medium: realistic painted bust portrait, dark gold and sepia parchment-map palette, compatible with an ancient Chinese parchment world map UI. Composition/framing: centered head-and-shoulders portrait, safe margins around helmet, shoulders and beard, readable in both large side-panel portrait frame and small modal portrait thumbnail; 1:1 square crop. Lighting/mood: low-saturation cinematic warm gold light, smoky brown shadows, solemn historical strategy-game mood. Scene/backdrop: plain deep umber background, no scenery. Constraints: no text, no logo, no watermark, no modern elements, no bright fantasy colors, no anime style, no photorealistic studio-photo look. Avoid: same face or armor silhouette as other generals; avoid elegant scholar features; avoid overly bright gold.

### 郭嘉 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/郭嘉.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Guo Jia, a brilliant but sickly Three Kingdoms strategist of Cao Cao, gaunt pale face, tired intelligent eyes, thin mustache and sparse short beard, dark scholar cap, layered black-brown robes with subtle gold trim, fragile body but sharp mind, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, readable as small UI portrait, no text, no watermark, no bright colors, avoid handsome warrior face, avoid youthful armored look.

### 许褚 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/许褚.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Xu Chu, a massive loyal bodyguard general of Cao Cao, round powerful face, thick eyebrows, shaved or tied hair, heavy dark iron armor, broad shoulders, blunt fearless expression, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 于禁 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/于禁.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Yu Jin, a strict disciplined general of Cao Cao, narrow stern face, orderly short beard, calm severe eyes, practical dark lamellar armor with minimal bronze trim, upright military posture, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 徐晃 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/徐晃.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Xu Huang, a steady veteran general of Cao Cao known for disciplined strength, long rectangular face, composed eyes, medium beard, sturdy dark bronze armor with subtle axe-shaped ornament on chest or shoulder, calm mountain-like presence, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 荀彧 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/荀彧.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Xun Yu, an elegant principled adviser of Cao Cao, refined pale face, neat thin mustache and short beard, calm upright gaze, high scholar-official headpiece, layered dark brown court robes with restrained gold trim, no armor, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 董昭 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/董昭.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Dong Zhao, a pragmatic Cao Wei adviser and official, mature rectangular face, neat mustache and short beard, calculating but composed eyes, dark brown official robes over very light hidden armor, modest black-gold headpiece, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 满宠 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/满宠.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Man Chong, a stern law-and-order Cao Wei administrator and defensive commander, lean square face, close-trimmed beard, severe watchful eyes, dark official-military robe with rigid collar and restrained bronze armor plates, disciplined posture, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 刘晔 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/刘晔.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Liu Ye, a clever Han imperial clan strategist and engineer serving Cao Cao, youthful refined face but not pretty, sharp technical eyes, thin mustache, compact scholar headpiece, layered dark olive-brown robes with subtle bronze mechanism-like clasp, no heavy armor, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 陈群 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/陈群.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Chen Qun, a refined Cao Wei statesman known for law and institutions, slender dignified face, neat short beard, composed formal gaze, tall black scholar-official cap, immaculate dark brown court robes with very restrained gold trim, no armor, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 钟繇 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/钟繇.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Zhong Yao, an elderly Cao Wei minister and master calligrapher, wise wrinkled face, long fine grey beard, calm scholarly eyes, soft dark official robes, tall but rounded scholar cap, subtle calligraphy-scroll ornament near collar, no armor, low-saturation dark gold and sepia palette matching an ancient parchment map UI, plain deep brown background, centered head and shoulders with safe margins, no text, no watermark, no bright colors.

### 杨修 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/杨修.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Yang Xiu, a clever arrogant Cao Wei literary adviser, mature Han dynasty scholar-official, narrow intelligent face, thin mustache, slightly smug eyes, restrained court headpiece, dark brown layered scholar robes with muted gold trim, historical Chinese painting realism, low-saturation sepia and dark gold palette matching a parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins, no text, no watermark, no bright colors, avoid modern idol face, avoid anime style, avoid soft porcelain skin.

### 王忠 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/王忠.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Wang Zhong, a minor rough Cao Cao officer in the Three Kingdoms era, plain narrow face, anxious cautious eyes, sparse mustache, slightly uneven jaw, worn simple dark lamellar armor with scuffed leather straps, subdued posture, ordinary field-officer presence rather than heroic legend, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for a game portrait frame and small modal thumbnail, no text, no watermark, no bright colors, avoid elite noble look, avoid same face as famous generals, avoid anime style.

### 臧霸 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/臧霸.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Zang Ba, rugged former outlaw and regional commander later allied with Cao Cao in the Three Kingdoms era, weathered angular face, scar on one cheek, wary independent gaze, wild short beard, sun-darkened skin, dark rugged armor with leather straps, muted bronze plates and a rough fur collar, frontier warlord presence rather than court general, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for a game portrait frame and small modal thumbnail, no text, no watermark, no bright colors, avoid bulky bodyguard look, avoid refined official robes, avoid anime style.

## 批次 B：袁绍与北方士族人物

名单：郭图、高干、高览、耿武、关纯、田楷、辛毗、辛评、荀谌、袁尚、袁谭、袁熙、袁遗、张郃、张南、严纲

差异化规则：袁绍阵营要体现河北士族、贵族子弟、北方军将和谋士派系感；避免所有人物都成为同一种华丽金甲贵族。

### 郭图 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/郭图.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Guo Tu, a sharp but petty adviser of Yuan Shao in the Three Kingdoms era, thin foxlike face, narrow suspicious eyes, small pointed mustache and short beard, slightly smug expression, dark northern noble official robes with muted gold trim, tall angular scholar cap, no armor, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait frame and small thumbnail, no text, no watermark, no bright colors, avoid heroic warrior look, avoid same face as Xun Yu.

### 高干 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/高干.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Gao Gan, a northern noble provincial governor and Yuan Shao kinsman, young mature aristocratic face, proud restrained gaze, clean neat mustache, elegant dark robe layered over polished but restrained armor, high noble headpiece with subtle Yuan clan ornament, refined Hebei elite presence, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small UI portrait, no text, no watermark, no bright colors, avoid old strategist face, avoid rugged frontier look, avoid anime style.

### 高览 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/高览.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Gao Lan, a seasoned Hebei battlefield general under Yuan Shao, broad weathered face, steady battle-worn eyes, medium full beard, practical northern lamellar armor with muted iron and bronze, fur-lined shoulder edge, no ornate noble robe, veteran commander presence rather than brute bodyguard, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait frame and small thumbnail, no text, no watermark, no bright colors, avoid oversized monster physique, avoid refined official look, avoid anime style.

### 耿武 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/耿武.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Geng Wu, a loyal regional minister in late Han Hebei, older upright face, tired but resolute eyes, thin grey mustache and short beard, plain dark official robe with simple woven collar, modest low scholar cap, no armor, austere loyalist presence, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small UI portrait, no text, no watermark, no bright colors, avoid noble luxury, avoid warrior armor, avoid anime style.

### 关纯 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/关纯.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Guan Chun, a loyal upright official of late Han Hebei associated with Han Fu and Yuan Shao's era, angular lean face, intense principled eyes, short black beard, simple dark scholar-warrior robe over very light leather armor, modest black cloth cap, stern loyalist presence rather than famous battlefield general, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait frame and small thumbnail, no text, no watermark, no bright colors, avoid ornate Yuan noble look, avoid bulky general armor, avoid anime style.

### 田楷 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/田楷.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Tian Kai, a northern frontier military governor connected to Gongsun Zan, lean sun-weathered face, alert cavalry officer eyes, trimmed mustache, practical leather-and-lamellar armor with pale fur collar and worn straps, compact military cap, austere Youzhou border presence, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel and small modal portrait, no text, no watermark, no bright colors, avoid Yuan court luxury, avoid heavy brute armor, avoid anime style.

### 辛毗 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/辛毗.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Xin Pi, an articulate diplomat and adviser from a northern gentry family, clear intelligent eyes, slim lively face, neat thin mustache and short beard, composed persuasive expression, dark olive-brown scholar robes with restrained bronze clasp, modest official cap, no armor, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small UI portrait, no text, no watermark, no bright colors, avoid harsh schemer face, avoid military armor, avoid anime style.

### 辛评 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/辛评.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Xin Ping, an older conservative adviser of Yuan Shao and elder northern gentry statesman, long oval face, measured cautious eyes, fuller neatly combed beard with early grey, formal dark court robes with muted gold edging, taller square scholar-official cap, dignified but worried expression, no armor, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait and thumbnail, no text, no watermark, no bright colors, avoid same face as Xin Pi, avoid warrior armor, avoid anime style.

### 荀谌 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/荀谌.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Xun Chen, a refined Yingchuan strategist serving Yuan Shao, elegant narrow face, cool assessing eyes, thin mustache and short pointed beard, high dark scholar cap with restrained northern-gentry detail, layered black-brown robes with very subtle gold pattern, composed and distant expression, no armor, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small UI portrait, no text, no watermark, no bright colors, avoid looking identical to Xun Yu, avoid youthful beauty, avoid anime style.

### 袁尚 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/袁尚.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, 1:1 bust of Yuan Shang, pampered young heir of Yuan Shao. Historical Chinese illustration realism with visible brushwork, not a photo. Softer rounded young noble face, less handsome, faint thin mustache, spoiled uncertain eyes, ornate but muted dark silk robe over light ceremonial armor, low wide noble crown, no tall official hat, no modern actor look. Dark sepia and muted gold palette matching an ancient parchment map UI, plain deep umber background, centered head and shoulders with safe margins, readable in small UI thumbnail. No text, no watermark, no bright colors, no anime, avoid looking like Gao Gan or Yuan Tan.

### 袁谭 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/袁谭.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Yuan Tan, the ambitious eldest son of Yuan Shao, mature noble warrior face, sharper cheekbones, hard resentful eyes, trimmed mustache and short beard, dark formal armor with squared shoulders and restrained Yuan clan gold trim, less elegant and more aggressive than Yuan Shang, high military-noble headpiece, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small UI portrait, no text, no watermark, no bright colors, avoid youthful pampered face, avoid rugged bandit look, avoid anime style.

### 袁熙 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/袁熙.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Yuan Xi, a quieter northern lord and son of Yuan Shao associated with Youzhou, reserved aristocratic face, slightly long nose, distant cold eyes, neat mustache, dark blue-black noble robe under light cavalry armor, small fur-edged mantle hinting at northern frontier, restrained headpiece, subdued melancholy presence, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait frame and small thumbnail, no text, no watermark, no bright colors, avoid same face as Yuan Shang or Yuan Tan, avoid brute warrior look, avoid anime style.

### 袁遗 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/袁遗.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Yuan Yi, an older Han dynasty aristocratic scholar-official from the Yuan clan, refined tired face, high forehead, long narrow grey beard, calm principled eyes, understated dark court robes with worn gold edging, tall traditional official cap, noble lineage but politically exhausted presence, no armor, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small UI portrait, no text, no watermark, no bright colors, avoid young heir look, avoid military armor, avoid anime style.

### 张郃 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/张郃.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Zhang He, an agile and elegant battlefield general originally under Yuan Shao, later famous for tactical flexibility, lean handsome but mature warrior face, sharp bright eyes, trimmed mustache and pointed beard, sleek dark lamellar armor with narrow shoulder guards, subtle feather-like ridge on compact helmet, poised strategic warrior presence rather than brute strength, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait frame and small thumbnail, no text, no watermark, no bright colors, avoid same silhouette as Gao Lan or Xu Huang, avoid anime style.

### 张南 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/张南.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Zhang Nan, a lesser Hebei military officer in Yuan Shao's forces, ordinary square face, practical watchful eyes, short mustache, slightly rough skin, simple dark iron lamellar armor with plain cloth scarf, no ornate helmet, modest field-command presence, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel portrait and small modal thumbnail, no text, no watermark, no bright colors, avoid famous hero look, avoid noble court robe, avoid anime style.

### 严纲 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/严纲.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Yan Gang, a northern cavalry general associated with Gongsun Zan and the White Horse Volunteers, wind-burned face, stern forward eyes, short rugged beard, pale horsehair plume on compact helmet, light cavalry lamellar armor with off-white scarf and worn leather straps, frontier horseman discipline, low-saturation sepia and dark gold palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait frame and small thumbnail, no text, no watermark, no bright colors, avoid Yuan noble robes, avoid bulky infantry armor, avoid anime style.

## 批次 C：江东与孙吴人物

名单：陈武、丁奉、甘宁、蒋钦、凌操、凌统、鲁肃、陆逊、吕范、吕蒙、太史慈、虞翻、张纮、张昭、周泰、朱桓、诸葛谨、华歆、阚泽

差异化规则：江东人物要区分水军、游侠、老臣、青年统帅、儒雅谋士和刚烈护卫；允许克制的深红、青绿或水军皮革细节，但整体仍要低饱和。

### 陈武 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/陈武.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Chen Wu, a fierce Jiangdong infantry and river-war commander of Sun Quan, dark weathered face, intense loyal eyes, short rugged beard, sturdy build, dark leather-and-lamellar armor with muted red cloth knot and wet-river campaign wear, no ornate noble robe, low-saturation sepia, dark gold and restrained deep red palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait frame and small modal thumbnail, no text, no watermark, no bright colors, avoid northern heavy cavalry look, avoid same face as Zhou Tai.

### 丁奉 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/丁奉.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Ding Feng, a veteran Eastern Wu general, older lean face, calm hardened eyes, grey-streaked short beard, practical dark river-navy armor with weathered leather straps and muted teal cloth edge, compact helmet without plume, disciplined late-career commander presence, low-saturation sepia, dark gold and restrained teal palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel portrait and small thumbnail, no text, no watermark, no bright colors, avoid youthful hero face, avoid ornate court robes, avoid anime style.

### 甘宁 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/甘宁.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Gan Ning, bold river pirate turned Eastern Wu general, sharp rebellious face, confident wild eyes, short beard and mustache, dark leather river-raider armor with muted crimson scarf and small bell-like metal ornaments, open-collar swagger but historically grounded, no bright fantasy colors, low-saturation sepia, dark gold and restrained red palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait frame and small modal thumbnail, no text, no watermark, avoid elegant court official look, avoid bulky northern armor, avoid anime style.

### 蒋钦 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/蒋钦.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, square 1:1 bust of Jiang Qin, practical Eastern Wu river-navy commander. Historical Chinese game illustration, visible brush texture, not photorealistic. Plain broad working face, honest alert eyes, short trimmed beard, no metal helmet, dark cloth headwrap tied low, simple water-worn leather-and-lamellar armor partly covered by muted teal river scarf, modest patrol commander presence, different from helmeted Ding Feng and Ling Cao. Low-saturation sepia, dark gold and subdued teal palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail. No text, no watermark, no bright colors, no anime.

### 凌操 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/凌操.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, 1:1 bust of Ling Cao, older Eastern Wu naval vanguard. Historical Chinese illustration realism with visible brushwork, not photorealistic. Weathered angular face, protective stern eyes, short grey-streaked beard, lighter river-war armor with leather plates, muted red-brown scarf, simple low helmet, Jiangdong boat-campaign feel. Low-saturation sepia, dark gold, restrained red-brown accents matching an ancient parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable in small thumbnail. No text, no watermark, no bright colors, avoid heavy northern cavalry armor, avoid modern photo look.

### 凌统 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/凌统.png`
- 最终提示词：
  > 1:1 realistic painted bust portrait of Ling Tong, young fierce Eastern Wu general, son of Ling Cao, lean youthful face, intense restrained anger in the eyes, thin mustache beginning to grow, tied hair under compact military headpiece, sleek dark lamellar armor with muted red sash and river-war leather straps, proud disciplined posture, low-saturation sepia, dark gold and restrained red palette matching an ancient parchment strategy map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel and small thumbnail, no text, no watermark, no bright colors, avoid looking like older Ling Cao, avoid pirate swagger like Gan Ning, avoid anime style.

### 鲁肃 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/鲁肃.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, 1:1 bust of Lu Su, generous broad-minded Eastern Wu statesman. Historical Chinese illustration realism with visible brush strokes and painterly texture, not photorealistic, not studio portrait. Warm mature rounded face, calm kind eyes, neat medium beard, soft dark scholar robes with restrained muted teal trim, simple official cap, no armor, diplomatic and humane presence. Dark sepia, muted gold and subdued teal palette matching an ancient parchment map UI, plain deep umber background, centered head and shoulders with safe margins, readable as small UI thumbnail. No text, no watermark, no bright colors, no anime.

### 陆逊 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/陆逊.png`
- 最终提示词：
  > Painted historical game portrait, square 1:1 bust of Lu Xun, young Eastern Wu scholar-general. Painterly brush texture, ancient Chinese strategy game art, not photorealistic and not modern actor. Slim scholarly face, slightly narrow eyes, calm tactical gaze, sparse thin mustache, modest youthfulness, dark scholar robe over light hidden armor, muted teal sash and dark red-brown collar, small simple commander headpiece. Low-saturation sepia and dark gold colors matching parchment world-map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small thumbnail. No text, no watermark, no bright colors, no anime.

### 吕范 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/吕范.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Lü Fan, an Eastern Wu official known for ritual order and administration, mature slender face, meticulous eyes, neat thin mustache and short beard, precise composed expression, immaculate dark court robes with muted gold-brown trim and a narrow teal sash, tall but simple official cap, no armor, refined administrator presence, painterly Chinese illustration realism, low-saturation sepia and dark gold palette matching an ancient parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small UI portrait, no text, no watermark, no bright colors, avoid warm round Lu Su face, avoid warrior armor, avoid anime style.

### 吕蒙 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/吕蒙.png`
- 最终提示词：
  > Painted historical strategy game portrait, 1:1 bust of Lü Meng, Eastern Wu commander who rose from rough soldier to learned general. Painterly brush texture, not photorealistic. Plain strong face, thoughtful disciplined eyes, short beard, modest dark lamellar armor partly covered by a simple scholar cloak, worn teal scarf, little ornament, compact cloth military cap, self-made practical commander, not a noble hero. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable in small thumbnail. No text, no watermark, no bright colors, no anime, avoid ornate armor.

### 太史慈 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/太史慈.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Taishi Ci, heroic Eastern Han and Wu warrior known for bravery and archery, tall dignified face, bright resolute eyes, strong nose, neat mustache and short beard, dark agile armor with subtle bow-shaped ornament and muted red-brown scarf, upright loyal warrior presence, painterly historical Chinese realism with visible brush texture, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel portrait and small thumbnail, no text, no watermark, no bright colors, avoid bulky brute look, avoid pirate style, avoid anime style.

### 虞翻 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/虞翻.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Yu Fan, blunt outspoken Eastern Wu scholar and diviner, narrow severe face, sharp critical eyes, thin mustache and angular short beard, slightly tilted scholar cap, dark plain robes with subtle I Ching-like woven collar pattern, no armor, proud difficult intellectual presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel and small thumbnail, no text, no watermark, no bright colors, avoid gentle Lu Su expression, avoid warrior armor, avoid anime style.

### 张纮 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/张纮.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Zhang Hong, elegant senior Eastern Wu scholar and adviser, gentle long face, wise mild eyes, long neat grey beard, refined dark brown scholar robes with muted teal-green edging, simple tall official cap, no armor, calm literary statesman presence, painterly historical Chinese realism with soft brush texture, low-saturation sepia and dark gold palette matching ancient parchment map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait and small thumbnail, no text, no watermark, no bright colors, avoid stern Zhang Zhao look, avoid warrior armor, avoid anime style.

### 张昭 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/张昭.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Zhang Zhao, stern senior Eastern Wu minister, elderly rectangular face, deep frown lines, commanding critical eyes, long straight grey beard, austere dark court robes with restrained gold-brown trim, tall square official cap, no armor, uncompromising elder-statesman presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders with safe margins, readable in small thumbnail, no text, no watermark, no bright colors, avoid gentle Zhang Hong expression, avoid warrior armor, avoid anime style.

### 周泰 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/周泰.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Zhou Tai, scarred loyal bodyguard general of Eastern Wu, rugged dark face with visible old scars across cheek and brow, grim protective eyes, short rough beard, dark river-war armor with worn leather straps and muted red cloth, strong shoulders but not monstrous, guarded silent presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait and thumbnail, no text, no watermark, no bright colors, avoid northern brute armor, avoid pirate swagger, avoid anime style.

### 朱桓 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/朱桓.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, square 1:1 bust of Zhu Huan, proud Eastern Wu defensive general. Historical painterly realism, not photorealistic close-up. Medium crop with full headgear and shoulders visible, safe margins. Angular confident face, defiant eyes, short neat beard, practical dark armor with muted red-brown sash, compact low commander cap, fortress-commander presence. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background. No text, no watermark, no bright colors, no anime, avoid extreme close-up and avoid oversized tall official hat.

### 诸葛谨 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/诸葛谨.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Zhuge Jin, gentle Eastern Wu statesman and elder brother of Zhuge Liang, long face with notably high broad forehead, kind restrained eyes, neat long beard, soft dark scholar robes with muted teal and gold-brown edging, simple official cap set back to reveal forehead, no armor, diplomatic trustworthy presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching ancient parchment map UI, plain deep umber background, centered head and shoulders, safe margins for portrait frame and small thumbnail, no text, no watermark, no bright colors, avoid looking like Lu Su or Zhang Hong, avoid warrior armor, avoid anime style.

### 华歆 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/华歆.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Hua Xin, refined late Han scholar-official later associated with Cao Wei, cool reserved face, high cheekbones, detached intelligent eyes, thin mustache and tidy short beard, austere dark court robes with very restrained gold trim, tall black official cap, no armor, old aristocratic scholar presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel portrait and small thumbnail, no text, no watermark, no bright colors, avoid warm Eastern Wu teal details, avoid warrior armor, avoid anime style.

### 阚泽 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/阚泽.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, square 1:1 bust of Kan Ze, clever Eastern Wu envoy and scholar. Ancient Chinese game illustration with visible brush texture, not photorealistic, not modern actor. Thin slightly plain face, quick observant eyes, sparse mustache, restrained wry expression, modest dark scholar robe with muted teal-brown edge, small simple cloth official cap, no luxurious embroidery, no armor. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable in small thumbnail. No text, no watermark, no bright colors, no anime, avoid handsome idol face.

## 批次 D：刘备、蜀汉、益州与汉中人物

名单：法正、费祎、关平、黄权、黄忠、简雍、蒋琬、李严、廖化、刘璋、马良、马谡、孟达、糜芳、糜竺、庞统、孙乾、王平、魏延、吴懿、向朗、徐庶、严颜、张任、张松、周仓、董允、伊籍、王累

差异化规则：蜀汉与益州人物需要区分仁义旧部、益州地方官、山地守将、老将、谋士、商贾士族和忠烈武人；不要全部使用绿色长袍。

### 法正 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/法正.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Fa Zheng, brilliant but vengeful Shu-Han strategist, sharp narrow face, calculating intense eyes, thin mustache and short beard, dark scholar robes with muted green-brown collar and hidden dagger-like clasp, compact adviser cap, sly tactical presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette with restrained green accents matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid gentle benevolent adviser face, avoid warrior armor, avoid anime style.

### 费祎 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/费祎.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Fei Yi, elegant Shu-Han statesman and diplomat, gentle refined face, calm intelligent eyes, neat thin mustache and short beard, soft dark court robes with muted green-grey and gold-brown trim, simple official cap, no armor, balanced and humane administrative presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable as small UI thumbnail, no text, no watermark, no bright colors, avoid sharp schemer look like Fa Zheng, avoid warrior armor, avoid anime style.

### 关平 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/关平.png`
- 最终提示词：
  > Painted historical strategy game portrait, square 1:1 bust of Guan Ping, young Shu-Han warrior and son of Guan Yu. Ancient Chinese game illustration with visible brush texture, not photorealistic, not modern actor. Plain youthful but sturdy face, earnest loyal eyes, slightly rough skin, very faint mustache, modest dark green-brown lamellar armor, simple cloth-and-metal headband, restrained red cord, filial battlefield officer presence. Low-saturation sepia and dark gold palette with muted green accents matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail. No text, no watermark, no bright colors, no anime idol look, avoid long Guan Yu beard.

### 黄权 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/黄权.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Huang Quan, cautious and rational Shu-Han strategist from Yizhou, later serving Wei, mature rectangular face, steady analytical eyes, neat mustache and medium beard, dark official robes over light hidden armor, muted earth-green collar and bronze clasp, modest square official cap, pragmatic border-administrator presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid sly Fa Zheng expression, avoid warrior armor, avoid anime style.

### 黄忠 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/黄忠.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Huang Zhong, elderly veteran archer general of Shu-Han, weathered old face, piercing brave eyes, thick white eyebrows, full white beard but controlled, dark practical armor with muted green-brown archer cloak and subtle bow ornament, no bright fantasy gear, upright old warrior pride, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait and small thumbnail, no text, no watermark, no bright colors, avoid Santa-like beard, avoid oversized ornate armor, avoid anime style.

### 简雍 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/简雍.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Jian Yong, easygoing old companion and envoy of Liu Bei, relaxed slightly humorous face, clever lazy eyes, sparse mustache and casual short beard, loose dark traveler's scholar robe with muted brown-green scarf, simple soft cap tilted slightly, no armor, informal diplomatic presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid stern official look, avoid warrior armor, avoid anime style.

### 蒋琬 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/蒋琬.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Jiang Wan, calm senior Shu-Han regent and administrator, mature broad forehead, steady gentle eyes, neat medium beard with a little grey, dignified dark court robes with muted green-grey edging and simple bronze clasp, tall but restrained official cap, no armor, patient governing presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for portrait frame and small thumbnail, no text, no watermark, no bright colors, avoid youthful Fei Yi look, avoid sharp schemer face, avoid anime style.

### 李严 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/李严.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Li Yan, proud capable Shu-Han administrator and military commander, stern square face, suspicious ambitious eyes, trimmed mustache and short beard, dark official-military robe over rigid armor plates, muted earth-green sash and bronze shoulder detail, upright but tense posture, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid gentle statesman look, avoid bulky brute armor, avoid anime style.

### 廖化 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/廖化.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Liao Hua, long-serving Shu-Han veteran officer, weathered middle-aged to older face, loyal tired eyes, short grey-streaked beard, practical worn dark armor with muted green-brown cloth wrap, no ornate helmet, survivor of many campaigns presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid famous hero glamour, avoid young handsome face, avoid anime style.

### 刘璋 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/刘璋.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Liu Zhang, weak provincial ruler of Yizhou in late Han, soft round face, anxious indecisive eyes, neat mustache and short beard, rich but subdued dark official robe with muted ochre-green trim, ornate yet slightly ill-fitting governor headpiece, no armor, sheltered and hesitant presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait and small thumbnail, no text, no watermark, no bright colors, avoid heroic ruler look, avoid warrior armor, avoid anime style.

### 马良 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/马良.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Ma Liang, refined Shu-Han scholar known for his white eyebrows, slender gentle face, calm wise eyes, distinctive pale white eyebrows while hair remains dark, neat thin mustache and short beard, elegant dark scholar robes with muted green-grey trim, modest official cap, no armor, luminous but restrained scholar presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid full white hair fantasy look, avoid anime style.

### 马谡 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/马谡.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Ma Su, talented but overconfident Shu-Han strategist, younger narrow face, bright arrogant eyes, thin mustache, slightly raised chin, dark scholar-military robe with light hidden armor and muted green sash, compact adviser cap, clever but untested presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel and small thumbnail, no text, no watermark, no bright colors, avoid gentle Ma Liang look, avoid old beard, avoid anime idol style.

### 孟达 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/孟达.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Meng Da, ambitious and unreliable frontier commander between Shu and Wei, narrow guarded face, restless side-glancing eyes, trimmed mustache and short beard, dark mixed armor with travel-worn cloak and muted brown-green scarf, no faction-heavy emblem, posture slightly turned as if cautious, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid loyal heroic expression, avoid ornate noble armor, avoid anime style.

### 糜芳 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/糜芳.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Mi Fang, wealthy clan military officer of Liu Bei who later surrendered, plump cautious face, uneasy eyes, short beard, dark armor partly covered by rich but subdued merchant-family robe, muted brown-red sash, slightly defensive posture, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait and thumbnail, no text, no watermark, no bright colors, avoid heroic loyal warrior look, avoid scholar-only robe, avoid anime style.

### 糜竺 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/糜竺.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Mi Zhu, wealthy merchant-gentry patron and loyal adviser of Liu Bei, mature kind face, calm generous eyes, neat long beard, refined dark silk robes with understated gold-brown merchant-family pattern, no armor, simple elegant official cap, dignified wealthy but not flashy presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid looking like Mi Fang, avoid military armor, avoid anime style.

### 庞统 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/庞统.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Pang Tong, brilliant unconventional Shu-Han strategist known as the Fledgling Phoenix, unattractive but intelligent face, broad nose, heavy eyelids, penetrating hidden eyes, sparse mustache and uneven short beard, dark travel-worn scholar robes with muted green-brown scarf, simple low cap, no armor, eccentric deep strategist presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel and small thumbnail, no text, no watermark, no bright colors, avoid handsome adviser look, avoid fantasy phoenix imagery, avoid anime style.

### 孙乾 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/孙乾.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Sun Qian, early Liu Bei diplomat and adviser, middle-aged gentle face, composed trustworthy eyes, neat mustache and medium beard, plain dark traveler's official robe with muted green-brown edging, simple envoy cap, no armor, patient loyal envoy presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid warrior armor, avoid wealthy Mi Zhu look, avoid anime style.

### 王平 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/王平.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Wang Ping, practical mountain-defense general of Shu-Han, dark weathered face, steady cautious eyes, short rough beard, sturdy but plain dark armor with mountain-campaign cloak and muted green-brown cloth wraps, no ornate helmet, humble self-taught commander presence from frontier ranks, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel and small thumbnail, no text, no watermark, no bright colors, avoid noble scholar look, avoid bulky brute armor, avoid anime style.

### 魏延 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/魏延.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Wei Yan, fierce and rebellious Shu-Han general, long angular face, intense suspicious eyes, thick eyebrows, wild medium beard, dark rugged armor with muted red-brown scarf and mountain-war leather straps, hair tied high but slightly unruly, dangerous independent warrior presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid loyal gentle expression, avoid northern brute bodyguard silhouette, avoid anime style.

### 吴懿 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/吴懿.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, square 1:1 bust of Wu Yi, Yizhou provincial military commander of Shu-Han. Historical Chinese game illustration, not photorealistic close-up. Medium crop with safe margins. Mature reserved face, practical eyes, neat short beard, simple dark official-military robe over restrained armor, muted ochre-green sash, low compact commander cap, provincial guard commander presence, not a king. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background. No text, no watermark, no bright colors, no anime, avoid ornate royal armor and tall jeweled crown.

### 向朗 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/向朗.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Xiang Lang, elderly Shu-Han scholar-official, plain long face, quiet cautious eyes, thin grey mustache and short beard, modest dark robes with muted green-brown edging, simple low official cap, no armor, local learned elder presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for side-panel and small thumbnail, no text, no watermark, no bright colors, avoid high-ranking grand minister luxury, avoid warrior armor, avoid anime style.

### 徐庶 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/徐庶.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Xu Shu, wandering swordsman-scholar strategist of Liu Bei, lean melancholy face, sharp thoughtful eyes, short mustache and beard, dark traveler's scholar robe over light hidden armor, muted grey-green cloak, simple headwrap rather than tall official cap, restrained heroic but sorrowful presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid court official luxury, avoid rugged brute warrior, avoid anime style.

### 严颜 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/严颜.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Yan Yan, stubborn elderly Yizhou veteran general, rugged old face, fierce unyielding eyes, thick grey eyebrows, short white beard, dark local armor with mountain fortress wear and muted ochre scarf, compact old helmet, proud defiant captured-general presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait and small thumbnail, no text, no watermark, no bright colors, avoid looking like Huang Zhong archer, avoid ornate Shu court style, avoid anime.

### 张任 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/张任.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Zhang Ren, loyal Yizhou general serving Liu Zhang, stern disciplined face, cold unwavering eyes, trimmed beard, dark practical armor with muted ochre-green scarf and fortress-guard shoulder plates, compact helmet, upright doomed-loyalty presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid Shu-Han green hero look, avoid rugged bandit style, avoid anime.

### 张松 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/张松.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, 1:1 bust of Zhang Song, clever unattractive Yizhou strategist. Short narrow face, sharp large eyes, crooked nose, thin mustache, slight hunched posture, plain dark scholar robe, small low cap, sly but human expression. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail. No text, no watermark, no bright colors, no anime, no caricature, not handsome.

### 周仓 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/周仓.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Zhou Cang, rough loyal warrior follower of Guan Yu, dark rugged face, thick eyebrows, fierce devoted eyes, heavy short beard, simple dark armor with worn cloth headwrap and muted red-green scarf, strong shoulders but not monstrous, folk-hero battlefield presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for game portrait and thumbnail, no text, no watermark, no bright colors, avoid looking like Zhou Tai, avoid ornate officer armor, avoid anime style.

### 董允 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/董允.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Dong Yun, upright strict Shu-Han court official, young-to-mature refined face, serious principled eyes, neat thin mustache, immaculate dark official robe with muted green-grey trim, simple straight official cap, no armor, moral disciplinarian presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid gentle Fei Yi look, avoid old scholar beard, avoid anime style.

### 伊籍 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/伊籍.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, 1:1 bust of Yi Ji, older Liu Bei envoy and scholar-official. Gentle aged face, diplomatic calm eyes, thin grey mustache and short beard, plain dark travel official robe with muted green-brown trim, simple soft cap, no armor. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail. No text, no watermark, no bright colors, no anime, not a warrior.

### 王累 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/王累.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Wang Lei, loyal Yizhou official known for desperate remonstrance, gaunt intense face, sorrowful determined eyes, thin mustache and short beard, plain dark official robes with muted ochre-green trim, simple low cap, no armor, tragic loyalist presence as if ready to die for counsel, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins for portrait frame and thumbnail, no text, no watermark, no bright colors, avoid calm bureaucrat look, avoid warrior armor, avoid anime style.

## 批次 E：荆州、南方与地方势力人物

名单：蔡瑁、曹豹、陈登、陈宫、陈圭、黄祖、蒯良、蒯越、刘繇、王朗、王威、文聘、张允、王粲、王修、雷铜

差异化规则：荆州和地方势力人物要体现地方豪族、水军守将、儒生名士、老谋士和边缘武将的不同层次；避免都成为普通文官或普通甲士。

### 蔡瑁 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/蔡瑁.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, 1:1 bust of Cai Mao, Jingzhou local naval commander. Medium crop, safe margins. Arrogant mature face, narrow calculating eyes, neat mustache, practical dark river armor under a subdued clan officer robe, muted teal scarf, compact low commander cap, not a king and not royal. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, readable small thumbnail. No text, no watermark, no bright colors, no anime, avoid ornate crown and royal armor.

### 曹豹 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/曹豹.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Cao Bao, mediocre Xuzhou military officer in late Han, ordinary broad face, wary insecure eyes, sparse mustache and short beard, plain dark armor with worn brown cloth scarf, simple helmet, slightly defensive posture, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid heroic elite commander look, avoid noble robes, avoid anime style.

### 陈登 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/陈登.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Chen Deng, capable Guangling gentry strategist and local administrator, lean refined face, bright confident eyes, neat mustache and short beard, dark scholar-official robe with subtle military leather underlayer, muted blue-green collar, modest official cap, energetic local statesman presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid elderly scholar look, avoid heavy armor, avoid anime style.

### 陈宫 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/陈宫.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Chen Gong, tragic strategist associated with Lü Bu, stern intelligent face, deep sorrowful eyes, thin mustache and pointed short beard, dark scholar robes with restrained black-brown pattern, high but simple adviser cap, no armor, principled but doomed presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid gentle official look, avoid warrior armor, avoid anime style.

### 陈圭 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/陈圭.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, 1:1 bust of Chen Gui, elderly Xuzhou gentry adviser and father of Chen Deng. Old narrow face, quiet shrewd eyes, thin grey mustache and beard, plain dark official robes, simple aged scholar cap, no armor, restrained local elder strategist presence. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins. No text, no watermark, no bright colors, no anime.

### 黄祖 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/黄祖.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Huang Zu, rough aging Jiangxia warlord and river defense commander, broad weathered face, suspicious harsh eyes, thick grey-black beard, dark river armor with worn leather and muted teal-brown scarf, compact battered helmet, local strongman presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid aristocratic Cai Mao look, avoid court robes, avoid anime style.

### 蒯良 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/蒯良.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Kuai Liang, senior Jingzhou gentry adviser, older dignified face, calm prudent eyes, long neat grey beard, dark scholar-official robe with muted teal-brown trim, tall but restrained local clan cap, no armor, wise provincial elder presence, painterly historical Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid military armor, avoid identical look to Kuai Yue, avoid anime style.

### 蒯越 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/蒯越.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Kuai Yue, clever Jingzhou strategist from the Kuai clan, middle-aged lean face, sharp opportunistic eyes, thin mustache and pointed short beard, dark scholar robes with subtle teal-grey pattern, slightly angled official cap, no armor, agile political adviser presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid older Kuai Liang face, avoid warrior look, avoid anime style.

### 刘繇 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/刘繇.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Liu Yao, late Han regional governor in Yangzhou, refined cautious aristocratic face, worried eyes, neat mustache and short beard, subdued dark official robes with muted blue-grey trim, simple governor cap, no armor, displaced provincial ruler presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid warrior armor, avoid arrogant Yuan clan look, avoid anime style.

### 王朗 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/王朗.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Wang Lang, proud elderly scholar-official and debater of late Han, stern long face, sharp self-important eyes, long grey beard, dark formal court robes with restrained gold-brown trim, tall square official cap, no armor, eloquent but rigid presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid gentle elder look, avoid warrior armor, avoid anime style.

### 王威 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/王威.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, 1:1 bust of Wang Wei, lesser Jingzhou local guard officer. Medium crop with safe margins. Lean plain face, wary practical eyes, short beard, no metal helmet, dark cloth headwrap, simple leather-and-lamellar armor under a rough brown-grey cloak, modest garrison officer presence, clearly lower status than Wen Ping. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, readable small thumbnail. No text, no watermark, no bright colors, no anime, avoid same helmet and armor silhouette as Wen Ping.

### 文聘 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/文聘.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Wen Ping, steady Jingzhou and Wei defensive general, mature firm face, calm immovable eyes, neat medium beard, sturdy dark armor with muted teal-grey officer scarf and disciplined shoulder plates, compact commander helmet, fortress-guardian presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid rough bandit look, avoid ornate royal armor, avoid anime style.

### 张允 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/张允.png`
- 最终提示词：
  > 1:1 painted Three Kingdoms strategy game bust portrait of Zhang Yun, Jingzhou naval officer under Cai Mao, narrow practical face, guarded eyes, short mustache and beard, dark river armor with muted teal sash, simple cloth-and-metal naval cap, subordinate fleet commander presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid looking like Cai Mao noble leader, avoid rough pirate style, avoid anime.

### 王粲 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/王粲.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, square 1:1 bust of Wang Can, young Jian'an poet-scholar. Ancient Chinese game illustration, visible brush texture, not photorealistic. Thin slightly frail face, melancholic intelligent eyes, sparse mustache, small soft scholar cap, plain dark robe with subtle scroll collar, no armor, literary exile presence. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders with safe margins, readable small thumbnail. No text, no watermark, no bright colors, no anime, avoid large tall hat and modern photo look.

### 王修 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/王修.png`
- 最终提示词：
  > 1:1 painted historical strategy game bust portrait of Wang Xiu, upright local official and loyal moralist in late Han, plain mature face, firm honest eyes, short neat beard, simple dark official robes with muted brown-grey trim, modest low cap, no armor, stern ethical provincial official presence, painterly Chinese realism, low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail, no text, no watermark, no bright colors, avoid wealthy noble look, avoid warrior armor, avoid anime style.

### 雷铜 (已生成)

- 保存路径：`sanguobaye-web/public/assets/images/generals/雷铜.png`
- 最终提示词：
  > Painted Three Kingdoms strategy game portrait, square 1:1 bust of Lei Tong, Ba-Shu local mountain officer. Medium crop with safe margins. Lean weathered face, sharp straightforward eyes, short beard, dark leather-and-lamellar armor with rough ochre-green cloak, small metal cap with cloth wrap, hill garrison commander presence, not a huge bearded brute. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, readable small thumbnail. No text, no watermark, no bright colors, no anime, avoid looking like Zhou Cang or Wei Yan.

## 批次 F：西凉、边地、汉中与割据武将

名单：成宜、公孙恭、公孙康、公孙越、梁兴、马玩、杨秋、杨任、杨松、阎圃、张横、张卫、张绣、贾诩

差异化规则：边地人物要突出风沙、皮革、骑兵、边塞和汉中道教/山地气质；但不能都变成同一类粗犷胡须骑将。

## 批次 G：名士、医者、卜者与讨董联盟小势力

名单：方悦、管辂、华佗、穆顺、潘凤、乔瑁、王门、武安国、张超

差异化规则：小势力与特殊人物要靠身份识别：医者、术士、短命猛将、地方太守、讨董义军武将等各有轮廓；避免和主流诸侯阵营撞脸。
