(function(){
  var SELECTORS = [
    '.figure-img img',
    '.hero-figure img',
    '.hero-image img',
    '.project-visual img'
  ].join(', ');

  var overlay = document.createElement('div');
  overlay.className = 'image-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Expanded image');
  overlay.innerHTML =
    '<button type="button" class="image-lightbox__close">Close ✕</button>' +
    '<div class="image-lightbox__inner"><img class="image-lightbox__img" alt=""></div>';
  document.body.appendChild(overlay);

  var lightboxImg = overlay.querySelector('.image-lightbox__img');
  var closeBtn = overlay.querySelector('.image-lightbox__close');
  var lastFocus = null;

  function openLightbox(img){
    lastFocus = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function closeLightbox(){
    overlay.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    lightboxImg.removeAttribute('src');
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  closeBtn.addEventListener('click', function(e){
    e.stopPropagation();
    closeLightbox();
  });

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeLightbox();
  });

  overlay.querySelector('.image-lightbox__inner').addEventListener('click', function(e){
    e.stopPropagation();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
  });

  document.querySelectorAll(SELECTORS).forEach(function(img){
    if(img.closest('.project-row--link')) return;
    var wrap = img.closest('.figure-img, .hero-figure, .hero-image, .project-visual');
    if(wrap) wrap.classList.add('is-expandable');
    img.addEventListener('click', function(){
      openLightbox(img);
    });
  });
})();
