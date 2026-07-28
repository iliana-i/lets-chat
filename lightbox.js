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

  var inner = overlay.querySelector('.image-lightbox__inner');
  var closeBtn = overlay.querySelector('.image-lightbox__close');
  var lastFocus = null;

  function resetInner(){
    inner.classList.remove('is-stack');
    inner.innerHTML = '<img class="image-lightbox__img" alt="">';
  }

  function getLightboxImg(){
    return inner.querySelector('.image-lightbox__img');
  }

  function openLightbox(img){
    resetInner();
    lastFocus = document.activeElement;
    var lightboxImg = getLightboxImg();
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function openLightboxStack(stack){
    var imgs = stack.querySelectorAll('img');
    if(!imgs.length) return;
    lastFocus = document.activeElement;
    inner.classList.add('is-stack');
    inner.innerHTML = '';
    imgs.forEach(function(img){
      var el = document.createElement('img');
      el.className = 'image-lightbox__img';
      el.src = img.currentSrc || img.src;
      el.alt = img.alt || '';
      inner.appendChild(el);
    });
    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function closeLightbox(){
    overlay.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    resetInner();
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  closeBtn.addEventListener('click', function(e){
    e.stopPropagation();
    closeLightbox();
  });

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeLightbox();
  });

  inner.addEventListener('click', function(e){
    e.stopPropagation();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
  });

  document.querySelectorAll('[data-lightbox-stack]').forEach(function(stack){
    stack.classList.add('is-expandable');
    stack.querySelectorAll('.figure-img').forEach(function(wrap){
      wrap.classList.add('is-expandable');
    });
    stack.addEventListener('click', function(e){
      if(e.target.closest('.figure-img, img')) openLightboxStack(stack);
    });
  });

  document.querySelectorAll(SELECTORS).forEach(function(img){
    if(img.closest('.project-row--link')) return;
    if(img.closest('[data-lightbox-stack]')) return;
    var wrap = img.closest('.figure-img, .hero-figure, .hero-image, .project-visual');
    if(wrap) wrap.classList.add('is-expandable');
    img.addEventListener('click', function(){
      openLightbox(img);
    });
  });
})();
