# 見積書作成アプリ（出演料＋交通費）

出演料と交通費を含む見積書をブラウザ上で作成し、PDFとしてダウンロードできるWebアプリです。

## 機能

- 出演料・交通費それぞれの明細行を個別に入力
- 出演料：消費税を加えた総計① を自動計算
- 交通費：内税表示の交通費② を自動計算
- 総計（①＋②）を自動計算
- PDFとしてダウンロード

## 使い方

1. `index.html` をブラウザで開く（またはGitHub Pagesで公開）
2. 左パネルから宛先・案件名・出演料明細・交通費明細を入力
3. 右側のプレビューでリアルタイム確認
4. 「PDFをダウンロード」ボタンでA4サイズのPDFを保存

## GitHub Pages で公開する方法

1. このリポジトリをGitHubにプッシュ
2. リポジトリの `Settings` → `Pages`
3. Branch を `main`、フォルダを `/ (root)` に設定して `Save`
4. `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

## ファイル構成

```
├── index.html   # メインHTML
├── style.css    # スタイル
├── app.js       # ロジック
└── README.md
```

## 使用ライブラリ（CDN）

- [html2canvas](https://html2canvas.hertzen.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
