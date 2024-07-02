# Noticeboard Modal

Noticeboard Modal is a lightweight, customizable full-screen modal for displaying important notices, announcements, or CTAs on your website. It's easy to integrate, highly configurable, and designed for production use.

## Features

- Full-screen modal with customizable content
- Configurable appearance (colors, fonts, text)
- Optional byline for CTA button
- Ability to show/hide based on user interaction
- Remembers user acknowledgment using localStorage
- Easy to remove or reinitialize with new content
- Production-ready with minimal footprint
- Option to skip display for web crawlers to improve SEO
- Version-specific display control to ensure users see updated content

## Installation

Add the following script tag to your HTML file, preferably just before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/harryfear/noticeboard-modal@latest/modal.min.js"></script>
```

Using `@latest` ensures that you always get the most recent version of the script. However, be aware that this might occasionally introduce breaking changes. If you need to lock to a specific version for stability, replace `@latest` with a specific version number (e.g., `@1.7.0`).

## Usage

To initialize the modal:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const modal = new NoticeBoardModal({
        heading: 'Welcome to Our Site!',
        bodyText: 'We have some important information for you.\nThanks!',
        ctaText: 'Get Started',
        ctaByline: 'Limited Time Offer',
        backgroundColor: 'rgba(0, 0, 128, 0.9)',
        textColor: '#ffffff',
        ctaColor: '#FFA500',
        version: '1.0',
        target: '*',
        exclude: ['/privacy', '/terms'],
        callback: function() {
            console.log('User interacted with the modal');
            // Perform any action after user interaction
        }
    });
});
```

In this above example, the modal will show on all pages except those starting with '/privacy' or '/terms'.

To reinitialize the modal with new content:

```javascript
modal.reinit({
    heading: 'New Update!',
    bodyText: 'We have updated our terms of service.',
    ctaText: 'Review',
    ctaByline: 'Click to read',
    backgroundColor: 'rgba(0, 128, 0, 0.9)',
    version: '1.1'
});
```

## Configuration Options

| Option           | Type     | Default                                          | Description                                           |
|------------------|----------|--------------------------------------------------|-------------------------------------------------------|
| fontFamily       | string   | 'Arial, sans-serif'                              | Font family for the modal content                     |
| heading          | string   | 'Notice'                                         | Modal heading text                                    |
| bodyText         | string   | 'Important information will be displayed here.'  | Modal body text (break lines with `\n`                |
| ctaText          | string   | 'Acknowledge'                                    | Text for the call-to-action button                    |
| ctaByline        | string   | ''                                               | Optional byline text for the CTA button               |
| backgroundColor  | string   | 'rgba(0, 0, 0, 0.9)'                             | Background color of the modal                         |
| textColor        | string   | '#ffffff'                                        | Color of the text content                             |
| ctaColor         | string   | '#007bff'                                        | Background color of the call-to-action button         |
| version          | string   | '1.0'                                            | Version string for tracking acknowledgments           |
| showDays         | number   | 1                                                | Number of days to remember user acknowledgment        |
| target           | string   | '*'                                              | URL pattern to show the modal on ('*' for all pages, '/' for homepage only) |
| exclude          | array    | []                                               | Array of URL patterns to exclude from showing the modal |
| callback         | function | null                                             | Function to call after user interacts with the modal  |
| skipForCrawlers  | boolean  | true                                             | Whether to skip showing the modal for web crawlers    |

## Methods

- `reinit(newConfig)`: Reinitialize the modal with new configuration options
- `remove()`: Remove the modal from the DOM and clear localStorage

## Screenshots

### Screenshot 1
![Screenshot 1](/screen-init.png)

### Screenshot 2
![Screenshot 2](/screen-reinit.png)

## WordPress Integration

To use NoticeBoard Modal in WordPress, you can choose one of the following methods. Both snippets can be added either to your theme's `functions.php` file or used with a code snippet plugin like "Code Snippets".

### Method 1: Using wp_enqueue_scripts

This method uses WordPress's recommended way of enqueuing scripts:

```php
function enqueue_noticeboard_modal() {
    wp_enqueue_script('noticeboard-modal', 'https://cdn.jsdelivr.net/gh/harryfear/noticeboard-modal@latest/modal.min.js', array(), null, true);

    wp_add_inline_script('noticeboard-modal', '
        document.addEventListener("DOMContentLoaded", function() {
            new NoticeBoardModal({
                heading: "Welcome to ' . get_bloginfo('name') . '!",
                bodyText: "We have some important information for you.",
                ctaText: "Get Started",
                ctaByline: "Limited Time Offer",
                backgroundColor: "rgba(0, 0, 128, 0.9)",
                textColor: "#ffffff",
                ctaColor: "#FFA500",
                version: "1.0"
            });
        });
    ');
}
add_action('wp_enqueue_scripts', 'enqueue_noticeboard_modal');
```

### Method 2: Using wp_head

This method directly inserts the script in the `<head>` section:

```php
function insert_noticeboard_modal() {
    ?>
    <script src="https://cdn.jsdelivr.net/gh/harryfear/noticeboard-modal@latest/modal.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            new NoticeBoardModal({
                heading: "Welcome to <?php echo esc_js(get_bloginfo('name')); ?>!",
                bodyText: "We have some important information for you.",
                ctaText: "Get Started",
                ctaByline: "Limited Time Offer",
                backgroundColor: "rgba(0, 0, 128, 0.9)",
                textColor: "#ffffff",
                ctaColor: "#FFA500",
                version: "1.0"
            });
        });
    </script>
    <?php
}
add_action('wp_head', 'insert_noticeboard_modal');
```

Choose the method that best fits your WordPress setup and requirements. The `wp_enqueue_scripts` method is generally recommended for better performance and compatibility with caching plugins, but the `wp_head` method can be useful for quick implementations or specific use cases.

## Credits

[Claude 3.5 Sonnet](https://claude.ai/chat/2064264a-92d0-41d8-b616-78f3c4eef46e) (with approximately `11` prompts) and [ChatGPT 4](https://chatgpt.com/c/4466eb66-a1c1-4c89-b28e-4c662b5aa4de) with `1` prompt

## Changelog

### v1.10.0
- Improved responsiveness by using `font-size: max(1rem, 3.5vmin)` on the modal container
- Switched to em units throughout for better scalability
- Increased body text line height to 1.4 for improved readability
- Updated all sizing to be relative to the new root font size

### v1.9.2
- Improves line height on body text

### v1.9.1
- Fixes syntax typo

### v1.9.0
- By default skips display for GoogleBot and other crawlers for SEO purposes

### v1.8.1
- Fixed: Horizontal centering for body text

### v1.8.0
- Added callback function option for post-interaction actions

### v1.7.1
- Fixed: Restored `target` and `exclude` functionality that was accidentally removed
- Updated: README to clearly explain `target` and `exclude` options

### v1.7.0
- Added WordPress integration methods (wp_enqueue_scripts and wp_head)

### v1.6.0
- Fixed styling issues for buttons with bylines
- Adjusted padding and line-height for improved appearance

### v1.5.0
- Made the script production-ready
- Optimized code for performance and minimal footprint

### v1.4.0
- Added optional byline feature for CTA button
- Implemented styling options for byline text

### v1.3.0
- Removed unnecessary logging
- Cleaned up code for production use

### v1.2.0
- Fixed visibility issues
- Improved error handling and debugging capabilities

### v1.1.0
- Added ability to remove/destroy the modal
- Implemented reinit functionality with new configuration options

### v1.0.0
- Initial release of NoticeBoard Modal
- Implemented basic modal functionality with customizable options
