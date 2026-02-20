// Дебounce для оптимизации производительности
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// НАВИГАЦИЯ СКРОЛЛ
window.addEventListener('scroll', debounce(() => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10));

// МОБИЛЬНОЕ МЕНЮ
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            body.style.overflow = 'hidden'; // Блокируем скролл
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            body.style.overflow = '';
        }
    });
}

// ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ НА ССЫЛКУ
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Закрываем меню
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            body.style.overflow = '';
            
            // Плавный скролл
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ ВНЕ ЕГО
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !menuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        body.style.overflow = '';
    }
});

// АНИМАЦИЯ ПОЯВЛЕНИЯ С ПОДДЕРЖКОЙ ПРОИЗВОДИТЕЛЬНОСТИ
const fadeElements = document.querySelectorAll('.fade-up');

// Используем Intersection Observer для лучшей производительности
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Можно отписаться после появления для экономии ресурсов
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    observer.observe(element);
});

// ОБРАБОТКА ФОРМЫ
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name || !email || !message) {
            showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        if (!emailRegex.test(email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }
        
        if (message.length < 10) {
            showNotification('Сообщение должно содержать минимум 10 символов', 'error');
            return;
        }
        
        // Здесь можно добавить отправку на сервер
        showNotification('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.', 'success');
        this.reset();
    });
}

// Функция показа уведомлений
function showNotification(message, type) {
    // Проверяем, существует ли уже уведомление
    let notification = document.querySelector('.notification');
    
    if (notification) {
        notification.remove();
    }
    
    // Создаем новое уведомление
    notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'var(--secondary)' : '#ef4444'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 90%;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        style.textContent += `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--primary)';
                }
            });
        }
    });
}

window.addEventListener('scroll', debounce(highlightNavigation, 50));

// ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ЭКРАНА
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// ПОДДЕРЖКА TOUCH-СОБЫТИЙ
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (navLinks.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

// ПРОВЕРКА НАЛИЧИЯ ТАЧ-ЭКРАНА
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// ОПТИМИЗАЦИЯ ЗАГРУЗКИ
document.addEventListener('DOMContentLoaded', () => {
    // Предзагрузка изображений (если есть)
    if ('connection' in navigator && navigator.connection.saveData === true) {
        // Режим экономии трафика
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.setAttribute('loading', 'eager');
        });
    }
    
    // Проверка поддержки webp
    const webpCheck = new Image();
    webpCheck.onload = function() {
        document.body.classList.add('webp-supported');
    };
    webpCheck.onerror = function() {
        document.body.classList.add('webp-not-supported');
    };
    webpCheck.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
});

// ИНИЦИАЛИЗАЦИЯ
highlightNavigation();
