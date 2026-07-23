// ============================================
// Open Redirect PoC - Script
// ============================================

// ===== DOM Elements =====
document.addEventListener('DOMContentLoaded', function() {
    // Set researcher name
    const researcherEl = document.getElementById('researcher-name');
    if (researcherEl) {
        researcherEl.textContent = 'Aditia Saputra';
    }

    // Test redirect
    const testBtn = document.getElementById('test-btn');
    if (testBtn) {
        testBtn.addEventListener('click', testRedirect);
    }

    // Copy button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCurlCommand);
    }

    // Detect referer on phishing page
    detectReferer();

    // Demo login
    const demoForm = document.querySelector('#phishing-form');
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('⚠️ CREDENTIALS CAPTURED! This is a demo. No data is actually sent.');
        });
    }
});

// ===== Test Redirect =====
function testRedirect() {
    const targetUrl = document.getElementById('target-url').value;
    const redirectUrl = document.getElementById('redirect-url').value;

    if (!targetUrl || !redirectUrl) {
        alert('Please fill in both fields.');
        return;
    }

    const resultCard = document.getElementById('result-card');
    const resultContent = document.getElementById('result-content');

    // Show result card
    resultCard.style.display = 'block';

    // Build request
    const request = `GET ${new URL(targetUrl).pathname} HTTP/1.1
Host: ${new URL(targetUrl).host}
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36
Referer: ${redirectUrl}
Researcher: Aditia Saputra`;

    const curl = `curl -v "${targetUrl}" \\\n  -H "Referer: ${redirectUrl}" \\\n  -H "Researcher: Aditia Saputra"`;

    resultContent.innerHTML = `
<div style="margin-bottom:12px;">
    <strong>📤 Request:</strong>
    <pre style="background:#0d0d0d;padding:12px;border-radius:6px;margin:8px 0;font-size:0.85rem;overflow-x:auto;">${escapeHtml(request)}</pre>
</div>
<div style="margin-bottom:12px;">
    <strong>🔗 Curl Command:</strong>
    <pre style="background:#0d0d0d;padding:12px;border-radius:6px;margin:8px 0;font-size:0.85rem;overflow-x:auto;">${escapeHtml(curl)}</pre>
</div>
<div>
    <strong>📌 Expected Response:</strong>
    <pre style="background:#0d0d0d;padding:12px;border-radius:6px;margin:8px 0;font-size:0.85rem;overflow-x:auto;color:#4caf50;">
HTTP/2 302 Found
Location: ${redirectUrl}
    </pre>
</div>
<div style="margin-top:12px;">
    <a href="${targetUrl}" target="_blank" class="btn btn-success" style="display:inline-block;padding:8px 16px;background:#00c853;color:#fff;border-radius:6px;text-decoration:none;">
        🚀 Open in New Tab
    </a>
</div>
`;
}

// ===== Copy Curl Command =====
function copyCurlCommand() {
    const targetUrl = document.getElementById('target-url').value;
    const redirectUrl = document.getElementById('redirect-url').value;

    if (!targetUrl || !redirectUrl) {
        alert('Please fill in both fields first.');
        return;
    }

    const curl = `curl -v "${targetUrl}" \\\n  -H "Referer: ${redirectUrl}" \\\n  -H "Researcher: Aditia Saputra"`;

    navigator.clipboard.writeText(curl).then(() => {
        alert('✅ Curl command copied to clipboard!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = curl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ Curl command copied to clipboard!');
    });
}

// ===== Copy Code Block =====
function copyCode(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const code = element.querySelector('pre code');
    if (!code) return;

    const text = code.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = element.querySelector('.copy-code-btn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ Copied to clipboard!');
    });
}

// ===== Detect Referer on Phishing Page =====
function detectReferer() {
    const refererDisplay = document.getElementById('referer-display');
    const useragentDisplay = document.getElementById('useragent-display');
    const redirectDisplay = document.getElementById('redirect-display');

    if (refererDisplay) {
        const referer = document.referrer || 'Direct access (no referer)';
        refererDisplay.textContent = referer;
    }

    if (useragentDisplay) {
        useragentDisplay.textContent = navigator.userAgent;
    }

    if (redirectDisplay) {
        // Check if redirected from referer
        const referer = document.referrer || '';
        if (referer) {
            redirectDisplay.textContent = referer;
        } else {
            redirectDisplay.textContent = 'Direct access (not redirected)';
        }
    }

    // If redirected, show alert
    if (document.referrer) {
        console.log('🔴 Open Redirect detected! Referer:', document.referrer);
    }
}

// ===== Escape HTML =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}