# 将领头像补齐与复核实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按已确认 spec 补齐 119 张缺失将领头像，复核 66 张已有头像，并确保最终 185 个剧本将领头像都能在现有地图与 UI 场景中协调使用。

**Architecture:** 以剧本 `persons.json` 为权威姓名来源，建立批次与提示词清单；使用内置 `image_gen` 按将领逐张生成头像；通过接触表和运行时场景参考做视觉复核，必要时重生成；最后更新美术指南并运行文件完整性验证。

**Tech Stack:** PowerShell、内置 `image_gen`、本地文件系统、Markdown 美术文档、HTML 接触表或本地图像查看工具。

---

## 文件结构

- 读取：`sanguobaye-web/public/config/scenarios/*/persons.json`
- 读取：`sanguobaye-web/public/assets/images/bg_world_map.jpg`
- 读取/修改：`doc/美术文档/美术资源生成指南.md`
- 读取/写入：`sanguobaye-web/public/assets/images/generals/{将领中文名}.png`
- 创建：`tmp/portrait-review/portrait-inventory.md`
- 创建：`tmp/portrait-review/contact-sheet-*.html`
- 创建：`tmp/portrait-review/runtime-check-*.html`
- 修改：`docs/superpowers/plans/2026-06-11-general-portraits-completion.md`，用于勾选执行进度

---

### Task 1: 盘点权威姓名、缺失头像和已有头像

**Files:**
- Read: `sanguobaye-web/public/config/scenarios/*/persons.json`
- Read: `sanguobaye-web/public/assets/images/generals/*.png`
- Create: `tmp/portrait-review/portrait-inventory.md`

- [ ] **Step 1: 从剧本人物表计算唯一将领名**

Run:

```powershell
$personFiles = Get-ChildItem .\sanguobaye-web\public\config\scenarios -Recurse -Filter persons.json
$names = New-Object System.Collections.Generic.HashSet[string]
foreach ($file in $personFiles) {
  $items = Get-Content -Raw -Encoding UTF8 $file.FullName | ConvertFrom-Json
  foreach ($p in $items) {
    if (-not [string]::IsNullOrWhiteSpace($p.name)) {
      [void]$names.Add([string]$p.name)
    }
  }
}
$names | Sort-Object
"unique_person_names=$($names.Count)"
```

Expected: 输出 185 个唯一将领名，并显示 `unique_person_names=185`。

- [ ] **Step 2: 计算已有头像和缺失头像**

Run:

```powershell
$existing = New-Object System.Collections.Generic.HashSet[string]
Get-ChildItem .\sanguobaye-web\public\assets\images\generals -Filter *.png | ForEach-Object {
  [void]$existing.Add($_.BaseName)
}
$missing = $names | Where-Object { -not $existing.Contains($_) } | Sort-Object
"existing_portraits=$($existing.Count)"
"missing_portraits=$($missing.Count)"
$missing
```

Expected: 显示 `existing_portraits=66` 和 `missing_portraits=119`。

- [ ] **Step 3: 写入盘点摘要**

Create `tmp/portrait-review/portrait-inventory.md` with:

