# Resolution Settings and Responsive Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a Settings menu to toggle game resolution between 1920x1080 and 1080x720, and make all screens responsive to the selected resolution without letterboxing.

**Architecture:** We will introduce a `resolution` state in `useGameStore`. A new `SettingsScreen` replaces `MapEditorScreen`. We'll use a `useScale` hook to calculate proportional scaling (`width / 1920`). Screens will update to use `width: 100%, height: 100%` and `flex: 1` to fill the window, and hardcoded pixel values (like coordinates, `TILE_SIZE`, fonts) will be multiplied by the `scale` factor.

**Tech Stack:** React, Zustand, Vitest, Testing Library

---

### Task 1: Add Resolution State and Hook

**Files:**
- Modify: `src/core/state/useGameStore.ts`
- Create: `src/core/hooks/useScale.ts`
- Create: `tests/core/state/resolutionState.test.ts`
- Create: `tests/core/hooks/useScale.test.tsx`

- [ ] **Step 1: Write failing test for state**

```typescript
// tests/core/state/resolutionState.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../../src/core/state/useGameStore';

describe('Resolution State', () => {
    beforeEach(() => {
        useGameStore.setState({ resolution: { width: 1920, height: 1080 } });
    });

    it('has default resolution', () => {
        const state = useGameStore.getState();
        expect(state.resolution).toEqual({ width: 1920, height: 1080 });
    });

    it('can update resolution', () => {
        useGameStore.getState().setResolution({ width: 1080, height: 720 });
        expect(useGameStore.getState().resolution).toEqual({ width: 1080, height: 720 });
    });
});
```

- [ ] **Step 2: Write failing test for useScale hook**

```tsx
// tests/core/hooks/useScale.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useScale } from '../../../src/core/hooks/useScale';
import { useGameStore } from '../../../src/core/state/useGameStore';

const TestComponent = () => {
    const scale = useScale();
    return <div data-testid="scale-value">{scale}</div>;
};

describe('useScale', () => {
    it('returns 1 for 1920 width', () => {
        useGameStore.setState({ resolution: { width: 1920, height: 1080 } });
        render(<TestComponent />);
        expect(screen.getByTestId('scale-value')).toHaveTextContent('1');
    });

    it('returns 0.5625 for 1080 width', () => {
        useGameStore.setState({ resolution: { width: 1080, height: 720 } });
        render(<TestComponent />);
        expect(screen.getByTestId('scale-value')).toHaveTextContent('0.5625');
    });
});
```

- [ ] **Step 3: Run tests to verify failure**
Run: `npx vitest run tests/core/state/resolutionState.test.ts tests/core/hooks/useScale.test.tsx`
Expected: FAIL

- [ ] **Step 4: Implement state and hook**

In `src/core/state/useGameStore.ts`, add to `GameState`:
```typescript
    resolution: { width: number, height: number };
    setResolution: (res: { width: number, height: number }) => void;
```
Add to `useGameStore` initial state:
```typescript
    resolution: { width: 1920, height: 1080 },
    setResolution: (res) => set({ resolution: res }),
```
Update `ScreenType`:
```typescript
export type ScreenType = 'MAIN_MENU' | 'SELECT_SCENARIO' | 'SELECT_FORCE' | 'GAME' | 'SETTINGS' | 'BATTLE';
```

Create `src/core/hooks/useScale.ts`:
```typescript
import { useGameStore } from '../state/useGameStore';

export const useScale = () => {
    const resolution = useGameStore(state => state.resolution);
    return resolution.width / 1920;
};
```

- [ ] **Step 5: Run tests to verify passing**
Run: `npx vitest run tests/core/state/resolutionState.test.ts tests/core/hooks/useScale.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**
```bash
git add src/core/state/useGameStore.ts src/core/hooks/useScale.ts tests/core/state/resolutionState.test.ts tests/core/hooks/useScale.test.tsx
git commit -m "feat: add resolution state and useScale hook"
```

### Task 2: Create SettingsScreen

**Files:**
- Create: `src/view/screens/SettingsScreen.tsx`
- Create: `tests/view/screens/SettingsScreen.test.tsx`

- [ ] **Step 1: Write failing test**
```tsx
// tests/view/screens/SettingsScreen.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SettingsScreen } from '../../../src/view/screens/SettingsScreen';
import { useGameStore } from '../../../src/core/state/useGameStore';

