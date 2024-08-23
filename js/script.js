document.addEventListener('DOMContentLoaded', function () {
    const warningMessage = document.createElement('div');
    warningMessage.classList.add('warning-message');
    warningMessage.textContent = 'Text copied !';
    document.body.appendChild(warningMessage); // Append warning message to body

    function attachEventListeners() {
        const contentLinks = document.querySelectorAll('.content a');
        contentLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const nextPage = this.getAttribute('href');
                navigateToPage(nextPage); // Call the navigation function
            });
        });

        const copyableEmail = document.querySelector('#email');
        const copyableDiscord = document.querySelector('#discord');

        if (copyableEmail) {
            copyableEmail.addEventListener('click', function () {
                copyToClipboard(this.dataset.email);
            });
        }

        if (copyableDiscord) {
            copyableDiscord.addEventListener('click', function () {
                copyToClipboard(this.dataset.discord);
            });
        }
    }

    attachEventListeners(); // Initial setup of event listeners

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        warningMessage.style.display = 'block'; // Show the message
        setTimeout(() => {
            warningMessage.style.display = 'none'; // Hide the message after 2 seconds
        }, 2000);
    }

    function navigateToPage(url) {
        const currentSection = document.querySelector('.content');

        // Fade out current section
        currentSection.classList.add('fade-out');

        // Wait for fade out animation to finish
        setTimeout(() => {
            // Update URL without reloading
            updateUrlWithoutReload(url);

            // Fetch new page content and update current section
            fetchPageContent(url).then(content => {
                document.querySelector('#main-content').innerHTML = content;
                currentSection.classList.remove('fade-out');
                // Reattach event listeners for new content
                attachEventListeners();
            });
        }, 1000); // Wait for 1s (duration of fade out animation)
    }

    // Update URL without reloading
    function updateUrlWithoutReload(newUrl) {
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    // Fetch page content via AJAX
    function fetchPageContent(url) {
        return fetch(url)
            .then(response => response.text())
            .then(html => {
                // Extract the new content from the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                return tempDiv.querySelector('#main-content').innerHTML;
            });
    }

    // Listen for back/forward button navigation
    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.path) {
            // Fetch and replace content based on the URL in the history state
            fetchPageContent(event.state.path).then(content => {
                document.querySelector('#main-content').innerHTML = content;
                document.querySelector('.content').classList.remove('fade-out');
                // Reattach event listeners for new content
                attachEventListeners();
            });
        }
    });
});
