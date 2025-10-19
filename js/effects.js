document.addEventListener('DOMContentLoaded', function() {
  // 为所有卡片添加悬停光泽效果
  const cards = document.querySelectorAll('.abstract-wrapper, .reco-theme .content-wrapper');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.style.setProperty('--mouse-x', `${x}px`);
      this.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 打字机效果 - 可选，用于主页标语
  const heroSub = document.querySelector('.hero .description');
  if (heroSub) {
    const originalText = heroSub.textContent;
    heroSub.textContent = '';
    let i = 0;
    
    function typeWriter() {
      if (i < originalText.length) {
        heroSub.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }
    
    // 延迟开始打字效果
    setTimeout(typeWriter, 1000);
  }
});