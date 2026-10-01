/*==================== HELPERS ====================*/
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

// Lets Enter / Space activate non-button elements that carry role="button" or role="tab"
document.addEventListener('keydown', (e) =>{
    const el = e.target
    if((e.key === 'Enter' || e.key === ' ') && el.matches('[role="button"], [role="tab"]')){
        e.preventDefault()
        el.click()
    }
})

/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

function setMenu(open){
    navMenu.classList.toggle('show-menu', open)
    if(navToggle) navToggle.setAttribute('aria-expanded', open)
}

/*====MENU SHOW ====*/
/*validate if constant exist*/
if(navToggle){
    navToggle.addEventListener('click', () => setMenu(true))
}

/*====MENU HIDDEN ====*/
/*validate if constant exist*/
if (navClose) {
    navClose.addEventListener('click', () => setMenu(false))
}

// Close the mobile menu with Escape or by tapping outside it
document.addEventListener('keydown', (e) =>{
    if(e.key === 'Escape' && navMenu.classList.contains('show-menu')) setMenu(false)
})
document.addEventListener('click', (e) =>{
    if(navMenu.classList.contains('show-menu') && !navMenu.contains(e.target) && !navToggle.contains(e.target)){
        setMenu(false)
    }
})

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav_link')

function linkAction(){
    // When we click on each nav_link, we remove the show-menu class
    setMenu(false)
}
navLink.forEach(n => n.addEventListener('click', linkAction))


/*==================== ACCORDION SKILLLS ====================*/
const skillsContent = document.querySelectorAll('.skills_content'),
      skillsHeader = document.querySelectorAll('.skills_header')

function toggleSkills(){
    const item = this.parentNode
    const wasClosed = item.classList.contains('skills_close')

    skillsContent.forEach(content =>{
        content.classList.remove('skills_open')
        content.classList.add('skills_close')
        content.querySelector('.skills_header').setAttribute('aria-expanded', 'false')
    })
    if(wasClosed){
        item.classList.remove('skills_close')
        item.classList.add('skills_open')
        this.setAttribute('aria-expanded', 'true')
    }
}

skillsHeader.forEach((el) =>{
    el.setAttribute('aria-expanded', el.parentNode.classList.contains('skills_open'))
    el.addEventListener('click', toggleSkills)
})



/*==================== QUALIFICATION TABS ====================*/
const tabs = document.querySelectorAll('[data-target]'),
      tabsContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab =>{
    tab.addEventListener('click', () =>{
        const target = document.querySelector(tab.dataset.target)

        tabsContents.forEach(tabContent =>{
            tabContent.classList.remove('qualification_active')
        })

        target.classList.add('qualification_active')

        tabs.forEach(t =>{
            t.classList.remove('qualification_active')
            t.setAttribute('aria-selected', 'false')
        })
        tab.classList.add('qualification_active')
        tab.setAttribute('aria-selected', 'true')
    })
})

/*==================== SERVICES MODAL ====================*/
const modalViews = document.querySelectorAll('.services_modal'),
      modalBtns = document.querySelectorAll('.services_button'),
      modalCloses = document.querySelectorAll('.services_modal-close')

let lastModalTrigger = null

// Move modals out of the cards so the cards' hover transform can't trap the fixed overlay
modalViews.forEach(modalView => document.body.appendChild(modalView))

let modal = function(modalClick){
    modalViews[modalClick].classList.add('active-modal')
    modalViews[modalClick].querySelector('.services_modal-close').focus()
}

function closeModals(){
    modalViews.forEach((modalView) =>{
        modalView.classList.remove('active-modal')
    })
    if(lastModalTrigger) lastModalTrigger.focus()
}

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () =>{
        lastModalTrigger = modalBtn
        modal(i)
    })
})

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', closeModals)
})

// Close by clicking the backdrop or pressing Escape
modalViews.forEach((modalView) =>{
    modalView.addEventListener('click', (e) =>{
        if(e.target === modalView) closeModals()
    })
})
document.addEventListener('keydown', (e) =>{
    if(e.key === 'Escape' && document.querySelector('.active-modal')) closeModals()
})

/*==================== PORTFOLIO SWIPER ====================*/
// cssMode was removed: combined with loop it opened on the last project and froze the arrows
const portfolioSlider = document.querySelector('.portfolio_slider')

