(function() {
    let instance = null;

    class NoticeBoardModal {
        constructor(config) {
            if (instance) {
                instance.reinit(config);
                return instance;
            }
    
            this.config = {
                fontFamily: 'Arial, sans-serif',
                heading: 'Notice',
                bodyText: 'Important information will be displayed here.',
                ctaText: 'Acknowledge',
                ctaByline: '',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                textColor: '#ffffff',
                ctaColor: '#007bff',
                version: '1.0',
                showDays: 7,
                target: '*',
                exclude: [],
                callback: null,
                skipForCrawlers: true,
                ...config
            };
    
            if (this.shouldShowModal()) {
                this.createModalElement();
                this.createModal();
                this.showModal();
            }
    
            instance = this;
        }

        shouldShowModal() {
            // Check for crawlers first
            if (this.config.skipForCrawlers && this.isCrawler()) {
                return false;
            }
        
            const modalLastShown = localStorage.getItem(`noticeBoardModalLastShown_v${this.config.version}`);
            if (modalLastShown) {
                const daysSinceLastShown = (Date.now() - parseInt(modalLastShown)) / (1000 * 60 * 60 * 24);
                if (daysSinceLastShown < this.config.showDays) {
                    return false;
                }
            }

            const currentPath = window.location.pathname.toLowerCase();
            const currentPage = currentPath.split('/').pop();

            // More liberal exclude matching
            const isExcluded = this.config.exclude.some(excludePath => {
                excludePath = excludePath.toLowerCase();
                return currentPath.includes(excludePath) ||
                       currentPage.includes(excludePath) ||
                       (excludePath.endsWith('.html') && currentPage === excludePath) ||
                       (excludePath.startsWith('/') && currentPath.startsWith(excludePath));
            });

            if (isExcluded) return false;

            // Check if current path matches the target
            if (this.config.target === '*') {
                return true;
            } else if (this.config.target === '/') {
                return currentPath === '/' || currentPath === '';
            } else {
                return currentPath.startsWith(this.config.target.toLowerCase());
            }
        }
            
        isCrawler() {
            const crawlers = [
                'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
                'baiduspider', 'facebookexternalhit', 'twitterbot', 'rogerbot',
                'linkedinbot', 'embedly', 'quora link preview', 'showyoubot',
                'outbrain', 'pinterest', 'slackbot', 'vkShare', 'W3C_Validator'
            ];
            const userAgent = navigator.userAgent.toLowerCase();
            return crawlers.some(crawler => userAgent.indexOf(crawler) !== -1);
        }

        createModalElement() {
            this.modalElement = document.createElement('div');
            this.modalElement.id = 'notice-board-modal';
            document.body.appendChild(this.modalElement);
        }

        createModal() {
            this.modalElement.className = 'notice-board-modal';
            this.modalElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                background-color: ${this.config.backgroundColor};
                font-family: ${this.config.fontFamily};
                font-size: clamp(22px, 3vw, 48px);
            `;
    
            let ctaContent = `<span class="line1">${this.config.ctaText}</span>`;
            if (this.config.ctaByline) {
                ctaContent += `<br><span class="line2">${this.config.ctaByline}</span>`;
            }
    
            // Replace \n with <br> for line breaks in body text
            const bodyTextWithBreaks = this.config.bodyText.replace(/\n/g, '<br>');
    
            const modalContent = `
                <div class="notice-board-modal-content" style="
                    text-align: center;
                    max-width: 80%;
                    width: 100%;
                    padding: 2em;
                    box-sizing: border-box;
                ">
                    <h1 style="color: ${this.config.textColor}; margin-bottom: 0.5em; font-size: 2em;">${this.config.heading}</h1>
                    <p style="color: ${this.config.textColor}; margin-bottom: 1em; font-size: 1em; text-align: center; line-height: 1.4;">${bodyTextWithBreaks}</p>
                    <button class="notice-board-modal-button" style="
                        border: none;
                        padding: ${this.config.ctaByline ? '0.8em 1em' : '0.5em 1em'};
                        border-radius: 0.25em;
                        cursor: pointer;
                        font-size: 1em;
                        margin-top: 1em;
                        transition: opacity 0.3s ease;
                        background-color: ${this.config.ctaColor};
                        color: #ffffff;
                        text-align: center;
                        line-height: ${this.config.ctaByline ? '1.2' : 'normal'};
                    ">${ctaContent}</button>
                </div>
            `;
            this.modalElement.innerHTML = modalContent;
            const button = this.modalElement.querySelector('button');
            button.addEventListener('click', () => this.handleAction());
            button.addEventListener('mouseover', () => button.style.opacity = '0.9');
            button.addEventListener('mouseout', () => button.style.opacity = '1');
    
            const style = document.createElement('style');
            style.textContent = `
                .notice-board-modal-button .line1 {
                    font-size: 1.2em;
                    font-weight: bold;
                    display: block;
                }
                .notice-board-modal-button .line2 {
                    font-size: 0.8em;
                    font-style: italic;
                    display: block;
                    margin-top: 0.2em;
                }
            `;
            document.head.appendChild(style);
        }

        showModal() {
            this.modalElement.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        hideModal() {
            this.modalElement.style.display = 'none';
            document.body.style.overflow = '';
        }

        handleAction() {
            this.hideModal();
            localStorage.setItem(`noticeBoardModalLastShown_v${this.config.version}`, Date.now().toString());
            if (typeof this.config.callback === 'function') {
                this.config.callback();
            }
        }

        remove() {
            if (this.modalElement) {
                this.hideModal();
                this.modalElement.remove();
            }
        }

        reinit(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.remove();
            if (this.shouldShowModal()) {
                this.createModalElement();
                this.createModal();
                this.showModal();
            }
        }
    }

    // Make NoticeBoardModal available globally
    window.NoticeBoardModal = NoticeBoardModal;

    // Auto-initialization
    let autoInitAttempted = false;
    document.addEventListener('DOMContentLoaded', function() {
        if (!autoInitAttempted && !instance) {
            new NoticeBoardModal();
        }
        autoInitAttempted = true;
    });

    // Allow for immediate manual initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            autoInitAttempted = true;
        });
    } else {
        autoInitAttempted = true;
    }
})();
