/* ==========================================================================
   MAIN JAVASCRIPT LOGIC
   Features: AI Welcome Speech, Local RAG Chatbot Engine, Scroll Progress Bar,
   Typewriter, Theme Switcher, Project Filtering, Modals, Form Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Global Voice AI State ---
  let isVoiceMuted = false;

  function speakText(text) {
    if (isVoiceMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any active speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // --- Voice Toggle Button ---
  const voiceToggleBtn = document.getElementById('voice-toggle-btn');
  if (voiceToggleBtn) {
    voiceToggleBtn.addEventListener('click', () => {
      isVoiceMuted = !isVoiceMuted;
      if (isVoiceMuted) {
        window.speechSynthesis.cancel();
        voiceToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        voiceToggleBtn.title = "Voice AI Muted (Click to Unmute)";
      } else {
        voiceToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        voiceToggleBtn.title = "Voice AI Enabled (Click to Mute)";
        speakText("Voice AI enabled.");
      }
    });
  }

  // --- 1. AI Welcome Experience Screen ---
  const welcomeScreen = document.getElementById('welcome-screen');
  const enterBtn = document.getElementById('enter-portfolio-btn');
  const preloader = document.getElementById('preloader');

  // Hide static preloader first
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 800);
  }

  // --- Confetti & Celebration Physics System ---
  function triggerCelebrationConfetti() {
    const canvas = document.getElementById('celebration-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#fbbf24', '#f43f5e'];
    const confetti = [];
    const count = 140;

    for (let i = 0; i < count; i++) {
      confetti.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 30,
        vx: (Math.random() - 0.5) * 24,
        vy: (Math.random() - 0.85) * 24,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let frame = 0;
    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      confetti.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45;
        p.vx *= 0.98;
        p.rotation += p.rSpeed;
        p.opacity -= 0.008;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
          ctx.restore();
        }
      });

      frame++;
      if (alive && frame < 180) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animateConfetti();
  }

  if (enterBtn && welcomeScreen) {
    enterBtn.addEventListener('click', () => {
      // 1. Trigger Confetti Burst
      triggerCelebrationConfetti();

      // 2. Display Thank You Toast Banner
      showToast('🎉 Thank you so much for visiting my website! Welcome to my AI World!', 'success');

      // 3. Dissolve Welcome Portal Screen
      welcomeScreen.style.opacity = '0';
      welcomeScreen.style.transform = 'scale(1.08)';
      setTimeout(() => {
        welcomeScreen.style.visibility = 'hidden';
      }, 900);

      // 4. Trigger Celebration Voice Speech Greeting
      const celebrationSpeech = "Thank you so much for visiting my website! Welcome to Ebenazer K's AI portfolio experience. Feel free to explore my projects, technical skills, internships, and achievements.";
      setTimeout(() => {
        speakText(celebrationSpeech);
      }, 600);
    });
  }

  // --- 2. Scroll Progress Bar ---
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });

  // --- 3. Typewriter Effect ---
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const phrases = [
      'Machine Learning Engineer',
      'AI Engineer',
      'Data Scientist',
      'Python Developer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  // --- 4. Cursor Glow Follower ---
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });
  }

  // --- 5. Theme Switcher (Dark / Light) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      }
    });
  }

  // --- 6. Aesthetic Nav Indicator Line & Sticky Header ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navIndicator = document.getElementById('nav-indicator');

  function moveIndicator(linkElem) {
    if (!navIndicator || !linkElem) return;
    navIndicator.style.left = `${linkElem.offsetLeft}px`;
    navIndicator.style.width = `${linkElem.offsetWidth}px`;
  }

  // Position indicator initially
  const initialActive = document.querySelector('.nav-link.active');
  if (initialActive) {
    setTimeout(() => moveIndicator(initialActive), 300);
  }

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
    link.addEventListener('mouseleave', () => {
      const currentActive = document.querySelector('.nav-link.active');
      if (currentActive) moveIndicator(currentActive);
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  });

  // --- 7. Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 110;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            moveIndicator(link);
          }
        });
      }
    });
  });

  // --- 8. Skills Tab Switcher ---
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');
      skillCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Skill Bar Observer
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const barFill = entry.target.querySelector('.skill-bar-fill');
        if (barFill) {
          const targetWidth = barFill.getAttribute('data-percentage') || '85%';
          barFill.style.width = targetWidth;
        }
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => skillObserver.observe(card));

  // --- 9. Animated Counters ---
  const counterElements = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counterElements.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = target / 40;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.textContent = Math.ceil(count) + suffix;
              setTimeout(updateCount, 30);
            } else {
              counter.textContent = target + suffix;
            }
          };

          updateCount();
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) counterObserver.observe(statsSection);

  // --- 10. Project Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 11. Project Details Modal ---
  const projectModal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body-content');

  const projectDetails = {
    'project-1': {
      title: 'Customer Churn Prediction System',
      category: 'Machine Learning',
      image: 'assets/images/project-1.jpg',
      tags: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Streamlit'],
      overview: 'End-to-end Machine Learning web application predicting customer churn risk based on behavioral metrics and account attributes.',
      problem: 'Subscription and service businesses face revenue loss due to unmanaged customer attrition. Identifying at-risk customers early enables proactive retention campaigns.',
      features: [
        'Automated data preprocessing & handling of missing/categorical fields.',
        'Feature scaling and risk probability estimation pipeline.',
        'Interactive risk calculator for business stakeholders.',
        'Low-latency Streamlit cloud deployment.'
      ],
      improvements: [
        'Integration with automated email alerting for high-risk accounts.',
        'SHAP/LIME model explainability dashboard to highlight churn drivers.'
      ],
      github: 'https://github.com/ebenazer890/customer_churn_predict',
      demo: 'https://customerpredictorebenazer.streamlit.app/'
    },
    'project-2': {
      title: 'Sales Data Analysis Dashboard',
      category: 'Data Analysis',
      image: 'assets/images/project-2.jpg',
      tags: ['Python', 'Pandas', 'Plotly', 'Matplotlib', 'Streamlit'],
      overview: 'Interactive sales analytics dashboard designed for multi-dimensional business performance exploration and KPI tracking.',
      problem: 'Static sales reports fail to give executive teams real-time visibility into regional trends, profit margins, and customer purchasing patterns.',
      features: [
        'Real-time revenue, cost, and profit distribution metrics.',
        'Interactive Plotly chart visualizations with region and date range filtering.',
        'Customer purchasing trend mapping and high-margin product insights.',
        'Responsive web interface deployed on Streamlit Cloud.'
      ],
      improvements: [
        'Automated ETL pipeline connecting directly to SQL database backends.',
        'Time-series forecasting module predicting upcoming quarter sales.'
      ],
      github: 'https://github.com/ebenazer890/sales_data_analysis',
      demo: 'https://salesdataanalysisebenazer.streamlit.app/'
    },
    'project-3': {
      title: 'Heart Disease Prediction System',
      category: 'Machine Learning',
      image: 'assets/images/project-3.jpg',
      tags: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Streamlit'],
      overview: 'Healthcare AI diagnostic tool predicting the likelihood of heart disease using clinical patient metrics.',
      problem: 'Cardiovascular diseases require early diagnosis. Automated ML screening helps clinicians perform rapid risk stratification.',
      features: [
        'Preprocessing key physiological indicators (cholesterol, ECG, blood pressure).',
        'Supervised classification model evaluated on medical benchmark datasets.',
        'Intuitive input form built for fast clinical risk assessment.',
        'High accuracy Streamlit web deployment.'
      ],
      improvements: [
        'Expanding dataset to include imaging metrics (echocardiogram features).',
        'FHIR medical data standard integration for EHR software.'
      ],
      github: 'https://github.com/ebenazer890/heart_disease_predictor',
      demo: 'https://heart-diseasepredictorebenazer.streamlit.app/'
    },
    'project-4': {
      title: 'Student Performance Prediction',
      category: 'Machine Learning',
      image: 'assets/images/project-4.jpg',
      tags: ['Python', 'Pandas', 'Scikit-learn', 'Streamlit'],
      overview: 'Educational analytics application forecasting student academic performance to enable early academic intervention.',
      problem: 'Educational institutions need reliable predictive insights to identify struggling students before final evaluations.',
      features: [
        'Exploratory Data Analysis (EDA) on study habits and historical grades.',
        'Supervised regression/classification model with evaluation metrics.',
        'Real-time grade prediction calculator based on input factors.',
        'Low-latency Streamlit frontend.'
      ],
      improvements: [
        'Adding personalized study recommendation algorithms based on weak subject areas.',
        'Multi-semester trend tracking for student cohorts.'
      ],
      github: 'https://github.com/ebenazer890/student_predictor',
      demo: 'https://studentpredictor-ebenazer.streamlit.app/'
    },
    'project-5': {
      title: 'AI-Power Knowledge Interaction System',
      category: 'NLP & Generative AI',
      image: 'assets/images/project-5.jpg',
      tags: ['Python', 'Streamlit', 'LLM', 'NLP', 'FAISS', 'Vector Databases'],
      overview: 'Retrieval-Augmented Generation (RAG) assistant allowing users to upload dense documents and perform conversational Q&A.',
      problem: 'Reading lengthy technical/financial documents is time-consuming. Users require precise, context-backed answers instantly.',
      features: [
        'PDF document parsing and contextual text chunking.',
        'Vector similarity search using FAISS vector indexing.',
        'NLP embedding extraction and LLM context synthesis.',
        'Interactive chat interface built with Streamlit.'
      ],
      improvements: [
        'Hybrid search combining keyword BM25 with dense vector embeddings.',
        'Multi-document comparison and tabular data extraction capabilities.'
      ],
      github: 'https://github.com/ebenazer890/AI-Power-Knowledge-Interaction-System',
      demo: 'https://ai-power-knowledge-ebenazer.streamlit.app/'
    },
    'project-6': {
      title: 'SMS Spam Detector',
      category: 'NLP & AI',
      image: 'assets/images/project-6.jpg',
      tags: ['Python', 'Scikit-learn', 'TF-IDF', 'NLP', 'Flask'],
      description: 'NLP classification web app that categorizes SMS messages as Spam or Ham with over 98% accuracy.',
      overview: 'High-precision text classification service detecting unsolicited or fraudulent SMS messages.',
      problem: 'Spam messages pose security and phishing risks to mobile users. Automated real-time text filtering protects end users.',
      features: [
        'Text preprocessing, stop-word removal, and n-gram extraction.',
        'TF-IDF Vectorization coupled with Multinomial Naive Bayes classifier.',
        'Real-time text spam evaluation engine.',
        'Web application interface deployed on Render using Flask.'
      ],
      improvements: [
        'BERT transformer fine-tuning for contextual multilingual text classification.',
        'RESTful microservice endpoint for mobile app integration.'
      ],
      github: 'https://github.com/ebenazer890/sms-spam-detector',
      demo: 'https://sms-spam-detector-ebenazer.onrender.com/'
    },
    'project-7': {
      title: 'Loan Approval Prediction',
      category: 'Machine Learning',
      image: 'assets/images/project-7.jpg',
      tags: ['Python', 'Pandas', 'Scikit-learn', 'Decision Tree', 'Streamlit', 'Joblib', 'Git'],
      overview: 'End-to-end Machine Learning web application using Decision Tree Classification to predict loan application approval based on applicant financial & credit parameters.',
      problem: 'Manual loan approval evaluation by financial institutions is slow and prone to subjective bias. Automated decision tree models speed up risk assessment with data-driven objectivity.',
      features: [
        'Cleaned and preprocessed loan application dataset.',
        'Handled missing values using Mean and Mode imputation techniques.',
        'Encoded categorical variables using LabelEncoder for model compatibility.',
        'Trained and evaluated a Decision Tree Classification model.',
        'Persisted trained model using Joblib serialization.',
        'Built an interactive Streamlit web application for real-time predictions.',
        'Deployed application on Streamlit Community Cloud.'
      ],
      improvements: [
        'Ensemble modeling integration (Random Forest & XGBoost benchmarking).',
        'SHAP model explainability visualizations for loan approval factor breakdown.'
      ],
      github: 'https://github.com/ebenazer890/loan_predictore',
      demo: 'https://loanpredictore-ebenazer.streamlit.app/'
    }
  };

  document.querySelectorAll('.view-project-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-id');
      const data = projectDetails[projId];
      if (data && modalBody && projectModal) {
        modalBody.innerHTML = `
          <div style="margin-bottom: 20px;">
            <span class="section-subtitle">${data.category}</span>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-top: 6px;">${data.title}</h2>
          </div>
          <div style="width:100%; height:260px; border-radius:14px; overflow:hidden; margin-bottom:20px;">
            <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="margin-bottom:16px;">
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--primary-light); margin-bottom:6px;"><i class="fas fa-info-circle"></i> Project Overview</h4>
            <p style="color:var(--text-secondary); line-height:1.6;">${data.overview}</p>
          </div>
          <div style="margin-bottom:16px;">
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--accent); margin-bottom:6px;"><i class="fas fa-exclamation-triangle"></i> Problem Statement</h4>
            <p style="color:var(--text-secondary); line-height:1.6;">${data.problem}</p>
          </div>
          <div style="margin-bottom:16px;">
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--primary-light); margin-bottom:6px;"><i class="fas fa-star"></i> Key Features</h4>
            <ul style="padding-left:20px; color:var(--text-secondary); line-height:1.7;">
              ${data.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
          <div style="margin-bottom:16px;">
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--secondary); margin-bottom:6px;"><i class="fas fa-rocket"></i> Future Improvements</h4>
            <ul style="padding-left:20px; color:var(--text-secondary); line-height:1.7;">
              ${data.improvements.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
          <div class="project-tags" style="margin-bottom:24px;">
            ${data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          <div style="display:flex; gap:14px; flex-wrap:wrap;">
            <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="fab fa-github"></i> Repository</a>
            <a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
          </div>
        `;
        projectModal.classList.add('active');
      }
    });
  });

  if (modalClose && projectModal) {
    modalClose.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) projectModal.classList.remove('active');
    });
  }

  // --- 12. Resume View Modal Trigger ---
  const viewResumeBtn = document.getElementById('view-resume-btn');
  if (viewResumeBtn && projectModal && modalBody) {
    viewResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalBody.innerHTML = `
        <div style="text-align:center; margin-bottom: 20px;">
          <h2 style="font-size:2.2rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">EBENAZER K</h2>
          <p style="color:var(--accent); font-weight:700; font-size:1.05rem;">Machine Learning Engineer | AI Engineer | Data Scientist</p>
          <p style="color:var(--text-muted); font-size:0.875rem; margin-top:6px;">
            Kanniyakumari, India &nbsp;|&nbsp; +91 7558186327 &nbsp;|&nbsp; ebenazer890@gmail.com<br>
            <a href="https://linkedin.com/in/ebenazerk" target="_blank" style="color:var(--primary-light);">linkedin.com/in/ebenazerk</a> &nbsp;|&nbsp;
            <a href="https://github.com/ebenazer890" target="_blank" style="color:var(--primary-light);">github.com/ebenazer890</a>
          </p>
        </div>
        <hr style="border-color:var(--border-color); margin-bottom:20px;">

        <div style="margin-bottom:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--primary-light); margin-bottom:8px;"><i class="fas fa-user-check"></i> Professional Summary</h3>
          <p style="color:var(--text-secondary); line-height:1.6; font-size:0.925rem;">
            Detail-oriented Machine Learning Engineer with hands-on experience building and deploying 4+ end-to-end ML, NLP, and Generative AI applications using Python, Scikit-learn, LangChain, and FAISS. Skilled in data preprocessing, feature engineering, model evaluation, and RAG-based LLM systems, backed by a 5-month internship applying SQL and Power BI to deliver data-driven insights. Seeking a Machine Learning Engineer / AI Engineer / Data Scientist role to build scalable, production-ready AI solutions.
          </p>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--primary-light); margin-bottom:8px;"><i class="fas fa-laptop-code"></i> Technical Skills</h3>
          <ul style="padding-left:18px; color:var(--text-secondary); line-height:1.7; font-size:0.9rem;">
            <li><strong>Programming & Querying:</strong> Python, SQL</li>
            <li><strong>Data & Analysis:</strong> NumPy, Pandas, Matplotlib, EDA, Excel</li>
            <li><strong>ML Frameworks & Deployment:</strong> Scikit-learn, Streamlit, FastAPI, Docker</li>
            <li><strong>Visualization & BI:</strong> Matplotlib, Plotly</li>
            <li><strong>Version Control & Tools:</strong> Git, GitHub, Jupyter Notebook</li>
          </ul>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--primary-light); margin-bottom:8px;"><i class="fas fa-cogs"></i> Machine Learning Skills</h3>
          <ul style="padding-left:18px; color:var(--text-secondary); line-height:1.7; font-size:0.9rem;">
            <li><strong>Core ML:</strong> Data Preprocessing, Feature Engineering, Model Evaluation, Cross Validation, Hyperparameter Tuning</li>
            <li><strong>Algorithms:</strong> Linear Regression, Logistic Regression, KNN, Decision Tree, Random Forest, Naive Bayes, SVM</li>
            <li><strong>NLP:</strong> TF-IDF, NLTK, Text Classification</li>
            <li><strong>Generative AI:</strong> FAISS (Vector Search), Retrieval-Augmented Generation (RAG), LLM Applications</li>
          </ul>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--primary-light); margin-bottom:8px;"><i class="fas fa-project-diagram"></i> Key Projects</h3>
          <div style="margin-bottom:10px;">
            <p style="color:var(--text-primary); font-weight:700;">Heart Disease Prediction — End-to-End ML Application</p>
            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:4px;"><i>Technologies: Python, Scikit-learn, Streamlit, Pandas</i></p>
            <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.875rem; line-height:1.5;">
              <li>Engineered and deployed an end-to-end ML application enabling real-time heart disease risk prediction.</li>
              <li>Evaluated model performance using Accuracy, Precision, Recall, F1-score, and Confusion Matrix.</li>
            </ul>
          </div>

          <div style="margin-bottom:10px;">
            <p style="color:var(--text-primary); font-weight:700;">Customer Churn Prediction — Classification Model</p>
            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:4px;"><i>Technologies: Python, Scikit-learn, Streamlit, Pandas</i></p>
            <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.875rem; line-height:1.5;">
              <li>Developed customer churn model using multiple algorithms to identify at-risk customers with Streamlit serving interface.</li>
            </ul>
          </div>

          <div style="margin-bottom:10px;">
            <p style="color:var(--text-primary); font-weight:700;">AI-Powered PDF Financial Analysis Chatbot (RAG)</p>
            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:4px;"><i>Technologies: Python, LangChain, FAISS, Streamlit, Plotly</i></p>
            <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.875rem; line-height:1.5;">
              <li>Built RAG system using LangChain and FAISS for PDF document chunking, vector embeddings, and LLM Q&A.</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--primary-light); margin-bottom:8px;"><i class="fas fa-briefcase"></i> Internship & Experience</h3>
          <p style="color:var(--text-primary); font-weight:700;">Data Analyst Intern — Z3 Connect, Nagercoil (5 Months)</p>
          <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6;">
            Cleaned and preprocessed datasets using Python & Pandas, executed SQL database queries, and constructed interactive Power BI executive dashboards for business stakeholders.
          </p>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--primary-light); margin-bottom:8px;"><i class="fas fa-graduation-cap"></i> Education & Certifications</h3>
          <p style="color:var(--text-primary); font-weight:700;">Bachelor of Technology — Artificial Intelligence and Data Science (2022 – 2026)</p>
          <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:10px;">St. Xavier's Catholic College of Engineering, Nagercoil</p>
          <p style="color:var(--text-secondary); font-size:0.9rem;">
            <strong>Certifications:</strong> Data Science Certification (Networkz System) &nbsp;|&nbsp; Python Certification (Gelbero Pvt Limited)
          </p>
        </div>

        <div style="text-align:center; margin-top:24px;">
          <a href="assets/documents/Ebenazer_K_Resume.pdf" download class="btn btn-primary"><i class="fas fa-download"></i> Download Full Resume (PDF)</a>
        </div>
      `;
      projectModal.classList.add('active');
    });
  }

  // --- 13. Local RAG Knowledge Base & AI Chatbot Engine ---
  const chatbotToggle = document.getElementById('ai-chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInputField = document.getElementById('chatbot-input-field');
  const chatbotSendBtn = document.getElementById('chatbot-send-btn');

  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.toggle('active');
    });
  }

  if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener('click', () => {
      chatbotWindow.classList.remove('active');
    });
  }

  // Portfolio RAG Knowledge Base Chunks
  const portfolioKB = [
    {
      keywords: ['who', 'ebenazer', 'about', 'profile', 'bio', 'identity', 'summary'],
      answer: "Ebenazer K is a Machine Learning Engineer, AI Engineer, and Data Scientist based in Kanniyakumari, India. He graduated with a B.Tech in Artificial Intelligence & Data Science from St. Xavier's Catholic College of Engineering, Nagercoil."
    },
    {
      keywords: ['education', 'college', 'degree', 'btech', 'university', 'xavier'],
      answer: "Ebenazer K holds a Bachelor of Technology (B.Tech) degree in Artificial Intelligence and Data Science (2022–2026) from St. Xavier's Catholic College of Engineering, Nagercoil."
    },
    {
      keywords: ['projects', 'project', 'deployed', 'apps', 'work', 'churn', 'sales', 'heart', 'spam', 'knowledge', 'loan', 'approval', 'decision', 'tree'],
      answer: "Ebenazer has built and deployed 7 full-stack real applications:\n1. Customer Churn Prediction (Streamlit)\n2. Sales Data Analysis Dashboard (Plotly & Streamlit)\n3. Heart Disease Prediction (Streamlit)\n4. Student Performance Prediction (Streamlit)\n5. AI-Power Knowledge Interaction System (RAG & Streamlit)\n6. SMS Spam Detector (Render deployment)\n7. Loan Approval Prediction using Decision Tree (Streamlit Community Cloud)."
    },
    {
      keywords: ['internship', 'internships', 'experience', 'work', 'z3', 'singularium', 'hexcent', 'company', 'role'],
      answer: "Ebenazer has completed 3 professional internships:\n1. Z3 Connect (Data Analyst Intern, 5 Months) — Cleaned data, SQL queries, Power BI dashboards, KPI reports, ML feature support.\n2. Singularium Technology (Data Annotation Intern, 1 Month) — Image annotation, data labeling, dataset preparation, AI validation.\n3. Hexcent Pvt. Ltd. (Python Developer Intern, 1 Month) — Python app development, REST APIs, database integration, Git."
    },
    {
      keywords: ['skills', 'technologies', 'stack', 'languages', 'tools', 'python', 'sql', 'scikit', 'pandas'],
      answer: "Ebenazer's technical skills are organized into 6 categories:\n• Programming: Python, SQL\n• Machine Learning: Scikit-learn, TensorFlow, PyTorch, Feature Engineering, Model Evaluation, Data Preprocessing\n• Data Analysis: Pandas, NumPy, Matplotlib, Plotly, Power BI, Excel, Exploratory Data Analysis (EDA)\n• AI & NLP: Machine Learning, Artificial Intelligence, RAG & Vector Databases, Prompt Engineering, NLP (TF-IDF, Text Classification)\n• Deployment & Tools: Streamlit, REST APIs & Docker, Git & GitHub\n• Data Operations: Data Annotation"
    },
    {
      keywords: ['certifications', 'certificate', 'networkz', 'gelbero', 'credentials'],
      answer: "Ebenazer holds two professional certifications:\n1. Data Science Certification from Networkz System\n2. Python Certification from Gelbero Pvt Limited."
    },
    {
      keywords: ['contact', 'email', 'phone', 'location', 'linkedin', 'github', 'reach', 'hire'],
      answer: "You can reach Ebenazer K via:\n• Email: ebenazer890@gmail.com\n• Phone: +91 7558186327\n• Location: Kanniyakumari, India\n• LinkedIn: linkedin.com/in/ebenazerk\n• GitHub: github.com/ebenazer890"
    },
    {
      keywords: ['algorithms', 'algorithm', 'ml', 'models', 'classifier', 'regression'],
      answer: "Ebenazer works with Random Forest, Decision Trees, Logistic Regression, Naive Bayes (MultinomialNB), SVM, KNN, TF-IDF Vectorization, KMeans Clustering, and Vector Similarity Search."
    }
  ];

  function searchRAG(query) {
    const cleanQuery = query.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    portfolioKB.forEach(chunk => {
      let score = 0;
      chunk.keywords.forEach(kw => {
        if (cleanQuery.includes(kw)) score += 2;
      });
      if (score > maxScore) {
        maxScore = score;
        bestMatch = chunk.answer;
      }
    });

    if (maxScore > 0 && bestMatch) {
      return bestMatch;
    } else {
      return "Ebenazer K is a Machine Learning Engineer, AI Engineer, and Data Scientist with expertise in Python, ML models, RAG Chatbots, and Data Analytics. You can ask me about his projects, internships at Z3 Connect / Singularium / Hexcent, skills, or contact info!";
    }
  }

  function appendChatMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`;
    bubble.innerText = text;
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    if (sender === 'bot') {
      speakText(text);
    }
  }

  function handleUserChatInput(queryText) {
    const text = queryText || (chatbotInputField ? chatbotInputField.value.trim() : '');
    if (!text) return;

    appendChatMessage('user', text);
    if (chatbotInputField) chatbotInputField.value = '';

    // Activate scanner beam animation
    const scannerBeam = document.getElementById('chatbot-scanner-beam');
    if (scannerBeam) scannerBeam.classList.add('active');

    // Show temporary Robot thinking state bubble
    const thinkingBubble = document.createElement('div');
    thinkingBubble.className = 'chat-bubble chat-bubble-bot thinking-bubble';
    thinkingBubble.innerHTML = '🤖 <i class="fas fa-cog fa-spin"></i> AI Robot scanning knowledge base...';
    chatbotMessages.appendChild(thinkingBubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    setTimeout(() => {
      if (scannerBeam) scannerBeam.classList.remove('active');
      thinkingBubble.remove();
      const response = searchRAG(text);
      appendChatMessage('bot', response);
    }, 600);
  }

  if (chatbotSendBtn) {
    chatbotSendBtn.addEventListener('click', () => handleUserChatInput());
  }

  if (chatbotInputField) {
    chatbotInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserChatInput();
    });
  }

  document.querySelectorAll('.chat-suggest-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.getAttribute('data-query');
      handleUserChatInput(query);
    });
  });

  // --- 14. Contact Form Handling: Direct Gmail & WhatsApp Delivery ---
  const contactForm = document.getElementById('contact-form');
  const messageInput = document.getElementById('form-message');
  const charCounter = document.getElementById('char-count');
  const btnWhatsApp = document.getElementById('btn-send-whatsapp');

  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len > 450) {
        charCounter.style.color = '#ef4444';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  function getContactFormData() {
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = messageInput ? messageInput.value.trim() : '';
    return { name, email, subject, message };
  }

  function validateContactForm() {
    const data = getContactFormData();
    if (!data.name || !data.email || !data.subject || !data.message) {
      showToast('Please fill out all required fields before sending.', 'error');
      return false;
    }
    return data;
  }

  // 1. Send via Gmail
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = validateContactForm();
      if (!data) return;

      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${data.subject}`);
      const mailtoBody = encodeURIComponent(
        `Hello Ebenazer,\n\nYou have received a new contact inquiry from your portfolio website:\n\n` +
        `👤 Name: ${data.name}\n` +
        `📧 Email: ${data.email}\n` +
        `📌 Subject: ${data.subject}\n\n` +
        `💬 Message:\n${data.message}\n`
      );

      const mailtoUrl = `mailto:ebenazer890@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      window.open(mailtoUrl, '_blank');

      showToast(`Opening Gmail to deliver message from ${data.name} to ebenazer890@gmail.com!`, 'success');
      contactForm.reset();
      if (charCounter) charCounter.textContent = '0 / 500';
    });
  }

  // 2. Send via WhatsApp
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      const data = validateContactForm();
      if (!data) return;

      const waText = encodeURIComponent(
        `*New Inquiry from Ebenazer's Portfolio*\n\n` +
        `👤 *Name:* ${data.name}\n` +
        `📧 *Email:* ${data.email}\n` +
        `📌 *Subject:* ${data.subject}\n\n` +
        `💬 *Message:* ${data.message}`
      );

      const waUrl = `https://wa.me/917558186327?text=${waText}`;
      window.open(waUrl, '_blank');

      showToast(`Opening WhatsApp to send direct message to +91 7558186327!`, 'success');
      if (contactForm) contactForm.reset();
      if (charCounter) charCounter.textContent = '0 / 500';
    });
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `
      <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // --- 15. Scroll-to-Top Button ---
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 16. Dynamic Real-time GitHub API Fetcher ---
  async function fetchGitHubStats() {
    const reposElem = document.getElementById('gh-public-repos');
    const starsElem = document.getElementById('gh-total-stars');
    const followersElem = document.getElementById('gh-followers');
    const followingElem = document.getElementById('gh-following');
    const statusElem = document.getElementById('github-loading-status');

    if (!reposElem || !starsElem || !followersElem || !followingElem) return;

    try {
      // Fetch profile details
      const userRes = await fetch('https://api.github.com/users/ebenazer890');
      if (!userRes.ok) throw new Error('Failed to fetch user profile');
      const userData = await userRes.json();

      // Fetch public repos to calculate total stars
      const reposRes = await fetch('https://api.github.com/users/ebenazer890/repos?per_page=100');
      let totalStars = 0;
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      }

      // Populate live values
      const repoCount = userData.public_repos ? (userData.public_repos >= 20 ? `${userData.public_repos}+` : `${userData.public_repos}+`) : '20+';
      reposElem.textContent = repoCount;
      starsElem.textContent = `${totalStars} ⭐`;
      followersElem.textContent = userData.followers ?? '0';
      followingElem.textContent = userData.following ?? '0';

      if (statusElem) {
        statusElem.innerHTML = '<i class="fas fa-check-circle" style="color:var(--secondary);"></i> Live GitHub API';
      }
    } catch (err) {
      console.warn('GitHub API fetch fallback active:', err);
      reposElem.textContent = '20+';
      starsElem.textContent = '0 ⭐';
      followersElem.textContent = '0';
      followingElem.textContent = '0';
      if (statusElem) {
        statusElem.textContent = 'Live GitHub Profile (@ebenazer890)';
      }
    }
  }

  fetchGitHubStats();
});
