document.addEventListener('DOMContentLoaded', () => {

    // ==============================================================
    // КОНФІГУРАЦІЯ
    // ==============================================================
    const AUTOPLAY_THRESHOLD = 0.5;
    const LAZY_THRESHOLD = 0.01;

    // ==============================================================
    // 1. ЛЕНИВОЕ ЗАВАНТАЖЕННЯ для .s7 та .s11
    // ==============================================================
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const video = entry.target;

            if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
                video.preload = 'metadata';
                video.load();
            }

            lazyObserver.unobserve(video);
        });
    }, {
        threshold: LAZY_THRESHOLD,
        rootMargin: '200px 0px'
    });

    // ==============================================================
    // 2. АВТОПЛЕЙ для .s7 та .s11
    // ==============================================================
    const autoplayObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (video.closest('.swiper-slide')) return;

            if (entry.isIntersecting) {
                const tryPlay = () => {
                    video.play().catch(() => console.log('Автоплей заблоковано'));
                };
                if (video.readyState >= 2) {
                    tryPlay();
                } else {
                    video.addEventListener('canplay', tryPlay, { once: true });
                }
            } else {
                if (!video.paused) video.pause();
            }
        });
    }, { threshold: AUTOPLAY_THRESHOLD });

    document.querySelectorAll('.s7 video, .s11 video').forEach(video => {
        lazyObserver.observe(video);
        autoplayObserver.observe(video);
    });

    // ==============================================================
    // 3. СЛАЙДЕР — логіка кліку
    // ==============================================================
    document.querySelectorAll('.swiper-slide video').forEach(video => {
        video.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Якщо src ще не встановлений — завантажуємо
            if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
                video.load();
            }

            if (!video.controls) {
                // Перший клік — вмикаємо controls і запускаємо
                document.querySelectorAll('.swiper-slide video').forEach(v => {
                    if (v !== video) {
                        v.pause();
                        v.controls = false;
                    }
                });

                video.muted = false;
                video.controls = true;

                const tryPlay = () => {
                    video.play().catch(err => console.error('Помилка:', err));
                };
                if (video.readyState >= 2) {
                    tryPlay();
                } else {
                    video.addEventListener('canplay', tryPlay, { once: true });
                }

            } else {
                // Controls вже є — toggle play/pause
                if (video.paused) {
                    video.play().catch(err => console.error('Помилка:', err));
                } else {
                    video.pause();
                }
            }
        }, true); // capture — перехоплюємо до браузера
    });

    // ==============================================================
    // 4. ЗУПИНКА ПРИ СВАЙПІ
    // ==============================================================
    const initSwiperListeners = () => {
        document.querySelectorAll('.swiper').forEach(sliderElement => {
            if (sliderElement.swiper && !sliderElement._videoHandlerAttached) {
                sliderElement._videoHandlerAttached = true;

                sliderElement.swiper.on('slideChangeTransitionStart', () => {
                    document.querySelectorAll('.swiper-slide video').forEach(v => {
                        if (!v.paused) v.pause();
                        v.controls = false;
                    });
                });
            }
        });
    };

    initSwiperListeners();
    setTimeout(initSwiperListeners, 500);
    setTimeout(initSwiperListeners, 1500);
});