describe('SettingsScreen', () => {
    beforeEach(() => {
        useGameStore.setState({ resolution: { width: 1920, height: 1080 }, currentScreen: 'SETTINGS' });
    });

    it('renders resolution options and handles selection', () => {
        render(<SettingsScreen />);
        expect(screen.getByText('游戏设置')).toBeInTheDocument();
        
        const option1080 = screen.getByText('1080 x 720');
        fireEvent.click(option1080);
        
        expect(useGameStore.getState().resolution).toEqual({ width: 1080, height: 720 });
    });
    
    it('handles back button', () => {
        render(<SettingsScreen />);
        const backBtn = screen.getByText('返回');
        fireEvent.click(backBtn);
        expect(useGameStore.getState().currentScreen).toBe('MAIN_MENU');
    });
});
```

- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run tests/view/screens/SettingsScreen.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement SettingsScreen**
```tsx
// src/view/screens/SettingsScreen.tsx
import React from 'react';
import { useGameStore } from '../../core/state/useGameStore';
import { useScale } from '../../core/hooks/useScale';

export const SettingsScreen: React.FC = () => {
    const { setScreen, resolution, setResolution } = useGameStore();
    const scale = useScale();

    const handleSelect = (width: number, height: number) => {
        setResolution({ width, height });
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#20150d', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '100%', height: '100%', 
                backgroundColor: '#000', 
                backgroundImage: 'url(/assets/images/bg_main_menu.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#d6a85b', fontFamily: '"STKaiti", "KaiTi", serif', position: 'relative'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}></div>

                <button 
                    onClick={() => setScreen('MAIN_MENU')}
                    style={{ 
                        position: 'absolute', top: `${40 * scale}px`, right: `${40 * scale}px`,
                        padding: `${16 * scale}px ${32 * scale}px`, backgroundColor: 'rgba(26, 17, 12, 0.8)', color: '#d6a85b', 
                        border: `${4 * scale}px solid #d6a85b`, cursor: 'pointer', fontSize: `${32 * scale}px`, fontFamily: '"STKaiti", "KaiTi", serif',
                        zIndex: 1
                    }}>
                    返回
                </button>

                <div style={{
                    fontSize: `${96 * scale}px`, fontWeight: 'bold', letterSpacing: `${30 * scale}px`,
                    color: '#d6a85b', textShadow: `${4 * scale}px ${4 * scale}px ${8 * scale}px #000`,
                    marginBottom: `${80 * scale}px`,
                    zIndex: 1
                }}>
                    游戏设置
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: `${40 * scale}px`, width: `${800 * scale}px`, zIndex: 1 }}>
                    <button 
                        onClick={() => handleSelect(1920, 1080)}
                        style={{
                            padding: `${30 * scale}px 0`, width: '100%', backgroundColor: resolution.width === 1920 ? 'rgba(214, 168, 91, 0.3)' : 'rgba(26, 17, 12, 0.8)',
                            color: '#d6a85b', border: `${4 * scale}px solid #d6a85b`, fontSize: `${48 * scale}px`, fontWeight: 'bold',
                            cursor: 'pointer', fontFamily: '"STKaiti", "KaiTi", serif', letterSpacing: `${8 * scale}px`,
                            boxShadow: `${6 * scale}px ${6 * scale}px 0px rgba(0,0,0,0.5)`, transition: 'all 0.2s', textAlign: 'center'
                        }}
                    >
                        1920 x 1080
                    </button>
                    <button 
                        onClick={() => handleSelect(1080, 720)}
                        style={{
                            padding: `${30 * scale}px 0`, width: '100%', backgroundColor: resolution.width === 1080 ? 'rgba(214, 168, 91, 0.3)' : 'rgba(26, 17, 12, 0.8)',
                            color: '#d6a85b', border: `${4 * scale}px solid #d6a85b`, fontSize: `${48 * scale}px`, fontWeight: 'bold',
                            cursor: 'pointer', fontFamily: '"STKaiti", "KaiTi", serif', letterSpacing: `${8 * scale}px`,
                            boxShadow: `${6 * scale}px ${6 * scale}px 0px rgba(0,0,0,0.5)`, transition: 'all 0.2s', textAlign: 'center'
                        }}
                    >
                        1080 x 720
                    </button>
                </div>
            </div>
        </div>
    );
};
```

- [ ] **Step 4: Run test to verify passing**
Run: `npx vitest run tests/view/screens/SettingsScreen.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/view/screens/SettingsScreen.tsx tests/view/screens/SettingsScreen.test.tsx
git commit -m "feat: add SettingsScreen"
```

### Task 3: Update App.tsx & MainMenu.tsx

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/view/screens/MainMenu.tsx`

