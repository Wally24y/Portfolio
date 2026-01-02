document.addEventListener("DOMContentLoaded", () => {
    const skillpg = document.getElementById("skills");
    const aboutpg = document.getElementById("about");
    const homepg = document.getElementById("home");
    const contactpg = document.getElementById("contact");
    const aboutbtn = document.getElementById("aboutbtn");
    const homebtn = document.getElementById("homebtn");
    const skillsbtn = document.getElementById("skillsbtn");
    const contactbtn = document.getElementById("contactbtn");
    const contactbtn1 = document.getElementById("contactbtn1");
    const modeToggle = document.getElementById("modeToggle");
    const type3 = document.getElementById("type3");
    const type2 = document.getElementById("type2");
    const type1 = document.getElementById("type1");
    const fadeUP = document.getElementById("fadeUp");
    const slider = document.getElementById('projectSlider');
    let cards = Array.from(slider.children);
    let index = 1;

    function hideAll() {
        aboutpg.classList.add("notRight");
        skillpg.classList.add("notTop");
        contactpg.classList.add("notDown");
        aboutpg.classList.remove("right");
        skillpg.classList.remove("top");
        contactpg.classList.remove("down");
        homepg.classList.add("opacity1");
        fadeUP.classList.remove("animate");
    }

    aboutbtn.addEventListener("click", function () {
        hideAll();
        aboutpg.classList.remove("notRight");
        aboutpg.classList.add("right");
        resetFadeUp();
        fadeUP.classList.add("animate");
        animateSkills();
    })
    skillsbtn.addEventListener("click", function () {
        hideAll();
        skillpg.classList.remove("notTop");
        skillpg.classList.add("top");
    })
    homebtn.addEventListener("click", function () {
        hideAll();
        homepg.classList.remove("opacity1");
        type1.innerHTML = "";
        type2.innerHTML = "";
        runNameAndTitleTyping();
    })
    contactbtn.addEventListener("click", function () {
        hideAll();
        contactpg.classList.remove("notDown");
        contactpg.classList.add("down");
    })
    contactbtn1.addEventListener("click", function () {
        hideAll();
        contactpg.classList.remove("notDown");
        contactpg.classList.add("down");
    })

    // Measure width BEFORE cloning
    if (!cards.length) return;
    const originalCard = cards[0];

    // read gap safely (fallback to 24)
    let gapVal = getComputedStyle(slider).gap;
    gapVal = gapVal ? parseFloat(gapVal) : 24;

    // compute cardWidth
    let cardWidth = originalCard.offsetWidth + gapVal;
    window.addEventListener("resize", () => {
        cardWidth = originalCard.offsetWidth + gapVal;
        slider.scrollLeft = cardWidth * index;
    });
    // Clone first & last cards for infinite loop
    const firstClone = originalCard.cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);

    // Insert clones: lastClone at start, firstClone at end
    slider.insertBefore(lastClone, slider.firstChild);
    slider.appendChild(firstClone);

    // Update cards list
    cards = Array.from(slider.children);

    // Start at the first real card
    index = 1;
    slider.scrollLeft = cardWidth * index;

    // Flag to prevent multiple clicks while animating
    let isScrolling = false;

    // Smooth scroll function
    function smoothScroll() {
        isScrolling = true;
        slider.style.scrollBehavior = "smooth";
        slider.scrollLeft = cardWidth * index;

        // If we hit a clone, jump instantly to the real card
        if (index === 0) { // leading clone
            slider.style.scrollBehavior = "auto";
            index = cards.length - 2;
            slider.scrollLeft = cardWidth * index;
            slider.style.scrollBehavior = "smooth";
        } else if (index === cards.length - 1) { // trailing clone
            slider.style.scrollBehavior = "auto";
            index = 1;
            slider.scrollLeft = cardWidth * index;
            slider.style.scrollBehavior = "smooth";
        }
    }

    // Right button
    document.querySelector('.slide-btn.right').addEventListener('click', () => {
        if (isScrolling) return;
        index++;
        smoothScroll();
    });

    // Left button
    document.querySelector('.slide-btn.left').addEventListener('click', () => {
        if (isScrolling) return;
        index--;
        smoothScroll();
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        if (modeToggle) modeToggle.classList.replace("fa-moon", "fa-sun");
    }
    if (modeToggle) {
        modeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            // Change icon based on mode
            if (document.body.classList.contains("dark-mode")) {
                modeToggle.classList.replace("fa-moon", "fa-sun");
                localStorage.setItem("theme", "dark");
            } else {
                modeToggle.classList.replace("fa-sun", "fa-moon");
                localStorage.setItem("theme", "light");
            }
        });
    }
    function animateSkills() {
        const titles = document.querySelectorAll(".skill-title");
        const items = document.querySelectorAll(".skill-item"); // match HTML class
        // Reset titles
        titles.forEach(t => {
            t.style.animation = "none";
            void t.offsetWidth; // force reflow
            t.style.opacity = 0; // ensure hidden before animating
        });

        // Reset items
        items.forEach(li => {
            li.style.animation = "none";
            void li.offsetWidth; // force reflow
            li.style.opacity = 0; // keep hidden until animation
        });

        setTimeout(() => {
            titles.forEach(t => {
                t.style.animation = "fadeLeft 1s ease forwards";
            });
        }, 900); // 20ms is enough to trigger reflow
        // Animate items after a delay (after titles)
        setTimeout(() => {
            items.forEach((li, index) => {
                li.style.animation = `fadeLeft 1s ease forwards ${0.3 * index}s`;
            });
        }, 1000); // match the title animation duration

    }
    function resetFadeUp() {
        fadeUP.style.animation = "none";
        void fadeUP.offsetWidth; // force reflow
        fadeUP.style.animation = ""; // or fadeUP.classList.add("animate") if using classes
    }
    function startTypingEffect(element, texts, speed = 100, delay = 1500, onFinish = null) {
        let textIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function getVisibleTextOnly(html) {
            return html.replace(/<[^>]*>/g, "");
        }
        function type() {
            let fullHTML = texts[textIndex];
            let visible = getVisibleTextOnly(fullHTML);

            if (!deleting) {
                charIndex++;
            } else {
                charIndex--;
            }

            if (charIndex < 0) charIndex = 0;
            if (charIndex > visible.length) charIndex = visible.length;

            // Build safe HTML up to the visible char count
            let output = "";
            let visibleCount = 0;

            for (let i = 0; i < fullHTML.length; i++) {
                output += fullHTML[i];

                if (fullHTML[i] !== "<") {
                    visibleCount++;
                } else {
                    while (fullHTML[i] !== ">" && i < fullHTML.length - 1) {
                        i++;
                        output += fullHTML[i];
                    }
                }

                if (visibleCount >= charIndex) break;
            }

            element.innerHTML = output;

            if (!deleting && charIndex === visible.length) {
                if (textIndex === texts.length - 1) {
                    // Stop on last text without deleting
                    element.innerHTML = texts[textIndex];
                    if (onFinish) onFinish();
                    return;
                }
                deleting = true;
                setTimeout(type, delay);
                return;
            }

            if (deleting && charIndex === 0) {
                deleting = false;
                //textIndex = (textIndex + 1) % texts.length;
                if (textIndex < texts.length - 1) {
                    textIndex++;
                    setTimeout(type, speed);
                } else {
                    // Stop on last text
                    element.innerHTML = texts[textIndex];
                    return;
                }
            }
            setTimeout(type, deleting ? speed / 2 : speed);
        }
        type();
    }
    function runFullHomeTyping() {
        startTypingEffect(
            type3,
            [" and welcome", ", I'm"],
            100,
            1200,
            () => runNameAndTitleTyping()
        );
    }

    function runNameAndTitleTyping() {
        startTypingEffect(
            type1,
            ["<span class='span1'>Walter Joseph.</span>"],
            100,
            800,
            () => {
                startTypingEffect(
                    type2,
                    ["<span class='span2'>Software developer.</span>"],
                    80,
                    800,
                    "cursor2"
                );
            }
        );
    }

    //  Run full animation ONLY on first load
    runFullHomeTyping();
    
    const form = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    // Simple email validation
    function validateEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Basic validation
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            formStatus.textContent = "Please fill in all fields!";
            formStatus.style.color = "red";
            return;
        }

        if (!validateEmail(email)) {
            formStatus.textContent = "Enter a valid email address!";
            formStatus.style.color = "red";
            return;
        }

        // Prepare data for Netlify
        const formData = new FormData(form);
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        })
            .then(() => {
                formStatus.textContent = "Form submitted successfully!";
                formStatus.style.color = "green";
                form.reset();
            })
            .catch((err) => {
                console.error(err);
                formStatus.textContent = "Error submitting form. Try again.";
                formStatus.style.color = "red";
            });
    });
}
);

if (document.readyState === "complete") {
    document.body.classList.add("ready");
} else {
    window.addEventListener("load", () => {
        document.body.classList.add("ready");
    });
}