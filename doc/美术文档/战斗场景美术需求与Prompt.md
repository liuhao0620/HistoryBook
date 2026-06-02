# 《三国霸业》复刻版 - 战斗场景美术需求与 Prompt

本文档基于原版游戏战斗系统的逻辑架构（8种地形地块、6种兵种），整理了用于战棋/策略战斗场景的美术资源需求及 AI 绘画提示词（Prompt）。您可以将这些 Prompt 提交给 OpenAI (DALL-E 3) 或 Midjourney 等工具生成图片。

---

## 1. 整体视觉风格约定、尺寸与存储规范
- **视角**：
  - **地形地块 (Terrain Tiles)**：**绝对纯正的 2D 俯视角 (Top-down 2D)**，完全垂直向下看。地块必须是完美的正方形，**不要任何 3D 厚度、透视或等距斜角 (Isometric)**，以确保网格能完美无缝拼接。
  - **兵种单位 (Units)**：为了让角色在地图上显得立体且易于辨认，角色可以采用 **2.5D 等距视角 (Isometric)** 或带有一点俯视角度的立体透视。
- **画风**：中国古典风、复古策略游戏美学（Retro Strategy Game Aesthetic），色调偏向暗金、棕色与厚重的历史感（水墨/工笔元素点缀）。
- **全局色调与光影强制统一 (CRITICAL)**：所有的地形地块必须共享**完全相同**的全局色调（偏暗的棕色、土色、暗绿色）和光照强度。**绝对不要**出现高饱和度的亮黄色或翠绿色，否则拼接后会像打补丁一样毫无整体感。
- **地形渲染策略 (Base + Overlay)**：为了实现地形的完美融合，游戏采用底图+覆盖物的渲染方式：
  - **底图 (Base)**：所有陆地地形均以“平原 (Plain)”为底图，所有水面地形以“河流 (River)”为底图。这两者必须是**无缝拼接 (Seamless Tiling)**的方形纹理。
  - **覆盖物 (Overlay Props)**：除了平原和河流，其他地形（如草地、森林、山地、村庄、城池、营寨）实际上是放置在平原底图上的**透明背景覆盖物 (Transparent Props)**。
- **图片处理要求**：平原和河流生成无缝方块；**兵种单位以及除平原/河流外的所有地形覆盖物，必须是透明背景（Transparent PNG）**。由于 AI 绘图工具（如 DALL-E/Midjourney）通常无法直接输出透明背景，请务必在生成纯白背景的图片后，使用抠图工具（如 remove.bg 或 Photoshop）将白底去除，再放入项目中！
- **地形生成特殊约束**：作为会被大量重复铺设的基础地块（特别是草地、平原），必须保持画面干净，**绝不能包含明显的个别树木、巨石等显著标志物**，否则拼接后会产生严重的重复感和视觉混乱。边缘必须能够无缝连接（Seamless Tiling）。
- **尺寸与比例要求**：
  - **基础地块 (Terrain) 与 兵种单位 (Units)**：必须生成为 **1:1 正方形**（建议尺寸为 256x256 或 512x512 像素），以便在游戏引擎中精确映射与缩放至 32x32、64x64 或 128x128 的标准网格中。如果使用 Midjourney，请在 Prompt 末尾添加 `--ar 1:1`；如果使用 DALL-E 3，请指定正方形比例。
  - **边缘过渡地块集 (Tile-sets / Sprite sheets)**：如包含多种拼接边缘的海岸线图集，建议生成为 **3:2 或 16:9**（如 `--ar 3:2`），以确保有足够的空间排布多种变体图块。
- **输出目录规范**：生成的图片请统一保存在项目中的 `sanguobaye-web/public/assets/images/battle/` 目录下（若无此目录请新建），并在每个具体的需求项中遵循指定的文件名。

---

## 2. 战斗地图地块 (Terrain Tiles)
战斗地图基于网格，共有 8 种基础地形。地块资源需要能够拼接连成一片大地图。

### 2.1 草地 (Lea)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_lea.png`
- **用途**：基础地形，阻力较小。作为平原上的透明覆盖物。
- **AI 绘画提示词 (Prompt)**：
  > Pure top-down 2D game terrain prop of lush green grass patches. NO ground/dirt base, just the grass itself. Flat texture, NO isometric angle, NO 3D thickness. Ancient Chinese landscape painting style. Unified muted color palette, dark earth tones. Isolated on a solid white background (for easy background removal), high quality, 8k.
  > *(中文释义：纯正俯视角的2D游戏地形道具：翠绿的草丛斑块。不要泥土底图，只要草本身。平坦纹理，不要等距斜角，不要3D厚度。中国古代山水画风格。统一的暗色调。纯白背景（便于抠图去底），高质量，8k。)*