- [ ] **Step 1: Implement App.tsx & MainMenu changes**

In `src/App.tsx`, remove `MapEditorScreen` and add `SettingsScreen`:
```tsx
// Add import
import { SettingsScreen } from './view/screens/SettingsScreen';
// Add to switch:
    case 'SETTINGS':
      return <SettingsScreen />;
// Update the root wrapper div
function App() {
  const { currentScreen, setAvailableScenarios, resolution } = useGameStore();
  // ...
  return (
    <div style={{ width: `${resolution.width}px`, height: `${resolution.height}px`, overflow: 'hidden' }}>
      {/* existing switch statement rendering screens */}
    </div>
  );
}
```

In `src/view/screens/MainMenu.tsx`:
```tsx
import { useScale } from '../../core/hooks/useScale';

export const MainMenu: React.FC = () => {
    // ...
    const scale = useScale();

    // Replace the outer div dimensions:
    // <div style={{ width: '1920px', height: '1080px', ...
    // With:
    // <div style={{ width: '100%', height: '100%', ...

    // Update the Map Editor button:
    // onClick={() => setScreen('SETTINGS')}
    // 游戏设置

    // Update all hardcoded px values by multiplying with scale, e.g.:
    // fontSize: `${120 * scale}px`, letterSpacing: `${30 * scale}px`, etc.
    // padding: `${40 * scale}px ${80 * scale}px`
    // menuBtnStyle width/height/padding/fontSize updated to use scale. Since it's outside the component, move it inside or pass scale.
```
*Note: Due to space, implementer should systematically multiply all px values in `MainMenu.tsx` by `scale`.*

- [ ] **Step 2: Run related tests**
Run: `npx vitest run` (ensure nothing breaks)

- [ ] **Step 3: Commit**
```bash
git add src/App.tsx src/view/screens/MainMenu.tsx
git commit -m "feat: integrate SettingsScreen and make MainMenu responsive"
```

### Task 4: Responsive SelectScenario & SelectForce

**Files:**
- Modify: `src/view/screens/SelectScenario.tsx`
- Modify: `src/view/screens/SelectForce.tsx`

- [ ] **Step 1: Implement scaling in SelectScenario**
In `src/view/screens/SelectScenario.tsx`, import `useScale` and apply it:
- Change outer container to `width: '100%', height: '100%'`.
- Multiply all `px` values by `scale`.

- [ ] **Step 2: Implement scaling in SelectForce**
In `src/view/screens/SelectForce.tsx`, import `useScale` and apply it:
- Change outer container to `width: '100%', height: '100%'`.
- Multiply all `px` values by `scale` (including map coordinates `left: ${(x * 120 + 135) * scale}px`).

- [ ] **Step 3: Commit**
```bash
git add src/view/screens/SelectScenario.tsx src/view/screens/SelectForce.tsx
git commit -m "feat: make SelectScenario and SelectForce responsive"
```

### Task 5: Responsive GameScreen

**Files:**
- Modify: `src/view/screens/GameScreen.tsx`

- [ ] **Step 1: Implement scaling in GameScreen**
In `src/view/screens/GameScreen.tsx`:
- Import `useScale`.
- Outer div: `width: '100%', height: '100%'`.
- Map container: `flex: 1`.
- Sidebar: `width: ${300 * scale}px`.
- Map elements (cities, lines): multiply coordinates `(x * 120 + 135)` and `(y * 120 + 105)` by `scale`.
- Modal sizes, font sizes, padding: multiply by `scale`.

- [ ] **Step 2: Commit**
```bash
git add src/view/screens/GameScreen.tsx
git commit -m "feat: make GameScreen responsive"
```

### Task 6: Responsive BattleScreen

**Files:**
- Modify: `src/view/screens/BattleScreen.tsx`

- [ ] **Step 1: Implement scaling in BattleScreen**
In `src/view/screens/BattleScreen.tsx`:
- Import `useScale`.
- Change `TILE_SIZE` constant to dynamically calculate: `const TILE_SIZE = 80 * scale;` (move inside component).
- `SCENE_WIDTH` and `SCENE_HEIGHT` use `resolution.width` and `resolution.height`.
- Change outer container to `width: '100%', height: '100%'`.
- Map viewport wrapper uses `flex: 1`.
- Apply `scale` to fonts, padding, UI sizes.

- [ ] **Step 2: Commit**
```bash
git add src/view/screens/BattleScreen.tsx
git commit -m "feat: make BattleScreen responsive"
```

---

Plan complete. I will save this plan.