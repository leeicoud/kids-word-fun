import React, { useState, useEffect } from 'react';
import { Volume2, Snail, RotateCcw, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

export default function SpellingGame({ words, accent, onEarnStar }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLetters, setUserLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const currentWordObj = words[currentIndex] || words[0] || {
    word: 'cat',
    translation: '猫咪',
    emoji: '🐱'
  };

  const targetWord = currentWordObj.word.toLowerCase().replace(/[^a-z]/g, '');

  // 单词切换时重置字母池
  useEffect(() => {
    if (!targetWord) return;
    setUserLetters([]);
    setIsSuccess(false);
    setIsError(false);

    // 打乱当前单词的字母，如果太短可以加一两个干扰可爱字母
    const letters = targetWord.split('').map((char, index) => ({
      id: `${char}-${index}`,
      char,
      used: false
    }));

    // 随机打乱
    setAvailableLetters([...letters].sort(() => 0.5 - Math.random()));
    speakWord(currentWordObj.word, { accent, slow: false });
  }, [currentIndex, currentWordObj, targetWord, accent]);

  const handleLetterClick = (letterObj) => {
    if (letterObj.used || isSuccess) return;
    sounds.playPop();

    const newUserLetters = [...userLetters, letterObj];
    setUserLetters(newUserLetters);

    // 标记为已使用
    setAvailableLetters(prev =>
      prev.map(item => (item.id === letterObj.id ? { ...item, used: true } : item))
    );

    // 检查拼写是否达成
    if (newUserLetters.length === targetWord.length) {
      const spelled = newUserLetters.map(l => l.char).join('');
      if (spelled === targetWord) {
        // 拼对成功
        sounds.playCorrect();
        setIsSuccess(true);
        setIsError(false);
        onEarnStar(2);
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        // 拼错提醒
        sounds.playWrong();
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 800);
      }
    }
  };

  const handleRemoveLetter = (indexToRemove) => {
    if (isSuccess) return;
    sounds.playPop();
    const removed = userLetters[indexToRemove];
    setUserLetters(prev => prev.filter((_, idx) => idx !== indexToRemove));

    setAvailableLetters(prev =>
      prev.map(item => (item.id === removed.id ? { ...item, used: false } : item))
    );
  };

  const handleReset = () => {
    sounds.playPop();
    setUserLetters([]);
    setIsSuccess(false);
    setIsError(false);
    setAvailableLetters(prev => prev.map(item => ({ ...item, used: false })));
  };

  const handleNext = () => {
    sounds.playPop();
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(c => c + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* 顶部进度 */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-900 rounded-full border border-purple-300">
          拼词挑战 {currentIndex + 1} / {words.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新拼</span>
          </button>
        </div>
      </div>

      {/* 拼写核心卡片 */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 cartoon-card border-4 border-purple-300 flex flex-col items-center">
        {/* 中文与发音线索 */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl filter drop-shadow">{currentWordObj.emoji || '🎈'}</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-800">
            {currentWordObj.translation}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => speakWord(currentWordObj.word, { accent, slow: false })}
            className="cartoon-btn-purple px-4 py-1.5 rounded-xl text-white font-black text-xs flex items-center gap-1 shadow-sm"
          >
            <Volume2 className="w-4 h-4" />
            <span>听发音</span>
          </button>
          <button
            onClick={() => speakWord(currentWordObj.word, { accent, slow: true })}
            className="cartoon-btn-green p-1.5 rounded-xl text-white font-black text-xs shadow-sm"
            title="小乌龟慢读"
          >
            <Snail className="w-4 h-4" />
          </button>
        </div>

        {/* 拼写字母槽位 */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 my-4 flex-wrap">
          {Array.from({ length: targetWord.length }).map((_, idx) => {
            const letter = userLetters[idx];
            return (
              <div
                key={idx}
                onClick={() => letter && handleRemoveLetter(idx)}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-3 flex items-center justify-center text-2xl sm:text-3xl font-black cursor-pointer transition-all ${
                  isSuccess
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-600 scale-105'
                    : isError
                    ? 'border-rose-400 bg-rose-50 text-rose-600 animate-wiggle'
                    : letter
                    ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-inner'
                    : 'border-dashed border-slate-300 bg-slate-50 text-transparent'
                }`}
              >
                {letter?.char ? letter.char.toUpperCase() : ''}
              </div>
            );
          })}
        </div>

        {/* 提示点击删除 */}
        <p className="text-[11px] text-slate-400 mb-6 font-medium">
          点击下方糖果字母填入，若填错可点击上方方框撤回
        </p>

        {/* 待选糖果字母池 */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap max-w-md">
          {availableLetters.map((item) => (
            <button
              key={item.id}
              disabled={item.used || isSuccess}
              onClick={() => handleLetterClick(item)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-black text-xl sm:text-2xl transition-all flex items-center justify-center shadow-md ${
                item.used
                  ? 'opacity-20 scale-90 cursor-not-allowed bg-slate-200 text-slate-400'
                  : 'cartoon-btn-yellow text-amber-950 hover:scale-105 active:scale-95'
              }`}
            >
              {item.char.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 成功过关反馈 */}
        {isSuccess && (
          <div className="w-full mt-6 pt-4 border-t border-purple-100 flex items-center justify-between animate-pop">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-base">
              <span>🎉</span>
              <span>太聪明了！拼写完全正确！</span>
            </div>

            <button
              onClick={handleNext}
              className="cartoon-btn-pink px-5 py-2.5 rounded-2xl text-white font-black text-sm shadow-md flex items-center gap-1"
            >
              <span>下一个词 ➡️</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
