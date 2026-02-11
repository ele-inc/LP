#!/usr/bin/env node
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load environment variables
dotenv.config({ path: join(rootDir, '.env') });

// Target image mappings
const IMAGE_TARGETS = {
  'instructor': {
    path: 'assets/images/instructor/profile.jpg',
    selector: '.instructor-image',
    description: '講師の写真',
    htmlPattern: /<div class="absolute inset-4 rounded-2xl bg-white shadow-high-end flex items-center justify-center">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
    htmlReplacement: (imagePath) => `<div class="absolute inset-4 rounded-2xl bg-white shadow-high-end overflow-hidden">
                <img
                  src="./${imagePath}"
                  alt="える プロフィール写真"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>`
  },
  'customer-1': {
    path: 'assets/images/testimonials/customer-01.jpg',
    selector: '.customer-1-image',
    description: 'お客様の声01の写真',
    htmlPattern: /<div\s+class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">\s*<svg[\s\S]*?<\/svg>\s*<\/div>/,
    htmlReplacement: (imagePath) => `<div class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                  <img
                    src="./${imagePath}"
                    alt="お客様01"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>`
  },
  'customer-2': {
    path: 'assets/images/testimonials/customer-02.jpg',
    selector: '.customer-2-image',
    description: 'お客様の声02の写真',
    htmlPattern: /<div\s+class="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">\s*<svg[\s\S]*?<\/svg>\s*<\/div>/,
    htmlReplacement: (imagePath) => `<div class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                  <img
                    src="./${imagePath}"
                    alt="お客様02"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>`
  },
  'customer-3': {
    path: 'assets/images/testimonials/customer-03.jpg',
    selector: '.customer-3-image',
    description: 'お客様の声03の写真',
    htmlPattern: /<div\s+class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">\s*<svg[\s\S]*?<\/svg>\s*<\/div>/,
    htmlReplacement: (imagePath) => `<div class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                  <img
                    src="./${imagePath}"
                    alt="お客様03"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>`
  },
  'feature-1': {
    path: 'assets/images/features/market-research.jpg',
    selector: '.feature-1-image',
    description: 'Market In Research UI画面',
    htmlPattern: /<div\s+class="relative mb-8 aspect-\[4\/3\] rounded-xl bg-slate-50 flex items-center justify-center p-10 overflow-hidden">\s*<svg[\s\S]*?<\/svg>\s*<\/div>/,
    htmlReplacement: (imagePath) => `<div class="relative mb-8 aspect-[4/3] rounded-xl overflow-hidden bg-slate-50">
                <img
                  src="./${imagePath}"
                  alt="Market In Research 機能画面"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>`
  },
  'feature-2': {
    path: 'assets/images/features/data-planning.jpg',
    selector: '.feature-2-image',
    description: 'Data Driven Planning UI画面',
    htmlPattern: /<div\s+class="relative mb-8 aspect-\[4\/3\] rounded-xl bg-slate-50 flex items-center justify-center p-10 overflow-hidden">\s*<svg\s+class="w-full h-full text-slate-300 group-hover:text-emerald-400\/50[\s\S]*?<\/svg>\s*<\/div>/,
    htmlReplacement: (imagePath) => `<div class="relative mb-8 aspect-[4/3] rounded-xl overflow-hidden bg-slate-50">
                <img
                  src="./${imagePath}"
                  alt="Data Driven Planning 機能画面"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>`
  },
  'feature-3': {
    path: 'assets/images/features/bolt-writing.jpg',
    selector: '.feature-3-image',
    description: 'Neuro Bolt Writing UI画面',
    htmlPattern: /<div\s+class="relative mb-8 aspect-\[4\/3\] rounded-xl bg-slate-50 flex items-center justify-center p-10 overflow-hidden">\s*<svg\s+class="w-full h-full text-slate-300 group-hover:text-purple-400\/50[\s\S]*?<\/svg>\s*<\/div>/,
    htmlReplacement: (imagePath) => `<div class="relative mb-8 aspect-[4/3] rounded-xl overflow-hidden bg-slate-50">
                <img
                  src="./${imagePath}"
                  alt="Neuro Bolt Writing 機能画面"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>`
  }
};

/**
 * Generate image using Google Generative AI
 */
async function generateImage(prompt, apiKey) {
  console.log('🎨 画像を生成中...');
  console.log(`プロンプト: "${prompt}"`);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview'
  });

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseModalities: ['image', 'text'],
      },
    });

    const response = result.response;

    // Extract image data from response
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      const imagePart = parts.find(part => part.inlineData);

      if (imagePart && imagePart.inlineData) {
        const imageData = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;

        console.log('✅ 画像生成成功！');
        return {
          data: Buffer.from(imageData, 'base64'),
          mimeType
        };
      }
    }

    throw new Error('画像データが見つかりません。');
  } catch (error) {
    console.error('❌ 画像生成エラー:', error.message);
    throw error;
  }
}

/**
 * Save image to file
 */
function saveImage(imageBuffer, targetPath) {
  const fullPath = join(rootDir, targetPath);
  const dir = dirname(fullPath);

  // Create directory if it doesn't exist
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(fullPath, imageBuffer);
  console.log(`💾 画像を保存しました: ${targetPath}`);

  return fullPath;
}

/**
 * Update HTML with new image
 */
function updateHTML(target, imagePath) {
  const htmlPath = join(rootDir, 'index.html');
  const targetConfig = IMAGE_TARGETS[target];

  if (!targetConfig || !targetConfig.htmlPattern) {
    console.warn(`⚠️  HTML更新パターンが見つかりません: ${target}`);
    return;
  }

  try {
    let html = readFileSync(htmlPath, 'utf-8');

    // Replace the pattern with new image
    const updated = html.replace(
      targetConfig.htmlPattern,
      targetConfig.htmlReplacement(imagePath)
    );

    if (html === updated) {
      console.warn('⚠️  HTML内で該当パターンが見つかりませんでした');
      console.warn('手動でHTMLを更新する必要があるかもしれません');
      return;
    }

    writeFileSync(htmlPath, updated, 'utf-8');
    console.log('📝 index.html を更新しました');
  } catch (error) {
    console.error('❌ HTML更新エラー:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  // Parse command line arguments: node script.js <target> <prompt>
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('使い方: node generate-image.js <target> <prompt>');
    console.error('例: node generate-image.js instructor "30代日本人男性、笑顔、白背景"');
    console.error('\n利用可能なターゲット:', Object.keys(IMAGE_TARGETS).join(', '));
    process.exit(1);
  }

  const target = args[0];
  const prompt = args.slice(1).join(' ');

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY が設定されていません');
    console.error('.env ファイルを作成して API キーを設定してください');
    process.exit(1);
  }

  const targetConfig = IMAGE_TARGETS[target];
  if (!targetConfig) {
    console.error(`❌ 不明なターゲット: ${target}`);
    console.error('利用可能なターゲット:', Object.keys(IMAGE_TARGETS).join(', '));
    process.exit(1);
  }

  console.log(`\n🎯 ターゲット: ${targetConfig.description}`);
  console.log(`📁 保存先: ${targetConfig.path}\n`);

  try {
    // Generate image
    const image = await generateImage(prompt, apiKey);

    // Save image
    saveImage(image.data, targetConfig.path);

    // Update HTML
    updateHTML(target, targetConfig.path);

    console.log('\n✨ 完了しました！');
    console.log(`ブラウザで index.html を開いて確認してください。\n`);
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
