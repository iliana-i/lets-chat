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
    '<button type="button" class="image-lightbox__close" aria-label="Close">' +
      '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
        '<path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '</svg>' +
    '</button>' +
    '<button type="button" class="image-lightbox__nav image-lightbox__nav--prev" aria-label="Previous image">' +
      '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
        '<path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</button>' +
    '<button type="button" class="image-lightbox__nav image-lightbox__nav--next" aria-label="Next image">' +
      '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
        '<path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</button>' +
    '<div class="image-lightbox__inner"><img class="image-lightbox__img" alt=""></div>';
  document.body.appendChild(overlay);

  var inner = overlay.querySelector('.image-lightbox__inner');
  var closeBtn = overlay.querySelector('.image-lightbox__close');
  var prevBtn = overlay.querySelector('.image-lightbox__nav--prev');
  var nextBtn = overlay.querySelector('.image-lightbox__nav--next');
  var lastFocus = null;
  var galleryImages = [];
  var galleryIndex = -1;

  function resetInner(){
    inner.classList.remove('is-stack');
    inner.innerHTML = '<img class="image-lightbox__img" alt="">';
  }

  function getLightboxImg(){
    return inner.querySelector('.image-lightbox__img');
  }

  function updateGalleryNav(){
    var hasGallery = galleryImages.length > 1;
    overlay.classList.toggle('has-gallery', hasGallery);
    if(!hasGallery){
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }
    prevBtn.hidden = galleryIndex <= 0;
    nextBtn.hidden = galleryIndex >= galleryImages.length - 1;
  }

  function showGallerySlide(index){
    if(!galleryImages.length) return;
    galleryIndex = Math.max(0, Math.min(index, galleryImages.length - 1));
    var img = galleryImages[galleryIndex];
    var lightboxImg = getLightboxImg();
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    updateGalleryNav();
  }

  function openLightbox(img){
    galleryImages = [];
    galleryIndex = -1;
    resetInner();
    lastFocus = document.activeElement;
    var lightboxImg = getLightboxImg();
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    updateGalleryNav();
    closeBtn.focus();
  }

  function openLightboxGallery(images, startIndex){
    galleryImages = images;
    resetInner();
    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    showGallerySlide(startIndex);
    closeBtn.focus();
  }

  function openLightboxStack(stack){
    galleryImages = [];
    galleryIndex = -1;
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
    updateGalleryNav();
    closeBtn.focus();
  }

  function closeLightbox(){
    overlay.classList.remove('is-open', 'has-gallery');
    document.body.classList.remove('lightbox-open');
    galleryImages = [];
    galleryIndex = -1;
    resetInner();
    updateGalleryNav();
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function stepGallery(delta){
    if(galleryImages.length <= 1) return;
    var nextIndex = galleryIndex + delta;
    if(nextIndex < 0 || nextIndex >= galleryImages.length) return;
    showGallerySlide(nextIndex);
  }

  closeBtn.addEventListener('click', function(e){
    e.stopPropagation();
    closeLightbox();
  });

  prevBtn.addEventListener('click', function(e){
    e.stopPropagation();
    stepGallery(-1);
  });

  nextBtn.addEventListener('click', function(e){
    e.stopPropagation();
    stepGallery(1);
  });

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeLightbox();
  });

  inner.addEventListener('click', function(e){
    e.stopPropagation();
  });

  document.addEventListener('keydown', function(e){
    if(!overlay.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeLightbox();
    else if(e.key === 'ArrowLeft') stepGallery(-1);
    else if(e.key === 'ArrowRight') stepGallery(1);
  });

  document.querySelectorAll('[data-lightbox-gallery]').forEach(function(gallery){
    var imgs = Array.from(gallery.querySelectorAll(SELECTORS));
    if(!imgs.length) return;

    imgs.forEach(function(img){
      var wrap = img.closest('.figure-img, .hero-figure, .hero-image, .project-visual');
      if(wrap) wrap.classList.add('is-expandable');
      img.addEventListener('click', function(e){
        e.stopPropagation();
        openLightboxGallery(imgs, imgs.indexOf(img));
      });
    });

    gallery.querySelectorAll('[data-lightbox-stack]').forEach(function(stack){
      stack.classList.add('is-expandable');
      stack.querySelectorAll('.figure-img').forEach(function(wrap){
        wrap.classList.add('is-expandable');
      });
    });
  });

  document.querySelectorAll('[data-lightbox-stack]').forEach(function(stack){
    if(stack.closest('[data-lightbox-gallery]')) return;
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
    if(img.closest('[data-lightbox-gallery]')) return;
    var wrap = img.closest('.figure-img, .hero-figure, .hero-image, .project-visual');
    if(wrap) wrap.classList.add('is-expandable');
    img.addEventListener('click', function(){
      openLightbox(img);
    });
  });

  updateGalleryNav();
})();