```markdown
# 将领头像盘点

- 权威姓名来源：`sanguobaye-web/public/config/scenarios/*/persons.json`
- 唯一将领数：185
- 已有头像数：66
- 缺失头像数：119
- 地图参考：`sanguobaye-web/public/assets/images/bg_world_map.jpg`

## 缺失头像名单

蔡瑁、曹豹、曹休、陈登、陈宫、陈圭、陈群、陈武、成宜、程昱、典韦、丁奉、董允、董昭、法正、方悦、费祎、甘宁、高干、高览、耿武、公孙恭、公孙康、公孙越、关纯、关平、管辂、郭嘉、郭图、华佗、华歆、黄权、黄忠、黄祖、贾诩、简雍、蒋钦、蒋琬、阚泽、蒯良、蒯越、雷铜、李严、梁兴、廖化、凌操、凌统、刘繇、刘晔、刘璋、鲁肃、陆逊、吕范、吕蒙、马良、马谡、马玩、满宠、孟达、糜芳、糜竺、穆顺、潘凤、庞统、乔瑁、孙乾、太史慈、田楷、王粲、王朗、王累、王门、王平、王威、王修、王忠、魏延、文聘、吴懿、武安国、向朗、辛毗、辛评、徐晃、徐庶、许褚、荀谌、荀彧、严纲、严颜、阎圃、杨秋、杨任、杨松、杨修、伊籍、于禁、虞翻、袁尚、袁谭、袁熙、袁遗、臧霸、张超、张郃、张横、张纮、张南、张任、张松、张卫、张绣、张允、张昭、钟繇、周仓、周泰、朱桓、诸葛谨
```

- [ ] **Step 4: 提交盘点结果**

Run:

```bash
git add tmp/portrait-review/portrait-inventory.md
git commit -m "docs: record portrait inventory"
```

Expected: 只提交盘点文档。

---

### Task 2: 建立批次和提示词策略

**Files:**
- Create: `tmp/portrait-review/portrait-prompt-batches.md`

- [ ] **Step 1: 创建批次文档骨架**

Create `tmp/portrait-review/portrait-prompt-batches.md` with these sections:

```markdown
# 将领头像生成批次与提示词策略

## 全局基础提示词

Use case: historical-scene
Asset type: Three Kingdoms strategy game general portrait, 1:1 PNG
Style/medium: realistic painted bust portrait, dark gold and sepia parchment-map palette, compatible with an ancient Chinese parchment world map UI
Composition/framing: centered head-and-shoulders portrait, safe margins around headgear, shoulders and beard, readable in both large side-panel portrait frame and small modal portrait thumbnail
Lighting/mood: low-saturation cinematic warm gold light, smoky brown shadows, solemn historical strategy-game mood
Scene/backdrop: plain deep umber background, no scenery, no text
Constraints: no modern elements, no watermark, no logo, no bright fantasy colors, no anime style, no photorealistic studio-photo look

## 批次 A：曹魏与曹操相关人物

名单：曹休、程昱、典韦、董昭、郭嘉、满宠、于禁、许褚、荀彧、刘晔、徐晃、陈群、钟繇、杨修、王忠、臧霸

## 批次 B：袁绍与北方士族人物

名单：郭图、高干、高览、耿武、关纯、田楷、辛毗、辛评、荀谌、袁尚、袁谭、袁熙、袁遗、张郃、张南

## 批次 C：江东与孙吴人物

名单：陈武、丁奉、甘宁、蒋钦、凌操、凌统、鲁肃、陆逊、吕范、吕蒙、太史慈、虞翻、张纮、张昭、周泰、朱桓、诸葛谨、华歆、阚泽

## 批次 D：刘备、蜀汉、益州与汉中人物

名单：法正、费祎、关平、黄权、黄忠、简雍、蒋琬、李严、廖化、刘璋、马良、马谡、孟达、糜芳、糜竺、庞统、孙乾、王平、魏延、吴懿、向朗、徐庶、严颜、张任、张松、周仓、董允、伊籍、王累

## 批次 E：荆州、南方与地方势力人物

名单：蔡瑁、曹豹、陈登、陈宫、陈圭、黄祖、蒯良、蒯越、刘繇、王朗、王威、文聘、张允、王粲、王修、雷铜

## 批次 F：西凉、边地、汉中与割据武将

名单：成宜、公孙恭、公孙康、公孙越、梁兴、马玩、杨秋、杨任、杨松、阎圃、张横、张卫、张绣

## 批次 G：名士、医者、卜者与讨董联盟小势力

名单：方悦、管辂、华佗、穆顺、潘凤、乔瑁、王门、武安国、张超
```

- [ ] **Step 2: 为每个批次补充差异化规则**

Update `tmp/portrait-review/portrait-prompt-batches.md` so each batch includes a short rule:

```markdown
差异化规则：同批人物必须在脸型、年龄、服饰、头冠/发髻、胡须和姿态上拆开；如果两张头像像同一人换装，后生成者重做。
```

- [ ] **Step 3: 提交批次文档**

Run:

```bash
git add tmp/portrait-review/portrait-prompt-batches.md
git commit -m "docs: define portrait generation batches"
```

Expected: 只提交批次与提示词策略文档。

---

### Task 3: 复核已有 66 张头像

**Files:**
- Read: `sanguobaye-web/public/assets/images/generals/*.png`
- Create: `tmp/portrait-review/contact-sheet-existing.html`
- Create: `tmp/portrait-review/existing-regeneration-candidates.md`

- [ ] **Step 1: 创建已有头像接触表 HTML**

Create `tmp/portrait-review/contact-sheet-existing.html` with an HTML grid referencing all existing PNG files under `sanguobaye-web/public/assets/images/generals/`.
Each tile must show the image at 96x96 and the filename below it.

- [ ] **Step 2: 打开或查看接触表**

Use the in-app browser or local file preview to inspect `tmp/portrait-review/contact-sheet-existing.html`.

Expected: 所有 66 张已有头像可见，且能并排比较脸型、胡须、头冠、肩甲、色调和构图。

- [ ] **Step 3: 记录重生成候选**

Create `tmp/portrait-review/existing-regeneration-candidates.md` with:

```markdown
# 已有头像复核候选

## 需要重生成

| 将领 | 原因 | 新方向 |
| --- | --- | --- |

## 保留

| 将领 | 理由 |
| --- | --- |
```

Fill the first table only for portraits with clear issues:

- 与其他头像像同一人换装。
- 角色身份与历史/游戏印象明显不符。
- 过亮、过艳或不贴合地图和 UI。
- 小头像尺寸下脸部不可读。

- [ ] **Step 4: 提交已有头像复核记录**

Run:

```bash
git add tmp/portrait-review/contact-sheet-existing.html tmp/portrait-review/existing-regeneration-candidates.md
git commit -m "docs: review existing general portraits"
```

Expected: 只提交接触表和复核记录。

---

### Task 4: 逐批生成缺失头像

**Files:**
- Read: `tmp/portrait-review/portrait-prompt-batches.md`
- Write: `sanguobaye-web/public/assets/images/generals/{将领中文名}.png`
- Update: `tmp/portrait-review/portrait-prompt-batches.md`

- [ ] **Step 1: 为一个将领写最终提示词**

For each missing general, use the global base prompt and add identity-specific traits.
Example for `典韦`:

```text
Use case: historical-scene
Asset type: Three Kingdoms strategy game general portrait, 1:1 PNG
Primary request: A portrait of Dian Wei, a towering and brutally loyal bodyguard general of Cao Cao, known for raw physical strength.
Subject: broad square face, thick neck, fierce but loyal eyes, heavy short beard, massive warrior shoulders, dark iron armor with worn bronze beast details.
Style/medium: realistic painted bust portrait, dark gold and sepia parchment-map palette, compatible with an ancient Chinese parchment world map UI.
Composition/framing: centered head-and-shoulders portrait, safe margins around helmet, shoulders and beard, readable in both large side-panel portrait frame and small modal portrait thumbnail.
Lighting/mood: low-saturation cinematic warm gold light, smoky brown shadows, solemn historical strategy-game mood.
Scene/backdrop: plain deep umber background, no scenery.
Constraints: no text, no logo, no watermark, no modern elements, no bright fantasy colors, no anime style, no photorealistic studio-photo look.
Avoid: same face or armor silhouette as other generals; avoid elegant scholar features.
```

- [ ] **Step 2: 使用内置 image_gen 生成该头像**

Run one built-in `image_gen` call for that general.

Expected: 输出一张 1:1 武将头像，画风与地图/UI 协调。

- [ ] **Step 3: 保存到最终路径**

Move or copy the generated image into:

```text
sanguobaye-web/public/assets/images/generals/{将领中文名}.png
```

Do not overwrite an existing file unless that general is listed in `existing-regeneration-candidates.md`.

- [ ] **Step 4: 记录最终提示词**

Append the accepted prompt under the relevant batch section in `tmp/portrait-review/portrait-prompt-batches.md`.

- [ ] **Step 5: 每批提交一次**

Use these exact commit commands by batch:

```bash
git add sanguobaye-web/public/assets/images/generals tmp/portrait-review/portrait-prompt-batches.md
git commit -m "art: add cao wei general portraits"
git commit -m "art: add yuan shao general portraits"
git commit -m "art: add jiangdong general portraits"
git commit -m "art: add shu and yizhou general portraits"
git commit -m "art: add jingzhou regional general portraits"
git commit -m "art: add frontier general portraits"
git commit -m "art: add scholar and minor-force portraits"
```

Expected: 每个提交只执行其中一条 `git commit` 命令，并且只包含对应批次 PNG 和提示词记录。

---

### Task 5: 逐批做接触表复核和必要重生成

**Files:**
- Read: `sanguobaye-web/public/assets/images/generals/*.png`
- Create: `tmp/portrait-review/contact-sheet-batch-*.html`
- Create: `tmp/portrait-review/runtime-check-batch-*.html`
- Update: `tmp/portrait-review/portrait-prompt-batches.md`

- [ ] **Step 1: 为新批次创建接触表**

For each generated batch, create the matching file from this fixed list:

- `tmp/portrait-review/contact-sheet-batch-cao-wei.html`
- `tmp/portrait-review/contact-sheet-batch-yuan-shao.html`
- `tmp/portrait-review/contact-sheet-batch-jiangdong.html`
- `tmp/portrait-review/contact-sheet-batch-shu-yizhou.html`
- `tmp/portrait-review/contact-sheet-batch-jingzhou.html`
- `tmp/portrait-review/contact-sheet-batch-frontier.html`
- `tmp/portrait-review/contact-sheet-batch-scholars-minor.html`

Each file contains:

- 新生成头像。
- 同阵营已有头像。
- 重生成候选头像。
- 每张图 96x96 和 180x180 两种尺寸。

- [ ] **Step 2: 创建运行时风格检查页**

For each generated batch, create the matching file from this fixed list:

- `tmp/portrait-review/runtime-check-batch-cao-wei.html`
- `tmp/portrait-review/runtime-check-batch-yuan-shao.html`
- `tmp/portrait-review/runtime-check-batch-jiangdong.html`
- `tmp/portrait-review/runtime-check-batch-shu-yizhou.html`
- `tmp/portrait-review/runtime-check-batch-jingzhou.html`
- `tmp/portrait-review/runtime-check-batch-frontier.html`
- `tmp/portrait-review/runtime-check-batch-scholars-minor.html`

Each file uses a dark brown panel and `bg_world_map.jpg` as visual context.
Show each portrait in:

- 右侧大头像框比例。
- 弹窗小头像比例。

- [ ] **Step 3: 视觉判定并记录**

For each portrait, mark one of:

```markdown
- 通过：色调协调，大小尺寸都可读，与同批人物不撞脸。
- 重做：说明原因，例如脸型重复、甲胄重复、太亮、太暗、小头像不可读、人物气质不对。
```

- [ ] **Step 4: 重生成失败头像**

For each failed portrait, write a more specific prompt that changes at least two of:

- Face shape.
- Facial hair.
- Headgear.
- Armor silhouette.
- Expression.
- Accent color.
- Regional motif.

Then regenerate and replace the failed file.

- [ ] **Step 5: 提交复核结果**

Use these exact commit commands by batch:

```bash
git add tmp/portrait-review/contact-sheet-batch-*.html tmp/portrait-review/runtime-check-batch-*.html tmp/portrait-review/portrait-prompt-batches.md sanguobaye-web/public/assets/images/generals
git commit -m "art: review cao wei general portraits"
git commit -m "art: review yuan shao general portraits"
git commit -m "art: review jiangdong general portraits"
git commit -m "art: review shu and yizhou general portraits"
git commit -m "art: review jingzhou regional general portraits"
git commit -m "art: review frontier general portraits"
git commit -m "art: review scholar and minor-force portraits"
```

Expected: 每个提交只执行其中一条 `git commit` 命令，并且该批有接触表、运行时检查页和必要重生成结果。

---

### Task 6: 将最终提示词写入美术指南

**Files:**
- Modify: `doc/美术文档/美术资源生成指南.md`
- Read: `tmp/portrait-review/portrait-prompt-batches.md`

- [ ] **Step 1: 在第 13 批之后追加新批次**

Append sections to `doc/美术文档/美术资源生成指南.md` after the current batch 13 content.
Use this structure:

```markdown
## 14. 按剧本人物表补充生成：曹魏与曹操相关人物 (已生成)
- **依据文件**：`sanguobaye-web/public/config/scenarios/*/persons.json`
- **说明**：`general_names.json` 当前存在编码乱码，本轮以各剧本人物表中的可读中文名为权威姓名来源。
- **用途**：补齐游戏人物信息、城池面板、战报与命令反馈头像。
- **尺寸比例**：1:1 (建议 512x512)
- **格式**：`.png`
- **保存路径规则**：`sanguobaye-web/public/assets/images/generals/{将领中文名}.png`
- **基础画风约定**：
  > Three Kingdoms era historical bust portrait, dark gold and sepia parchment-map palette, compatible with `bg_world_map.jpg`, low-saturation cinematic warm gold light, plain deep umber background, readable in both large side-panel portrait frame and small modal portrait thumbnail, no text, no logo, no watermark, no modern elements.

### 14.1 典韦 (已生成)
- **保存路径**：`sanguobaye-web/public/assets/images/generals/典韦.png`
- **AI 绘图提示词 (Prompt)**：
  > Use case: historical-scene. Asset type: Three Kingdoms strategy game general portrait, 1:1 PNG. Primary request: A portrait of Dian Wei, a towering and brutally loyal bodyguard general of Cao Cao, known for raw physical strength. Subject: broad square face, thick neck, fierce but loyal eyes, heavy short beard, massive warrior shoulders, dark iron armor with worn bronze beast details. Style/medium: realistic painted bust portrait, dark gold and sepia parchment-map palette, compatible with an ancient Chinese parchment world map UI. Composition/framing: centered head-and-shoulders portrait, safe margins around helmet, shoulders and beard, readable in both large side-panel portrait frame and small modal portrait thumbnail. Lighting/mood: low-saturation cinematic warm gold light, smoky brown shadows, solemn historical strategy-game mood. Scene/backdrop: plain deep umber background, no scenery. Constraints: no text, no logo, no watermark, no modern elements, no bright fantasy colors, no anime style, no photorealistic studio-photo look. Avoid: same face or armor silhouette as other generals; avoid elegant scholar features.
```

