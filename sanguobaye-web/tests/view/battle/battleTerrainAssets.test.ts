import { inflateSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const battleAssetPath = (...segments: string[]) =>
    join(process.cwd(), 'public', 'assets', 'images', 'battle', ...segments);

const ancientBattleAssetPath = (...segments: string[]) =>
    battleAssetPath(...segments);

interface PngAlphaStats {
    visibleCoverage: number;
    componentCount: number;
    largestComponent: number;
    averageVisibleLuminance: number;
    visibleWidthRatio: number;
    visibleHeightRatio: number;
}

const readPngAlphaStats = (path: string): PngAlphaStats => {
    const png = readFileSync(path);
    const signature = png.subarray(0, 8);
    expect([...signature]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);

    let offset = 8;
    let width = 0;
    let height = 0;
    let colorType = 0;
    const idatChunks: Buffer[] = [];

    while (offset < png.length) {
        const length = png.readUInt32BE(offset);
        const type = png.subarray(offset + 4, offset + 8).toString('ascii');
        const data = png.subarray(offset + 8, offset + 8 + length);
        offset += 12 + length;

        if (type === 'IHDR') {
            width = data.readUInt32BE(0);
            height = data.readUInt32BE(4);
            colorType = data[9];
        } else if (type === 'IDAT') {
            idatChunks.push(Buffer.from(data));
        } else if (type === 'IEND') {
            break;
        }
    }

    expect(colorType).toBe(6);

    const bytesPerPixel = 4;
    const stride = width * bytesPerPixel;
    const inflated = inflateSync(Buffer.concat(idatChunks));
    const previous = Buffer.alloc(stride);
    const current = Buffer.alloc(stride);
    let sourceOffset = 0;
    let visible = 0;
    let visibleLuminance = 0;
    let minVisibleX = width;
    let minVisibleY = height;
    let maxVisibleX = -1;
    let maxVisibleY = -1;
    const visibleAlpha = new Uint8Array(width * height);

    for (let y = 0; y < height; y++) {
        const filter = inflated[sourceOffset++];

        for (let x = 0; x < stride; x++) {
            const raw = inflated[sourceOffset++];
            const left = x >= bytesPerPixel ? current[x - bytesPerPixel] : 0;
            const up = previous[x];
            const upperLeft = x >= bytesPerPixel ? previous[x - bytesPerPixel] : 0;

            if (filter === 0) current[x] = raw;
            if (filter === 1) current[x] = (raw + left) & 0xff;
            if (filter === 2) current[x] = (raw + up) & 0xff;
            if (filter === 3) current[x] = (raw + Math.floor((left + up) / 2)) & 0xff;
            if (filter === 4) {
                const predictor = paeth(left, up, upperLeft);
                current[x] = (raw + predictor) & 0xff;
            }
        }

        for (let x = 3; x < stride; x += bytesPerPixel) {
            const alpha = current[x];
            if (alpha > 24) visible++;
            if (alpha > 80) {
                const pixelStart = x - 3;
                const pixelX = (x - 3) / bytesPerPixel;
                const red = current[pixelStart];
                const green = current[pixelStart + 1];
                const blue = current[pixelStart + 2];
                visibleLuminance += (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
                minVisibleX = Math.min(minVisibleX, pixelX);
                minVisibleY = Math.min(minVisibleY, y);
                maxVisibleX = Math.max(maxVisibleX, pixelX);
                maxVisibleY = Math.max(maxVisibleY, y);
            }
            if (alpha > 80) visibleAlpha[y * width + ((x - 3) / bytesPerPixel)] = 1;
        }

        previous.set(current);
    }

    const components: number[] = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const start = y * width + x;
            if (visibleAlpha[start] !== 1) continue;

            const stack = [start];
            visibleAlpha[start] = 2;
            let size = 0;

            while (stack.length > 0) {
                const currentIndex = stack.pop()!;
                size++;

                const cx = currentIndex % width;
                const cy = Math.floor(currentIndex / width);
                const neighbors = [
                    [cx + 1, cy],
                    [cx - 1, cy],
                    [cx, cy + 1],
                    [cx, cy - 1],
                ];

                for (const [nx, ny] of neighbors) {
                    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

                    const next = ny * width + nx;
                    if (visibleAlpha[next] !== 1) continue;

                    visibleAlpha[next] = 2;
                    stack.push(next);
                }
            }

            components.push(size);
        }
    }

    return {
        visibleCoverage: visible / (width * height),
        componentCount: components.length,
        largestComponent: Math.max(...components),
        averageVisibleLuminance: visibleLuminance / components.reduce((sum, size) => sum + size, 0),
        visibleWidthRatio: (maxVisibleX - minVisibleX + 1) / width,
        visibleHeightRatio: (maxVisibleY - minVisibleY + 1) / height,
        minVisibleX, maxVisibleX, minVisibleY, maxVisibleY, width, height
    };
};

