// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Sticky Header Effect
const header = document.getElementById('header');
// lastScrollTop no se usa, se puede eliminar si no hay lógica de dirección de scroll
// let lastScrollTop = 0; 

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    // lastScrollTop = scrollTop; // Puedes eliminar esta línea
});

// FAQ Accordion Functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Cierra todos los ítems FAQ que no sean el actual
        faqItems.forEach(faqItem => {
            if (faqItem !== item) {
                faqItem.classList.remove('active');
            }
        });
        
        // Alterna el estado del ítem clickeado
        item.classList.toggle('active');
    });
});

// Smooth Scrolling for Anchor Links
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Handling (Modificado para Formspree y mensajes personalizados)
const contactForm = document.querySelector('.contact-form');
const formSuccessMessage = document.querySelector('.form-success-message');

// Elementos del modal personalizado
const customModal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalIcon = document.getElementById('modal-icon');
const closeButton = document.querySelector('.close-button');

// Función para mostrar el modal
function showModal(title, message, isSuccess = false) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.className = ''; // Limpiar clases anteriores

    if (isSuccess) {
        modalIcon.classList.add('fas', 'fa-check-circle', 'success-icon');
        customModal.classList.add('modal-success'); // Clase para estilos de éxito
        customModal.classList.remove('modal-error');
    } else {
        modalIcon.classList.add('fas', 'fa-times-circle', 'error-icon');
        customModal.classList.add('modal-error'); // Clase para estilos de error
        customModal.classList.remove('modal-success');
    }
    customModal.style.display = 'flex'; // Mostrar el modal
}

// Función para cerrar el modal
closeButton.addEventListener('click', () => {
    customModal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (event) => {
    if (event.target === customModal) {
        customModal.style.display = 'none';
    }
});


contactForm.addEventListener('submit', async (e) => { // Agregamos 'async' aquí
    e.preventDefault(); // Prevenimos el envío por defecto para la validación JS
    
    // Ocultar mensaje de éxito si estaba visible
    formSuccessMessage.style.display = 'none';
    contactForm.style.display = 'flex'; // Asegurarse de que el formulario esté visible para validar

    const formData = new FormData(contactForm);
    const email = formData.get('email');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) { // Solo valida si el campo email no está vacío
        showModal('Error de validación', 'Por favor, ingrese un email válido.', false);
        return; // Detiene el envío si el email es inválido
    }

    // Ocultar formulario mientras se envía
    contactForm.style.display = 'none'; 
    // Aquí podrías mostrar un spinner de carga si lo deseas

    try {
        const response = await fetch(contactForm.action, {
            method: contactForm.method,
            body: formData,
            headers: {
                'Accept': 'application/json' // Esto es importante para que Formspree responda con JSON
            }
        });

        if (response.ok) { // Si la respuesta de Formspree es exitosa
            formSuccessMessage.style.display = 'flex'; // Mostrar mensaje de éxito (usando flex para centrado)
            contactForm.reset(); // Resetea el formulario
        } else {
            // Manejar errores de Formspree (ej. si falla la validación del lado de Formspree)
            const data = await response.json();
            let errorMessage = 'Hubo un problema al enviar su mensaje. Por favor, intente de nuevo.';
            if (data.errors) {
                // Si Formspree devuelve errores específicos
                errorMessage = data.errors.map(error => error.message).join(', ');
            } else if (data.error) {
                // A veces Formspree devuelve un solo campo 'error'
                errorMessage = data.error;
            }
            showModal('Error en el envío', errorMessage, false);
            contactForm.style.display = 'flex'; // Volver a mostrar el formulario en caso de error
        }
    } catch (error) {
        // Manejar errores de red o cualquier otra excepción
        showModal('Error de conexión', 'No se pudo conectar con el servidor. Por favor, revise su conexión a internet.', false);
        console.error('Error al enviar el formulario:', error);
        contactForm.style.display = 'flex'; // Volver a mostrar el formulario en caso de error
    }
});


// Add animation when elements come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        } else {
            // Opcional: Si quieres que la animación se revierta al salir de vista
            // entry.target.style.opacity = '0';
            // entry.target.style.transform = 'translateY(20px)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.service-card, .training-column, .faq-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add loading animation for the page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Initialize page opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Nota sobre el carrusel de logos:
// Actualmente, la animación del carrusel de logos está manejada enteramente por CSS.
// Si deseas agregar controles de navegación (flechas, puntos) o una lógica de carrusel más compleja,
// se requerirá código JavaScript adicional para ello.