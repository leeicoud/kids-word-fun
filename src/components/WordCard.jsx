import React, { useState, useEffect } from 'react';
import { Volume2, Snail, ChevronLeft, ChevronRight, Shuffle, Play, Pause, Bookmark, BookmarkCheck, CheckCircle2, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

export default function WordCard({
  words,
  currentIndex,
  onPrev,
  onNext,
  onRandom,
  accent,
  onMarkMastered,
  isMastered,
  onToggleFavorite,
  isFavorite
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentWord = words[currentIndex] || {
    word: 'hello',
    phonetic: '/həˈləʊ/',
    translation: '你好',
    emoji: '👋',
    sentence: 'Hello, welcome to English world!',
    sentenceCn: '你好，欢迎来到英语世界！',
    memoryTip: '每天见面打个招呼：Hello！'
  };

  // 每次切换单词时翻回正面，并自动朗读
  useEffect(() => {
    setIsFlipped(false);
    speakWord(currentWord.word, { accent, slow: false });
  }, [currentIndex, currentWord.word, accent]);

  // 自动播放功能（小剧场自动翻页与朗读）
  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        onNext();
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, onNext]);

  // 监听键盘空格键 Space 实现 3D 卡片翻转
  useEffect(() => {
    const handleSpaceKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault(); // 阻止页面滚动
        sounds.playFlip();
        setIsFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleSpaceKeyDown);
    return () => window.removeEventListener('keydown', handleSpaceKeyDown);
  }, []);

  const handleFlip = () => {
    sounds.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handlePronounce = (e, slow = false) => {
    e.stopPropagation();
    sounds.playPop();
    speakWord(currentWord.word, { slow, accent });
  };

  const handleSentencePronounce = (e) => {
    e.stopPropagation();
    sounds.playPop();
    speakWord(currentWord.sentence, { slow: false, accent });
  };

  const handleMasteredClick = (e) => {
    e.stopPropagation();
    if (isMastered) return; // 已经掌握，每个单词只能加一次星
    sounds.playStar();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onMarkMastered(currentWord.word);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    sounds.playPop();
    onToggleFavorite(currentWord.word);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* 顶部进度与控制胶囊 */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
            第 {currentIndex + 1} / {words.length} 个
          </span>
          {isMastered && (
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1 border border-emerald-300 animate-pop">
              <span>⭐</span> 已牢牢掌握
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 自动轮读播放按钮 */}
          <button
            onClick={() => {
              sounds.playPop();
              setIsAutoPlaying(!isAutoPlaying);
            }}
            className={`flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full border transition-all ${
              isAutoPlaying
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? '暂停轮播' : '自动读词'}</span>
          </button>

          {/* 收藏按钮 */}
          <button
            onClick={handleFavoriteClick}
            title={isFavorite ? '取消收藏' : '加入我的生词本'}
            className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-300 transition-colors"
          >
            {isFavorite ? (
              <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 核心 3D 翻转卡片 */}
      <div
        onClick={handleFlip}
        className="w-full h-[380px] sm:h-[420px] cursor-pointer perspective-1000 select-none group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ====== 卡片正面 (英文展示区) ====== */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-white p-6 sm:p-8 flex flex-col justify-between cartoon-card backface-hidden border-4 border-amber-300 hover:border-amber-400">
            {/* 卡片右上角翻转提示与分类标签 */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-4xl sm:text-5xl animate-bounce-soft filter drop-shadow">
                  {currentWord.emoji || '✨'}
                </span>
                {currentWord.category && (
                  <span className="text-xs font-black px-2.5 py-1 bg-amber-100/80 text-amber-900 rounded-full border border-amber-300 shadow-sm flex items-center gap-1">
                    <span>{currentWord.categoryIcon || '📚'}</span>
                    <span>{currentWord.category}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600/80 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                <span>点我翻看中文</span>
              </div>
            </div>

            {/* 核心单词与发音 */}
            <div className="text-center my-auto">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-wider hover:text-amber-600 transition-colors">
                {currentWord.word}
              </h2>

              {currentWord.phonetic && (
                <p className="text-slate-400 font-mono text-base sm:text-lg mt-1">
                  {currentWord.phonetic}
                </p>
              )}

              {/* 发音按钮组：正常小喇叭 + 小乌龟慢读 */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={(e) => handlePronounce(e, false)}
                  className="cartoon-btn-yellow flex items-center gap-1.5 px-4 py-2 rounded-2xl text-amber-950 font-black text-sm shadow-sm"
                  title="正常速度朗读"
                >
                  <Volume2 className="w-5 h-5 text-amber-800" />
                  <span>标准发音</span>
                </button>

                <button
                  onClick={(e) => handlePronounce(e, true)}
                  className="cartoon-btn-green flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-white font-black text-sm shadow-sm"
                  title="0.2倍速极慢朗读，适合听清每个辅音与元音"
                >
                  <Snail className="w-5 h-5" />
                  <span>0.2倍慢读 🐢</span>
                </button>
              </div>
            </div>

            {/* 卡片底部简短例句 */}
            <div
              onClick={handleSentencePronounce}
              className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-left hover:bg-amber-100/70 transition-colors"
              title="点击朗读例句"
            >
              <div className="pr-2">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {currentWord.sentence}
                </p>
              </div>
              <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
          </div>

          {/* ====== 卡片反面 (中文释义与趣味巧记) ====== */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8 flex flex-col justify-between cartoon-card backface-hidden rotate-y-180 border-4 border-orange-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-4xl sm:text-5xl filter drop-shadow">
                  {currentWord.emoji || '🎉'}
                </span>
                {currentWord.category && (
                  <span className="text-xs font-black px-2.5 py-1 bg-orange-200/80 text-orange-900 rounded-full border border-orange-300 shadow-sm flex items-center gap-1">
                    <span>{currentWord.categoryIcon || '📚'}</span>
                    <span>{currentWord.category}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100/70 px-2.5 py-1 rounded-full border border-orange-200">
                <RotateCw className="w-3 h-3" />
                <span>点我翻回英文</span>
              </div>
            </div>

            {/* 核心中文释义 */}
            <div className="text-center my-auto">
              <div className="inline-block px-4 py-1 rounded-full bg-orange-200 text-orange-800 text-xs font-black mb-2">
                中文释义
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
                {currentWord.translation}
              </h2>

              {/* 趣味记忆口诀 / 联想妙记 */}
              {currentWord.memoryTip && (
                <div className="mt-4 p-3 bg-white/90 rounded-2xl border-2 border-dashed border-orange-300 shadow-sm text-left max-w-sm mx-auto">
                  <p className="text-xs font-black text-orange-700 flex items-center gap-1 mb-1">
                    <span>💡</span> 趣味巧记口诀：
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {currentWord.memoryTip}
                  </p>
                </div>
              )}
            </div>

            {/* 例句中文释义 */}
            <div className="bg-white/80 p-3 rounded-2xl border border-orange-200 text-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                "{currentWord.sentenceCn || currentWord.sentence}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部控制按钮组 */}
      <div className="w-full flex items-center justify-between gap-2 mt-6">
        {/* 上一个单词 */}
        <button
          onClick={() => {
            sounds.playPop();
            onPrev();
          }}
          className="cartoon-btn-yellow flex-1 py-3 px-3 rounded-2xl text-amber-950 font-black text-sm sm:text-base flex items-center justify-center gap-1"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>上一个</span>
        </button>

        {/* 随机单词 */}
        <button
          onClick={() => {
            sounds.playPop();
            onRandom();
          }}
          title="随机来一个单词"
          className="cartoon-btn-purple p-3 rounded-2xl text-white font-black shadow-sm flex items-center justify-center"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        {/* 掌握打卡按钮：每个单词只能加一次星 */}
        <button
          onClick={handleMasteredClick}
          disabled={isMastered}
          className={`flex-1 py-3 px-3 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-1.5 transition-all ${
            isMastered
              ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400/80 cursor-default shadow-inner'
              : 'cartoon-btn-green text-white active:scale-95'
          }`}
          title={isMastered ? '这个单词已经获得小星星啦' : '记住这个单词，奖励1颗小星星'}
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>{isMastered ? '已掌握 ⭐' : '我记住了 +1星'}</span>
        </button>

        {/* 下一个单词 */}
        <button
          onClick={() => {
            sounds.playPop();
            onNext();
          }}
          className="cartoon-btn-pink flex-1 py-3 px-3 rounded-2xl text-white font-black text-sm sm:text-base flex items-center justify-center gap-1"
        >
          <span>下一个</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 键盘快捷键贴心提示 */}
      <div className="mt-4 text-center text-xs text-slate-400 font-medium">
        💡 键盘小秘密：按键盘 <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[10px]">←</kbd> 和 <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[10px]">→</kbd> 快速切换，按 <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[10px]">空格 Space</kbd> 翻转卡片
      </div>
    </div>
  );
}
