# General Portraits Completion Design

## Context

The game currently has portrait assets in `sanguobaye-web/public/assets/images/generals/`.
The existing art guide is `doc/美术文档/美术资源生成指南.md`, which defines a dark gold and brown Three Kingdoms strategy portrait style and includes generated batches for core generals.

`sanguobaye-web/public/config/general_names.json` appears to contain garbled text, so the reliable source of Chinese general names for this task is the scenario `persons.json` files under `sanguobaye-web/public/config/scenarios/`.
Across those scenario files there are 185 unique names. There are currently 66 existing portrait PNG files, leaving 119 missing portraits.

## Goal

Complete the general portrait asset set for all 185 unique scenario generals.

This includes:

- Generate portraits for all 119 missing generals.
- Review all 66 existing portraits for visual quality and excessive similarity.
- Regenerate existing portraits when they are too homogeneous, visually weak, or insufficiently recognizable for the named historical/game character.
- Save final portraits as `sanguobaye-web/public/assets/images/generals/{将领中文名}.png`.
- Add the final prompt records to `doc/美术文档/美术资源生成指南.md` in the same style as the existing generated batches.

## Visual Direction

All portraits should preserve the established game style:

- Three Kingdoms era historical portrait.
- Bust portrait, head and shoulders, centered.
- Dark gold and brown base palette.
- Cinematic lighting.
- Realistic painted strategy-game portrait.
- Plain dark background.
- No text, no logo, no watermark, no modern elements.

The style should be consistent enough to belong to one game, but not so uniform that portraits look like variants of the same person.

## De-Homogenization Rules

Each portrait prompt should include distinguishing traits based on the character's historical role, faction, region, age, and personality.
The prompt set should vary:

- Face shape and age: youthful, elderly, rugged, gaunt, broad, refined, sickly, imposing.
- Hair and facial hair: clean-shaven, thin mustache, short beard, long scholar beard, heavy warrior beard, grey beard.
- Clothing and armor: court robes, scholar robes, Taoist robes, frontier armor, naval armor, heavy infantry armor, cavalry lamellar, southern commander armor, medical robes.
- Regional motifs: Jiangdong naval details, Xiliang frontier fur and leather, Jingzhou scholar-official restraint, Yizhou mountain-road austerity, northern cavalry weathering.
- Pose and expression: calm strategist, loyal veteran, arrogant noble, fierce champion, anxious minor lord, principled official, opportunistic adviser.
- Accent colors: restrained faction or identity accents while keeping the overall dark gold and brown style.

Any generated image that appears to reuse the same face, armor silhouette, beard, expression, or composition too closely with another portrait should be regenerated with a more specific prompt.

## Review Process

The review should happen in batches.

1. Create or update prompt records for a batch of generals grouped by faction or role.
2. Generate images into a temporary review location or the final generals directory.
3. Build a contact-sheet style visual review of the batch together with nearby existing portraits.
4. Check for:
   - Duplicate-looking faces.
   - Repeated armor and collar shapes.
   - Repeated facial hair layouts.
   - Similar expression and head angle across unrelated characters.
   - Poor readability at game UI size.
   - Mismatch between character identity and portrait.
5. Regenerate failed portraits with targeted prompts.
6. Move accepted portraits to `sanguobaye-web/public/assets/images/generals/`.
7. Record final prompts in `doc/美术文档/美术资源生成指南.md`.

Existing portraits are not automatically overwritten. They are reviewed first, then regenerated only when the visual review finds clear problems.

## Asset Batches

The missing and review candidates should be organized into practical batches such as:

- Cao Wei and Cao-affiliated officers.
- Yuan Shao and northern officials.
- Jiangdong/Wu commanders and advisers.
- Liu Bei/Shu, Yizhou, and Hanzhong figures.
- Jingzhou and southern regional figures.
- Xiliang/frontier commanders.
- Famous independents, scholars, physicians, diviners, and minor coalition figures.

Batching is only for control and review; the final deliverable is the full portrait set.

## Documentation

`doc/美术文档/美术资源生成指南.md` should receive new generated sections after the existing batch 13 section.
The format should match the existing entries:

- Batch heading with status.
- Basis file or data source.
- Purpose.
- Size, format, and save-path rule.
- Base style convention.
- One numbered entry per general with save path and prompt.

Because the source `general_names.json` is garbled, the documentation should note that scenario `persons.json` files were used as the authoritative readable name source for this completion pass.

## Verification

Completion requires evidence for:

- All unique scenario general names have matching PNG files.
- No final portrait file is empty or unreadable.
- The art guide contains prompt records for newly generated or regenerated portraits.
- Contact-sheet visual review was performed for generated batches and existing reviewed portraits.
- Any regenerated existing portrait has a clear reason recorded in the work summary.

No production code changes are expected for this task.
