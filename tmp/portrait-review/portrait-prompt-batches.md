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

## 批次 B：袁绍与北方士族人物

名单：郭图、高干、高览、耿武、关纯、田楷、辛毗、辛评、荀谌、袁尚、袁谭、袁熙、袁遗、张郃、张南、严纲

差异化规则：袁绍阵营要体现河北士族、贵族子弟、北方军将和谋士派系感；避免所有人物都成为同一种华丽金甲贵族。

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