### 2.2 平原 (Dene) - 作为所有陆地的基础底图
- **保存路径及名称**：由于我们需要测试多种底色方案，请分别保存为：
  - 方案一 (灰绿柔和)：`sanguobaye-web/public/assets/images/battle/tile_dene_classic.png`
  - 方案二 (水墨羊皮)：`sanguobaye-web/public/assets/images/battle/tile_dene_parchment.png`
  - 方案三 (肃杀冷灰)：`sanguobaye-web/public/assets/images/battle/tile_dene_cold.png`
- **用途**：基础开阔地形，无阻力。作为所有陆地地块的底层铺设。
- **AI 绘画提示词 (Prompt)**：
  为了找到最护眼且最契合“复古策略”的底色，请分别用以下三套 Prompt 生成三张不同的平原底图以供引擎测试：

  > **方案一：经典灰绿柔和风 (推荐)**
  > Pure top-down 2D game tile of a flat plain, desaturated grayish-green and soft brown earth. Low contrast, easy on the eyes. Flat texture, NO isometric angle, NO 3D thickness, NO distinct rocks or trees. Seamless tiling texture, ancient Chinese battlefield terrain. Unified muted color palette, neutral earth tones. Clean edges, isolated on a white background, high quality.
  > *(中文释义：纯正俯视角的2D游戏平原地块，低饱和度的灰绿色与柔和的棕色泥土混合。低对比度，视觉舒适。平坦纹理，不要等距斜角，不要3D厚度，不要明显的石头或树木。无缝拼接纹理。统一的暗色调，中性泥土色。边缘干净，纯白背景，高质量。)*

  > **方案二：古地图水墨风 (Parchment & Ink)**
  > Pure top-down 2D game tile of a flat plain, faded parchment texture, ancient Chinese ink scroll background. Very low contrast, easy on the eyes, sepia tones. Flat texture, NO isometric angle, NO 3D thickness, NO distinct rocks or trees. Seamless tiling texture. Clean edges, isolated on a white background, high quality.
  > *(中文释义：纯正俯视角的2D游戏平原地块，褪色的羊皮纸纹理，中国古代水墨画卷底色。极低对比度，视觉舒适，复古棕褐色调。平坦纹理，不要等距斜角，不要3D厚度，不要明显的石头或树木。无缝拼接纹理。边缘干净，纯白背景，高质量。)*

  > **方案三：肃杀冷灰风 (Cold Battlefield)**
  > Pure top-down 2D game tile of a flat plain, desaturated cool greyish earth, stony soil. Dark and solemn battlefield atmosphere, low contrast, easy on the eyes. Flat texture, NO isometric angle, NO 3D thickness, NO distinct rocks or trees. Seamless tiling texture. Clean edges, isolated on a white background, high quality.
  > *(中文释义：纯正俯视角的2D游戏平原地块，低饱和度的冷灰色泥土，多石土壤。阴暗庄严的战场氛围，低对比度，视觉舒适。平坦纹理，不要等距斜角，不要3D厚度，不要明显的石头或树木。无缝拼接纹理。边缘干净，纯白背景，高质量。)*

### 2.3 山地 (Hill)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_hill.png`
- **用途**：高阻力地形，步兵/弓兵有防御加成，骑兵难以通行。作为平原上的透明覆盖物。
- **AI 绘画提示词 (Prompt)**：
  > Pure top-down 2D game terrain prop of rocky hills and mountains. NO ground/dirt base, just the rocks themselves. Flat texture base but stylized as rugged stones from a top-down view, NO isometric angle, NO 3D thickness. Traditional Chinese ink wash painting aesthetic. Isolated on a solid white background (for easy background removal), high quality.
  > *(中文释义：纯正俯视角的2D游戏地形道具：山石。不要泥土底图，只要岩石本身。基于平坦纹理但在俯视下具有崎岖岩石的风格化表现，不要等距斜角，不要3D厚度。传统中国水墨画美学。纯白背景（便于抠图去底），高质量。)*

