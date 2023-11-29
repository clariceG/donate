const updateStatusForm = document.getElementById('updateStatusForm');
const clearUpdatesBtn = document.getElementById('clearUpdatesBtn');

// Function to update status
async function updateStatus(event) {
    event.preventDefault();
    
    const statusInput = document.getElementById('status');
    const status = statusInput.value;

    try {
        await axios.post('http://localhost:5501/admin/update-status', { status });
        alert('Status updated successfully!');
        // You can add more logic to refresh the page or update the UI as needed
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

// Function to clear status updates
async function clearStatusUpdates() {
    try {
        await axios.post('http://localhost:5501/admin/clear-updates');
        alert('Status updates cleared!');
        // You can add more logic to refresh the page or update the UI as needed
    } catch (error) {
        console.error('Error clearing status updates:', error);
    }
}

// Event listeners
updateStatusForm.addEventListener('submit', updateStatus);
clearUpdatesBtn.addEventListener('click', clearStatusUpdates);
