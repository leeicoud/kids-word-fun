import React, { useState } from 'react';
import { X, Check, Globe, Sparkles, Book, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { ONLINE_DICT_SOURCES } from '../data/dictSources';
import { BUILTIN_CATEGORIES } from '../data/builtInDicts';
import { sounds } from '../utils/soundEffects';

export default function DictSelectorModal({
  isOpen,
  onClose,
  currentDictId,
  onSelectDict,
  onLoadCustomUrl,
  isLoadingOnline
}) {
  const [activeCategory, setActiveCategory] = useState('online'); // 'online' | 'theme' | 'custom'
  const [customUrl, setCustomUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [customError, setCustomError] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setCustomError('');
    try {
      await onLoadCustomUrl(customUrl.trim(), customName.trim() || '自定义在线词库');
      sounds.playCorrect();
      onClose();
    } catch (err) {
      setCustomError('加载失败，请确保链接为公开有效的 JSON 词库格式（支持跨域 CORS）');
      sounds.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[85vh]">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎒</span>
            <h2 className="text-xl font-black tracking-wide drop-shadow-sm">选择你的学习词库</h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-black/10 active:scale-90 transition-transform"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 选项卡分类 */}
        <div className="flex border-b border-amber-100 bg-amber-50/60 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveCategory('online');
            }}
            className={`pb-2.5 px-3 font-black text-sm flex items-center gap-1.5 border-b-2 transition-all ${
              activeCategory === 'online'
                ? 'border-amber-500 text-amber-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-amber-600'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>小学教材同步 (在线开源)</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveCategory('theme');
            }}
            className={`pb-2.5 px-3 font-black text-sm flex items-center gap-1.5 border-b-2 transition-all ${
              activeCategory === 'theme'
                ? 'border-amber-500 text-amber-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-amber-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>萌趣主题分类 (精选)</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveCategory('custom');
            }}
            className={`pb-2.5 px-3 font-black text-sm flex items-center gap-1.5 border-b-2 transition-all ${
              activeCategory === 'custom'
                ? 'border-amber-500 text-amber-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-amber-600'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>自定义在线词库</span>
          </button>
        </div>

        {/* 词库列表内容区 */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* 在线同步词库 */}
          {activeCategory === 'online' && (
            <div className="space-y-3">
              <div className="text-xs text-amber-800/80 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                <span>💡</span>
                <span>数据源来自公开开源的小学英语教材词库（PEP人教版、剑桥少儿英语），在线实时同步！</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ONLINE_DICT_SOURCES.map((item) => {
                  const isSelected = currentDictId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        sounds.playPop();
                        onSelectDict({ type: 'online', item });
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative overflow-hidden group hover:scale-[1.02] ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/80 shadow-md'
                          : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h3 className="font-black text-slate-800 text-base group-hover:text-amber-600 transition-colors">
                              {item.name}
                            </h3>
                            <span className="text-xs font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              {item.badge} · {item.sampleCount}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-500 font-medium line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 萌趣主题分类词库 */}
          {activeCategory === 'theme' && (
            <div className="space-y-3">
              <div className="text-xs text-emerald-800/80 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                <span>🌈</span>
                <span>精心配套萌趣 Emoji、趣味朗诵例句与神奇谐音记忆口诀，零基础首选！</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUILTIN_CATEGORIES.map((cat) => {
                  const isSelected = currentDictId === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        sounds.playPop();
                        onSelectDict({ type: 'builtin', item: cat });
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative overflow-hidden group hover:scale-[1.02] ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 shadow-md'
                          : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{cat.icon}</span>
                          <div>
                            <h3 className="font-black text-slate-800 text-base group-hover:text-emerald-600 transition-colors">
                              {cat.name}
                            </h3>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              {cat.words.length} 个单词
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-500 font-medium">
                        {cat.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 自定义在线导入 */}
          {activeCategory === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-sky-800 text-xs leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 text-sm mb-1">
                  <span>🌐</span> 在线获取任意开放词库
                </p>
                支持加载网络上公开托管的 JSON 格式单词库（例如 GitHub Raw、Vercel、Gitee、各类公开语料库）。只要是 <code>[&#123; "word": "apple", "trans": "苹果" &#125;]</code> 格式即可在线抓取！
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  词库名称（选填）
                </label>
                <input
                  type="text"
                  placeholder="例如：我的生词本 / 快乐暑假词库"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  在线公开 JSON 地址 (URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/my-words.json"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none text-sm font-medium"
                />
              </div>

              {customError && (
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{customError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoadingOnline}
                className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-98 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoadingOnline ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>正在获取在线词库...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 立即在线抓取并学习</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* 弹窗底部 */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