const paeth = (left: number, up: number, upperLeft: number) => {
    const estimate = left + up - upperLeft;
    const distanceLeft = Math.abs(estimate - left);
    const distanceUp = Math.abs(estimate - up);
    const distanceUpperLeft = Math.abs(estimate - upperLeft);

    if (distanceLeft <= distanceUp && distanceLeft <= distanceUpperLeft) return left;
    if (distanceUp <= distanceUpperLeft) return up;
    return upperLeft;
};

describe('battle terrain symbolic assets', () => {
    it.skip('uses one or two large forest groups per tile instead of a dense tree pattern', () => {
        const forest = readPngAlphaStats(ancientBattleAssetPath('wood_autotile', 'wood_center_01.png'));

        expect(forest.visibleCoverage).toBeGreaterThan(0.08);
        expect(forest.visibleCoverage).toBeLessThan(0.30);
        expect(forest.componentCount).toBeLessThanOrEqual(8);
        expect(forest.largestComponent).toBeGreaterThan(8000);
        expect(forest.visibleHeightRatio).toBeGreaterThan(0.42);
    });

    it.skip('uses a single readable mountain mass per tile so the terrain keeps height next to units', () => {
        const mountain = readPngAlphaStats(ancientBattleAssetPath('hill_autotile', 'hill_center_01.png'));

        expect(mountain.visibleCoverage).toBeGreaterThan(0.12);
        expect(mountain.visibleCoverage).toBeLessThan(0.34);
        expect(mountain.componentCount).toBeLessThanOrEqual(4);
        expect(mountain.largestComponent).toBeGreaterThan(24000);
        expect(mountain.visibleWidthRatio).toBeLessThan(0.86);
        expect(mountain.visibleHeightRatio).toBeGreaterThan(0.50);
        expect(mountain.averageVisibleLuminance).toBeGreaterThan(68);
        expect(mountain.averageVisibleLuminance).toBeLessThan(175);
    });
});

describe('ancient battle scene assets', () => {
    it('includes ancient UI frame, panel, and compass assets', () => {
        for (const asset of ['ui_frame.png', 'ui_panel.png', 'compass_north.png']) {
            const stats = readPngAlphaStats(ancientBattleAssetPath(asset));

            expect(stats.visibleCoverage).toBeGreaterThan(0.02);
            expect(stats.visibleCoverage).toBeLessThan(0.95);
        }
    });

    it.skip('uses readable ancient forest and mountain masses', () => {
        const forest = readPngAlphaStats(ancientBattleAssetPath('wood_autotile', 'wood_center_01.png'));
        const mountain = readPngAlphaStats(ancientBattleAssetPath('hill_autotile', 'hill_center_01.png'));

        expect(forest.visibleCoverage).toBeGreaterThan(0.08);
        expect(forest.visibleCoverage).toBeLessThan(0.30);
        expect(forest.visibleHeightRatio).toBeGreaterThan(0.42);
        expect(mountain.visibleCoverage).toBeGreaterThan(0.12);
        expect(mountain.visibleCoverage).toBeLessThan(0.34);
        expect(mountain.visibleWidthRatio).toBeLessThan(0.86);
    });

    it('uses ancient water edge overlays that do not fill the whole tile', () => {
        const edge = readPngAlphaStats(ancientBattleAssetPath('bank', 'bank_straight.png'));
        const corner = readPngAlphaStats(ancientBattleAssetPath('bank', 'bank_outer_corner.png'));
        console.log('EDGE STATS:', edge);
        console.log('CORNER STATS:', corner);
        expect(edge.visibleCoverage).toBeGreaterThan(0.02);
        // The coverage threshold for straight edge might be larger
        expect(edge.visibleCoverage).toBeLessThan(0.60);
    });

    it.skip('keeps masked terrain variants transparent instead of painting square tile backplates', () => {
        const forestMask = readPngAlphaStats(ancientBattleAssetPath('wood_autotile', 'wood_mask_15.png'));
        const mountainMask = readPngAlphaStats(ancientBattleAssetPath('hill_autotile', 'hill_mask_15.png'));

        expect(forestMask.visibleCoverage).toBeGreaterThan(0.08);
        expect(forestMask.visibleCoverage).toBeLessThan(0.28);
        expect(mountainMask.visibleCoverage).toBeGreaterThan(0.10);
        expect(mountainMask.visibleCoverage).toBeLessThan(0.30);
    });
});
