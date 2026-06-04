Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot '..\public\assets\images\battle\ancient'
$woodDir = Join-Path $root 'wood_autotile'
$hillDir = Join-Path $root 'hill_autotile'
$waterDir = Join-Path $root 'water_edges'
New-Item -ItemType Directory -Force -Path $root, $woodDir, $hillDir, $waterDir | Out-Null

function New-Bitmap($width, $height) {
    $bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::Transparent)
    return @($bitmap, $graphics)
}

function Save-Bitmap($bitmap, $graphics, $path) {
    $graphics.Dispose()
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
}

function SolidBrush($a, $r, $g, $b) {
    return New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($a, $r, $g, $b))
}

function Pen($a, $r, $g, $b, $width) {
    return New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($a, $r, $g, $b), $width)
}

function Draw-ParchmentBase($path) {
    $pair = New-Bitmap 512 512
    $bitmap = $pair[0]
    $g = $pair[1]
    $bg = SolidBrush 255 155 125 65
    $g.FillRectangle($bg, 0, 0, 512, 512)
    $bg.Dispose()

    for ($i = 0; $i -lt 900; $i++) {
        $x = (37 * $i + 53) % 512
        $y = (91 * $i + 17) % 512
        $size = 1 + (($i * 13) % 5)
        $alpha = 16 + (($i * 7) % 34)
        $brush = SolidBrush $alpha 92 66 31
        $g.FillEllipse($brush, $x, $y, $size, $size)
        $brush.Dispose()
    }

    for ($i = 0; $i -lt 40; $i++) {
        $pen = Pen 26 80 55 24 (1 + (($i * 3) % 3))
        $x = (29 * $i + 11) % 512
        $y = (61 * $i + 19) % 512
        $g.DrawArc($pen, $x - 80, $y - 35, 180, 80, 10, 130)
        $pen.Dispose()
    }

    Save-Bitmap $bitmap $g $path
}

function Draw-WaterBase($path) {
    $pair = New-Bitmap 256 256
    $bitmap = $pair[0]
    $g = $pair[1]
    $bg = SolidBrush 255 55 75 67
    $g.FillRectangle($bg, 0, 0, 256, 256)
    $bg.Dispose()

    for ($i = 0; $i -lt 45; $i++) {
        $pen = Pen 75 204 180 122 2
        $x = (($i * 47) % 260) - 24
        $y = 8 + (($i * 31) % 240)
        $g.DrawArc($pen, $x, $y, 54, 16, 190, 145)
        $pen.Dispose()
    }

    Save-Bitmap $bitmap $g $path
}

function Draw-WaterEdge($path, $mask) {
    $pair = New-Bitmap 80 80
    $bitmap = $pair[0]
    $g = $pair[1]
    $sand = SolidBrush 165 178 139 73
    $foam = Pen 145 222 204 151 2
    $dark = Pen 130 83 61 30 3

    if (($mask -band 1) -ne 0) {
        $g.FillRectangle($sand, 0, 0, 80, 9)
        $g.DrawLine($foam, 4, 10, 76, 8)
        $g.DrawLine($dark, 0, 0, 80, 0)
    }
    if (($mask -band 2) -ne 0) {
        $g.FillRectangle($sand, 71, 0, 9, 80)
        $g.DrawLine($foam, 71, 5, 72, 75)
        $g.DrawLine($dark, 79, 0, 79, 80)
    }
    if (($mask -band 4) -ne 0) {
        $g.FillRectangle($sand, 0, 71, 80, 9)
        $g.DrawLine($foam, 5, 71, 75, 72)
        $g.DrawLine($dark, 0, 79, 80, 79)
    }
    if (($mask -band 8) -ne 0) {
        $g.FillRectangle($sand, 0, 0, 9, 80)
        $g.DrawLine($foam, 10, 4, 8, 76)
        $g.DrawLine($dark, 0, 0, 0, 80)
    }

    $sand.Dispose()
    $foam.Dispose()
    $dark.Dispose()
    Save-Bitmap $bitmap $g $path
}

