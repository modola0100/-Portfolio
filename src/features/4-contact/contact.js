export function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    if (!form || !statusEl) return;

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        statusEl.textContent = 'Sending...';
        statusEl.classList.remove('text-red-500', 'text-green-500');

        try {
            const response = await fetch(event.target.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusEl.textContent = 'Message sent successfully!';
                statusEl.classList.add('text-green-500');
                form.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    statusEl.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    statusEl.textContent = 'Oops! There was a problem submitting your form.';
                }
                statusEl.classList.add('text-red-500');
            }
        } catch (error) {
            statusEl.textContent = 'Oops! There was a network error.';
            statusEl.classList.add('text-red-500');
        }
    }

    form.addEventListener('submit', handleSubmit);
}