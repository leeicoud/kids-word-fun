#!/bin/bash
# 一键部署到 Cloudflare Pages 快捷脚本

echo "🚀 准备部署【小太阳萌趣背单词】到 Cloudflare Pages..."
cd "$(dirname "$0")"

# 1. 执行生产环境打包
echo "📦 正在执行本地静态打包构建 (npm run build)..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ 构建失败，请检查错误日志。"
  exit 1
fi

echo "✨ 静态资源打包完成 (dist/)！"
echo ""
echo "🌐 正在调用 Cloudflare Wrangler CLI 发布到 Pages..."
echo "💡 提示：如果尚未登录 Cloudflare，系统会自动打开浏览器进行一次性免费授权登录。"
echo ""

# 使用 npx 直接运行 wrangler 进行 pages 部署
npx wrangler pages deploy dist --project-name=kids-word-fun --commit-dirty=true

echo ""
echo "🎉 部署完成！请在上方查看您的专属 Cloudflare Pages 域名（通常为 https://kids-word-fun.pages.dev）。"