function Draw-Forest($path, $mask) {
    $pair = New-Bitmap 256 256
    $bitmap = $pair[0]
    $g = $pair[1]
    $trunk = SolidBrush 230 85 55 25
    $leafDark = SolidBrush 235 55 75 38
    $leaf = SolidBrush 235 91 103 50
    $leafLight = SolidBrush 220 132 121 63
    $shadow = SolidBrush 55 33 22 8

    $clusters = @(
        @(70, 92, 62),
        @(134, 82, 70),
        @(190, 104, 62),
        @(116, 156, 72)
    )

    foreach ($cluster in $clusters) {
        $cx = $cluster[0]
        $cy = $cluster[1]
        $r = $cluster[2]
        $g.FillEllipse($shadow, $cx - $r / 2, $cy - $r / 3 + 22, $r, $r / 2)
        $g.FillRectangle($trunk, $cx - 5, $cy + 22, 10, 54)
        $g.FillEllipse($leafDark, $cx - $r / 2, $cy - $r / 2, $r, $r)
        $g.FillEllipse($leaf, $cx - $r / 3, $cy - $r / 2 - 8, $r * 0.72, $r * 0.72)
        $g.FillEllipse($leafLight, $cx - $r / 4, $cy - $r / 3, $r * 0.38, $r * 0.32)
    }

    $trunk.Dispose()
    $leafDark.Dispose()
    $leaf.Dispose()
    $leafLight.Dispose()
    $shadow.Dispose()
    Save-Bitmap $bitmap $g $path
}

function Draw-Hill($path, $mask) {
    $pair = New-Bitmap 380 380
    $bitmap = $pair[0]
    $g = $pair[1]
    $fill = SolidBrush 235 123 99 55
    $ridge = Pen 235 62 43 22 5
    $light = Pen 215 211 174 101 4
    $shadow = SolidBrush 55 33 22 8

    $points = @(
        (New-Object System.Drawing.Point 48,288),
        (New-Object System.Drawing.Point 132,118),
        (New-Object System.Drawing.Point 198,270),
        (New-Object System.Drawing.Point 252,92),
        (New-Object System.Drawing.Point 334,288)
    )
    $g.FillEllipse($shadow, 48, 280, 286, 48)
    $g.FillPolygon($fill, $points)
    $g.DrawLines($ridge, $points)
    $g.DrawLine($light, 132, 118, 160, 230)
    $g.DrawLine($light, 252, 92, 224, 230)
    $g.DrawLine($ridge, 198, 270, 234, 188)

    $fill.Dispose()
    $ridge.Dispose()
    $light.Dispose()
    $shadow.Dispose()
    Save-Bitmap $bitmap $g $path
}

function Draw-PropTile($path, $kind) {
    $pair = New-Bitmap 256 256
    $bitmap = $pair[0]
    $g = $pair[1]
    $ink = Pen 230 54 38 18 5
    $fill = SolidBrush 220 134 97 45
    $light = SolidBrush 210 213 171 91
    $green = SolidBrush 220 87 94 43

    if ($kind -eq 'grass') {
        for ($i = 0; $i -lt 9; $i++) {
            $x = 42 + (($i * 29) % 150)
            $y = 142 + (($i * 41) % 46)
            $g.DrawLine($ink, $x, $y, $x + 7, $y - 34)
            $g.DrawLine($ink, $x, $y, $x - 16, $y - 24)
            $g.DrawLine($ink, $x, $y, $x + 20, $y - 18)
        }
    } elseif ($kind -eq 'city') {
        $g.FillRectangle($fill, 64, 88, 128, 102)
        $g.FillRectangle($light, 86, 110, 82, 54)
        $g.DrawRectangle($ink, 64, 88, 128, 102)
        $g.DrawRectangle($ink, 90, 54, 76, 54)
        $g.DrawLine($ink, 64, 88, 128, 42)
        $g.DrawLine($ink, 192, 88, 128, 42)
    } elseif ($kind -eq 'village') {
        $g.FillRectangle($fill, 58, 128, 58, 48)
        $g.FillRectangle($fill, 138, 116, 62, 60)
        $g.DrawLine($ink, 48, 128, 88, 92)
        $g.DrawLine($ink, 88, 92, 126, 128)
        $g.DrawLine($ink, 130, 116, 170, 80)
        $g.DrawLine($ink, 170, 80, 210, 116)
        $g.DrawRectangle($ink, 58, 128, 58, 48)
        $g.DrawRectangle($ink, 138, 116, 62, 60)
    } else {
        $g.FillRectangle($fill, 72, 104, 112, 88)
        $g.DrawLine($ink, 72, 104, 128, 58)
        $g.DrawLine($ink, 184, 104, 128, 58)
        $g.DrawRectangle($ink, 72, 104, 112, 88)
    }

    $ink.Dispose()
    $fill.Dispose()
    $light.Dispose()
    $green.Dispose()
    Save-Bitmap $bitmap $g $path
}

