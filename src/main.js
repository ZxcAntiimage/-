const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('header__nav--open');
  });
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('header__nav--open')) {
      mainNav.classList.remove('header__nav--open');
    }
  });
  const navLinks = mainNav.querySelectorAll('.header__nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('header__nav--open');
    });
  });
}
(function() {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const paginationContainer = document.getElementById('paginationNumbers');
  
  if (!track || !prevBtn || !nextBtn || !paginationContainer) return;
  
  const cards = Array.from(track.children);
  const totalCards = cards.length;
  let currentIndex = 0;
  let isTransitioning = false;
  
  function getCardWidth() {
    return cards[0]?.offsetWidth || track.parentElement.offsetWidth;
  }
  
  function updateCarousel() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const cardWidth = getCardWidth();
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    
    document.querySelectorAll('.pagination__number').forEach((btn, idx) => {
      if (idx === currentIndex) {
        btn.classList.add('pagination__number--active');
        btn.classList.remove('bg-white', 'text-[#263573]');
      } else {
        btn.classList.remove('pagination__number--active');
        btn.classList.add('bg-white', 'text-[#263573]');
      }
    });
    
    setTimeout(() => {
      isTransitioning = false;
    }, 300);
  }
  
  function updatePaginationButtons() {
    let buttonsHtml = '';
    for (let i = 0; i < totalCards; i++) {
      const activeClass = i === currentIndex ? 'pagination__number--active bg-gradient-to-r from-[#ff4d4d] to-[#d11717] text-white' : 'bg-white text-[#263573]';
      buttonsHtml += `<button class="pagination__number w-[40px] h-[40px] rounded-full shadow-md hover:bg-gradient-to-r from-[#ff4d4d] to-[#d11717] hover:text-white transition-all duration-300 cursor-pointer border border-gray-200 font-medium ${activeClass}" data-index="${i}">${i + 1}</button>`;
    }
    paginationContainer.innerHTML = buttonsHtml;
    
    document.querySelectorAll('.pagination__number').forEach(btn => {
      btn.addEventListener('click', () => {
        if (isTransitioning) return;
        const newIndex = parseInt(btn.dataset.index);
        if (newIndex !== currentIndex) {
          currentIndex = newIndex;
          updateCarousel();
          updatePaginationButtons();
        }
      });
    });
  }
  
  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      updatePaginationButtons();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    if (currentIndex < totalCards - 1) {
      currentIndex++;
      updateCarousel();
      updatePaginationButtons();
    }
  });
  
  window.addEventListener('resize', () => {
    setTimeout(() => {
      const cardWidth = getCardWidth();
      track.style.transition = 'none';
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      setTimeout(() => {
        track.style.transition = 'transform 0.3s ease-in-out';
      }, 10);
    }, 100);
  });
  
  updatePaginationButtons();
  updateCarousel();
})();
(function() {
  const modal = document.getElementById('orderModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const orderForm = document.getElementById('orderForm');
  const formMessage = document.getElementById('formMessage');
  
  function openModal() {
    if (modal) {
      modal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';
      if (formMessage) formMessage.classList.add('hidden');
    }
  }
  
  function closeModal() {
    if (modal) {
      modal.classList.remove('modal--open');
      document.body.style.overflow = '';
      if (orderForm) orderForm.reset();
    }
  }
  
  document.querySelectorAll('.price-card__order-btn, .benefits__order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });
  
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });
  
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(orderForm);
      const name = formData.get('name');
      const phone = formData.get('phone');
      
      if (!name || !phone) {
        showMessage('Please fill in all fields', 'error');
        return;
      }
      
      showMessage('Sending...', 'loading');
      
      try {
        const response = await fetch('/order.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            name: name,
            phone: phone,
            sub1: getQueryParam('sub1') || '',
            sub2: getQueryParam('sub2') || ''
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showMessage('Order submitted successfully! We will contact you soon.', 'success');
          setTimeout(() => {
            closeModal();
          }, 2000);
        } else {
          showMessage(result.error || 'Something went wrong. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
      }
    });
  }
  
  function showMessage(msg, type) {
    if (formMessage) {
      formMessage.textContent = msg;
      formMessage.classList.remove('hidden', 'modal__message--success', 'modal__message--error', 'modal__message--loading');
      formMessage.classList.add(`modal__message--${type}`);
    }
  }
  
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
})();
