// 在线公开词库配置列表（支持多源热备：同源部署在线接口 + 国内多节点加速镜像）

export const ONLINE_DICT_SOURCES = [
  {
    id: 'primary-complete',
    name: '小学1-6年级系统分类全词库',
    grade: '1-6年级全套',
    badge: '👑 推荐·大纲全量',
    color: 'from-rose-500 to-amber-500',
    icon: '🏆',
    description: '576词大纲全套系统分类：颜色、学校、文具、数字、家庭、身体、衣物、职业、动词短语等！',
    urls: [
      './dicts/primary-complete.json' // 部署同源在线接口（100% 稳定高可用）
    ],
    sampleCount: '576 词完整版'
  },
  {
    id: 'pep-3',
    name: '人教版 PEP 英语 三年级',
    grade: '三年级',
    badge: '小学起步',
    color: 'from-amber-400 to-orange-400',
    icon: '🌱',
    description: '涵盖文具、动物、颜色、数字、食物、身体等核心词汇',
    urls: [
      './dicts/pep-3.json',
      'https://fastly.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/pep-3.json',
      'https://cdn.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/pep-3.json'
    ],
    sampleCount: '50+ 核心词'
  },
  {
    id: 'pep-4',
    name: '人教版 PEP 英语 四年级',
    grade: '四年级',
    badge: '基础进阶',
    color: 'from-emerald-400 to-teal-500',
    icon: '🌿',
    description: '学校生活、日常作息、天气、服装与农场蔬菜动物',
    urls: [
      './dicts/pep-4.json',
      'https://fastly.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/pep-4.json',
      'https://cdn.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/pep-4.json'
    ],
    sampleCount: '30+ 核心词'
  },
  {
    id: 'pep-5',
    name: '人教版 PEP 英语 五年级',
    grade: '五年级',
    badge: '能力提升',
    color: 'from-blue-400 to-indigo-500',
    icon: '🌲',
    description: '星期日程、四季天气、家务帮手、大自然公园与方位',
    urls: [
      './dicts/pep-5.json',
      'https://fastly.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/pep-5.json',
      'https://cdn.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/pep-5.json'
    ],
    sampleCount: '20+ 核心词'
  },
  {
    id: 'pep-6',
    name: '人教版 PEP 英语 六年级',
    grade: '六年级',
    badge: '小升初冲刺',
    color: 'from-purple-400 to-pink-500',
    icon: '🚀',
    description: '小升初比较级、交通规则、公共设施与过去式语法词',
    urls: [
      './dicts/pep-6.json',
      'https://fastly.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/pep-6.json',
      'https://cdn.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/pep-6.json'
    ],
    sampleCount: '20+ 核心词'
  },
  {
    id: 'cambridge-starters',
    name: '剑桥少儿英语 Starters (一级)',
    grade: '国际少儿',
    badge: '剑桥考级',
    color: 'from-rose-400 to-red-500',
    icon: '⭐',
    description: '恐龙、外星人、机器人、沙滩、风筝等少儿趣味情境词汇',
    urls: [
      './dicts/cambridge-starters.json',
      'https://fastly.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/cambridge-starters.json',
      'https://cdn.jsdelivr.net/gh/RealKai42/qwerty-learner@master/public/dicts/cambridge-starters.json'
    ],
    sampleCount: '15+ 核心词'
  }
];

