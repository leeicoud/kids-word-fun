// 内置精选小学趣味词库（带卡通 Emoji、发音音标、趣味例句与神奇记忆口诀）

export const BUILTIN_CATEGORIES = [
  {
    id: 'animals',
    name: '萌萌动物园',
    icon: '🦁',
    description: '小猫、小狗、大熊猫等可爱小动物',
    words: [
      {
        word: 'cat',
        phonetic: '/kæt/',
        translation: '猫咪',
        emoji: '🐱',
        sentence: 'The little cat is sleeping in the sun.',
        sentenceCn: '小猫正在阳光下睡觉。',
        memoryTip: '小猫喜欢把帽子（hat）当成玩具。'
      },
      {
        word: 'dog',
        phonetic: '/dɒɡ/',
        translation: '小狗',
        emoji: '🐶',
        sentence: 'The cute dog wags its tail happily.',
        sentenceCn: '可爱的小狗开心地摇尾巴。',
        memoryTip: 'dog 汪汪叫，看家护院真灵巧。'
      },
      {
        word: 'panda',
        phonetic: '/ˈpændə/',
        translation: '大熊猫',
        emoji: '🐼',
        sentence: 'Pandas love eating sweet bamboo.',
        sentenceCn: '大熊猫最爱吃甜甜的竹子。',
        memoryTip: '胖达胖达（panda），中国国宝黑白花。'
      },
      {
        word: 'rabbit',
        phonetic: '/ˈræbɪt/',
        translation: '兔子',
        emoji: '🐰',
        sentence: 'The rabbit has long ears and red eyes.',
        sentenceCn: '小兔子有长长的耳朵和红红的眼睛。',
        memoryTip: '小白兔跑得快，胡萝卜是它的最爱。'
      },
      {
        word: 'elephant',
        phonetic: '/ˈelɪfənt/',
        translation: '大象',
        emoji: '🐘',
        sentence: 'The elephant has a very long nose.',
        sentenceCn: '大象有一个长长的鼻子。',
        memoryTip: '大象长鼻子，喷水洗澡真神奇。'
      },
      {
        word: 'monkey',
        phonetic: '/ˈmʌŋki/',
        translation: '猴子',
        emoji: '🐵',
        sentence: 'The clever monkey is climbing the tree.',
        sentenceCn: '聪明的猴子正在爬树。',
        memoryTip: '猴子爱吃香蕉，荡秋千真敏捷。'
      },
      {
        word: 'lion',
        phonetic: '/ˈlaɪən/',
        translation: '狮子',
        emoji: '🦁',
        sentence: 'The lion is the king of the forest.',
        sentenceCn: '狮子是森林之王。',
        memoryTip: '狮子 lion 吼一声，森林百兽抖三抖。'
      },
      {
        word: 'bear',
        phonetic: '/beə(r)/',
        translation: '熊',
        emoji: '🐻',
        sentence: 'The big brown bear likes honey.',
        sentenceCn: '大棕熊喜欢吃甜甜的蜂蜜。',
        memoryTip: '小熊 bear 圆滚滚，冬眠睡大觉。'
      },
      {
        word: 'tiger',
        phonetic: '/ˈtaɪɡə(r)/',
        translation: '老虎',
        emoji: '🐯',
        sentence: 'The tiger has beautiful yellow and black stripes.',
        sentenceCn: '老虎身上有美丽的黄色和黑色条纹。',
        memoryTip: '泰戈尔（tiger）额头写着“王”。'
      },
      {
        word: 'duck',
        phonetic: '/dʌk/',
        translation: '鸭子',
        emoji: '🦆',
        sentence: 'Three ducks are swimming in the pond.',
        sentenceCn: '三只鸭子正在池塘里游水。',
        memoryTip: '大口大口（duck），嘎嘎嘎水中游。'
      }
    ]
  },
  {
    id: 'fruits_food',
    name: '美味水果与美食',
    icon: '🍎',
    description: '苹果、香蕉、冰淇淋等美味食物',
    words: [
      {
        word: 'apple',
        phonetic: '/ˈæpl/',
        translation: '苹果',
        emoji: '🍎',
        sentence: 'An apple a day keeps the doctor away.',
        sentenceCn: '一天一苹果，医生远离我。',
        memoryTip: '红红苹果圆又圆，咬上一口脆又甜。'
      },
      {
        word: 'banana',
        phonetic: '/bəˈnɑːnə/',
        translation: '香蕉',
        emoji: '🍌',
        sentence: 'Monkeys like eating yellow bananas.',
        sentenceCn: '猴子喜欢吃黄色的香蕉。',
        memoryTip: '拨哪呢（banana），香蕉剥皮弯弯腰。'
      },
      {
        word: 'orange',
        phonetic: '/ˈɒrɪndʒ/',
        translation: '橙子 / 橙色',
        emoji: '🍊',
        sentence: 'This sweet orange is full of juice.',
        sentenceCn: '这个甜甜的橙子汁水好多。',
        memoryTip: '橙子圆圆像小灯笼，酸酸甜甜维C多。'
      },
      {
        word: 'watermelon',
        phonetic: '/ˈwɔːtəmələn/',
        translation: '西瓜',
        emoji: '🍉',
        sentence: 'We love eating cold watermelon in summer.',
        sentenceCn: '夏天我们最喜欢吃冰西瓜。',
        memoryTip: 'water（水）+ melon（瓜）= 汁水饱满的大西瓜！'
      },
      {
        word: 'ice cream',
        phonetic: '/ˌaɪs ˈkriːm/',
        translation: '冰淇淋',
        emoji: '🍦',
        sentence: 'I want a chocolate ice cream, please.',
        sentenceCn: '我想要一个巧克力味的冰淇淋。',
        memoryTip: 'ice（冰）+ cream（奶油），甜丝丝凉爽爽。'
      },
      {
        word: 'cake',
        phonetic: '/keɪk/',
        translation: '蛋糕',
        emoji: '🎂',
        sentence: 'Happy birthday! Here is your birthday cake.',
        sentenceCn: '生日快乐！这是你的生日蛋糕。',
        memoryTip: '吹蜡烛，吃 cake，过生日好开心。'
      },
      {
        word: 'milk',
        phonetic: '/mɪlk/',
        translation: '牛奶',
        emoji: '🥛',
        sentence: 'Drinking milk helps children grow tall.',
        sentenceCn: '喝牛奶能帮助小朋友长高高。',
        memoryTip: '白白牛奶纯又香，每天早上一大杯。'
      },
      {
        word: 'bread',
        phonetic: '/bred/',
        translation: '面包',
        emoji: '🍞',
        sentence: 'I have some warm bread for breakfast.',
        sentenceCn: '我早餐吃了一些热乎乎的面包。',
        memoryTip: '不累的（bread），吃完面包活力满满！'
      }
    ]
  },
  {
    id: 'school_life',
    name: '快乐校园文具',
    icon: '🎒',
    description: '铅笔、橡皮、书包与书桌',
    words: [
      {
        word: 'book',
        phonetic: '/bʊk/',
        translation: '书本',
        emoji: '📖',
        sentence: 'Open your English book to page ten.',
        sentenceCn: '打开你的英语书翻到第十页。',
        memoryTip: '打开 book，书中自有大千世界。'
      },
      {
        word: 'pencil',
        phonetic: '/ˈpensl/',
        translation: '铅笔',
        emoji: '✏️',
        sentence: 'I draw a red star with my pencil.',
        sentenceCn: '我用铅笔画了一颗红色的星星。',
        memoryTip: '铅笔细细 pencil，写字画画最拿手。'
      },
      {
        word: 'eraser',
        phonetic: '/ɪˈreɪzə(r)/',
        translation: '橡皮擦',
        emoji: '🧼',
        sentence: 'Can I borrow your eraser, please?',
        sentenceCn: '请问我可以借用一下你的橡皮擦吗？',
        memoryTip: '轻轻擦一擦 eraser，小错全都变干净。'
      },
      {
        word: 'ruler',
        phonetic: '/ˈruːlə(r)/',
        translation: '尺子',
        emoji: '📏',
        sentence: 'Use a ruler to draw a straight line.',
        sentenceCn: '用尺子画一条直线。',
        memoryTip: '长长尺子 ruler，测量规矩放心里。'
      },
      {
        word: 'schoolbag',
        phonetic: '/ˈskuːlbæɡ/',
        translation: '书包',
        emoji: '🎒',
        sentence: 'My new schoolbag is bright blue.',
        sentenceCn: '我的新书包是亮蓝色的。',
        memoryTip: '背上小书包 schoolbag，上学不迟到。'
      },
      {
        word: 'teacher',
        phonetic: '/ˈtiːtʃə(r)/',
        translation: '老师',
        emoji: '👩‍🏫',
        sentence: 'Our teacher is kind and friendly.',
        sentenceCn: '我们的老师亲切又和蔼。',
        memoryTip: '教我们知识的爱心天使就是 teacher。'
      }
    ]
  },
  {
    id: 'nature_colors',
    name: '神奇自然与天气',
    icon: '🌈',
    description: '太阳、彩虹、星星与蓝天',
    words: [
      {
        word: 'sun',
        phonetic: '/sʌn/',
        translation: '太阳',
        emoji: '☀️',
        sentence: 'The bright sun shines high in the sky.',
        sentenceCn: '明亮的太阳高高挂在天空中。',
        memoryTip: '太阳升起 sun，世界一片暖洋洋。'
      },
      {
        word: 'rainbow',
        phonetic: '/ˈreɪnbəʊ/',
        translation: '彩虹',
        emoji: '🌈',
        sentence: 'Look! There is a beautiful rainbow!',
        sentenceCn: '看！有一道美丽的彩虹！',
        memoryTip: 'rain（雨）+ bow（弓）= 雨后出现的彩虹桥！'
      },
      {
        word: 'star',
        phonetic: '/stɑː(r)/',
        translation: '星星',
        emoji: '⭐',
        sentence: 'Twinkle, twinkle, little star!',
        sentenceCn: '一闪一闪亮晶晶，满天都是小星星！',
        memoryTip: '夜空中眨眼睛的小精灵就是 star。'
      },
      {
        word: 'flower',
        phonetic: '/ˈflaʊə(r)/',
        translation: '花朵',
        emoji: '🌸',
        sentence: 'The spring flowers smell very sweet.',
        sentenceCn: '春天的花朵闻起来很香甜。',
        memoryTip: '小蜜蜂采蜜忙，花朵 flower 迎风笑。'
      },
      {
        word: 'tree',
        phonetic: '/triː/',
        translation: '大树',
        emoji: '🌳',
        sentence: 'Birds are singing happily in the tree.',
        sentenceCn: '鸟儿在大树上欢快地歌唱。',
        memoryTip: '绿色的大树 tree，撑起夏日大绿伞。'
      }
    ]
  }
];
