document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('analyze-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loader = document.getElementById('loader');
    const resultsContainer = document.getElementById('results-container');
    const updateJiraBtn = document.getElementById('update-jira-btn');
    
    // Settings elements
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const settingsForm = document.getElementById('settings-form');
    const connectionStatus = document.getElementById('connection-status');
    const saveJiraBtn = document.getElementById('save-jira-btn');

    let currentTicketId = null;
    let currentRcaData = null;

    // Load saved settings if they exist
    document.getElementById('jira-domain').value = localStorage.getItem('jiraDomain') || '';
    document.getElementById('jira-email').value = localStorage.getItem('jiraEmail') || '';
    document.getElementById('jira-token').value = localStorage.getItem('jiraToken') || '';

    // Settings Modal Logic
    openSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        connectionStatus.classList.add('hidden');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    // Close modal if clicked outside of content
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    // Handle Connection and Verification
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const jiraDomain = document.getElementById('jira-domain').value.trim();
        const jiraEmail = document.getElementById('jira-email').value.trim();
        const jiraToken = document.getElementById('jira-token').value.trim();

        // Save locally
        localStorage.setItem('jiraDomain', jiraDomain);
        localStorage.setItem('jiraEmail', jiraEmail);
        localStorage.setItem('jiraToken', jiraToken);

        const originalBtnHtml = saveJiraBtn.innerHTML;
        saveJiraBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving & Verifying...';
        saveJiraBtn.style.opacity = '0.7';
        connectionStatus.classList.add('hidden');
        connectionStatus.className = 'status-msg hidden';

        try {
            const response = await fetch('/api/verify-jira', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jiraDomain, userEmail: jiraEmail, apiToken: jiraToken })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Connection failed');
            }

            connectionStatus.textContent = `Saved and connected as ${result.user}`;
            connectionStatus.classList.remove('hidden');
            connectionStatus.classList.add('success');
            
            setTimeout(() => {
                settingsModal.classList.add('hidden');
            }, 1000);

        } catch (error) {
            connectionStatus.textContent = error.message;
            connectionStatus.classList.remove('hidden');
            connectionStatus.classList.add('error');
        } finally {
            saveJiraBtn.innerHTML = originalBtnHtml;
            saveJiraBtn.style.opacity = '1';
        }
    });

    function getCredentials() {
        return {
            jiraDomain: localStorage.getItem('jiraDomain'),
            userEmail: localStorage.getItem('jiraEmail'),
            apiToken: localStorage.getItem('jiraToken')
        };
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const ticketId = document.getElementById('ticket-id').value.trim();
        if (!ticketId) return;

        const credentials = getCredentials();
        if(!credentials.jiraDomain || !credentials.userEmail || !credentials.apiToken) {
            alert('Please configure your Jira settings first!');
            settingsModal.classList.remove('hidden');
            return;
        }

        // UI State: Loading
        analyzeBtn.classList.add('hidden');
        loader.classList.remove('hidden');
        resultsContainer.classList.add('hidden');

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, ...credentials })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch analysis');
            }

            const data = await response.json();
            
            currentTicketId = data.ticketInfo.ticketId;
            currentRcaData = data.rca;

            document.getElementById('ticket-title-display').textContent = data.ticketInfo.ticketId;
            document.getElementById('res-summary').textContent = data.ticketInfo.summary;
            document.getElementById('res-status').textContent = data.ticketInfo.status;
            document.getElementById('res-priority').textContent = data.ticketInfo.priority;

            document.getElementById('res-valid').textContent = data.verification.valid;
            
            const confEl = document.getElementById('res-confidence');
            confEl.textContent = data.verification.confidence;
            
            const confValue = parseInt(data.verification.confidence);
            if(confValue > 85) { confEl.style.color = 'var(--success)'; }
            else if(confValue > 50) { confEl.style.color = 'var(--warning)'; }
            else { confEl.style.color = 'var(--danger)'; }

            document.getElementById('res-missing').textContent = data.verification.missingDetails.join(", ");

            document.getElementById('res-rca-category').textContent = data.rca.category;
            document.getElementById('res-rca-rootcause').textContent = data.rca.rootCause;
            document.getElementById('res-rca-impact').textContent = data.rca.impact;
            document.getElementById('res-rca-corrective').textContent = data.rca.correctiveAction;
            document.getElementById('res-rca-preventive').textContent = data.rca.preventiveAction;
            
            updateJiraBtn.style.background = '';
            updateJiraBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Update to JIRA';

            setTimeout(() => {
                loader.classList.add('hidden');
                analyzeBtn.classList.remove('hidden');
                resultsContainer.classList.remove('hidden');
            }, 600);

        } catch (error) {
            alert(error.message);
            loader.classList.add('hidden');
            analyzeBtn.classList.remove('hidden');
        }
    });

    updateJiraBtn.addEventListener('click', async () => {
        if (!currentTicketId || !currentRcaData) return;
        
        const credentials = getCredentials();
        const originalHTML = updateJiraBtn.innerHTML;
        updateJiraBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating JIRA...';
        updateJiraBtn.style.opacity = '0.7';

        try {
            const response = await fetch('/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: currentTicketId,
                    rcaData: currentRcaData,
                    ...credentials
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to update Jira');

            updateJiraBtn.style.background = 'var(--success)';
            updateJiraBtn.style.color = 'white';
            updateJiraBtn.innerHTML = '<i class="fa-solid fa-check"></i> JIRA Updated Successfully';
            updateJiraBtn.style.opacity = '1';
            
        } catch (error) {
            alert(error.message);
            updateJiraBtn.innerHTML = originalHTML;
            updateJiraBtn.style.opacity = '1';
        }
    });
});
