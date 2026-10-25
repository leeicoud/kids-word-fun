import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import WordCard from './components/WordCard';
import PracticeQuiz from './components/PracticeQuiz';
import SpellingGame from './components/SpellingGame';
import DictSelectorModal from './components/DictSelectorModal';
import Footer from './components/Footer';
import { BUILTIN_CATEGORIES } from './data/builtInDicts';
import { ONLINE_DICT_SOURCES, fetchOnlineDict } from './data/dictSources';
import { getStoredData, saveStoredData } from './utils/storage';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [userData, setUserData] = useState(() => getStoredData());
  const [currentDictInfo, setCurrentDictInfo] = useState({
    id: 'primary-complete',
    name: '小学1-6年级系统分类全词库',
    type: 'online'
  });
  const [words, setWords] = useState(BUILTIN_CATEGORIES[0].words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('flashcard'); // 'flashcard' | 'quiz' | 'spelling'
  const [accent, setAccent] = useState('en-US'); // 'en-US' | 'en-GB'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDictModalOpen, setIsDictModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // 保存学情数据
  useEffect(() => {
    saveStoredData(userData);
  }, [userData]);

  // 加载指定词库
  const loadDictionary = useCallback(async (dictConfig) => {
    setIsLoading(true);
    setLoadError('');

    if (dictConfig.type === 'builtin') {
      const cat = BUILTIN_CATEGORIES.find(c => c.id === dictConfig.item.id) || BUILTIN_CATEGORIES[0];
      setWords(cat.words);
      setCurrentDictInfo({
        id: cat.id,
        name: cat.name,
        type: 'builtin'
      });
      setCurrentIndex(0);
      setIsLoading(false);
      return;
    }

    if (dictConfig.type === 'online') {
      try {
        const fetchedWords = await fetchOnlineDict(dictConfig.item);
        if (fetchedWords && fetchedWords.length > 0) {
          setWords(fetchedWords);
          setCurrentDictInfo({
            id: dictConfig.item.id,
            name: dictConfig.item.name,
            type: 'online'
          });
          setCurrentIndex(0);
        } else {
          throw new Error('词库数据为空');
        }
      } catch (err) {
        console.warn('Online dict fetch failed, falling back to built-in dict', err);
        setLoadError('在线词库连接受阻，已为您自动切换到精选词库');
        const fallback = BUILTIN_CATEGORIES[0];
        setWords(fallback.words);
        setCurrentDictInfo({
          id: fallback.id,
          name: `${fallback.name} (离线精选)`,
          type: 'builtin'
        });
        setCurrentIndex(0);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // 自定义 URL 在线加载
  const handleLoadCustomUrl = async (url, customName) => {
    setIsLoading(true);
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('网络请求失败');
      const data = await resp.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('数据格式须为 JSON 数组');

      const parsedWords = data.map((item, index) => ({
        id: `custom-${index}`,
        word: item.name || item.word || 'word',
        phonetic: item.usphone ? `/${item.usphone}/` : (item.phonetic || ''),
        translation: Array.isArray(item.trans) ? item.trans.join('；') : (item.trans || item.translation || '释义'),
        emoji: '🎈',
        sentence: (item.sentences && item.sentences[0]) ? item.sentences[0].s : `This is ${item.name || item.word}.`,
        sentenceCn: (item.sentences && item.sentences[0]) ? item.sentences[0].sCn : `这是 ${item.name || item.word}。`,
        memoryTip: `认真背诵 ${item.name || item.word} 吧！`
      }));

      setWords(parsedWords);
      setCurrentDictInfo({
        id: 'custom-' + Date.now(),
        name: customName,
        type: 'custom'
      });
      setCurrentIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载人教版三年级在线词库（带优雅降级）
  useEffect(() => {
    loadDictionary({
      type: 'online',
      item: ONLINE_DICT_SOURCES[0]
    });
  }, [loadDictionary]);

  // 上一个词
  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : words.length - 1));
  }, [words.length]);

  // 下一个词
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < words.length - 1 ? prev + 1 : 0));
  }, [words.length]);

  // 随机词
  const handleRandom = useCallback(() => {
    if (words.length <= 1) return;
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * words.length);
    } while (nextIndex === currentIndex);
    setCurrentIndex(nextIndex);
  }, [words.length, currentIndex]);

  // 快捷键支持（左右键切换、空格翻牌在WordCard内部）
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== 'flashcard') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        sounds.playPop();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        sounds.playPop();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handlePrev, handleNext]);

  // 获得星星奖励
  const handleEarnStar = (count = 1) => {
    setUserData(prev => ({
      ...prev,
      stars: (prev.stars || 0) + count,
      studiedToday: (prev.studiedToday || 0) + 1
    }));
  };

  // 掌握单词（每个单词仅限加一次星星，防止重复点击刷星）
  const handleMarkMastered = (word) => {
    setUserData(prev => {
      if (prev.masteredWords.includes(word)) {
        return prev; // 已经掌握过，直接返回，不重复加星
      }
      return {
        ...prev,
        masteredWords: [...prev.masteredWords, word],
        stars: (prev.stars || 0) + 1,
        studiedToday: (prev.studiedToday || 0) + 1
      };
    });
  };

  // 收藏生词
  const handleToggleFavorite = (word) => {
    setUserData(prev => {
      const already = prev.favoritedWords.includes(word);
      return {
        ...prev,
        favoritedWords: already
          ? prev.favoritedWords.filter(w => w !== word)
          : [...prev.favoritedWords, word]
      };
    });
  };

  const currentWord = words[currentIndex] || { word: '' };
  const isMastered = userData.masteredWords.includes(currentWord.word);
  const isFavorite = userData.favoritedWords.includes(currentWord.word);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-pink-300 selection:text-white">
      {/* 顶部导航 */}
      <Header
        currentDictName={currentDictInfo.name}
        onOpenDictModal={() => setIsDictModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stars={userData.stars || 0}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        accent={accent}
        setAccent={setAccent}
        learnedCount={userData.masteredWords.length}
        totalWords={words.length}
      />

      {/* 主体交互区 */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-bounce-soft">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-3xl shadow-lg border-4 border-white mb-4">
              🚀
            </div>
            <h3 className="text-xl font-black text-amber-900">正在在线获取词库中...</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              连网同步开源小学教材词库，小朋友稍等片刻哦 🎈
            </p>
          </div>
        ) : (
          <>
            {loadError && (
              <div className="mb-4 text-xs font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-4 py-2 rounded-2xl flex items-center gap-2">
                <span>💡</span>
                <span>{loadError}</span>
              </div>
            )}

            {/* Tab 1: 卡通翻转识词卡 */}
            {activeTab === 'flashcard' && (
              <WordCard
                words={words}
                currentIndex={currentIndex}
                onPrev={handlePrev}
                onNext={handleNext}
                onRandom={handleRandom}
                accent={accent}
                onMarkMastered={handleMarkMastered}
                isMastered={isMastered}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {/* Tab 2: 听音闯关问答 */}
            {activeTab === 'quiz' && (
              <PracticeQuiz
                words={words}
                accent={accent}
                onEarnStar={handleEarnStar}
              />
            )}

            {/* Tab 3: 拼写拼拼乐 */}
            {activeTab === 'spelling' && (
              <SpellingGame
                words={words}
                accent={accent}
                onEarnStar={handleEarnStar}
              />
            )}
          </>
        )}
      </main>

      {/* 底部部署说明与版权 */}
      <Footer />

      {/* 词库选择弹窗 */}
      <DictSelectorModal
        isOpen={isDictModalOpen}
        onClose={() => setIsDictModalOpen(false)}
        currentDictId={currentDictInfo.id}
        onSelectDict={(dict) => {
          loadDictionary(dict);
          setIsDictModalOpen(false);
        }}
        onLoadCustomUrl={handleLoadCustomUrl}
        isLoadingOnline={isLoading}
      />
    </div>
  );
}
