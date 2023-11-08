const updateList = document.getElementById('update-list');

// Function to get and display status updates
async function getStatusUpdates() {
    try {
        const response = await axios.get('/donor/get-status');
        const updates = response.data;

        // Clear the previous updates
        updateList.innerHTML = '';

        // Display updates in a FIFO-like stack
        for (const update of updates) {
            const listItem = document.createElement('li');
            listItem.textContent = update.status;
            updateList.appendChild(listItem);
        }
    } catch (error) {
        console.error('Error getting status updates:', error);
    }
}

// Get and display the initial status updates
getStatusUpdates();
