# 《三国霸业》复刻版 - 战斗场景美术需求与 Prompt

本文档基于原版游戏战斗系统的逻辑架构（8种地形地块、6种兵种），整理了用于战棋/策略战斗场景的美术资源需求及 AI 绘画提示词（Prompt）。您可以将这些 Prompt 提交给 OpenAI (DALL-E 3) 或 Midjourney 等工具生成图片。

---

## 1. 整体视觉风格约定、尺寸与存储规范
- **视角**：2D 等距视角（Isometric）或俯视角（Top-down），适配战棋类游戏的网格（Tile）移动逻辑。
- **画风**：中国古典风、复古策略游戏美学（Retro Strategy Game Aesthetic），色调偏向暗金、棕色与厚重的历史感（水墨/工笔元素点缀）。
- **图片处理要求**：地块建议生成无缝或可独立拼接的方块；兵种单位建议生成在纯白或纯绿背景上，以便后期抠图实现透明背景（PNG）。
- **尺寸与比例要求**：
  - **基础地块 (Terrain) 与 兵种单位 (Units)**：必须生成为 **1:1 正方形**（建议尺寸为 256x256 或 512x512 像素），以便在游戏引擎中精确映射与缩放至 32x32、64x64 或 128x128 的标准网格中。如果使用 Midjourney，请在 Prompt 末尾添加 `--ar 1:1`；如果使用 DALL-E 3，请指定正方形比例。
  - **边缘过渡地块集 (Tile-sets / Sprite sheets)**：如包含多种拼接边缘的海岸线图集，建议生成为 **3:2 或 16:9**（如 `--ar 3:2`），以确保有足够的空间排布多种变体图块。
- **输出目录规范**：生成的图片请统一保存在项目中的 `sanguobaye-web/public/assets/images/battle/` 目录下（若无此目录请新建），并在每个具体的需求项中遵循指定的文件名。

---

## 2. 战斗地图地块 (Terrain Tiles)
战斗地图基于网格，共有 8 种基础地形。地块资源需要能够拼接连成一片大地图。

### 2.1 草地 (Lea)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_lea.png`
- **用途**：基础地形，阻力较小。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game tile of a lush green grassland. Subtle dirt patches, ancient Chinese landscape painting style. Retro turn-based strategy game terrain asset. Clean edges, isolated on a white background, high quality, 8k.
  > *(中文释义：等距视角的2D游戏草地地块。隐约可见的泥土斑块，中国古代山水画风格。复古回合制策略游戏地形资产。边缘干净，纯白背景，高质量，8k。)*

### 2.2 平原 (Dene)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_dene.png`
- **用途**：基础开阔地形，无阻力。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game tile of a flat dry plain, yellowish dirt and sparse short grass. Ancient Chinese battlefield terrain, retro strategy game asset. Clean edges, isolated on a white background, high quality.
  > *(中文释义：等距视角的2D游戏平原地块，黄土与稀疏的短草。中国古代战场地形，复古策略游戏资产。边缘干净，纯白背景，高质量。)*

### 2.3 山地 (Hill)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_hill.png`
- **用途**：高阻力地形，步兵/弓兵有防御加成，骑兵难以通行。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game tile of steep rocky hills and mountains. Traditional Chinese ink wash painting aesthetic, rugged stones. Retro strategy game terrain asset. Clean edges, isolated on a white background, high quality.
  > *(中文释义：等距视角的2D游戏陡峭山石地块。传统中国水墨画美学，崎岖的岩石。复古策略游戏地形资产。边缘干净，纯白背景，高质量。)*

### 2.4 森林 (Wood)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_wood.png`
- **用途**：高阻力地形，适合伏击。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game tile of a dense ancient Chinese forest. Pine trees and bamboo groves, dark green foliage, mysterious atmosphere. Retro strategy game terrain asset. Clean edges, isolated on a white background, high quality.
  > *(中文释义：等距视角的2D游戏茂密中国古代森林地块。松树与竹林，深绿色的枝叶，神秘的氛围。复古策略游戏地形资产。边缘干净，纯白背景，高质量。)*

### 2.5 村庄 (Thorp)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_thorp.png`
- **用途**：可提供少量恢复或防御加成的建筑地块。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game tile of an ancient Chinese rural village. A few small thatched cottages, mud walls, peaceful farming settlement. Retro strategy game terrain asset. Clean edges, isolated on a white background, high quality.
  > *(中文释义：等距视角的2D游戏中国古代乡村地块。几座小茅草屋，泥墙，宁静的农耕定居点。复古策略游戏地形资产。边缘干净，纯白背景，高质量。)*

### 2.6 城池 (City)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_city.png`
- **用途**：核心防守地块，提供高额防御加成与生命恢复，AI进攻的首要目标。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game tile of a majestic ancient Chinese city gatehouse and stone walls. Dark gold and gray bricks, red banners. Retro strategy game terrain asset. Clean edges, isolated on a white background, high quality.
  > *(中文释义：等距视角的2D游戏宏伟中国古代城门与石墙地块。暗金色与灰色城砖，红色战旗。复古策略游戏地形资产。边缘干净，纯白背景，高质量。)*

### 2.7 营寨 (Tent)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_tent.png`
- **用途**：野外临时防守地块，提供一定防御与恢复。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game tile of an ancient Chinese military camp. Canvas tents, wooden barricades, military flags. Retro strategy game terrain asset. Clean edges, isolated on a white background, high quality.
  > *(中文释义：等距视角的2D游戏中国古代军营地块。帆布帐篷，木制拒马，军旗。复古策略游戏地形资产。边缘干净，纯白背景，高质量。)*

### 2.8 河流与海岸线 (River & Coastline Auto-tiles)
- **保存路径及名称**：`sanguobaye-web/public/assets/images/battle/tile_river_set.png`
- **用途**：水军的优势地形，其他兵种移动极其困难。为了让水面与陆地自然衔接，需要生成包含多种边界情况的“地块集”（Tile-set），用于程序的自动拼接（Auto-tiling）。
- **AI 绘画提示词 (Prompt)**：
  > Isometric 2D game tile set of river and coastlines. A sprite sheet containing deep water tiles, and various shoreline tiles with different edges (top, bottom, left, right, inner corners, outer corners) transitioning into dirt or grass. Stylized water with ancient Chinese painting waves, blue and jade green colors. Retro strategy game terrain asset. Clean edges, isolated on a white background, high quality, 8k.
  > *(中文释义：等距视角的2D游戏河流与海岸线地块集。一张包含深水地块以及各种不同边缘（上、下、左、右、内角、外角）过渡到泥土或草地的海岸线地块的精灵图（Sprite sheet）。风格化的水面，带有中国古画中的波纹，蓝色与翠绿色调。复古策略游戏地形资产。边缘干净，纯白背景，高质量，8k。)*

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
