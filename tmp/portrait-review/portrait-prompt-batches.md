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

## 批次 D：刘备、蜀汉、益州与汉中人物

名单：法正、费祎、关平、黄权、黄忠、简雍、蒋琬、李严、廖化、刘璋、马良、马谡、孟达、糜芳、糜竺、庞统、孙乾、王平、魏延、吴懿、向朗、徐庶、严颜、张任、张松、周仓、董允、伊籍、王累

差异化规则：蜀汉与益州人物需要区分仁义旧部、益州地方官、山地守将、老将、谋士、商贾士族和忠烈武人；不要全部使用绿色长袍。

## 批次 E：荆州、南方与地方势力人物

名单：蔡瑁、曹豹、陈登、陈宫、陈圭、黄祖、蒯良、蒯越、刘繇、王朗、王威、文聘、张允、王粲、王修、雷铜

差异化规则：荆州和地方势力人物要体现地方豪族、水军守将、儒生名士、老谋士和边缘武将的不同层次；避免都成为普通文官或普通甲士。

## 批次 F：西凉、边地、汉中与割据武将

名单：成宜、公孙恭、公孙康、公孙越、梁兴、马玩、杨秋、杨任、杨松、阎圃、张横、张卫、张绣、贾诩

差异化规则：边地人物要突出风沙、皮革、骑兵、边塞和汉中道教/山地气质；但不能都变成同一类粗犷胡须骑将。

## 批次 G：名士、医者、卜者与讨董联盟小势力

名单：方悦、管辂、华佗、穆顺、潘凤、乔瑁、王门、武安国、张超

差异化规则：小势力与特殊人物要靠身份识别：医者、术士、短命猛将、地方太守、讨董义军武将等各有轮廓；避免和主流诸侯阵营撞脸。
