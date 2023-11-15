const updateList = document.getElementById('update-list');

// Function to get and display status updates
async function getStatusUpdates() {
    try {
        const response = await axios.get('http://localhost:5501/donor/get-status');
        const updates = response.data;

        // Clear the previous updates
        updateList.innerHTML = '';

        // Display updates in a formatted way
        for (const update of updates) {
            if (update.statuses && update.statuses.length > 0) {
                const statusContainer = document.createElement('div');

                for (const status of update.statuses) {
                    const listItem = document.createElement('li');

                    if (status.status) {
                        listItem.innerHTML = `<strong>Status:</strong> ${status.status}`;

                        if (status.timestamp) {
                            const timestamp = new Date(status.timestamp);

                            if (!isNaN(timestamp.getTime())) {
                                // Display formatted timestamp
                                listItem.innerHTML += `<br><strong>Timestamp:</strong> ${timestamp.toLocaleString()}`;
                            } else {
                                console.error('Invalid timestamp:', status.timestamp);
                            }
                        }
                    } else {
                        console.error('Status field missing or empty:', status);
                    }

                    statusContainer.appendChild(listItem);
                }

                updateList.appendChild(statusContainer);
            } else {
                console.error('Statuses field missing or empty:', update);
            }
        }
    } catch (error) {
        console.error('Error getting status updates:', error);
    }
}

// Get and display the initial status updates
getStatusUpdates();