### 2.4 森林 (Wood)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_wood.png`
- **用途**：高阻力地形，适合伏击。作为平原上的透明覆盖物。
- **AI 绘画提示词 (Prompt)**：
  > Pure top-down 2D game terrain prop of a dense ancient Chinese forest canopy. NO ground/dirt base, just the trees themselves. Looking straight down at pine tree tops, dark green foliage. Flat texture base, NO isometric angle, NO 3D thickness. Mysterious atmosphere. Isolated on a solid white background (for easy background removal), high quality.
  > *(中文释义：纯正俯视角的2D游戏地形道具：茂密中国古代森林树冠。不要泥土底图，只要树木本身。完全垂直俯视松树顶部，深绿色的枝叶。基于平坦纹理，不要等距斜角，不要3D厚度。神秘的氛围。纯白背景（便于抠图去底），高质量。)*

### 2.5 村庄 (Thorp)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_thorp.png`
- **用途**：可提供少量恢复或防御加成的建筑地块。作为平原上的透明覆盖物。
- **AI 绘画提示词 (Prompt)**：
  > Pure top-down 2D game terrain prop of ancient Chinese rural village rooftops. NO ground/dirt base, just the buildings. Looking straight down at small thatched cottage roofs and mud walls. Flat texture base, NO isometric angle, NO 3D thickness. Isolated on a solid white background (for easy background removal), high quality.
  > *(中文释义：纯正俯视角的2D游戏地形道具：中国古代乡村屋顶。不要泥土底图，只要建筑本身。完全垂直俯视小茅草屋顶和泥墙。基于平坦纹理，不要等距斜角，不要3D厚度。纯白背景（便于抠图去底），高质量。)*

### 2.6 城池 (City)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_city.png`
- **用途**：核心防守地块，提供高额防御加成与生命恢复，AI进攻的首要目标。作为平原上的透明覆盖物。
- **AI 绘画提示词 (Prompt)**：
  > Pure top-down 2D game terrain prop of a majestic ancient Chinese city wall and gatehouse rooftops. NO ground/dirt base. Looking straight down at dark gold and gray bricks. Flat texture base, NO isometric angle, NO 3D thickness. Isolated on a solid white background (for easy background removal), high quality.
  > *(中文释义：纯正俯视角的2D游戏地形道具：宏伟中国古代城墙与城门屋顶。不要泥土底图。完全垂直俯视暗金色与灰色城砖。基于平坦纹理，不要等距斜角，不要3D厚度。纯白背景（便于抠图去底），高质量。)*

### 2.7 营寨 (Tent)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_tent.png`
- **用途**：野外临时防守地块，提供一定防御与恢复。作为平原上的透明覆盖物。
- **AI 绘画提示词 (Prompt)**：
  > Pure top-down 2D game terrain prop of an ancient Chinese military camp. NO ground/dirt base. Looking straight down at canvas tent tops and barricades. Flat texture base, NO isometric angle, NO 3D thickness. Isolated on a solid white background (for easy background removal), high quality.
  > *(中文释义：纯正俯视角的2D游戏地形道具：中国古代军营。不要泥土底图。完全垂直俯视帆布帐篷顶部和拒马。基于平坦纹理，不要等距斜角，不要3D厚度。纯白背景（便于抠图去底），高质量。)*

### 2.8 河流 (River)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_river.png`
- **用途**：水军的优势地形，其他兵种移动极其困难。
- **AI 绘画提示词 (Prompt)**：
  > Pure top-down 2D game tile of deep river water. Flat texture base, NO isometric angle, NO 3D thickness. Seamless tiling texture of stylized water with ancient Chinese painting waves. Unified muted color palette, dark blue and jade green colors. Clean edges, isolated on a white background, high quality.
  > *(中文释义：纯正俯视角的2D游戏深河水地块。基于平坦纹理，不要等距斜角，不要3D厚度。带有中国古画波纹风格化水面的无缝拼接纹理。统一的暗色调，深蓝色与翠绿色。边缘干净，纯白背景，高质量。)*

---

## 3. 兵种单位 (Unit Types)
战斗包含 6 种兵种，需要为每种兵种生成角色形象（可作为地图上的棋子Sprite或UI图标）。
**建议：** 在 Prompt 中可以加入特定颜色（如红/蓝）以区分敌我，或者生成中性色调，由游戏引擎进行染色。