// 带超时的安全 fetch
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 2500 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// 在线抓取并规范化单词数据
export async function fetchOnlineDict(dictSource) {
  let lastError = null;

  for (const url of dictSource.urls) {
    try {
      const resp = await fetchWithTimeout(url, { timeout: 3000 });
      if (!resp.ok) continue;
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        // 统一规范化字段
        return data.map((item, index) => {
          const rawWord = item.name || item.word || '';
          const rawTrans = Array.isArray(item.trans) ? item.trans.join('；') : (item.trans || item.translation || '');
          const phon = item.phonetic ? item.phonetic : (item.usphone ? `/${item.usphone}/` : (item.ukphone ? `/${item.ukphone}/` : ''));
          const sText = (item.sentences && item.sentences[0]) ? item.sentences[0].s : (item.sentence || `I love the word "${rawWord}"!`);
          const sCnText = (item.sentences && item.sentences[0]) ? item.sentences[0].sCn : (item.sentenceCn || `我很喜欢 "${rawWord}" 这个单词！`);
          const tipText = item.memoryTip || `认真读两遍，牢牢记住 ${rawWord} 吧！`;

          return {
            id: item.id || `${dictSource.id}-${index}`,
            number: item.number || (index + 1),
            word: rawWord,
            phonetic: phon,
            translation: rawTrans,
            category: item.category || '',
            categoryIcon: item.categoryIcon || '',
            emoji: item.emoji || getEmojiForWord(rawWord),
            sentence: sText,
            sentenceCn: sCnText,
            memoryTip: tipText
          };
        }).filter(item => item.word);
      }
    } catch (e) {
      lastError = e;
      console.warn(`Fetch ${url} failed or timed out, trying next mirror...`, e.message);
    }
  }

  throw lastError || new Error('所有在线词库源均无法访问，请检查网络连接');
}

// 常见小学单词自动配可爱 Emoji 映射
function getEmojiForWord(word) {
  const w = word.toLowerCase().trim();
  const map = {
    ruler: '📏', pencil: '✏️', eraser: '🧼', pen: '🖊️', bag: '🎒', book: '📖', crayon: '🖍️',
    'pencil box': '👝', red: '🔴', yellow: '🟡', green: '🟢', blue: '🔵', orange: '🍊',
    white: '⚪', black: '⚫', brown: '🟤', face: '😊', ear: '👂', eye: '👀', nose: '👃',
    mouth: '👄', arm: '💪', hand: '✋', leg: '🦵', foot: '🦶',
    cat: '🐱', dog: '🐶', monkey: '🐵', panda: '🐼', duck: '🦆', pig: '🐷', bird: '🐦',
    tiger: '🐯', elephant: '🐘', bread: '🍞', juice: '🧃', milk: '🥛', water: '💧',
    cake: '🎂', fish: '🐟', rice: '🍚', one: '1️⃣', two: '2️⃣', three: '3️⃣', four: '4️⃣',
    five: '5️⃣', six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟',
    classroom: '🏫', blackboard: '📋', light: '💡', door: '🚪', window: '🪟', desk: '🪑',
    chair: '🪑', computer: '💻', playground: '⚽', library: '📚', sunny: '☀️', windy: '💨',
    cloudy: '☁️', rainy: '🌧️', snowy: '❄️', warm: '🌤️', cold: '🥶', hot: '🥵', jacket: '🧥',
    shirt: '👔', dress: '👗', skirt: '👗', pants: '👖', shoes: '👟', tomato: '🍅', potato: '🥔',
    carrot: '🥕', sheep: '🐑', horse: '🐴', cow: '🐮',
    monday: '📅', tuesday: '📅', wednesday: '📅', thursday: '📅', friday: '📅', saturday: '🎉',
    sunday: '☀️', weekend: '🏖️', spring: '🌱', summer: '🌻', autumn: '🍁', winter: '⛄',
    season: '🌈', 'clean the room': '🧹', 'cook dinner': '🍳', 'wash clothes': '🧺',
    bridge: '🌉', forest: '🌲', river: '🏞️', mountain: '⛰️',
    taller: '🦒', shorter: '🦔', stronger: '🦁', older: '👴', younger: '👶',
    'by bus': '🚌', 'by bike': '🚲', 'by plane': '✈️', 'traffic lights': '🚦',
    hospital: '🏥', cinema: '🎬', 'post office': '📮', 'turn left': '⬅️', 'turn right': '➡️',
    'went camping': '⛺', 'rode a horse': '🏇', 'took pictures': '📷',
    alien: '👽', balloon: '🎈', birthday: '🎂', boat: '⛵', camera: '📷', candy: '🍬',
    dinosaur: '🦖', guitar: '🎸', helicopter: '🚁', kite: '🪁', monster: '👾', robot: '🤖',
    sand: '🏖️', swim: '🏊', train: '🚂'
  };
  return map[w] || '✨';
}
