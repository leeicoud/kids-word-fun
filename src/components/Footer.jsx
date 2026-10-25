import React, { useState } from 'react';
import { Rocket, Heart, HelpCircle, X, ExternalLink, Check } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Footer() {
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCommand = (cmd) => {
    navigator.clipboard?.writeText(cmd);
    sounds.playStar();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <footer className="w-full max-w-4xl mx-auto mt-12 mb-6 px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500">
          <button
            onClick={() => {
              sounds.playPop();
              setShowDeployModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 shadow-sm transition-all hover:scale-105"
          >
            <Rocket className="w-3.5 h-3.5 text-amber-500" />
            <span>免费部署到线上（手机/电脑都能用）</span>
          </button>

          <span className="text-slate-300">|</span>

          <span className="flex items-center gap-1 text-slate-400">
            纯前端零后端依赖 · 支持离线与在线双模式
          </span>
        </div>
      </footer>

      {/* 免费部署指南弹窗 */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <h3 className="text-lg font-black text-slate-800">
                  如何免费部署到公网服务器？
                </h3>
              </div>
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowDeployModal(false);
                }}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-left text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <p className="text-slate-700">
                本项目是标准的现代纯前端项目（React + Vite），<strong>没有任何后端服务器成本</strong>，支持免费永久部署到以下主流平台：
              </p>

              {/* 方案 1: Vercel / Netlify 一键部署 (最推荐，10秒搞定) */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <h4 className="font-black text-amber-900 flex items-center gap-1.5 mb-1.5 text-sm">
                  <span>⚡ 方案一：Vercel 一键上线（最推荐，零配置）</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-amber-950 text-xs pl-1">
                  <li>将代码推送到你的 GitHub 仓库；</li>
                  <li>打开 <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">vercel.com</a> 免费登录；</li>
                  <li>点击 "Add New Project" 选择该仓库，点击 <strong>Deploy</strong>，10秒即可自动生成全球 CDN 免费访问网址！</li>
                </ol>
              </div>

              {/* 方案 2: GitHub Pages 免费静态托管 */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-black text-slate-800 flex items-center gap-1.5 mb-1.5 text-sm">
                  <span>🐙 方案二：GitHub Pages 免费部署</span>
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  在本地执行打包命令生成静态文件：
                </p>
                <div className="relative bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-xs flex items-center justify-between">
                  <code>npm run build</code>
                  <button
                    onClick={() => copyCommand('npm run build')}
                    className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    <span>{copied ? '已复制' : '复制命令'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  将生成的 <code>dist</code> 文件夹内容上传至仓库的 <code>gh-pages</code> 分支，即可通过 <code>https://你的用户名.github.io/仓库名</code> 免费访问。
                </p>
              </div>

              {/* 方案 3: Cloudflare Pages 免费无限流量 */}
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200">
                <h4 className="font-black text-sky-900 flex items-center gap-1.5 mb-1 text-sm">
                  <span>☁️ 方案三：Cloudflare Pages</span>
                </h4>
                <p className="text-xs text-sky-800">
                  支持国内极速访问且完全免费无限流量，构建命令填 <code>npm run build</code>，输出目录填 <code>dist</code> 即可。
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowDeployModal(false);
                }}
                className="cartoon-btn-yellow px-6 py-2 rounded-xl text-amber-950 font-black text-xs"
              >
                我知道啦 👍
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