let swiperPortfolio = new Swiper(".portfolio_container", {
    loop:true,
    speed: 600,
    grabCursor: true,

    navigation: {
      nextEl: portfolioSlider.querySelector(".swiper-button-next"),
      prevEl: portfolioSlider.querySelector(".swiper-button-prev"),
    },
    pagination: {
      el: portfolioSlider.querySelector(".swiper-pagination"),
      clickable: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
  });

/*==================== TESTIMONIAL ====================*/
let swiperTestimonial = new Swiper(".testimonial_container", {
    loop:true,
    grabCursor: true,
    spaceBetween: 48,
    speed: 700,
    autoplay: prefersReducedMotion.matches ? false : {
      delay: 5500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints:{
        568:{
            slidesPerView: 2,
        }
    }
  });

/*==================== SCROLL REVEAL ANIMATIONS ====================*/
// Elements with data-reveal="up|left|right|scale|fade" animate in once they enter the viewport.
// Siblings revealed together are staggered slightly.
const revealEls = document.querySelectorAll('[data-reveal]')

revealEls.forEach(el =>{
    const siblings = [...el.parentNode.children].filter(c => c.hasAttribute('data-reveal'))
    const index = siblings.indexOf(el)
    if(index > 0) el.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 110}ms`)
})

if('IntersectionObserver' in window && !prefersReducedMotion.matches){
    const revealObserver = new IntersectionObserver((entries, observer) =>{
        entries.forEach(entry =>{
            if(entry.isIntersecting){
                entry.target.classList.add('is-visible')
                observer.unobserve(entry.target)
            }
        })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

    revealEls.forEach(el => revealObserver.observe(el))
}else{
    revealEls.forEach(el => el.classList.add('is-visible'))
}

/*==================== SKILL BARS ====================*/
// Bars fill only once the Skills section is on screen
const skillsContainer = document.getElementById('skills-container')

if(skillsContainer){
    if('IntersectionObserver' in window){
        const skillsObserver = new IntersectionObserver((entries, observer) =>{
            if(entries[0].isIntersecting){
                skillsContainer.classList.add('skills-animated')
                observer.disconnect()
            }
        }, { threshold: 0.3 })
        skillsObserver.observe(skillsContainer)
    }else{
        skillsContainer.classList.add('skills-animated')
    }
}

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 120
        const sectionId = current.getAttribute('id')
        const link = document.querySelector('.nav_menu a[href="#' + sectionId + '"]')

        // Sections without a nav link (e.g. qualification) are skipped
        if(!link) return

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            link.classList.add('active-link')
        }else{
            link.classList.remove('active-link')
        }
    })
}

/*====================CHANGE BACKGROUND HEADER ====================*/
const header = document.getElementById('header')

function scrollHeader(){
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(window.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}

/*====================SHOW SCROLL UP ====================*/
const scrollUpBtn = document.getElementById('scroll-up')

function scrollUp(){
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(window.scrollY >= 560) scrollUpBtn.classList.add('show-scroll'); else scrollUpBtn.classList.remove('show-scroll')
}

// One rAF-throttled listener for all scroll-driven UI
let scrollTicking = false
window.addEventListener('scroll', () =>{
    if(scrollTicking) return
    scrollTicking = true
    requestAnimationFrame(() =>{
        scrollActive()
        scrollHeader()
        scrollUp()
        scrollTicking = false
    })
}, { passive: true })
scrollActive()
scrollHeader()
scrollUp()


/*====================DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})


/*==================== CONTACT FORM ====================*/
// Submissions are delivered to brightmbulle@gmail.com by Web3Forms (https://web3forms.com).
// The access key below is a PUBLIC key by design: it can only send mail to the inbox it
// was created for, so it is safe in client-side code. It is not a secret / private API key.
// Setup: create a key for brightmbulle@gmail.com at https://web3forms.com and paste it here.
const CONTACT_FORM_CONFIG = {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
    recipient: 'brightmbulle@gmail.com',
    timeZone: 'Africa/Douala',
}

const contactForm = document.getElementById('contact-form')

if(contactForm){
    const contactButton = contactForm.querySelector('.contact_button'),
          contactButtonText = contactForm.querySelector('.contact_button-text'),
          contactStatus = document.getElementById('contact-status'),
          emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

    const validators = {
        name: v => v.length >= 2 || 'Please enter your name.',
        email: v => !v ? 'Please enter your email address.' : emailPattern.test(v) || 'Please enter a valid email address (e.g. name@example.com).',
        project: v => v.length >= 2 || 'Please tell me what the project is about.',
        message: v => v.length >= 10 || 'Please write a message (at least 10 characters).',
    }

    function validateField(field){
        const check = validators[field.name]
        if(!check) return true
        const result = check(field.value.trim())
        const error = document.getElementById(field.getAttribute('aria-describedby'))
        const valid = result === true

        field.closest('.contact_field').classList.toggle('contact_field--invalid', !valid)
        field.setAttribute('aria-invalid', !valid)
        error.textContent = valid ? '' : result
        return valid
    }

    function showStatus(type, html){
        contactStatus.className = `contact_status contact_status--${type}`
        contactStatus.innerHTML = html
        contactStatus.hidden = false
    }

    function setSubmitting(isSubmitting){
        contactButton.disabled = isSubmitting
        contactButton.classList.toggle('is-loading', isSubmitting)
        contactButton.setAttribute('aria-busy', isSubmitting)
        contactButtonText.textContent = isSubmitting ? 'Sending...' : 'Send Message'
    }

    const fields = [...contactForm.querySelectorAll('.contact_input')]

    // Validate on blur, then live once a field has shown an error
    fields.forEach(field =>{
        field.addEventListener('blur', () =>{ if(field.value.trim()) validateField(field) })
        field.addEventListener('input', () =>{
            if(field.getAttribute('aria-invalid') === 'true') validateField(field)
        })
    })

    let isSending = false

    contactForm.addEventListener('submit', async (e) =>{
        e.preventDefault()
        if(isSending) return

        // Validate every field so all errors show at once, then focus the first one
        const results = fields.map(validateField)
        const firstInvalid = fields[results.indexOf(false)]
        if(firstInvalid){
            firstInvalid.focus()
            contactStatus.hidden = true
            return
        }

        if(!CONTACT_FORM_CONFIG.accessKey || CONTACT_FORM_CONFIG.accessKey.startsWith('YOUR_')){
            console.error('Contact form: set CONTACT_FORM_CONFIG.accessKey in assets/js/main.js')
            showStatus('error', `The contact form isn't set up yet. Please email me directly at <a href="mailto:${CONTACT_FORM_CONFIG.recipient}">${CONTACT_FORM_CONFIG.recipient}</a>.`)
            return
        }

        // Honeypot ticked = bot: pretend it worked, send nothing
        if(contactForm.botcheck.checked){
            showStatus('success', "Thank you! Your message has been sent successfully. I'll get back to you soon.")
            contactForm.reset()
            return
        }

        const data = Object.fromEntries(new FormData(contactForm))
        const name = data.name.trim(),
              email = data.email.trim(),
              project = data.project.trim(),
              message = data.message.trim()

        const submittedAt = new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'full', timeStyle: 'long', timeZone: CONTACT_FORM_CONFIG.timeZone,
        }).format(new Date())

        const payload = {
            access_key: CONTACT_FORM_CONFIG.accessKey,
            subject: `New portfolio enquiry from ${name}: ${project}`,
            from_name: 'Bright Mbulle Portfolio',
            replyto: email,
            name,
            email,
            project,
            message,
            submitted_at: submittedAt,
            page: window.location.href,
        }

        isSending = true
        setSubmitting(true)
        contactStatus.hidden = true

        try{
            const response = await fetch(CONTACT_FORM_CONFIG.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload),
            })
            const result = await response.json().catch(() => ({}))

            if(!response.ok || !result.success){
                throw new Error(result.message || `Request failed with status ${response.status}`)
            }

            showStatus('success', "Thank you! Your message has been sent successfully. I'll get back to you soon.")
            contactForm.reset()
            fields.forEach(field =>{
                field.removeAttribute('aria-invalid')
                field.closest('.contact_field').classList.remove('contact_field--invalid')
            })
        }catch(err){
            console.error('Contact form error:', err)
            showStatus('error', `Sorry, your message couldn't be sent. Please try again in a moment, or email me directly at <a href="mailto:${CONTACT_FORM_CONFIG.recipient}">${CONTACT_FORM_CONFIG.recipient}</a>.`)
        }finally{
            isSending = false
            setSubmitting(false)
        }
    })
}
