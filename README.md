# AdukWeb
Aduk studios website

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aduk Studios - Where Vision Becomes Reality</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
        /* Global Styles */
        :root {
            --primary: #8A2BE2;
            --primary-dark: #6A0DAD;
            --secondary: #FF6B35;
            --dark: #0A0A14;
            --light: #F8F9FA;
            --gray: #6C757D;
            --transition: all 0.3s ease;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            color: var(--light);
            background-color: var(--dark);
            overflow-x: hidden;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1rem;
        }
        
        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        section {
            padding: 80px 0;
        }
        
        .section-title {
            text-align: center;
            margin-bottom: 60px;
            position: relative;
        }
        
        .section-title h2 {
            font-size: 2.8rem;
            color: var(--light);
            display: inline-block;
            position: relative;
        }
        
        .section-title h2:after {
            content: '';
            position: absolute;
            width: 70px;
            height: 4px;
            background: var(--secondary);
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 2px;
        }
        
        .section-subtitle {
            text-align: center;
            color: var(--gray);
            font-size: 1.1rem;
            max-width: 700px;
            margin: 0 auto 30px;
        }
        
        .btn {
            display: inline-block;
            background: linear-gradient(to right, var(--primary), var(--primary-dark));
            color: white;
            padding: 14px 32px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
            background: linear-gradient(to right, var(--primary-dark), var(--primary));
        }
        
        .btn-secondary {
            background: linear-gradient(to right, var(--secondary), #E5561C);
        }
        
        .btn-secondary:hover {
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        
        /* Header & Navigation */
        header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            padding: 20px 0;
            transition: var(--transition);
            background-color: rgba(10, 10, 20, 0.95);
            backdrop-filter: blur(10px);
        }
        
        header.scrolled {
            padding: 15px 0;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }
        
        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
        }
        
        .logo-text {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-size: 1.8rem;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-left: 10px;
        }
        
        .logo-icon {
            font-size: 2rem;
            color: var(--primary);
        }
        
        nav ul {
            display: flex;
            list-style: none;
        }
        
        nav ul li {
            margin-left: 30px;
        }
        
        nav ul li a {
            color: var(--light);
            text-decoration: none;
            font-weight: 500;
            font-size: 1rem;
            transition: var(--transition);
            position: relative;
        }
        
        nav ul li a:after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            background: var(--secondary);
            left: 0;
            bottom: -5px;
            transition: var(--transition);
        }
        
        nav ul li a:hover {
            color: var(--secondary);
        }
        
        nav ul li a:hover:after {
            width: 100%;
        }
        
        .mobile-menu-btn {
            display: none;
            font-size: 1.5rem;
            color: var(--light);
            cursor: pointer;
        }
        
        /* Hero Section */
        .hero {
            padding-top: 160px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(rgba(10, 10, 20, 0.9), rgba(10, 10, 20, 0.9)), 
                        url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            position: relative;
            overflow: hidden;
        }
        
        .hero:before {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, rgba(138, 43, 226, 0) 70%);
            top: -250px;
            right: -250px;
        }
        
        .hero:after {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, rgba(255, 107, 53, 0) 70%);
            bottom: -150px;
            left: -150px;
        }
        
        .hero-content {
            max-width: 800px;
            position: relative;
            z-index: 1;
        }
        
        .hero h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.1;
        }
        
        .hero-tagline {
            font-size: 1.8rem;
            margin-bottom: 25px;
            color: var(--light);
            font-weight: 300;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            color: rgba(255, 255, 255, 0.8);
            max-width: 700px;
        }
        
        .hero-btns {
            display: flex;
            gap: 20px;
            margin-top: 40px;
        }
        
        /* Studio Overview */
        .overview {
            background-color: #11111F;
        }
        
        .overview-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }
        
        .overview-image {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        .overview-image img {
            width: 100%;
            height: auto;
            display: block;
            transition: var(--transition);
        }
        
        .overview-image:hover img {
            transform: scale(1.05);
        }
        
        .overview-text h3 {
            font-size: 2rem;
            margin-bottom: 20px;
            color: var(--light);
        }
        
        .overview-text p {
            margin-bottom: 20px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .brand-values {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 30px;
        }
        
        .value-tag {
            background: rgba(138, 43, 226, 0.1);
            border: 1px solid rgba(138, 43, 226, 0.3);
            color: var(--primary);
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        /* Divisions Section */
        .divisions {
            background-color: var(--dark);
        }
        
        .divisions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
        }
        
        .division-card {
            background: #1A1A2E;
            border-radius: 10px;
            overflow: hidden;
            transition: var(--transition);
            border: 1px solid rgba(255, 255, 255, 0.05);
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        
        .division-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
            border-color: rgba(138, 43, 226, 0.3);
        }
        
        .division-icon {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            color: var(--primary);
            background: rgba(138, 43, 226, 0.05);
        }
        
        .division-content {
            padding: 30px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        
        .division-content h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: var(--light);
        }
        
        .division-content p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 20px;
            flex-grow: 1;
        }
        
        .division-services {
            list-style: none;
            margin-top: 20px;
        }
        
        .division-services li {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 8px;
            font-size: 0.95rem;
            display: flex;
            align-items: flex-start;
        }
        
        .division-services li:before {
            content: '✓';
            color: var(--secondary);
            font-weight: bold;
            margin-right: 10px;
            flex-shrink: 0;
        }
        
        /* Team Section */
        .team {
            background-color: #11111F;
        }
        
        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        
        .team-card {
            background: #1A1A2E;
            border-radius: 10px;
            overflow: hidden;
            transition: var(--transition);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .team-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            border-color: rgba(138, 43, 226, 0.3);
        }
        
        .team-img {
            height: 200px;
            background: linear-gradient(to right, var(--primary-dark), var(--primary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: white;
        }
        
        .team-info {
            padding: 25px;
        }
        
        .team-info h4 {
            font-size: 1.3rem;
            margin-bottom: 5px;
            color: var(--light);
        }
        
        .team-info .role {
            color: var(--secondary);
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 10px;
            display: block;
        }
        
        .team-info .period {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
        }
        
        /* Projects Section */
        .projects {
            background-color: var(--dark);
        }
        
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .project-card {
            background: #1A1A2E;
            border-radius: 10px;
            overflow: hidden;
            transition: var(--transition);
        }
        
        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
        }
        
        .project-img {
            height: 200px;
            background: linear-gradient(to right, #2c3e50, #4ca1af);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: white;
        }
        
        .project-content {
            padding: 25px;
        }
        
        .project-content h4 {
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: var(--light);
        }
        
        .project-content p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
        }
        
        /* Contact Section */
        .contact {
            background-color: #11111F;
        }
        
        .contact-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 50px;
        }
        
        .contact-info h3 {
            font-size: 1.8rem;
            margin-bottom: 20px;
            color: var(--light);
        }
        
        .contact-details {
            list-style: none;
            margin-top: 30px;
        }
        
        .contact-details li {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .contact-details li i {
            font-size: 1.2rem;
            color: var(--primary);
            margin-right: 15px;
            width: 30px;
        }
        
        .social-links {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .social-link {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: rgba(138, 43, 226, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 1.2rem;
            transition: var(--transition);
        }
        
        .social-link:hover {
            background: var(--primary);
            color: white;
            transform: translateY(-3px);
        }
        
        .contact-form .form-group {
            margin-bottom: 20px;
        }
        
        .contact-form input,
        .contact-form textarea {
            width: 100%;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            color: var(--light);
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            transition: var(--transition);
        }
        
        .contact-form input:focus,
        .contact-form textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.2);
        }
        
        .contact-form textarea {
            min-height: 150px;
            resize: vertical;
        }
        
        /* Footer */
        footer {
            background-color: #0A0A14;
            padding: 60px 0 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .footer-logo {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-size: 2rem;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
        }
        
        .footer-about p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 20px;
        }
        
        .footer-links h4,
        .footer-contact h4 {
            font-size: 1.3rem;
            margin-bottom: 20px;
            color: var(--light);
        }
        
        .footer-links ul {
            list-style: none;
        }
        
        .footer-links ul li {
            margin-bottom: 12px;
        }
        
        .footer-links ul li a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: var(--transition);
        }
        
        .footer-links ul li a:hover {
            color: var(--secondary);
            padding-left: 5px;
        }
        
        .footer-contact p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .footer-contact p i {
            margin-right: 10px;
            color: var(--primary);
        }
        
        .copyright {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
        }
        
        /* Responsive Styles */
        @media (max-width: 992px) {
            .hero h1 {
                font-size: 3.2rem;
            }
            
            .overview-content {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            
            .overview-image {
                order: 2;
            }
            
            .overview-text {
                order: 1;
            }
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
            
            nav {
                position: fixed;
                top: 80px;
                left: 0;
                width: 100%;
                background-color: rgba(10, 10, 20, 0.98);
                backdrop-filter: blur(10px);
                padding: 20px;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: var(--transition);
            }
            
            nav.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            nav ul {
                flex-direction: column;
            }
            
            nav ul li {
                margin: 0 0 15px 0;
            }
            
            .hero h1 {
                font-size: 2.8rem;
            }
            
            .hero-tagline {
                font-size: 1.5rem;
            }
            
            .section-title h2 {
                font-size: 2.2rem;
            }
            
            .hero-btns {
                flex-direction: column;
                align-items: flex-start;
            }
        }
        
        @media (max-width: 576px) {
            .hero h1 {
                font-size: 2.2rem;
            }
            
            .hero-tagline {
                font-size: 1.3rem;
            }
            
            section {
                padding: 60px 0;
            }
            
            .section-title h2 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <!-- Header & Navigation -->
    <header id="header">
        <div class="container header-container">
            <div class="logo">
                <div class="logo-icon">
                    <i class="fas fa-film"></i>
                </div>
                <div class="logo-text">ADUK STUDIOS</div>
            </div>
            
            <div class="mobile-menu-btn" id="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>
            
            <nav id="nav-menu">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#overview">Overview</a></li>
                    <li><a href="#divisions">Divisions</a></li>
                    <li><a href="#team">Team</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="container">
            <div class="hero-content">
                <h1>From Vision to VFX</h1>
                <div class="hero-tagline">Where Art Meets Innovation</div>
                <p>Aduk Studios is a premier multimedia and entertainment studio based in Zimbabwe, offering full-scale creative production across music, film, design, and live events. Known for merging cutting-edge technology with bold storytelling.</p>
                <div class="hero-btns">
                    <a href="#contact" class="btn">Book a Session</a>
                    <a href="#divisions" class="btn btn-secondary">Our Services</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Studio Overview -->
    <section class="overview" id="overview">
        <div class="container">
            <div class="section-title">
                <h2>Studio Overview</h2>
            </div>
            <div class="section-subtitle">
                A creative force behind some of the most compelling visuals, sound, and live experiences in Africa's rising entertainment landscape.
            </div>
            
            <div class="overview-content">
                <div class="overview-text">
                    <h3>Create. Captivate. Celebrate.</h3>
                    <p>Founded with a mission to centralize creative tools under one roof, the studio serves as a launchpad for artists, visionaries, and businesses looking to produce industry-standard work with global appeal.</p>
                    <p><strong>Founded:</strong> Early 2020s</p>
                    <p><strong>Founder:</strong> Kudakwashe Chatyoka (ChaBanger)</p>
                    <p><strong>Headquarters:</strong> Gweru, Zimbabwe</p>
                    
                    <div class="brand-values">
                        <span class="value-tag">Integrity</span>
                        <span class="value-tag">Creativity</span>
                        <span class="value-tag">Collaboration</span>
                        <span class="value-tag">Excellence</span>
                        <span class="value-tag">Empowerment</span>
                        <span class="value-tag">Cultural Fusion</span>
                    </div>
                </div>
                <div class="overview-image">
                    <!-- Studio image placeholder - replace with actual image -->
                    <div style="width: 100%; height: 400px; background: linear-gradient(to right, #8A2BE2, #6A0DAD); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                        <i class="fas fa-video"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Divisions Section -->
    <section class="divisions" id="divisions">
        <div class="container">
            <div class="section-title">
                <h2>Our Divisions & Services</h2>
            </div>
            <div class="section-subtitle">
                One studio. Endless possibilities. Explore our comprehensive creative services.
            </div>
            
            <div class="divisions-grid">
                <!-- Aduk Studio (Music) -->
                <div class="division-card">
                    <div class="division-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="division-content">
                        <h3>Aduk Studio (Music)</h3>
                        <p>Where raw sound becomes a mastered anthem. Full audio production for artists who demand clarity, creativity, and control.</p>
                        <ul class="division-services">
                            <li>Studio Recording</li>
                            <li>Mixing & Mastering</li>
                            <li>Vocal Engineering</li>
                            <li>Music Production</li>
                            <li>Jingles & Voice Overs</li>
                            <li>Event DJ's & MC's</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Aduk Visuals & VFX -->
                <div class="division-card">
                    <div class="division-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="division-content">
                        <h3>Aduk Visuals & VFX</h3>
                        <p>Your visuals. Reimagined with gravity-defying flair. Cinematic production for music videos, films, and branded content.</p>
                        <ul class="division-services">
                            <li>4K Cinematic Video Production</li>
                            <li>Visual Effects (VFX & CGI)</li>
                            <li>Green Screen Compositing</li>
                            <li>Motion Graphics</li>
                            <li>Short Film Direction</li>
                            <li>High-Definition Photography</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Aduk Design Lab -->
                <div class="division-card">
                    <div class="division-icon">
                        <i class="fas fa-paint-brush"></i>
                    </div>
                    <div class="division-content">
                        <h3>Aduk Design Lab</h3>
                        <p>Every pixel, a purpose. Fashion, graphic and motion design to bring ideas to life and make brands unforgettable.</p>
                        <ul class="division-services">
                            <li>Logo Design & Brand Kits</li>
                            <li>Album/Single Cover Art</li>
                            <li>Motion Posters</li>
                            <li>Social Media Packs</li>
                            <li>Custom Clothing & Upholstery</li>
                            <li>Printing Services</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Aduk Entertainment (Events) -->
                <div class="division-card">
                    <div class="division-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="division-content">
                        <h3>Aduk Entertainment (Events)</h3>
                        <p>We don't plan events—we produce experiences. Full service event production for private, public, and corporate spaces.</p>
                        <ul class="division-services">
                            <li>Event Planning & Coordination</li>
                            <li>Set Design & Décor</li>
                            <li>DMX Lighting & Stage Effects</li>
                            <li>Sound System Installation</li>
                            <li>Wedding & Ceremony Curation</li>
                            <li>Music Festivals & Concerts</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="team" id="team">
        <div class="container">
            <div class="section-title">
                <h2>Our Creative Team</h2>
            </div>
            <div class="section-subtitle">
                Meet the talented individuals who make the magic happen at Aduk Studios.
            </div>
            
            <div class="team-grid">
                <!-- Team Member 1 -->
                <div class="team-card">
                    <div class="team-img">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="team-info">
                        <h4>ChaBanger</h4>
                        <span class="role">Chief Executive Officer / Founder</span>
                        <p class="period">Founder</p>
                    </div>
                </div>
                
                <!-- Team Member 2 -->
                <div class="team-card">
                    <div class="team-img">
                        <i class="fas fa-headphones"></i>
                    </div>
                    <div class="team-info">
                        <h4>DJ Max850Magixian</h4>
                        <span class="role">Aduk Music Executive Director</span>
                        <p class="period">2024 - Current</p>
                    </div>
                </div>
                
                <!-- Team Member 3 -->
                <div class="team-card">
                    <div class="team-img">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="team-info">
                        <h4>Dir 5G (Muyenzi)</h4>
                        <span class="role">Aduk Visuals Director</span>
                        <p class="period">2024 - Current</p>
                    </div>
                </div>
                
                <!-- Team Member 4 -->
                <div class="team-card">
                    <div class="team-img">
                        <i class="fas fa-microphone"></i>
                    </div>
                    <div class="team-info">
                        <h4>FK Scott</h4>
                        <span class="role">Marketing Manager / Artist</span>
                        <p class="period">2022 - Current</p>
                    </div>
                </div>
            </div>
            
            <!-- Artists Section -->
            <div class="section-title" style="margin-top: 80px;">
                <h2>Signed Artists</h2>
            </div>
            
            <div class="team-grid">
                <div class="team-card">
                    <div class="team-img" style="background: linear-gradient(to right, #FF6B35, #E5561C);">
                        <i class="fas fa-microphone-alt"></i>
                    </div>
                    <div class="team-info">
                        <h4>Maki Wacho</h4>
                        <span class="role">Signed Afro Fusion Artist</span>
                        <p class="period">2024 - Current</p>
                    </div>
                </div>
                
                <div class="team-card">
                    <div class="team-img" style="background: linear-gradient(to right, #2193b0, #6dd5ed);">
                        <i class="fas fa-microphone-alt"></i>
                    </div>
                    <div class="team-info">
                        <h4>Blue Chillzy</h4>
                        <span class="role">Signed Hiphop Artist</span>
                        <p class="period">2025 - Current</p>
                    </div>
                </div>
                
                <div class="team-card">
                    <div class="team-img" style="background: linear-gradient(to right, #8e2de2, #4a00e0);">
                        <i class="fas fa-microphone-alt"></i>
                    </div>
                    <div class="team-info">
                        <h4>Ley25</h4>
                        <span class="role">Signed Hiphop / Trap Artist</span>
                        <p class="period">2022 - Current</p>
                    </div>
                </div>
                
                <div class="team-card">
                    <div class="team-img" style="background: linear-gradient(to right, #f46b45, #eea849);">
                        <i class="fas fa-microphone-alt"></i>
                    </div>
                    <div class="team-info">
                        <h4>Alkatel</h4>
                        <span class="role">Signed Dancehall Artist</span>
                        <p class="period">2022 - Current</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section class="projects" id="projects">
        <div class="container">
            <div class="section-title">
                <h2>Notable Productions & Projects</h2>
            </div>
            <div class="section-subtitle">
                A showcase of our most impactful creative works that demonstrate our studio's capabilities.
            </div>
            
            <div class="projects-grid">
                <!-- Project 1 -->
                <div class="project-card">
                    <div class="project-img">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="project-content">
                        <h4>Maki Wacho – "Kupetera Ipapo"</h4>
                        <p>An urban music video and cover art showcasing vibrant daily themes and industry-dominant visuals.</p>
                    </div>
                </div>
                
                <!-- Project 2 -->
                <div class="project-card">
                    <div class="project-img" style="background: linear-gradient(to right, #2c3e50, #3498db);">
                        <i class="fas fa-film"></i>
                    </div>
                    <div class="project-content">
                        <h4>Blue Chillzy – "Man from Cholocho"</h4>
                        <p>Professionally scripted video production integrating creative visual effects, camera work, lighting, and street narrative.</p>
                    </div>
                </div>
                
                <!-- Project 3 -->
                <div class="project-card">
                    <div class="project-img" style="background: linear-gradient(to right, #8E2DE2, #4A00E0);">
                        <i class="fas fa-compact-disc"></i>
                    </div>
                    <div class="project-content">
                        <h4>Dj Max850Magixian - "PaRoma Cypher"</h4>
                        <p>High-energy DJ performance showcasing tight mixing and curation for the dancefloor.</p>
                    </div>
                </div>
                
                <!-- Project 4 -->
                <div class="project-card">
                    <div class="project-img" style="background: linear-gradient(to right, #FF6B35, #F9C74F);">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="project-content">
                        <h4>ChaBanger - "Mixtapes"</h4>
                        <p>Genre-specific DJ performance mixtapes with tightly curated BPM for Amapiano, Afro, Dancehall, Hip-Hop, and Drill stage shows.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact" id="contact">
        <div class="container">
            <div class="section-title">
                <h2>Contact Us</h2>
            </div>
            <div class="section-subtitle">
                Ready to bring your creative vision to life? Get in touch with our team today.
            </div>
            
            <div class="contact-container">
                <div class="contact-info">
                    <h3>Get In Touch</h3>
                    <p>Whether you're an artist looking to record your next hit, a business needing branding, or planning an unforgettable event, Aduk Studios is here to help.</p>
                    
                    <ul class="contact-details">
                        <li>
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Gweru, Zimbabwe</span>
                        </li>
                        <li>
                            <i class="fas fa-phone"></i>
                            <span>+263776105031</span>
                        </li>
                        <li>
                            <i class="fas fa-envelope"></i>
                            <span>adukstudios@gmail.com</span>
                        </li>
                        <li>
                            <i class="fas fa-clock"></i>
                            <span>Mon-Fri: 8AM - 4PM | Sat: 8AM - 12PM</span>
                        </li>
                    </ul>
                    
                    <div class="social-links">
                        <a href="https://youtube.com" target="_blank" class="social-link">
                            <i class="fab fa-youtube"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" class="social-link">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" class="social-link">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://tiktok.com" target="_blank" class="social-link">
                            <i class="fab fa-tiktok"></i>
                        </a>
                        <a href="https://x.com" target="_blank" class="social-link">
                            <i class="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>
                
                <div class="contact-form">
                    <form id="contactForm">
                        <div class="form-group">
                            <input type="text" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <input type="email" placeholder="Your Email" required>
                        </div>
                        <div class="form-group">
                            <input type="text" placeholder="Subject" required>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Your Message" required></textarea>
                        </div>
                        <button type="submit" class="btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-about">
                    <div class="footer-logo">ADUK STUDIOS</div>
                    <p>From Vision to VFX: Where Art Meets Innovation. A premier multimedia and entertainment studio based in Zimbabwe, offering full-scale creative production.</p>
                    <p>"In a world of noise, we create moments that speak forever."</p>
                </div>
                
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#overview">Studio Overview</a></li>
                        <li><a href="#divisions">Our Services</a></li>
                        <li><a href="#team">Our Team</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                    </ul>
                </div>
                
                <div class="footer-contact">
                    <h4>Contact Info</h4>
                    <p><i class="fas fa-globe"></i> www.adukinc.co.zw</p>
                    <p><i class="fas fa-envelope"></i> adukstudios@gmail.com</p>
                    <p><i class="fas fa-phone"></i> +263 776 105 031</p>
                    <p><i class="fas fa-map-marker-alt"></i> Gweru, Zimbabwe</p>
                </div>
            </div>
            
            <div class="copyright">
                <p>&copy; 2024 Aduk Studios. All Rights Reserved. | "Create. Captivate. Celebrate."</p>
                <p style="margin-top: 10px;">Designed with passion for creative excellence.</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Form submission handling
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
        
        // Add animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.division-card, .team-card, .project-card').forEach(el => {
            observer.observe(el);
        });
    </script>
</body>
</html>
