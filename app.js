(() => {
  const pageLabels = { home: 'Discover', ar: 'AR Try-in-Space', builder: 'Custom Builder', studio: '3D Scan Studio', bazaar: 'Virtual Bazaar', advisor: 'Gift Advisor', orders: 'My orders' };
  const pages = [...document.querySelectorAll('.page')];
  const navItems = [...document.querySelectorAll('.nav-item')];
  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const navigate = (page) => {
    if (!pageLabels[page]) return;
    pages.forEach(section => section.classList.toggle('active', section.id === `page-${page}`));
    navItems.forEach(item => item.classList.toggle('active', item.dataset.page === page));
    document.getElementById('crumbCurrent').textContent = pageLabels[page];
    document.querySelector('.sidebar').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-go]');
    if (link) navigate(link.dataset.go);
  });
  navItems.forEach(item => item.addEventListener('click', () => navigate(item.dataset.page)));
  document.getElementById('menuBtn').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));

  // Dialogs explain prototype behavior without implying a live camera or backend connection.
  const backdrop = document.getElementById('modalBackdrop');
  const showModal = (title, body, kicker = 'A LITTLE NOTE', symbol = '✳') => {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').textContent = body;
    document.getElementById('modalKicker').textContent = kicker;
    document.getElementById('modalSymbol').textContent = symbol;
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
  };
  const closeModal = () => { backdrop.classList.remove('open'); backdrop.setAttribute('aria-hidden', 'true'); };
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOkay').addEventListener('click', closeModal);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  document.getElementById('privacyMore').addEventListener('click', () => showModal('Your room stays yours.', 'This alpha uses a sample room so you can explore the experience safely. A production AR view would process camera frames on your device and never store or upload them.', 'PRIVACY, BY DESIGN', '◈'));
  document.getElementById('tourBtn').addEventListener('click', () => showModal('A tiny tour of TokoXR', 'Explore a handmade favourite in your space, make a custom arrangement, browse the weekend market, get a thoughtful gift suggestion, or help a maker create a 3D listing. Every screen here is a clickable prototype.', 'WELCOME IN', '✿'));
  document.getElementById('tutorialBtn').addEventListener('click', () => showModal('Scan in three gentle steps', 'Find soft daylight, move slowly all the way around your arrangement, and check its real height and width before publishing. This sample scan is simulated for the prototype.', 'SCAN STUDIO · QUICK GUIDE', '◉'));
  document.getElementById('languageHelp').addEventListener('click', () => showModal('Panduan Bahasa Malaysia', 'Cari tempat yang terang. Gerakkan telefon perlahan-lahan mengelilingi gubahan. Pastikan seluruh produk berada dalam bingkai, kemudian semak ukuran sebenar sebelum diterbitkan.', 'PANDUAN RINGKAS', '☼'));

  // AR sample room controls.
  document.getElementById('roomToggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const scene = document.querySelector('.room-scene');
    const alternate = button.dataset.alternate !== 'true';
    button.dataset.alternate = String(alternate);
    button.innerHTML = alternate ? '▧ &nbsp; Use cosy living room' : '▧ &nbsp; Use sample room';
    scene.style.background = alternate
      ? 'linear-gradient(180deg,#d9e2da 0,#e8e8dc 76%,#bdb4a3 76%,#b9ad99 100%)'
      : 'linear-gradient(180deg,#e7e4db 0,#ece9e0 76%,#d7d0c1 76%,#c9c0ae 100%)';
    showToast(alternate ? 'Sample room changed' : 'Back to the bright sample room');
  });
  document.getElementById('shareAr').addEventListener('click', () => showToast('Preview link copied (demo)'));
  document.getElementById('arAdd').addEventListener('click', () => showModal('Lovely choice.', 'The Sunday Bunch is in your bag. In a real order, the maker confirms handmade details before you continue to payment.', 'ADDED TO YOUR BAG', '♡'));

  // Custom builder choices update the indicative price and preview accents.
  const builderState = { option: 'roses', stems: 6, color: 'blush', step: 1 };
  const baseFor = { roses: 89, tulips: 97, daisies: 94 };
  const stemMinus = document.getElementById('stemMinus');
  const stemPlus = document.getElementById('stemPlus');
  const updateBuilder = () => {
    const price = baseFor[builderState.option] + Math.max(0, builderState.stems - 6) * 3;
    document.getElementById('stemCount').textContent = builderState.stems;
    document.getElementById('builderPrice').textContent = `RM ${price}`;
    document.getElementById('builderLivePrice').textContent = `RM ${price}`;
    document.querySelectorAll('.builder-flower').forEach((flower, index) => {
      flower.style.color = builderState.color === 'blush' ? ['#e3b5aa','#e5d59f','#efcec2','#d9a69f'][index] : builderState.color;
      flower.textContent = builderState.option === 'daisies' ? '✿' : '✿';
    });
  };
  document.querySelectorAll('.option-row').forEach(row => row.addEventListener('click', () => {
    document.querySelectorAll('.option-row').forEach(item => item.classList.remove('selected'));
    row.classList.add('selected'); builderState.option = row.dataset.option; updateBuilder();
  }));
  stemMinus.addEventListener('click', () => { builderState.stems = Math.max(3, builderState.stems - 1); updateBuilder(); });
  stemPlus.addEventListener('click', () => { builderState.stems = Math.min(12, builderState.stems + 1); updateBuilder(); });
  const colors = { blush: ['#e3b5aa','#e5d59f','#efcec2','#d9a69f'], butter: ['#e9d58e','#f0dfad','#e7c979','#f3e9c6'], lilac: ['#c4b2d2','#e5d59f','#bba7ce','#dacbe4'], meadow: ['#9caa82','#e5d59f','#b4bc91','#879a75'] };
  const colorLabels = { blush: 'Blush & butter', butter: 'Butter & cream', lilac: 'Soft lilac', meadow: 'Meadow green' };
  document.querySelectorAll('.swatch').forEach(swatch => swatch.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(item => item.classList.remove('active'));
    swatch.classList.add('active'); builderState.color = swatch.dataset.color;
    document.getElementById('colorName').textContent = colorLabels[builderState.color];
    document.querySelectorAll('.builder-flower').forEach((flower, index) => flower.style.color = colors[builderState.color][index]);
  }));
  document.querySelectorAll('.builder-step').forEach(step => step.addEventListener('click', () => {
    builderState.step = Number(step.dataset.step);
    document.querySelectorAll('.builder-step').forEach(item => item.classList.toggle('current', item === step));
    document.getElementById('stepNumber').textContent = builderState.step;
    const headings = ['Choose your blooms','Choose your colours','Wrap it with love','Add a little note'];
    const descriptions = ['Pick the flowers that feel like you.','A palette for your special moment.','Finish it with a vase or wrapping.','A few words make it yours.'];
    const heading = document.querySelector('.option-heading h2');
    const desc = document.querySelector('.option-heading p');
    heading.textContent = headings[builderState.step - 1]; desc.textContent = descriptions[builderState.step - 1];
  }));
  document.getElementById('builderNext').addEventListener('click', () => {
    if (builderState.step < 4) {
      document.querySelector(`.builder-step[data-step="${builderState.step + 1}"]`).click();
      showToast(['','Flowers chosen — looking lovely!','Colours saved to your preview.','Wrapping preference noted.'][builderState.step]);
    } else {
      const note = document.getElementById('noteInput').value.trim();
      showModal('Your arrangement is ready.', `Your ${builderState.stems}-stem ${colorLabels[builderState.color].toLowerCase()} arrangement is RM ${document.getElementById('builderPrice').textContent.replace('RM ','')}. The maker will confirm your ${note ? 'message card' : 'design'} before payment.`, 'CUSTOM ORDER · INDICATIVE', '✿');
    }
  });

  // Seller scan progress is illustrative; no camera is requested.
  document.getElementById('scanButton').addEventListener('click', event => {
    const value = document.getElementById('coverageValue');
    const bar = document.querySelector('.coverage i');
    const current = Number(value.textContent.replace('%',''));
    if (current < 100) {
      const next = Math.min(100, current + 16);
      value.textContent = `${next}%`; bar.style.width = `${next}%`;
      event.currentTarget.innerHTML = next === 100 ? 'Review dimensions <span>→</span>' : 'Continue scan <span>→</span>';
      showToast(next === 100 ? 'Great coverage — ready for a quality check.' : `Capture coverage: ${next}%`);
    } else {
      showModal('A lovely scan.', 'Sample quality score: 92/100 · Good detail. Add the seller-confirmed dimensions (24 cm tall × 18 cm wide), then review the model before publishing.', 'MODEL READY · DEMO', '✓');
    }
  });

  // Bazaar actions and maker cards.
  document.getElementById('vrMode').addEventListener('click', () => showModal('Take a little wander.', 'Immersive mode is represented as a visual demo here. The real bazaar is phone-first, with optional headset support, seated mode, and teleport movement.', 'VIRTUAL BAZAAR', '⌘'));
  document.getElementById('enterMarket').addEventListener('click', () => showModal('Welcome to the Weekend Garden Market', 'You arrive at the Blomistry booth. Browse hand-tied blooms, visit other local makers, or open a piece to see its true size in your own space.', '12 MAKERS · OPEN UNTIL 9 PM', '✿'));
  document.querySelectorAll('.maker-card').forEach(card => card.addEventListener('click', () => showToast(`${card.dataset.maker} booth selected`)));
  document.getElementById('marketSearch').addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) showToast(`Showing makers for “${event.currentTarget.value.trim()}” (demo)`);
  });
  document.querySelector('.market-search kbd').addEventListener('click', () => document.getElementById('marketSearch').focus());

  // Advisor uses a transparent catalogue-only demo dataset.
  const advisor = { occasion: 'Birthday', space: 'Small shelf' };
  document.querySelectorAll('[data-group]').forEach(chip => chip.addEventListener('click', () => {
    const group = chip.dataset.group;
    document.querySelectorAll(`[data-group="${group}"]`).forEach(item => item.classList.remove('selected'));
    chip.classList.add('selected'); advisor[group] = chip.dataset.value;
  }));
  document.getElementById('photoOption').addEventListener('click', event => {
    const button = event.currentTarget; button.classList.toggle('enabled');
    if (button.classList.contains('enabled')) showModal('For this demo, we use a sample.', 'The prototype does not access or upload your photos. In the real advisor, a room image would be optional, processed on-device where possible, and deleted after use.', 'OPTIONAL ROOM PHOTO', '◈');
  });
  const picks = [
    { name:'The Sunday Bunch', price:89, reason:'A cheerful birthday pick with a true size preview for your small shelf.', art:'✿', color:'#c99188' },
    { name:'Little Sunbeam', price:68, reason:'A bright, compact arrangement that fits neatly on a desk or shelf.', art:'✳', color:'#c9ab64' },
    { name:'After the Rain', price:112, reason:'A thoughtful keepsake with a little more presence for a dining table.', art:'✿', color:'#8b9a77' }
  ];
  document.getElementById('findGift').addEventListener('click', () => {
    const budget = Number(document.getElementById('budgetSelect').value);
    const space = advisor.space || 'Small shelf';
    const filtered = picks.filter(item => item.price <= budget);
    const chosen = filtered.length ? filtered : [picks[1]];
    const row = document.getElementById('recommendationRow'); row.innerHTML = '';
    chosen.forEach((item, index) => {
      const card = document.createElement('article'); card.className = 'recommend-card';
      card.innerHTML = `<div class="recommend-art" style="color:${item.color}">${item.art}<span>◉ Try in your space</span></div><div class="recommend-copy"><b>${item.name}</b><p>${item.reason.replace('small shelf',space.toLowerCase())}</p><div><strong>RM ${item.price}</strong><button type="button">See in AR →</button></div></div>`;
      card.querySelector('button').addEventListener('click', () => navigate('ar'));
      row.appendChild(card);
    });
    document.getElementById('recommendations').classList.add('show');
    document.getElementById('recommendations').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`Thoughtful ${advisor.occasion.toLowerCase()} ideas, from maker listings.`);
  });

  document.getElementById('searchBtn').addEventListener('click', () => { navigate('bazaar'); setTimeout(() => document.getElementById('marketSearch').focus(), 150); });
  document.querySelectorAll('.orderAction').forEach(button => button.addEventListener('click', () => showModal('Order details · sample', 'Aina M. chose 6 stems in blush and butter with a custom message card. Please confirm the handmade details and due date before accepting.', 'ORDER #BX-081', '▤')));
  document.querySelectorAll('.round-control').forEach(button => button.addEventListener('click', () => showToast(button.getAttribute('aria-label') === 'Next' ? 'More handmade favourites coming soon.' : 'You’re viewing the first favourites.')));
})();
