// 本地存储管理：星星、答题统计、今日背诵数、掌握情况

const STORAGE_KEY = 'kids_word_fun_data';

export const getStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Load storage error', e);
  }
  return {
    stars: 10, // 初始给小朋友10颗奖励星星鼓劲
    masteredWords: [], // 已掌握的单词列表
    favoritedWords: [], // 收藏的生词
    dailyGoal: 10,
    studiedToday: 0,
    lastStudyDate: new Date().toLocaleDateString(),
  };
};

export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Save storage error', e);
  }
};
