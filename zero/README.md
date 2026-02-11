# ZERO ランディングページ

完全AI駆動型YouTube運用プログラム「ZERO」のLPです。

**本番プレビュー**: https://ele-inc.github.io/LP/lps/zero/

> mainブランチにpushすると自動でGitHub Pagesに反映されます

---

## ファイル構成

```
lps/zero/
├── README.md              # このファイル（編集ガイド）
├── index.html             # LPのHTMLファイル
├── package.json           # Node.js依存関係
├── .env                   # 環境変数（Git管理外）
├── .env.example           # 環境変数のサンプル
├── scripts/
│   ├── generate-image.js  # 画像生成メインスクリプト
│   └── update-html.js     # HTML自動更新
└── assets/
    └── images/            # 生成された画像
        ├── instructor/    # 講師写真
        ├── testimonials/  # お客様の声
        └── features/      # 機能UI画面
```

---

## プレビュー方法

### 方法1: GitHub Pages（本番確認）

https://ele-inc.github.io/LP/lps/zero/

- `main` ブランチにpushすると自動反映
- 反映まで1-2分かかる場合あり

### 方法2: VSCode Live Server（ローカル開発）

1. VSCodeで `index.html` を開く
2. 右クリック → 「Open with Live Server」
3. ブラウザが開き、リアルタイムで変更が反映されます

※ Live Server拡張機能が必要です

### 方法3: ブラウザで直接開く

```bash
open lps/zero/index.html
```

または Finder で `index.html` をダブルクリック

### 方法4: ローカルサーバー

```bash
cd lps/zero
python3 -m http.server 8000
```

→ http://localhost:8000 でアクセス

---

## 🎨 AI画像生成システム

Vertex AI Gemini を使って、自然言語で画像を生成・配置できます。

### セットアップ

1. **依存関係のインストール**
```bash
cd lps/zero
npm install
```

2. **環境変数の設定**
```bash
cp .env.example .env
```

`.env` を編集:
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

3. **Google Cloud 認証**
```bash
gcloud auth application-default login
```

### 使い方

#### 基本コマンド
```bash
npm run gen "<プロンプト>" -- --target <ターゲット>
```

#### 利用可能なターゲット

| ターゲット | 説明 | 保存先 |
|-----------|------|--------|
| `instructor` | 講師の写真 | `assets/images/instructor/profile.jpg` |
| `customer-1` | お客様01 | `assets/images/testimonials/customer-01.jpg` |
| `customer-2` | お客様02 | `assets/images/testimonials/customer-02.jpg` |
| `customer-3` | お客様03 | `assets/images/testimonials/customer-03.jpg` |
| `feature-1` | Market In Research | `assets/images/features/market-research.jpg` |
| `feature-2` | Data Driven Planning | `assets/images/features/data-planning.jpg` |
| `feature-3` | Neuro Bolt Writing | `assets/images/features/bolt-writing.jpg` |

#### 実行例

**講師の写真を生成**
```bash
npm run gen "30代日本人男性、ビジネスカジュアル、笑顔、白背景" -- --target instructor
```

**お客様の写真を生成**
```bash
npm run gen "40代日本人女性、スーツ、笑顔、白背景" -- --target customer-1
```

**UI画面を生成**
```bash
npm run gen "モダンなダッシュボード、青基調、グラフ表示" -- --target feature-1
```

### 音声入力での使い方

音声入力でも使えます:
```bash
# 音声で「講師の写真を30代男性で生成して」と言う
npm run gen "30代男性、ビジネスカジュアル、プロフェッショナル" -- --target instructor
```

生成 → 保存 → HTML更新が自動で実行されます。

---

## テキスト編集ガイド

### 構成（セクション順）

| セクション       | 行番号目安 | 内容                             |
| ---------------- | ---------- | -------------------------------- |
| ナビゲーション   | 162-180    | ヘッダーメニュー                 |
| ヒーロー         | 181-273    | メインビジュアル・キャッチコピー |
| 受講生の声       | 276-358    | Testimonials（3名分）            |
| 講師紹介         | 361-412    | えるの経歴                       |
| 講座内容         | 415-473    | オフ会・ライブ・コミュニティ     |
| 課題セクション   | 476-517    | 悩みの提示（ダーク背景）         |
| 機能紹介         | 518-590    | 3つのコア機能                    |
| データ説明       | 591-656    | Before/After比較                 |
| 4つのモード      | 659-703    | Plan/Full/Short/Bonus            |
| サポート内容     | 706-778    | 8つのサポート項目                |
| 申し込みフォーム | 779-819    | CTA・フォーム                    |
| フッター         | 820-881    | 会社情報・リンク                 |

### よく編集する箇所

#### キャッチコピー（ヒーロー）

```html
<!-- 190-194行目付近 -->
<h1 class="...">
  もう、台本で悩まない。<br />
  AIが"売れる台本"を<br />
  <span class="gradient-text">即座に生成する時代へ</span>
</h1>
```

#### サブコピー

```html
<!-- 195-199行目付近 -->
<p class="...">
  10万件の添削データを学習したAIが、<br />
  あなた専用の「伸びて、売れる」台本を即座に生成。<br />
  台本作成の時間を1/3に。あなたは撮影に集中できます。
</p>
```

#### CTAボタン

```html
<!-- 201-207行目付近 -->
<button class="btn-primary">
  無料で審査に申し込む
  <span class="ml-2 text-[14px]">→</span>
</button>
```

#### 受講生の声

```html
<!-- 303-312行目付近（1人目の例） -->
<p class="font-bold text-navy text-lg">T.K さん</p>
<p class="text-[12px] text-slate-400">ビジネス系YouTuber｜登録者 5.2万人</p>
...
<p class="text-slate-600">「正直、最初は半信半疑でした...」</p>
...
<p class="text-navy font-bold">
  月間収益 <span class="text-primary">120%</span> UP
</p>
```

---

## スタイル（色・フォント）

### メインカラー

`index.html` 内の Tailwind設定（11-36行目）で定義:

```javascript
colors: {
    "primary": "#0066FF",    // メインブルー
    "navy": "#020617",       // 濃紺（テキスト）
    "slate-custom": "#64748b", // グレー（サブテキスト）
    "surface": "#ffffff",    // 白背景
}
```

### よく使うクラス

| クラス             | 用途                       |
| ------------------ | -------------------------- |
| `btn-primary`      | 主要ボタン（紺→青ホバー）  |
| `btn-secondary`    | セカンダリボタン（白背景） |
| `gradient-text`    | グラデーションテキスト     |
| `section-spacing`  | セクション間余白           |
| `card-interactive` | ホバーで浮き上がるカード   |

---

## 編集時の注意点

1. **インデント**: スペース4つで統一
2. **クラス順序**: Tailwindのクラスは長くなりがち。改行しない
3. **レスポンシブ**: `sm:` `lg:` プレフィックスでブレイクポイント対応済み
4. **アイコン**: Google Material Symbols を使用

---

## 困ったときは

AIに聞いてください:

```
「ヒーローのキャッチコピーを○○に変えて」
「受講生の声を4人に増やして」
「メインカラーを緑に変えて」
「フォームの項目を追加して」
```

---

## Git操作

```bash
# 変更を確認
git diff lps/zero/

# コミット
git add lps/zero/
git commit -m "Update ZERO LP: 〇〇を変更"

# プッシュ
git push origin main
```
