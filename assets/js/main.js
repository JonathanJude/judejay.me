$(document).ready(function(){
  // Initialize dark mode
  initializeDarkMode();
  
  // Load JSON data
  loadProjectsData();
  loadAboutData();
  
  // Add scrollspy to <body>
  $('body').scrollspy({target: ".navbar", offset: 50});   

  // Add smooth scrolling on all links inside the navbar
  $("#jdNavbar a").on('click', function(event) {
      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
          // Prevent default anchor click behavior
          event.preventDefault();

          // Store hash
          var hash = this.hash;

          // Using jQuery's animate() method to add smooth page scroll
          // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
          $('html, body').animate({
              scrollTop: $(hash).offset().top
          }, 500, function(){
   
              // Add hash (#) to URL when done scrolling (default click behavior)
              window.location.hash = hash;
          });
      }  // End if
  });
  
  // Dark mode toggle functionality
  $('#darkModeToggle').on('click', function() {
    toggleDarkMode();
  });
});

// Dark Mode Functions
function initializeDarkMode() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateDarkModeIcon(true);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateDarkModeIcon(false);
  }
}

function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateDarkModeIcon(newTheme === 'dark');
}

function updateDarkModeIcon(isDark) {
  const icon = $('#darkModeToggle i');
  if (isDark) {
    icon.removeClass('fa-moon').addClass('fa-sun');
  } else {
    icon.removeClass('fa-sun').addClass('fa-moon');
  }
}

// Load Projects Data
function loadProjectsData() {
  if ($('#works').length === 0) return; // Only load on pages with works section
  
  $.getJSON('projects.json')
    .done(function(projects) {
      renderProjects(projects);
    })
    .fail(function() {
      console.log('Failed to load projects data');
    });
}

function renderProjects(projects) {
  const worksContainer = $('#works .container');
  const headerRow = worksContainer.find('.row').first();
  
  // Clear existing project containers
  worksContainer.find('.jd-sample-work-container').remove();
  
  // Create all project HTML first, then append in correct order
  let allProjectsHtml = '';
  projects.forEach(function(project, index) {
    const projectHtml = createProjectHtml(project, index, projects.length);
    allProjectsHtml += projectHtml;
  });
  
  // Append all projects after the header row
  headerRow.after(allProjectsHtml);
}

function createProjectHtml(project, index, projectsLength) {
  const statusHtml = `<li>${project.status}</li>`;
  const isEven = index % 2 === 0;
  const orderClass1 = isEven ? 'order-2' : 'order-1';
  const orderClass2 = isEven ? 'order-1' : 'order-2';
  
  // Handle store links
  let storeLinksHtml = '';
  if (project.googlePlayLink && project.googlePlayLink !== '#' && project.googlePlayLink !== '') {
    storeLinksHtml += `<a href="${project.googlePlayLink}" target="_blank"><i class="fab fa-google-play"></i></a>`;
  }
  if (project.appleStoreLink && project.appleStoreLink !== '#' && project.appleStoreLink !== '') {
    storeLinksHtml += `<a href="${project.appleStoreLink}" target="_blank"><i class="fab fa-apple"></i></a>`;
  }
  if (project.githubLink && project.githubLink !== '#' && project.githubLink !== '') {
    storeLinksHtml += `<a href="${project.githubLink}" target="_blank"><i class="fab fa-github"></i></a>`;
  }
  
  // Create images HTML with 3-image layout
  const imagesHtml = createImagesHtml(project.images);
  
  return `
    <div class="row jd-sample-work-container d-flex justify-content-between">
      <div class="col-12 col-sm-5 ${orderClass1} sample-work-details align-self-center">
        <h4 class="title">${project.title}</h4>
        <p class="description">${project.shortDescription}</p>
        <p class="description">${project.fullDescription}</p>
        <ul class="status">
          ${statusHtml}
        </ul>
        <div class="store-links">
          ${storeLinksHtml}
        </div>
      </div>
      <div class="col-12 col-sm-6 ${orderClass2}">
        ${imagesHtml}
      </div>
    </div>
    ${index < projectsLength - 1 ? '<br/>' : ''}
  `;
}

function createImagesHtml(images) {
  // Ensure we have exactly 3 images, fill with placeholder if needed
  const processedImages = [...images];
  while (processedImages.length < 3) {
    processedImages.push('assets/img/placeholder.svg');
  }
  processedImages.splice(3); // Keep only first 3
  
  // Create layout matching uploaded design: large image on left, two smaller on right
  return `
    <div class="project-images">
      <img src="${processedImages[0]}" alt="" class="img-fluid">
      <div class="side-images">
        <img src="${processedImages[1]}" alt="" class="img-fluid">
        <img src="${processedImages[2]}" alt="" class="img-fluid">
      </div>
    </div>
  `;
}

// Load About Data
function loadAboutData() {
  if ($('#about').length === 0) return; // Only load on about page
  
  $.getJSON('about.json')
    .done(function(aboutData) {
      renderAboutData(aboutData);
    })
    .fail(function() {
      console.log('Failed to load about data');
    });
}

function renderAboutData(data) {
  const aboutContainer = $('#about-container');
  const skillsHtml = data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
  
  const aboutHtml = `
    <div class="row jd-sample-work-container d-flex justify-content-between">
      <div class="col-12 col-sm-5 order-2 sample-work-details align-self-center">
        <h4 class="title">${data.name}</h4>
        <p class="description">${data.title}</p>
        <p class="description">${data.description}</p>
        
        <div class="skills">
          <h5>Skills:</h5>
          <div class="skills-list">
            ${skillsHtml}
          </div>
        </div>
        
        <div class="contact-info">
          <h5>Contact:</h5>
          <p>Email: <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.socialLinks ? `
            <div class="social-links">
              ${data.socialLinks.map(link => `<a href="${link.url}" target="_blank" class="social-link">${link.name}</a>`).join('')}
            </div>
          ` : ''}
          ${data.resumeLink ? `<p><a href="${data.resumeLink}" target="_blank" class="social-link">View Resume</a></p>` : ''}
        </div>
      </div>
      <div class="col-12 col-sm-6 order-1">
        <img src="${data.image}" alt="${data.name}" class="img-fluid about-image">
      </div>
    </div>
  `;
  
  aboutContainer.html(aboutHtml);
  
  // Update contact email in footer
  $('#contact a[href^="mailto:"]').attr('href', `mailto:${data.email}`).text(data.email);
}