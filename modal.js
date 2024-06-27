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
        if (this.shouldShowModal()) {
            this.createModalElement();
            this.init();
        }
    }

    shouldShowModal() {
        const modalShown = localStorage.getItem('noticeBoardModalShown');
        if (modalShown === this.config.version) return false;

        const currentPath = window.location.pathname;
        
        // Check if current path is in the exclude list
        if (this.config.exclude.some(path => currentPath.startsWith(path))) {
            return false;
        }

        // Check if current path matches the target
        if (this.config.target === '*') {
            return true;
        } else if (this.config.target === '/') {
            return currentPath === '/';
        } else {
            return currentPath.startsWith(this.config.target);
        }
    }

    // ... rest of the class implementation ...
}
