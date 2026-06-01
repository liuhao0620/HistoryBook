export interface Force {
    id: number; // 君主的Person ID
    kingId: number;
    character: number; // 君主性格: 0:和平, 1:大义, 2:奸诈, 3:狂人, 4:冒进
    color: string; // 在地图上的显示颜色
}