- [ ] **Step 2: 为所有新增和重生成头像写入提示词**

Each generated or regenerated portrait must have:

- Numbered heading.
- Save path.
- Final accepted prompt.
- Status `(已生成)`.

- [ ] **Step 3: 提交美术指南更新**

Run:

```bash
git add doc/美术文档/美术资源生成指南.md
git commit -m "docs: record completed general portrait prompts"
```

Expected: 美术指南包含所有新增或重生成头像的最终提示词。

---

### Task 7: 最终验证

**Files:**
- Read: `sanguobaye-web/public/config/scenarios/*/persons.json`
- Read: `sanguobaye-web/public/assets/images/generals/*.png`
- Read: `doc/美术文档/美术资源生成指南.md`

- [ ] **Step 1: 验证所有唯一将领都有 PNG**

Run:

```powershell
$personFiles = Get-ChildItem .\sanguobaye-web\public\config\scenarios -Recurse -Filter persons.json
$names = New-Object System.Collections.Generic.HashSet[string]
foreach ($file in $personFiles) {
  $items = Get-Content -Raw -Encoding UTF8 $file.FullName | ConvertFrom-Json
  foreach ($p in $items) {
    if (-not [string]::IsNullOrWhiteSpace($p.name)) {
      [void]$names.Add([string]$p.name)
    }
  }
}
$missing = @()
foreach ($name in ($names | Sort-Object)) {
  $path = ".\sanguobaye-web\public\assets\images\generals\$name.png"
  if (-not (Test-Path -LiteralPath $path)) {
    $missing += $name
  }
}
"unique_person_names=$($names.Count)"
"missing_files=$($missing.Count)"
$missing
```

