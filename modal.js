(function() {
    'use strict';

    class NoticeBoardModal {
        constructor(config) {
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
                showDays: 1,
                target: '*',
                exclude: [],
                ...config
            };
            this.createModalElement();
            this.init();
        }

        createModalElement() {
            this.modalElement = document.createElement('div');
            this.modalElement.id = 'notice-board-modal';
            document.body.appendChild(this.modalElement);
        }

        init() {
            this.createModal();
            this.showModal();
        }

        createModal() {
            this.modalElement.className = 'notice-board-modal';
            this.modalElement.style.cssText = `
                position:fixed;
                top:0;
                left:0;
                width:100vw;
                height:100vh;
                display:flex;
                justify-content:center;
                align-items:center;
                z-index:99999;
                background-color:${this.config.backgroundColor};
                font-family:${this.config.fontFamily};
            `;

            let ctaContent = `<span class="line1">${this.config.ctaText}</span>`;
            if (this.config.ctaByline) {
                ctaContent += `<br><span class="line2">${this.config.ctaByline}</span>`;
            }

            const modalContent = `
                <div class="notice-board-modal-content" style="
                    text-align:center;
                    max-width:80%;
                    width:100%;
                    padding:2rem;
                    box-sizing:border-box;
                ">
                    <h1 style="color:${this.config.textColor};margin-bottom:1rem;font-size:3rem;">${this.config.heading}</h1>
                    <p style="color:${this.config.textColor};margin-bottom:1.5rem;font-size:1.5rem;">${this.config.bodyText}</p>
                    <button class="notice-board-modal-button" style="
                        border:none;
                        padding:${this.config.ctaByline ? '1.3rem 1.5rem' : '0.75rem 1.5rem'};
                        border-radius:4px;
                        cursor:pointer;
                        font-size:1.2rem;
                        margin-top:2rem;
                        transition:opacity 0.3s ease;
                        background-color:${this.config.ctaColor};
                        color:#ffffff;
                        text-align:center;
                        line-height:${this.config.ctaByline ? '0.75rem' : 'normal'};
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
                    font-size:1.2em;
                    font-weight:bold;
                    display:block;
                }
                .notice-board-modal-button .line2 {
                    font-size:0.8em;
                    font-style:italic;
                    display:block;
                    margin-top:0.5em;
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
            localStorage.setItem('noticeBoardModalShown', this.config.version);
            setTimeout(() => {
                localStorage.removeItem('noticeBoardModalShown');
            }, this.config.showDays * 24 * 60 * 60 * 1000);
        }

        remove() {
            this.hideModal();
            this.modalElement.remove();
            localStorage.removeItem('noticeBoardModalShown');
        }

        reinit(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.createModal();
            this.showModal();
        }
    }

    window.NoticeBoardModal = NoticeBoardModal;
})();