// 语音朗读工具类：原生 Web Speech API + 在线公开音源双保障

export const speakWord = (word, { slow = false, accent = 'en-US' } = {}) => {
  if (!word) return;

  // 1. 尝试使用浏览器原生 Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // 停止当前正在播放的声音

    // 如果是短语，慢读时在空格处稍加停顿，体验更优
    const textToSpeak = slow && word.includes(' ') ? word.split(' ').join(' , ') : word;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = accent;
    // 0.2 倍极慢语速（超长慢音节分解，慢如树懒模式）
    utterance.rate = slow ? 0.2 : 0.95;
    utterance.pitch = 1.0;

    // 优先匹配高质量英语发音人
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    try {
      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.warn('Speech synthesis failed, falling back to audio tag', e);
    }
  }

  // 2. 备用兜底方案：使用公开词典音频接口
  try {
    const audioType = accent === 'en-GB' ? 1 : 2; // 1英音 2美音
    const audio = new Audio(`https://dict.youdao.com/dictvoice?type=${audioType}&audio=${encodeURIComponent(word)}`);
    if (slow) {
      audio.playbackRate = 0.25; // 0.25 倍极慢速播放
    }
    audio.play().catch(err => {
      console.warn('Audio play failed', err);
    });
  } catch (err) {
    console.error('All speech methods failed', err);
  }
};
