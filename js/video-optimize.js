document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ОРИГІНАЛЬНИЙ КОД ДЛЯ .s7 ТА .s11 (АВТОПЛЕЙ ПРИ СКРОЛІ)
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                if (!video.src && video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load(); 
                }
                video.play().catch(() => {});
            } else {
                if (!video.paused) video.pause();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.s7 video, .s11 video').forEach(v => videoObserver.observe(v));

    // 2. ОНОВЛЕНИЙ КОД ДЛЯ СЛАЙДЕРІВ
    document.addEventListener('click', (e) => {
        const sliderVideo = e.target.closest('.swiper-slide video');
        
        // Якщо клікнули не по відео у слайдері — ігноруємо
        if (!sliderVideo) return;

        /* ВАЖЛИВО: На iOS, якщо controls = true, клік по кнопці Pause 
           генерує подію безпосередньо на відео. 
           Ми дозволяємо браузеру самому обробити клік, якщо контролери вже активні.
        */
        if (sliderVideo.controls && e.target === sliderVideo) {
            // Даємо браузеру відпрацювати стандартно, не робимо preventDefault
            return; 
        }

        e.preventDefault(); 

        if (!sliderVideo.src && sliderVideo.dataset.src) {
            sliderVideo.src = sliderVideo.dataset.src;
            sliderVideo.load();
        }

        if (sliderVideo.paused) {
            // Зупиняємо всі інші відео в слайдерах
            document.querySelectorAll('.swiper-slide video').forEach(v => {
                if (v !== sliderVideo) {
                    v.pause();
                    v.controls = false;
                }
            });

            sliderVideo.muted = false;
            sliderVideo.controls = true; // Включаємо контролери
            sliderVideo.play().catch(err => console.error("Помилка відтворення:", err));
        } else {
            // Якщо відео грало і ми клацнули по ньому (не по кнопці паузи)
            sliderVideo.pause();
            // sliderVideo.controls = false; // Порада: краще не ховати контролери миттєво, щоб юзер міг натиснути Play знову
        }
    });

    // 3. ЗУПИНКА ПРИ СВАЙПІ
    const sliders = document.querySelectorAll('.swiper');
    sliders.forEach(sliderElement => {
        // Додаємо невелику затримку, щоб Swiper встиг ініціалізуватися
        const initSwiperEvents = () => {
            if (sliderElement.swiper) {
                sliderElement.swiper.on('slideChangeTransitionStart', () => {
                    document.querySelectorAll('.swiper-slide video').forEach(v => {
                        v.pause();
                        v.controls = false;
                    });
                });
            }
        };

        if (sliderElement.swiper) {
            initSwiperEvents();
        } else {
            sliderElement.addEventListener('swiper:init', initSwiperEvents);
        }
    });
});