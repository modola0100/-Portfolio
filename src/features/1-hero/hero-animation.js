
import { $ } from '../../shared/utils/dom.js';



export function initHeroAnimation() {

    const cube = $('.cube');

    const heroSection = $('#home');



    if (!cube || !heroSection) {

        console.error('Cube or hero section not found for animation.');

        return;

    }



    let mouseX = 0;

    let mouseY = 0;

    let targetX = 0;

    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;

    const windowHalfY = window.innerHeight / 2;



    function onMouseMove(event) {

        mouseX = (event.clientX - windowHalfX);

        mouseY = (event.clientY - windowHalfY);

    }



    function animate() {

        targetX = mouseX * 0.05;

        targetY = mouseY * 0.05;



        cube.style.transform = `rotateY(${targetX}deg) rotateX(${-targetY}deg)`;

        

        requestAnimationFrame(animate);

    }



    heroSection.addEventListener('mousemove', onMouseMove);

    

    heroSection.addEventListener('mouseleave', () => {

        mouseX = 0;

        mouseY = 0;

    });



    animate();

}


