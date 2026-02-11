# 画像生成スクリプト

## セットアップ

```bash
# 1. 依存関係インストール
npm install

# 2. 環境変数設定
cp .env.example .env
# .env を編集してプロジェクトIDを設定

# 3. 認証
gcloud auth application-default login
```

## 使い方（Claude Codeとの対話）

ユーザーが「講師の写真を生成して」と言うと、Claude Codeが自動で以下を実行：

```bash
node scripts/generate-image.js instructor "30代日本人男性、ビジネスカジュアル、笑顔、白背景"
```

## コマンド形式

```bash
node scripts/generate-image.js <target> <prompt>
```

### 利用可能なターゲット

- `instructor` - 講師の写真
- `customer-1` - お客様01
- `customer-2` - お客様02
- `customer-3` - お客様03
- `feature-1` - Market In Research UI
- `feature-2` - Data Driven Planning UI
- `feature-3` - Neuro Bolt Writing UI

## 実行例

```bash
# 講師写真
node scripts/generate-image.js instructor "30代日本人男性、ビジネスカジュアル、笑顔、プロフェッショナル、白背景"

# お客様の声
node scripts/generate-image.js customer-1 "40代日本人女性、スーツ、笑顔、白背景"

# UI画面
node scripts/generate-image.js feature-1 "モダンなSaaSダッシュボード、データ分析画面、青基調、グラフとチャート"
```

## 処理フロー

1. Vertex AI Gemini API で画像生成
2. `assets/images/` に保存
3. `index.html` を自動更新
4. 完了通知
