document.addEventListener('DOMContentLoaded', () => {
    
    // ==============================================================
    // 1. ОРИГІНАЛЬНИЙ КОД ДЛЯ .s7 (АВТОПЛЕЙ ПРИ СКРОЛІ)
    // ==============================================================
    const s7Videos = document.querySelectorAll('.s7 video');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                if (!video.src && video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load(); 
                }
                
                video.play().catch(error => {
                    console.log("Автоплей заблоковано браузером (s7)");
                });
            } else {
                if (video.src && !video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        threshold: 0.5
    });

    s7Videos.forEach(video => {
        videoObserver.observe(video);
    });

    // ==============================================================
    // 1.1 ДОДАТКОВИЙ БЛОК ДЛЯ .s11 (ТОЧНО ТАКА Ж ЛОГІКА)
    // ==============================================================
    const s11Videos = document.querySelectorAll('.s11 video');

    s11Videos.forEach(video => {
        videoObserver.observe(video);
    });

    // ==============================================================
    // 2. ІЗОЛЬОВАНИЙ КОД ДЛЯ СЛАЙДЕРІВ (СТРОГИЙ КОНТРОЛЬ ОДНОГО ВІДЕО)
    // ==============================================================
    document.addEventListener('click', (e) => {
        const sliderVideo = e.target.closest('.swiper-slide video');
        
        if (sliderVideo) {
            e.preventDefault(); 

            if (!sliderVideo.src && sliderVideo.dataset.src) {
                sliderVideo.src = sliderVideo.dataset.src;
                sliderVideo.load();
            }

            if (sliderVideo.paused) {
                document.querySelectorAll('.swiper-slide video').forEach(v => {
                    if (v !== sliderVideo) {
                        if (!v.paused) {
                            v.pause();
                        }
                        v.controls = false;
                    }
                });

                sliderVideo.muted = false;
                sliderVideo.controls = true;
                sliderVideo.play().catch(err => console.error("Помилка відтворення:", err));
            } else {
                sliderVideo.pause();
                sliderVideo.controls = false;
            }
        }
    });

    // ==============================================================
    // 3. ЗУПИНКА ТА СКРИТТЯ КОНТРОЛЕРІВ ПРИ СВАЙПІ
    // ==============================================================
    const sliders = document.querySelectorAll('.swiper');
    sliders.forEach(sliderElement => {
        if (sliderElement.swiper) {
            sliderElement.swiper.on('slideChangeTransitionStart', () => {
                document.querySelectorAll('.swiper-slide video').forEach(v => {
                    if (!v.paused) {
                        v.pause();
                    }
                    v.controls = false;
                });
            });
        }
    });

});