function Draw-Frame($path) {
    $pair = New-Bitmap 1180 720
    $bitmap = $pair[0]
    $g = $pair[1]
    $outer = Pen 245 169 103 36 8
    $inner = Pen 210 63 38 14 3
    $orn = Pen 230 201 137 54 4
    $g.DrawRectangle($outer, 5, 5, 1170, 710)
    $g.DrawRectangle($inner, 16, 16, 1148, 688)
    foreach ($sx in @(1, -1)) {
        foreach ($sy in @(1, -1)) {
            $cx = if ($sx -eq 1) { 30 } else { 1150 }
            $cy = if ($sy -eq 1) { 30 } else { 690 }
            $g.DrawArc($orn, $cx - 20, $cy - 20, 40, 40, 0, 270)
            $g.DrawLine($orn, $cx, $cy, $cx + ($sx * 52), $cy)
            $g.DrawLine($orn, $cx, $cy, $cx, $cy + ($sy * 52))
        }
    }
    $outer.Dispose()
    $inner.Dispose()
    $orn.Dispose()
    Save-Bitmap $bitmap $g $path
}

function Draw-Panel($path) {
    $pair = New-Bitmap 720 82
    $bitmap = $pair[0]
    $g = $pair[1]
    $fill = SolidBrush 210 44 24 9
    $edge = Pen 235 172 113 38 5
    $inner = Pen 190 85 51 17 2
    $g.FillRectangle($fill, 12, 8, 696, 66)
    $g.DrawRectangle($edge, 4, 4, 712, 74)
    $g.DrawRectangle($inner, 14, 13, 692, 56)
    $fill.Dispose()
    $edge.Dispose()
    $inner.Dispose()
    Save-Bitmap $bitmap $g $path
}

function Draw-Compass($path) {
    $pair = New-Bitmap 64 96
    $bitmap = $pair[0]
    $g = $pair[1]
    $gold = SolidBrush 235 218 161 72
    $dark = Pen 230 84 52 18 3
    $font = New-Object System.Drawing.Font('SimSun', 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString('N', $font, $gold, 20, 2)
    $points = @(
        (New-Object System.Drawing.Point 32,28),
        (New-Object System.Drawing.Point 52,56),
        (New-Object System.Drawing.Point 40,56),
        (New-Object System.Drawing.Point 40,86),
        (New-Object System.Drawing.Point 24,86),
        (New-Object System.Drawing.Point 24,56),
        (New-Object System.Drawing.Point 12,56)
    )
    $g.FillPolygon($gold, $points)
    $g.DrawPolygon($dark, $points)
    $gold.Dispose()
    $dark.Dispose()
    $font.Dispose()
    Save-Bitmap $bitmap $g $path
}

Draw-ParchmentBase (Join-Path $root 'tile_base_parchment.png')
Draw-WaterBase (Join-Path $root 'tile_base_water.png')
Draw-Frame (Join-Path $root 'ui_frame.png')
Draw-Panel (Join-Path $root 'ui_panel.png')
Draw-Compass (Join-Path $root 'compass_north.png')
Draw-PropTile (Join-Path $root 'tile_lea.png') 'grass'
Draw-PropTile (Join-Path $root 'tile_city.png') 'city'
Draw-PropTile (Join-Path $root 'tile_thorp.png') 'village'
Draw-PropTile (Join-Path $root 'tile_tent.png') 'camp'

for ($mask = 0; $mask -le 15; $mask++) {
    $suffix = $mask.ToString('00')
    Draw-WaterEdge (Join-Path $waterDir "water_edge_$suffix.png") $mask
    Draw-Forest (Join-Path $woodDir "wood_mask_$suffix.png") $mask
    Draw-Hill (Join-Path $hillDir "hill_mask_$suffix.png") $mask
}

Draw-Forest (Join-Path $woodDir 'wood_center_01.png') 0
Draw-Hill (Join-Path $hillDir 'hill_center_01.png') 0
