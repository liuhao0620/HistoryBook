# 已有头像复核候选

## 需要重生成

| 将领 | 原因 | 新方向 |
| --- | --- | --- |
| 侯成 | 与侯选在头盔、灰甲、脸型和小图轮廓上过于接近，像同一类普通骑兵将领换名。 | 做成疲惫谨慎的吕布旧部骑将，减少头盔遮挡，增加暗棕皮革马具、短须和不安眼神。 |
| 李堪 | 与李傕、李典、张杨等重甲武将的轮廓接近，小头像尺寸下缺少独立识别点。 | 做成西凉边地将领，削瘦脸、风沙痕迹、皮毛襟、短须，甲胄更粗粝而非中原制式。 |
| 刘岱 | 与刘表、刘焉等宗亲州牧同属官服构图，当前辨识度偏弱，人物性格不够明确。 | 做成谨慎而虚弱的汉室宗亲州牧，较年轻、焦虑眼神，官服下露出轻甲，金饰克制。 |

## 已重生成

| 将领 | 保存路径 | 最终提示词 | 复核结论 |
| --- | --- | --- | --- |
| 侯成 | `sanguobaye-web/public/assets/images/generals/侯成.png` | Painted Three Kingdoms strategy game portrait, 1:1 bust of Hou Cheng, weary cautious cavalry officer formerly under Lu Bu. Tired narrow face, uneasy eyes, short beard, no full helmet, tied dark hair with simple cloth band, dark brown leather horseman armor with worn straps and muted red-brown scarf, low-status veteran cavalry presence. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable small thumbnail. No text, no watermark, no bright colors, no anime, avoid looking like Hou Xuan or a generic helmeted cavalryman. | 与侯选的金属盔、灰甲轮廓明显分开；运行小头像仍可读。 |
| 李堪 | `sanguobaye-web/public/assets/images/generals/李堪.png` | Painted Three Kingdoms strategy game portrait, 1:1 bust of Li Kan, Xiliang frontier commander. Gaunt long face, wind-cracked skin, narrow hard eyes, very short beard, exposed forehead with tied-back hair, dusty pale fur collar, rough dark leather armor, ochre desert scarf, no cloth headwrap, no full metal helmet, no central-plains polished armor. Sepia and dark gold parchment-map palette, deep umber background, centered head and shoulders, safe margins. No text, no watermark, no bright colors, no anime, avoid looking like Hou Cheng. | 与李傕、李典、张杨的中原重甲轮廓拉开，也避免了与侯成的新图相似。 |
| 刘岱 | `sanguobaye-web/public/assets/images/generals/刘岱.png` | Painted Three Kingdoms strategy game portrait, 1:1 bust of Liu Dai, cautious weak Han imperial clan provincial governor. Younger anxious face, tired worried eyes, neat thin mustache and short beard, dark formal governor robe over very light hidden armor, restrained gold-brown trim, modest official cap, not heroic. Low-saturation sepia and dark gold palette matching parchment map UI, plain deep umber background, centered head and shoulders, safe margins, readable thumbnail. No text, no watermark, no bright colors, no anime, avoid looking like Liu Biao or Liu Yan. | 与刘表、刘焉的稳重年长州牧气质分开，焦虑和轻甲特征更明确。 |

审查图：

- `tmp/portrait-review/contact-sheet-existing-regenerated.png`
- `tmp/portrait-review/runtime-check-existing-regenerated.png`

## 保留

| 将领 | 理由 |
| --- | --- |
| 核心诸侯与名将 | 曹操、刘备、孙权、董卓、吕布、关羽、张飞、赵云、诸葛亮等核心头像辨识度强，运行时大头像和小头像均可读。 |
| 已有谋士与文官 | 李儒、荀攸、沮授、田丰、许攸、孔融、王允等文官/谋士头像与武将区分明显，暂不重生成。 |
| 已有江东、西凉与袁绍系武将 | 孙策、孙坚、马腾、马超、庞德、颜良、文丑、纪灵等已有头像气质明确，虽同属暗金风格但未达到需要重生成的同质化程度。 |
