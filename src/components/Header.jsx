import React from 'react';
import { BookOpen, Sparkles, Volume2, VolumeX, Gamepad2, Layers, Award, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Header({
  currentDictName,
  onOpenDictModal,
  activeTab,
  setActiveTab,
  stars,
  soundEnabled,
  setSoundEnabled,
  accent,
  setAccent,
  learnedCount,
  totalWords
}) {
  const toggleSound = () => {
    const next = !soundEnabled;
    sounds.enabled = next;
    setSoundEnabled(next);
    if (next) sounds.playPop();
  };

  return (
    <header className="w-full max-w-5xl mx-auto pt-4 pb-2 px-4 sm:px-6">
      {/* 顶部主状态栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-3xl shadow-sm border-2 border-amber-200">
        {/* Logo 区域 */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-2xl shadow-md border-2 border-white cute-bounce">
            ☀️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-amber-900">
                小太阳萌趣背单词
              </h1>
              <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 border border-pink-200">
                小学生专属版
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">每天十分钟，单词轻松记 🎒</p>
          </div>
        </div>

        {/* 词库切换胶囊按钮 */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenDictModal();
          }}
          className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-900 border-2 border-amber-300 shadow-sm active:scale-95 transition-all"
        >
          <Layers className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-black truncate max-w-[140px] sm:max-w-[200px]">
            {currentDictName}
          </span>
          <span className="text-xs font-bold text-amber-700 bg-white/70 px-2 py-0.5 rounded-full border border-amber-200">
            切换词库 📚
          </span>
        </button>

        {/* 右侧成就与设置 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 星星计数 */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-inner">
            <span className="text-lg animate-pulse">⭐</span>
            <span className="font-black text-amber-800 text-base">{stars}</span>
            <span className="text-xs text-amber-600 font-bold hidden sm:inline">颗星</span>
          </div>

          {/* 发音口音切换 */}
          <button
            onClick={() => {
              sounds.playPop();
              setAccent(accent === 'en-US' ? 'en-GB' : 'en-US');
            }}
            title="点击切换英式/美式发音"
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 transition-colors"
          >
            <span>{accent === 'en-US' ? '🇺🇸 美音' : '🇬🇧 英音'}</span>
          </button>

          {/* 音效开关 */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? '音效已开启' : '音效已关闭'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 active:scale-90 transition-all"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* 模式选择导航选项卡 */}
      <div className="mt-3 flex items-center justify-center gap-2 sm:gap-4">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('flashcard');
          }}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-black text-sm sm:text-base transition-all ${
            activeTab === 'flashcard'
              ? 'bg-amber-400 text-white shadow-md border-b-4 border-amber-500 scale-105'
              : 'bg-white/80 text-slate-600 hover:bg-white border-2 border-slate-200 hover:text-amber-600'
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 h-5" />
          <span>📖 卡通识词卡</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('quiz');
          }}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-black text-sm sm:text-base transition-all ${
            activeTab === 'quiz'
              ? 'bg-emerald-400 text-white shadow-md border-b-4 border-emerald-500 scale-105'
              : 'bg-white/80 text-slate-600 hover:bg-white border-2 border-slate-200 hover:text-emerald-600'
          }`}
        >
          <Gamepad2 className="w-4 h-4 sm:w-5 h-5" />
          <span>🎯 听音闯关</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('spelling');
          }}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-black text-sm sm:text-base transition-all ${
            activeTab === 'spelling'
              ? 'bg-purple-400 text-white shadow-md border-b-4 border-purple-500 scale-105'
              : 'bg-white/80 text-slate-600 hover:bg-white border-2 border-slate-200 hover:text-purple-600'
          }`}
        >
          <Sparkles className="w-4 h-4 sm:w-5 h-5" />
          <span>🧩 字母拼拼乐</span>
        </button>
      </div>
    </header>
  );
}
