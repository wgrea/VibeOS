// js/canvas/era-nav.js

export function setupEraNav(section, { stageId = null, onSelect }) {
  if (!section) return { sync: () => {} };

  const pillBar = section.querySelector('.era-pill-bar');
  let isExpanded = false;

  if (pillBar && !pillBar.parentElement.classList.contains('era-nav-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'era-nav-wrapper';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'era-arrow era-prev';
    prevBtn.setAttribute('aria-label', 'Previous era');
    prevBtn.innerHTML = '&#8249;';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'era-arrow era-next';
    nextBtn.setAttribute('aria-label', 'Next era');
    nextBtn.innerHTML = '&#8250;';

    const viewAllBtn = document.createElement('button');
    viewAllBtn.type = 'button';
    viewAllBtn.className = 'era-view-all-btn';
    viewAllBtn.setAttribute('aria-expanded', 'false');
    viewAllBtn.textContent = '⊞ View All';

    const hint = document.createElement('div');
    hint.className = 'era-rail-hint';
    hint.innerHTML = `
      <span class="era-scroll-cue">⇄ Scroll left/right or use arrows to browse</span>
      <span class="era-desc-cue">Description below ↓</span>
    `;

    pillBar.parentNode.insertBefore(wrapper, pillBar);
    wrapper.append(prevBtn, pillBar, nextBtn, viewAllBtn);
    wrapper.after(hint);

    const checkOverflow = () => {
      const canScroll = !isExpanded && pillBar.scrollWidth > pillBar.clientWidth + 4;
      const scrollCue = hint.querySelector('.era-scroll-cue');
      if (scrollCue) scrollCue.style.visibility = canScroll ? 'visible' : 'hidden';
    };
    requestAnimationFrame(checkOverflow);
    window.addEventListener('resize', checkOverflow);

    pillBar.addEventListener(
      'wheel',
      (e) => {
        if (!isExpanded && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          pillBar.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );

    wrapper._checkOverflow = checkOverflow;
  }

  function setExpanded(nextState) {
    isExpanded = nextState;
    const wrapper = section.querySelector('.era-nav-wrapper');
    const viewAllBtn = section.querySelector('.era-view-all-btn');

    wrapper?.classList.toggle('is-expanded', isExpanded);

    if (viewAllBtn) {
      viewAllBtn.setAttribute('aria-expanded', String(isExpanded));
      viewAllBtn.textContent = isExpanded ? '⊟ Collapse' : '⊞ View All';
    }

    wrapper?._checkOverflow?.();
  }

  section.addEventListener('click', (e) => {
    if (e.target.closest('.era-view-all-btn')) {
      setExpanded(!isExpanded);
      return;
    }

    const pill = e.target.closest('.era-pill');
    if (pill?.dataset.era) {
      onSelect(pill.dataset.era, true);
      return;
    }

    const arrow = e.target.closest('.era-arrow');
    if (arrow) {
      const pills = Array.from(section.querySelectorAll('.era-pill'));
      const currentIdx = pills.findIndex((btn) => btn.classList.contains('active'));
      const step = arrow.classList.contains('era-next') ? 1 : -1;
      const targetPill = pills[currentIdx + step];

      if (targetPill?.dataset.era) {
        onSelect(targetPill.dataset.era, true);
      }
    }
  });

  function sync(eraKey, descriptionText) {
    const pills = Array.from(section.querySelectorAll('.era-pill'));
    const activeIdx = pills.findIndex((btn) => btn.dataset.era === eraKey);

    pills.forEach((btn, idx) => {
      const isMatch = idx === activeIdx;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', String(isMatch));
    });

    if (!isExpanded) {
      pills[activeIdx]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }

    const prevBtn = section.querySelector('.era-prev');
    const nextBtn = section.querySelector('.era-next');
    if (prevBtn) prevBtn.disabled = activeIdx <= 0;
    if (nextBtn) nextBtn.disabled = activeIdx === -1 || activeIdx >= pills.length - 1;

    const stageBox = stageId
      ? document.getElementById(stageId)
      : section.querySelector('.era-display-card');

    if (stageBox) {
      stageBox.innerHTML = `
        <p>${descriptionText}</p>
      `;
    }
  }

  return { sync };
}
