document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('interactive-background');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles(); // Re-initialize particles on resize
    });

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    class Particle {
        constructor(x, y, size, speedX, speedY, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
            this.color = color;
        }

        update() {
            // Move particles
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary check (simple wrap around)
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Interaction with mouse (gentle push)
            let dx = this.x - mouseX;
            let dy = this.y - mouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let interactionDistance = 150; // Radius of mouse influence

            if (distance < interactionDistance) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxForce = 2; // How strong the push is
                let force = (interactionDistance - distance) / interactionDistance * maxForce;
                this.x += forceDirectionX * force * 0.1; // Adjust multiplier for subtlety
                this.y += forceDirectionY * force * 0.1;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let particlesArray = [];
    const numberOfParticles = 50; // Adjust for density/performance
    const particleColors = ['rgba(72,209,204,0.3)', 'rgba(72,209,204,0.5)', 'rgba(234,234,234,0.3)']; // Teal and light gray, semi-transparent

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 5 + 1; // Size between 1 and 6
            let x = Math.random() * width;
            let y = Math.random() * height;
            let speedX = (Math.random() * 0.4 - 0.2); // Slow horizontal drift
            let speedY = (Math.random() * 0.4 - 0.2); // Slow vertical drift
            let color = particleColors[Math.floor(Math.random() * particleColors.length)];
            particlesArray.push(new Particle(x, y, size, speedX, speedY, color));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});
