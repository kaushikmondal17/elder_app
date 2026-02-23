

(function () {
    const els = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .stagger');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('in-view');

                if (el.classList.contains('stagger')) {
                    const items = el.querySelectorAll('.stagger-item');
                    items.forEach((it, i) => {
                        it.style.transitionDelay = (i * 90) + 'ms';
                    });
                }

                const autoStagger = el.querySelectorAll(':scope > *');
                if (autoStagger.length > 4 && !el.classList.contains('stagger')) {
                    autoStagger.forEach((c, i) => c.style.transitionDelay = (i * 60) + 'ms');
                }
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
})();

// <!-- testmonial script -->

const swiperEl = document.querySelector('.mySwipertestmonial');
if (swiperEl) {
    Object.assign(swiperEl, {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false,
            reverseDirection: false
        },
        pagination: { clickable: false },
        breakpoints: {

            410: { slidesPerView: 1.5 },
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 2.5 },
            1024: { slidesPerView: 2.5 },
            1200: { slidesPerView: 3.5 },
            1400: { slidesPerView: 3.5 },
        }
    });

    swiperEl.initialize();
}

// <!-- new header-->


const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const dropdowns = document.querySelectorAll(".header__dropdown");

burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
});


dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector(".header__dropdown-toggle");
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove("dropdown-show");
        });

        dropdown.classList.toggle("dropdown-show");
    });
});

document.addEventListener("click", () => {
    dropdowns.forEach(d => d.classList.remove("dropdown-show"));
});


window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
        burger.classList.remove("is-active");
        menu.classList.remove("is-active");
    }
});


// <!-- menu_under_scriprt -->


document.querySelectorAll('.header__dropdown-title').forEach(title => {
    title.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = title.closest('.header__dropdown-group');
        parent.classList.toggle('active');
    });
});


document.querySelectorAll('.header__dropdown-items a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});


// <!-- product js -->

const mainImage = document.getElementById("main-image");
const variantId = document.querySelectorAll("#vairiant-images");

function imageSwap(e) {
    console.log(mainImage);
    console.log(this.src);
    console.log(this.getAttribute("data-large"));
    mainImage.src = this.src;
}

for (var i = 0; i < variantId.length; i++) {
    variantId[i].addEventListener("click", imageSwap, false);
}


// add_buttton_part 

function up(max) {
    document.getElementById("myNumber").value =
        parseInt(document.getElementById("myNumber").value) + 1;
    if (document.getElementById("myNumber").value >= parseInt(max)) {
        document.getElementById("myNumber").value = max;
    }
}
function down(min) {
    document.getElementById("myNumber").value =
        parseInt(document.getElementById("myNumber").value) - 1;
    if (document.getElementById("myNumber").value <= parseInt(min)) {
        document.getElementById("myNumber").value = min;
    }
}



$("#card_shop").click(function(){
    $("p").hide();
});

$("#show").click(function(){
    $("p").show();
})


