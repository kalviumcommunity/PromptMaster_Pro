// Global variables
let currentPromptType = 'zero-shot';
let ragContext = '';
let promptHistory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializePromptTypes();
    loadRecentPrompts();
    setupEventListeners();
    updateAnalytics();
});

// Initialize prompt type selection
function initializePromptTypes() {
    const promptTypes = document.querySelectorAll('.prompt-type');
    promptTypes.forEach(type => {
        type.addEventListener('click', () => {
            // Remove active class from all
            promptTypes.forEach(t => t.classList.remove('active'));
            // Add active class to clicked
            type.classList.add('active');
            
            currentPromptType = type.dataset.type;
            toggleExamplesSection();
        });
    });

    // Set zero-shot as default
    document.querySelector('.prompt-type[data-type="zero-shot"]').classList.add('active');
}

// Toggle examples section based on prompt type
function toggleExamplesSection() {
    const examplesSection = document.getElementById('examples-section');
    if (currentPromptType === 'one-shot' || currentPromptType === 'multi-shot') {
        examplesSection.style.display = 'block';
    } else {
        examplesSection.style.display = 'none';
    }
}

// Setup event listeners
function setupEventListeners() {
    // File upload for RAG
    document.getElementById('rag-file').addEventListener('change', handleFileUpload);
    
    // Enter key to process prompt
    document.getElementById('prompt-input').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            processPrompt();
        }
    });
}

// Handle file upload for RAG
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const uploadStatus = document.getElementById('upload-status');
    uploadStatus.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Processing document...</div>';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.success) {
            // For now, we'll just store the filename as context
            // In a real implementation, you'd process the file content
            ragContext = `Context from document: ${result.originalName}`;
            uploadStatus.innerHTML = `<div style="color: green;"><i class="fas fa-check"></i> Document uploaded: ${result.originalName}</div>`;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        uploadStatus.innerHTML = `<div style="color: red;"><i class="fas fa-exclamation-triangle"></i> Upload failed: ${error.message}</div>`;
    }
}

// Process the prompt
async function processPrompt() {
    const promptInput = document.getElementById('prompt-input').value.trim();
    const aiRole = document.getElementById('ai-role').value.trim();
    const examples = document.getElementById('examples').value.trim();
    const outputFormat = document.getElementById('output-format').value;

    if (!promptInput) {
        alert('Please enter a prompt');
        return;
    }

    const processBtn = document.getElementById('process-btn');
    const originalText = processBtn.innerHTML;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    processBtn.disabled = true;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Getting response from AI...</div>';

    try {
        const response = await fetch('/api/process-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: promptInput,
                promptType: currentPromptType,
                format: outputFormat,
                examples: examples,
                role: aiRole,
                context: ragContext
            })
        });

        const result = await response.json();

        if (result.success) {
            displayResponse(result.response, outputFormat);
            loadRecentPrompts();
            updateAnalytics();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        resultsDiv.innerHTML = `
            <div style="color: red; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Error</h4>
                <p>${error.message}</p>
            </div>
        `;
    } finally {
        processBtn.innerHTML = originalText;
        processBtn.disabled = false;
    }
}

// Display the response
function displayResponse(response, format) {
    const resultsDiv = document.getElementById('results');
    
    let formattedResponse = response;
    
    // Format based on output type
    if (format === 'json') {
        try {
            // Try to pretty-print JSON
            const jsonObj = JSON.parse(response);
            formattedResponse = JSON.stringify(jsonObj, null, 2);
            response = `<div class="json-response">${formattedResponse}</div>`;
        } catch (e) {
            // If not valid JSON, just display as text
            response = `<div class="response-content">${formattedResponse}</div>`;
        }
    } else if (format === 'markdown') {
        response = `<div class="markdown-response">${formattedResponse}</div>`;
    } else {
        response = `<div class="response-content">${formattedResponse}</div>`;
    }

    const responseElement = `
        <div class="response">
            <div class="response-header">
                <span><i class="fas fa-clock"></i> ${new Date().toLocaleTimeString()}</span>
                <span><i class="fas fa-tag"></i> ${currentPromptType}</span>
            </div>
            ${response}
        </div>
    `;

    resultsDiv.innerHTML = responseElement;
}

// Clear the editor
function clearEditor() {
    document.getElementById('prompt-input').value = '';
    document.getElementById('examples').value = '';
    document.getElementById('ai-role').value = 'Helpful AI Assistant';
    document.getElementById('output-format').value = 'text';
    ragContext = '';
    document.getElementById('upload-status').innerHTML = '';
}

// Load recent prompts
async function loadRecentPrompts() {
    try {
        const response = await fetch('/api/prompts');
        promptHistory = await response.json();
        
        const recentList = document.getElementById('recent-prompts');
        recentList.innerHTML = '';
        
        promptHistory.slice(0, 5).forEach(prompt => {
            const truncatedPrompt = prompt.originalPrompt.length > 50 
                ? prompt.originalPrompt.substring(0, 47) + '...' 
                : prompt.originalPrompt;
            
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.innerHTML = `
                <strong>${prompt.promptType}</strong><br>
                ${truncatedPrompt}
            `;
            item.addEventListener('click', () => loadPrompt(prompt.id));
            recentList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading recent prompts:', error);
    }
}

// Load a specific prompt
async function loadPrompt(promptId) {
    try {
        const response = await fetch(`/api/prompts/${promptId}`);
        const prompt = await response.json();
        
        document.getElementById('prompt-input').value = prompt.originalPrompt;
        document.getElementById('ai-role').value = 'Helpful AI Assistant'; // Default
        document.getElementById('output-format').value = prompt.format || 'text';
        
        // Set the prompt type
        currentPromptType = prompt.promptType;
        document.querySelectorAll('.prompt-type').forEach(t => t.classList.remove('active'));
        document.querySelector(`.prompt-type[data-type="${currentPromptType}"]`).classList.add('active');
        toggleExamplesSection();
        
        // Display the response
        displayResponse(prompt.response, prompt.format || 'text');
    } catch (error) {
        console.error('Error loading prompt:', error);
    }
}

// Update analytics
function updateAnalytics() {
    document.getElementById('total-prompts').textContent = promptHistory.length;
    
    // Calculate success rate (for demo, assume all successful)
    const successRate = promptHistory.length > 0 ? '100%' : '0%';
    document.getElementById('success-rate').textContent = successRate;
    
    // Calculate average response time (placeholder)
    const avgResponse = promptHistory.length > 0 ? '2.5s' : '0s';
    document.getElementById('avg-response').textContent = avgResponse;
}

// Export functions for global access
window.processPrompt = processPrompt;
window.clearEditor = clearEditor;