### 3.1 骑兵 (Cavalry)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/unit_cavalry.png`
- **兵种特征**：高机动力，开阔地形（草地/平原）优势，受制于山地和河流。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game sprite of an ancient Chinese cavalry soldier. A heavily armored warrior riding a warhorse, holding a long spear. Dark gold and iron armor. Retro strategy game character asset. Full body, standing pose, isolated on a solid white background.
  > *(中文释义：等距视角的2D游戏中国古代骑兵Sprite。身披重甲的战士骑着战马，手持长矛。暗金与玄铁铠甲。复古策略游戏角色资产。全身，站立姿势，纯白背景。)*

### 3.2 步兵 (Infantry)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/unit_infantry.png`
- **兵种特征**：基础近战兵种，防御力较强，全地形适应性中等。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game sprite of an ancient Chinese infantry foot soldier. Wearing sturdy leather and iron armor, holding a sword and a wooden shield. Retro strategy game character asset. Full body, combat stance, isolated on a solid white background.
  > *(中文释义：等距视角的2D游戏中国古代步兵Sprite。穿着坚固的皮铁铠甲，手持单手剑与木盾。复古策略游戏角色资产。全身，战斗姿态，纯白背景。)*

### 3.3 弓箭兵 (Archer)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/unit_archer.png`
- **兵种特征**：远程物理攻击，近战孱弱，适合在城池/山地后方输出。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game sprite of an ancient Chinese archer. Wearing light armor, drawing a traditional recurve bow, aiming forward. Retro strategy game character asset. Full body, action pose, isolated on a solid white background.
  > *(中文释义：等距视角的2D游戏中国古代弓箭兵Sprite。身穿轻甲，拉开传统反曲弓，向前瞄准。复古策略游戏角色资产。全身，动作姿态，纯白背景。)*

### 3.4 水军 (Navy)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/unit_navy.png`
- **兵种特征**：唯一能在河流中自由移动并获得巨大战斗加成的兵种。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game sprite of an ancient Chinese naval soldier (marine). Wearing light scaled armor suited for water combat, holding a trident or hook. Retro strategy game character asset. Full body, standing pose, isolated on a solid white background.
  > *(中文释义：等距视角的2D游戏中国古代水军Sprite。穿着适合水战的轻型鳞甲，手持三叉戟或吴钩。复古策略游戏角色资产。全身，站立姿势，纯白背景。)*

### 3.5 极兵 (Halberdier / Elite)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/unit_halberdier.png`
- **兵种特征**：精英近战兵种，攻击力极高，手持重兵器。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game sprite of an elite ancient Chinese halberdier. A massive, intimidating warrior in heavy elaborate armor, wielding a giant Ji (Chinese halberd). Dark bronze and red aesthetics. Retro strategy game character asset. Full body, isolated on a solid white background.
  > *(中文释义：等距视角的2D游戏中国古代精英极兵（戟兵）Sprite。体型巨大、令人畏惧的战士，身穿华丽重甲，挥舞着巨大的中国戟。暗青铜与红色美学。复古策略游戏角色资产。全身，纯白背景。)*

### 3.6 玄兵 (Mystic / Tactician)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/unit_mystic.png`
- **兵种特征**：智力型兵种（法师），擅长计谋与法术，如火攻、混乱等。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game sprite of an ancient Chinese mystic tactician. A wise scholar wearing flowing Taoist robes, holding a feather fan, surrounded by faint magical aura. Retro strategy game character asset. Full body, standing pose, isolated on a solid white background.
  > *(中文释义：等距视角的2D游戏中国古代玄兵（谋士/法师）Sprite。一位充满智慧的学者，身穿飘逸的道袍，手持羽扇，周围环绕着微弱的法术光环。复古策略游戏角色资产。全身，站立姿势，纯白背景。)*

### 3.7 水上行军状态 (战船 / Naval Ship)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/unit_naval_ship.png`
- **特征说明**：当任何兵种（尤其是水军）移动到“河流”地块时，为了视觉合理性，其 Sprite 将会被替换为一艘战船。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game sprite of a small ancient Chinese wooden warship (Mengchong or small boat). Used to represent army units moving on water. Dark wood, small sails or oars, ancient Chinese naval design. Retro strategy game unit asset. Isolated on a solid white background.
  > *(中文释义：等距视角的2D游戏小型中国古代木制战船（蒙冲或小舟）Sprite。用于表示在水面上移动的军队单位。深色木材，小帆或船桨，中国古代海军设计。复古策略游戏单位资产。纯白背景。)*
