export interface SkillDef {
    id: number;
    name: string;
    description: string;
}

let skillsCache: SkillDef[] = [];

export const loadSkills = async () => {
    if (skillsCache.length > 0) return skillsCache;
    try {
        const res = await fetch('/config/skills.json');
        if (res.ok) {
            skillsCache = await res.json();
        }
    } catch (e) {
        console.error('Failed to load skills', e);
    }
    return skillsCache;
};

export const getSkill = (id: number) => skillsCache.find(s => s.id === id);
