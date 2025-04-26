
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.getElementById('carousel-container');
    const loadingMessage = document.getElementById('carousel-loading');
    let currentSlide = 0;
    let slides = [];
    let autoplayInterval;
    let isPlaying = true;
    
    // Fetch images from JSON file
    fetch('./data/gallery.json')
        .then(response => {
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
            
            // Build carousel
            slides = data.images;
            buildCarousel(slides);
            
            // Start autoplay
            startAutoplay();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            if (loadingMessage) {
                loadingMessage.textContent = 'Error loading carousel. Please try again later.';
                loadingMessage.classList.add('error');
            }
        });
    
    function buildCarousel(images) {
        if (!carouselContainer) return;
        
        // Create carousel elements
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'carousel-slides';
        
        // Create controls
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.setAttribute('aria-label', 'Previous slide');
        
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.setAttribute('aria-label', 'Next slide');
        
        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = 'Pause';
        playPauseButton.className = 'play-pause-btn';
        playPauseButton.setAttribute('aria-label', 'Pause slideshow');
        
        // Create indicators container
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        
        // Create slides
        images.forEach((image, index) => {
            // Create slide element
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            if (index === 0) slide.classList.add('active');
            
            // Create image element
            const img = document.createElement('img');
            img.src = image.fullsize;
            img.alt = image.alt;
            
            // Create caption
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            caption.innerHTML = `<h3>${image.title}</h3><p>${image.description}</p>`;
            
            // Assemble slide
            slide.appendChild(img);
            slide.appendChild(caption);
            slidesContainer.appendChild(slide);
            
            // Create indicator
            const indicator = document.createElement('span');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.setAttribute('data-slide', index);
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicators.appendChild(indicator);
            
            // Add click event to indicator
            indicator.addEventListener('click', function() {
                goToSlide(index);
            });
        });
        
        // Assemble controls
        controls.appendChild(prevButton);
        controls.appendChild(playPauseButton);
        controls.appendChild(nextButton);
        
        // Assemble carousel
        carouselContainer.appendChild(slidesContainer);
        carouselContainer.appendChild(controls);
        carouselContainer.appendChild(indicators);
        
        // Add event listeners
        prevButton.addEventListener('click', previousSlide);
        nextButton.addEventListener('click', nextSlide);
        playPauseButton.addEventListener('click', toggleAutoplay);
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                previousSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
    }
    
    function goToSlide(index) {
        // Check if index is valid
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Update slides
        const slideElements = document.querySelectorAll('.carousel-slide');
        const indicatorElements = document.querySelectorAll('.carousel-indicator');
        
        // Remove active class from all slides and indicators
        slideElements.forEach(slide => slide.classList.remove('active'));
        indicatorElements.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slideElements[index].classList.add('active');
        indicatorElements[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
        
        // Reset autoplay timer
        if (isPlaying) {
            stopAutoplay();
            startAutoplay();
        }
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function previousSlide() {
        goToSlide(currentSlide - 1);
    }
    
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 3000); // 5 seconds
        isPlaying = true;
        
        // Update play/pause button
        const playPauseBtn = document.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.textContent = 'Pause';
            playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
        }
    }
    
    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        isPlaying = false;
        
        // Update play/pause button
        const playPauseBtn = document.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.textContent = 'Play';
            playPauseBtn.setAttribute('aria-label', 'Play slideshow');
        }
    }
    
    function toggleAutoplay() {
        if (isPlaying) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    }
});
