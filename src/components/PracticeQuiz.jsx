import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, Snail, Check, X, RotateCcw, Trophy, Award, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

export default function PracticeQuiz({ words, accent, onEarnStar }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [quizList, setQuizList] = useState([]);

  // 打乱单词生成闯关题目
  useEffect(() => {
    if (words && words.length > 0) {
      const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, 10);
      setQuizList(shuffled);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setCombo(0);
    }
  }, [words]);

  const currentQuestion = quizList[currentIndex];

  // 动态生成 4 个干扰选项
  const options = useMemo(() => {
    if (!currentQuestion || !words || words.length === 0) return [];
    const correct = currentQuestion;
    const others = words.filter(w => w.word !== correct.word).sort(() => 0.5 - Math.random()).slice(0, 3);
    const pool = [correct, ...others].sort(() => 0.5 - Math.random());
    return pool;
  }, [currentQuestion, words]);

  // 进入新题时自动播放当前发音
  useEffect(() => {
    if (currentQuestion && !isAnswered) {
      speakWord(currentQuestion.word, { accent, slow: false });
    }
  }, [currentQuestion, isAnswered, accent]);

  const handleSelect = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option.word === currentQuestion.word;
    if (isCorrect) {
      sounds.playCorrect();
      setScore(s => s + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      onEarnStar(newCombo > 2 ? 2 : 1); // 连击额外加星星

      if (newCombo >= 3) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      sounds.playWrong();
      setCombo(0);
    }
  };

  const handleNextQuestion = () => {
    sounds.playPop();
    if (currentIndex + 1 < quizList.length) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // 完成答题
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
      setCurrentIndex(quizList.length);
    }
  };

  const handleRestart = () => {
    sounds.playPop();
    const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizList(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCombo(0);
  };

  // 完成闯关的奖励页面
  if (currentIndex >= quizList.length && quizList.length > 0) {
    const perfect = score === quizList.length;
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-8 text-center cartoon-card border-4 border-amber-300 animate-pop">
        <div className="text-6xl mb-4 cute-bounce">
          {perfect ? '🏆' : '🌟'}
        </div>
        <h2 className="text-2xl font-black text-amber-900 mb-2">
          {perfect ? '太棒了！答题大满贯！' : '闯关完成，表现真优秀！'}
        </h2>
        <p className="text-slate-600 font-medium mb-6">
          本次答对了 <span className="text-2xl font-black text-emerald-600">{score}</span> / {quizList.length} 题
        </p>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-6 flex items-center justify-around">
          <div>
            <div className="text-xs text-slate-500 font-bold">获得小星星</div>
            <div className="text-2xl font-black text-amber-600">+{score} ⭐</div>
          </div>
          <div className="w-[1px] h-8 bg-amber-200"></div>
          <div>
            <div className="text-xs text-slate-500 font-bold">最高连击</div>
            <div className="text-2xl font-black text-rose-500">{combo} 🔥</div>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="cartoon-btn-yellow w-full py-3.5 rounded-2xl text-amber-950 font-black text-base flex items-center justify-center gap-2 shadow-md"
        >
          <RotateCcw className="w-5 h-5" />
          <span>再挑战一次 🚀</span>
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12 text-slate-400 font-bold">
        正在准备题库... 🎈
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* 顶部题目状态与连击指示 */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
            第 {currentIndex + 1} / {quizList.length} 关
          </span>
          {combo > 1 && (
            <span className="flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white animate-bounce">
              <Flame className="w-3.5 h-3.5" />
              <span>{combo} 连击 Combo!</span>
            </span>
          )}
        </div>
        <div className="text-xs font-bold text-slate-500">
          得分: <span className="font-black text-emerald-600 text-sm">{score}</span>
        </div>
      </div>

      {/* 听音核心面板 */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 cartoon-card border-4 border-emerald-300 flex flex-col items-center">
        {/* 默认不透露图片，答对后揭晓图案 */}
        <div className="mb-3 flex flex-col items-center">
          <span className={`text-5xl filter drop-shadow transition-all duration-300 ${isAnswered ? 'scale-110 animate-bounce' : 'animate-pulse'}`}>
            {isAnswered ? (currentQuestion.emoji || '🎉') : '🎧'}
          </span>
          {!isAnswered && (
            <span className="text-[11px] font-bold text-slate-400 mt-1">
              神秘盲盒 ❓ 答对后揭晓图案
            </span>
          )}
        </div>

        <p className="text-sm font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-4">
          👂 仔细听发音，选择正确的中文意思：
        </p>

        {/* 听音按钮组 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => speakWord(currentQuestion.word, { accent, slow: false })}
            className="cartoon-btn-yellow flex items-center gap-2 px-5 py-2.5 rounded-2xl text-amber-950 font-black text-base shadow-sm"
          >
            <Volume2 className="w-6 h-6 text-amber-800" />
            <span>点击听发音 🔊</span>
          </button>

          <button
            onClick={() => speakWord(currentQuestion.word, { accent, slow: true })}
            className="cartoon-btn-green p-2.5 rounded-2xl text-white font-black shadow-sm"
            title="小乌龟慢读"
          >
            <Snail className="w-6 h-6" />
          </button>
        </div>

        {/* 四选一选项矩阵 */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {options.map((option, idx) => {
            const isThisSelected = selectedOption?.word === option.word;
            const isThisCorrect = option.word === currentQuestion.word;

            let btnStyle = 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700';

            if (isAnswered) {
              if (isThisCorrect) {
                btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md animate-pop';
              } else if (isThisSelected && !isThisCorrect) {
                btnStyle = 'bg-rose-500 border-rose-600 text-white animate-wiggle';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option.word + idx}
                disabled={isAnswered}
                onClick={() => handleSelect(option)}
                className={`py-3.5 px-4 rounded-2xl border-2 font-black text-sm sm:text-base flex items-center justify-between transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-6 h-6 rounded-full bg-white/30 text-xs font-mono flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="truncate">{option.translation}</span>
                </div>

                {isAnswered && isThisCorrect && (
                  <Check className="w-5 h-5 shrink-0 stroke-[3]" />
                )}
                {isAnswered && isThisSelected && !isThisCorrect && (
                  <X className="w-5 h-5 shrink-0 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 答题后的反馈与下一题按钮 */}
        {isAnswered && (
          <div className="w-full mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs text-slate-400 font-bold block">正确单词是：</span>
              <span className="text-lg font-black text-slate-800">
                {currentQuestion.word} <span className="text-xs font-normal text-slate-500">{currentQuestion.phonetic}</span>
              </span>
            </div>

            <button
              onClick={handleNextQuestion}
              className="cartoon-btn-pink px-6 py-2.5 rounded-2xl text-white font-black text-sm shadow-md flex items-center gap-1.5 animate-bounce-soft"
            >
              <span>{currentIndex + 1 === quizList.length ? '查看成绩 🏆' : '下一题 ➡️'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
