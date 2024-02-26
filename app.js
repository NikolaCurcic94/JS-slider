// slider class ----------------
class Data {
    constructor(element, api) {
        this.rootElement = document.querySelector(`${element}`);
        this.api = api
        this.current = 0
        this.infiniteSlide = this.rootElement.dataset.infinite
        this.autoplay = this.rootElement.dataset.autoplay
        this.interval = this.rootElement.dataset.interval
        this.showDots = this.rootElement.dataset.bullets
        this.slideEffect = this.rootElement.dataset.animationType
    }
    // main init function -------------
    init() {
        this.selectors = {
            ctx: "slider",
            button: ["button-left", "button-right"],
            navigationDotWrapper: "navigation-dots__wrapper",
            navigationDot: "navigation-dot"
        }
        this.fetchJsonFile();
        this.data;
        this.checkLocalStorage()
    }
    // check and get current slide from local storage -------------
    checkLocalStorage() {
        this.current = parseInt(JSON.parse(localStorage.getItem("value"))) ?? 0
        console.log('check from local storage', this.current = parseInt(JSON.parse(localStorage.getItem("value"))) ?? 0);
    }
    // save current slide to local storage -------------
    saveToLocalStorage() {
        localStorage.setItem('value', JSON.stringify(this.current))
    }
    // set slider autoplay ------------------
    autoPlayFunc(leftBtn, rightBtn) {
        let intervalFunc = setInterval(() => {
            this.fadeToRight(leftBtn, rightBtn)
            if (this.infiniteSlide === "false" && this.current === this.data.length - 1) {
                clearInterval(intervalFunc)
            }
        }, this.interval)
    }
    // disable buttons depending on infinite dataset -----------
    handleButtons(leftBtn, rightBtn) {
        if (this.current === 0 && this.infiniteSlide === "false") {
            leftBtn.setAttribute('disabled', '');
        } else if (this.current > 0) {
            leftBtn.removeAttribute('disabled')
        } else if (this.infiniteSlide === "true") {
            leftBtn.removeAttribute('disabled')
        } if (this.infiniteSlide === "false" && this.current === this.data.length - 1) {
            rightBtn.setAttribute('disabled', '')
        } if (this.current < this.data.length - 1) {
            rightBtn.removeAttribute('disabled')
        }
    }
    // next slide by fade effect -----------------
    fadeToRight(leftBtn, rightBtn) {
        this.current++;
        if (this.infiniteSlide === "true") {
            if (this.current > this.data.length - 1) {
                this.current = 0
            }
        }
        this.rootElement.querySelectorAll(".slide").forEach((element) => {
            if (this.current === parseInt(element.getAttribute('data-id'))) {
                console.log(parseInt((element.getAttribute('data-id'))))
                element.style.opacity = "1";
            } else element.style.opacity = "0";
        })
        document.querySelectorAll(".navigation-dot").forEach((element) => {
            if (this.current === parseInt(element.dataset.set)) {
                element.classList.add('active-dot')
            } else {
                element.classList.remove('active-dot')
            }
        })
        this.changingDotsActivity(leftBtn, rightBtn)
        this.handleButtons(leftBtn, rightBtn)
        this.saveToLocalStorage()
    }
    // previous slide by fade effect ---------------
    fadeToLeft(leftBtn, rightBtn) {
        this.current--;
        if (this.infiniteSlide === "true") {
            if (this.current < 0) {
                this.current = this.data.length - 1
            }
        }
        this.rootElement.querySelectorAll(".slide").forEach((element) => {
            if (this.current === parseInt(element.getAttribute('data-id'))) {
                console.log(parseInt((element.getAttribute('data-id'))))
                element.style.opacity = "1";
            } else element.style.opacity = "0";
        })
        this.handleButtons(leftBtn, rightBtn)
        this.changingDotsActivity(leftBtn, rightBtn)
        this.saveToLocalStorage()
    }
    // slide on click ----------------
    slideOnClick() {
        this.rootElement.querySelectorAll(".slide").forEach((element) => {
            element.style.opacity = 1;
            element.style.position = 'static';
            element.style.transform = `translateX(${((-this.current) * 100)}%)`;
            console.log(element.style.transform = `translateX(${((-this.current) * 100)}%)`)
        });
    }
    // next slide by sliding effect -----------------
    slideToRight(leftBtn, rightBtn) {
        this.current++;
        console.log(this.current, 'slide right');
        this.slideOnClick()
        this.handleButtons(leftBtn, rightBtn)
        this.changingDotsActivity(leftBtn, rightBtn)
        this.saveToLocalStorage()
    }
    // // // previous slide by sliding effect -----------------
    slideToLeft(leftBtn, rightBtn) {
        this.current--;
        console.log(this.current, 'slide left');
        this.slideOnClick()
        this.handleButtons(leftBtn, rightBtn)
        this.changingDotsActivity(leftBtn, rightBtn)
        this.saveToLocalStorage()
    }
    // render navigation dots --------------
    renderNavigationDots(dots) {
        if (this.showDots === 'false') {
            dots.style.display = "none"
        }
    }
    // navigate slade using dots ---------------
    showSlidesByDots(index) {
        document.querySelectorAll('.slide').forEach(element => {
            if (parseInt(element.dataset.id) === index) {
                element.style.opacity = '1'
            } else {
                element.style.opacity = '0'
            }
        })
        this.saveToLocalStorage()
    }
    // adding and removing classes from dots -------------
    changingDotsActivity(leftBtn, rightBtn) {
        document.querySelectorAll(".navigation-dot").forEach((element, index) => {
            if (this.current === parseInt(element.dataset.set)) {
                element.classList.add('active-dot')
            } else {
                element.classList.remove("active-dot")
            }
            element.addEventListener("click", (event) => {
                this.current = parseInt(event.target.dataset.set)
                this.handleButtons(leftBtn, rightBtn)
                event.target.classList.add('active-dot')
                this.showSlidesByDots(index)
                this.rootElement.querySelectorAll('.active-dot').forEach((element) => {
                    if (element !== event.target) {
                        element.classList.remove("active-dot")
                    }
                })
            })
        });
    }
    // creating page elements -------------------
    createContent(data) {
        // update current slide from local storage -------------------
        // window.addEventListener("unload", function () {
        //     this.checkLocalStorage()
        //     console.log(this.current, 'test');
        // })
        // button wrapper -------------------
        const navigationDotWrapper = document.createElement("div")
        this.rootElement.appendChild(navigationDotWrapper)
        navigationDotWrapper.setAttribute('class', this.selectors.navigationDotWrapper)

        // create left button -------------------
        const prevButton = document.createElement("button")
        prevButton.setAttribute('class', 'left-button')
        prevButton.innerText = "Prev"

        // create right button -------------------
        const nextButton = document.createElement("button")
        nextButton.setAttribute('class', 'right-button')
        nextButton.innerText = "Next"
        this.rootElement.appendChild(prevButton)
        this.rootElement.appendChild(nextButton)

        // creating html elements from fetched data --------------
        data.forEach((element, index) => {
            // dots, and their wrapper ----------
            const navigationDot = document.createElement("div")
            navigationDot.setAttribute('class', this.selectors.navigationDot)
            navigationDot.setAttribute('data-set', index)
            navigationDotWrapper.appendChild(navigationDot)
            const slide = document.createElement("div")
            slide.style.backgroundImage = `url(${element.img})`

            // navigation dots -------------------
            this.changingDotsActivity(prevButton, nextButton)
            this.renderNavigationDots(navigationDotWrapper)
            if (index === 0) {
                slide.style.opacity = '1'
            } else {
                slide.style.opacity = '0'
            }
            // heading -------------
            const heading = document.createElement("h1")
            heading.innerText = element.title
            this.rootElement.appendChild(slide);
            slide.setAttribute('class', 'slide')
            slide.setAttribute('data-id', index)
            slide.appendChild(heading);
        })

        // buttons slide and disable depending on infinite data attribute ---------
        this.handleButtons(prevButton, nextButton)

        // next slide -------------------
        nextButton.addEventListener('click', () => {
            if (this.slideEffect === "fade") {
                this.fadeToRight(prevButton, nextButton)
            } else {
                this.slideToRight(prevButton, nextButton)
            }
            this.handleButtons(prevButton, nextButton)
        })

        // previous slide -------------------
        if (this.infiniteSlide === "true") {
            prevButton.removeAttribute('disabled');
        }
        prevButton.addEventListener('click', () => {
            if (this.slideEffect === "fade") {
                this.fadeToLeft(prevButton, nextButton)
            } else if (this.slideEffect === "slide") {
                this.slideToLeft(prevButton, nextButton)
            }
            this.handleButtons(prevButton, nextButton)
        })

        // autoplay -------------------
        if (this.autoplay === 'true') {
            this.autoPlayFunc(prevButton, nextButton)
        }
    }

    // fetching data -----------
    fetchJsonFile() {
        fetch(this.api).then(response => response.json()).then(data => {
            this.data = data;
            this.createContent(data);
        })
    }
}

// create a slider instance ----------
let slider1 = new Data(".slider", 'http://localhost:3000/data')
slider1.init()

