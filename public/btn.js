// frontend.js
document.getElementById('load-more-button').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/drives'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const driveCardsContainer = document.getElementById('drive-cards-container');
  
      // Create cards for each drive and append them to the container
      data.forEach(drive => {
        const card = createDriveCard(drive);
        driveCardsContainer.appendChild(card);
      });
    } catch (error) {
      console.error('Error loading drives:', error);
    }
  });
  
  // Function to create a drive card element
  function createDriveCard(drive) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded overflow-hidden shadow-md relative';
  
    const image = document.createElement('img');
    image.src = drive.image;
    image.alt = drive.title;
    image.className = 'h-40 w-full sm:h-48 object-cover';
  
    const content = document.createElement('div');
    content.className = 'm-4';
  
    const title = document.createElement('span');
    title.className = 'font-bold';
    title.innerText = drive.title;
  
    const description = document.createElement('span');
    description.className = 'block text-gray-500 text-sm';
    description.innerText = drive.description;
  
    content.appendChild(title);
    content.appendChild(description);
  
    card.appendChild(image);
    card.appendChild(content);
  
    // You can add more elements (e.g., donation links, buttons) here if needed
  
    return card;
  }
  