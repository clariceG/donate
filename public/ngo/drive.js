document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
            const contentSections = document.querySelectorAll('section');

            navLinks.forEach((link) => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);

                    contentSections.forEach((section) => {
                        section.classList.add('hidden');
                    });

                    document.getElementById(targetId).classList.remove('hidden');
                });
            });

    // Add an event listener to the "View Donation Drives" button
    const btnView = document.getElementById('btn-view');
    btnView.addEventListener('click', async () => {
        // Make an AJAX request to fetch donation drives
        try {
            const response = await fetch('/api/drives', {
                method: 'GET',
            });
            if (response.status === 200) {
                // Handle the response, e.g., display the donation drives on the page
                const drives = await response.json();
                console.log(drives); // Log the drives to the console for testing
                // You can display the drives on the page here
            } else {
                // Handle the error, e.g., display an error message
                console.error('Error fetching donation drives');
            }
        } catch (error) {
            console.error('Error loading donation drives:', error);
        }
    });

    // Add an event listener to the "Add new Donation Drives" button
    // Add an event listener to the "update Donation Drives" button
    // Add an event listener to the "delete Donation Drives" button
    // Add an event listener to the "Load more Donation Drives" button
});
