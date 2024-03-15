document.addEventListener('DOMContentLoaded', function () {
    const contentLinks = document.querySelectorAll('.content a');
    const warningMessage = document.createElement('div');
    warningMessage.classList.add('warning-message');
    warningMessage.textContent = 'Text copied !';
    document.body.appendChild(warningMessage); // Append warning message to body

    contentLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const nextPage = this.getAttribute('href');
            const currentSection = this.closest('.content');

            // Fade out current section
            currentSection.classList.add('fade-out');

            // Wait for fade out animation to finish
            setTimeout(() => {
                updateUrlWithoutReload(nextPage); // Update URL without reloading
                window.location.href = nextPage; // Go to next page
            }, 1000); // Wait for 1s (duration of fade out animation)
        });
    });

    const copyableEmail = document.querySelector('#email');
    const copyableDiscord = document.querySelector('#discord');

    copyableEmail.addEventListener('click', function () {
        copyToClipboard(this.dataset.email);
    });

    copyableDiscord.addEventListener('click', function () {
        copyToClipboard(this.dataset.discord);
    });

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

    // Update URL without reloading
    function updateUrlWithoutReload(newUrl) {
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
});
