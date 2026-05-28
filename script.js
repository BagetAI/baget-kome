const DB_ID = "1ea5aeae-e2be-4041-b12a-8aa05f1faad3";
const DB_BASE_URL = "https://stg-app.baget.ai/api/public/databases";

// Update waitlist counter
async function updateCounter() {
    try {
        const response = await fetch(`${DB_BASE_URL}/${DB_ID}/count`);
        if (response.ok) {
            const data = await response.json();
            const count = data.count || 0;
            const counterText = document.getElementById('counter-text');
            if (counterText) {
                counterText.textContent = `Join ${count} others on the waitlist`;
            }
        }
    } catch (error) {
        console.error("Failed to fetch count:", error);
    }
}

// Handle form submission
const waitlistForm = document.getElementById('waitlist-form');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Joining...';
        
        try {
            const response = await fetch(`${DB_BASE_URL}/${DB_ID}/rows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        name: name,
                        email: email,
                        source: window.location.href
                    }
                }),
            });

            if (response.ok) {
                formMessage.textContent = "Thanks! We'll be in touch with private tasting dates.";
                formMessage.className = "success";
                formMessage.classList.remove('hidden');
                waitlistForm.reset();
                updateCounter();
                
                // Keep the button disabled to prevent double signups
                submitBtn.textContent = 'Joined';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to join');
            }
        } catch (error) {
            console.error("Submission error:", error);
            formMessage.textContent = "Something went wrong. Please try again.";
            formMessage.className = "error";
            formMessage.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Initial counter update
updateCounter();

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.8)';
        header.style.boxShadow = 'none';
    }
});
