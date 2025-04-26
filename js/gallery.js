
document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.getElementById('gallery-container');
    const loadingMessage = document.getElementById('loading-message');
    
    // Fetch the gallery data from JSON file
    fetch('data/gallery.json')
        .then(response => {
            // Check if the response is ok (status 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading message
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            
            // Build gallery with the data
            buildGallery(data.images);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            if (loadingMessage) {
                loadingMessage.textContent = 'Error loading gallery. Please try again later.';
                loadingMessage.classList.add('error');
            }
        });
    
    // Function to build the gallery from the data
    function buildGallery(images) {
        // Check if we have the container
        if (!galleryContainer) return;
        
        // Loop through the images and create gallery items
        images.forEach(image => {
            // Create gallery item elements
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const link = document.createElement('a');
            link.href = image.fullsize;
            link.setAttribute('data-title', image.title);
            link.setAttribute('aria-label', `View full size image: ${image.title}`);
            
            const img = document.createElement('img');
            img.src = image.thumbnail;
            img.alt = image.alt;
            img.loading = 'lazy'; // Enable lazy loading for better performance
            
            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            
            const title = document.createElement('h3');
            title.textContent = image.title;
            
            const description = document.createElement('p');
            description.textContent = image.description;
            
            // Assemble the gallery item
            caption.appendChild(title);
            caption.appendChild(description);
            link.appendChild(img);
            galleryItem.appendChild(link);
            galleryItem.appendChild(caption);
            
            // Add to the gallery container
            galleryContainer.appendChild(galleryItem);
            
            // Add click event to open the full size image
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(image);
            });
        });
    }
    
    // Simple lightbox function
    function openLightbox(image) {
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        // Create lightbox content
        const content = document.createElement('div');
        content.className = 'lightbox-content';
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close lightbox');
        
        // Create image element
        const img = document.createElement('img');
        img.src = image.fullsize;
        img.alt = image.alt;
        
        // Create caption
        const caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        caption.textContent = image.title;
        
        // Assemble lightbox
        content.appendChild(closeBtn);
        content.appendChild(img);
        content.appendChild(caption);
        lightbox.appendChild(content);
        
        // Add to document
        document.body.appendChild(lightbox);
        
        // Prevent scrolling while lightbox is open
        document.body.style.overflow = 'hidden';
        
        // Add close event
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === closeBtn) {
                closeLightbox(lightbox);
            }
        });
        
        // Add escape key press event
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox(lightbox);
            }
        });
    }
    
    function closeLightbox(lightbox) {
        // Re-enable scrolling
        document.body.style.overflow = '';
        
        // Remove lightbox from DOM
        lightbox.remove();
    }
});
