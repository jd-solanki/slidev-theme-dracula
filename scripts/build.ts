import { execSync } from 'child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

import { globbySync } from 'globby';

export const repoRoot = path.join(__dirname, '..')
export const slidesDir = path.join(repoRoot, 'slides')
export const distDir = path.join(repoRoot, 'dist')

const slides = globbySync('*.md', { cwd: slidesDir })

const indexMdContent: string[] = ['# Slidev Theme Dracula']

slides.forEach(slidePath => {
    const slideName = path.basename(slidePath)
    const slideNameWithoutExt = slideName.split('.')[0]
    
    const slideBase = `/slidev-theme-dracula/${slideNameWithoutExt}`
    const slideOutDir = path.join(distDir, slideNameWithoutExt)
    
    execSync(`slidev build slides/${slidePath} --base ${slideBase} --out ${slideOutDir}`)

    indexMdContent.push(`- [${slideNameWithoutExt}](${slideBase})`)
})

// Generate `index.md` in dist dir
fs.writeFile(
    path.join(distDir, 'index.md'),
    indexMdContent.join('\n')
)