Expected: `unique_person_names=185` and `missing_files=0`.

- [ ] **Step 2: 验证头像文件非空且为 PNG**

Run:

```powershell
$bad = @()
Get-ChildItem .\sanguobaye-web\public\assets\images\generals -Filter *.png | ForEach-Object {
  $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
  $isPng = $bytes.Length -gt 8 -and $bytes[0] -eq 137 -and $bytes[1] -eq 80 -and $bytes[2] -eq 78 -and $bytes[3] -eq 71
  if ($_.Length -le 0 -or -not $isPng) {
    $bad += $_.Name
  }
}
"bad_png_files=$($bad.Count)"
$bad
```

Expected: `bad_png_files=0`.

- [ ] **Step 3: 验证美术指南包含新来源说明和关键路径**

Run:

```powershell
Select-String -Path ".\doc\美术文档\美术资源生成指南.md" -Pattern "persons.json","bg_world_map.jpg","generals/"
```

Expected: 输出包含 `persons.json`、`bg_world_map.jpg`、`sanguobaye-web/public/assets/images/generals/` 的匹配行。

- [ ] **Step 4: 记录最终复核摘要**

Create or update `tmp/portrait-review/final-review-summary.md` with the verification counts from Step 1 and Step 2 and the regeneration list from `tmp/portrait-review/existing-regeneration-candidates.md`.
If no existing portrait was regenerated, write `重生成已有头像：0` and leave the reason table empty except for the header.
If existing portraits were regenerated, write the exact count and one row per regenerated general.
The file uses this structure:

```markdown
# 将领头像最终复核摘要

- 唯一将领数：185
- 最终头像数：185
- 缺失文件：0
- 坏 PNG 文件：0
- 已复核已有头像：66
- 新增头像：119
- 重生成已有头像：0

## 重生成已有头像原因

| 将领 | 原因 |
| --- | --- |

## 同屏风格检查

- 已使用 `bg_world_map.jpg` 和暗金 UI 面板场景检查代表性头像。
- 已检查右侧大头像框和弹窗小头像尺寸下的可读性。
```

- [ ] **Step 5: 提交最终验证摘要**

Run:

```bash
git add tmp/portrait-review/final-review-summary.md
git commit -m "docs: summarize portrait completion verification"
```

Expected: 最终摘要提交完成。
