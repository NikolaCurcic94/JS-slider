"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// slider class ----------------
var Data = /** @class */ (function () {
    function Data(element, api) {
        this.rootElement = document.querySelector("".concat(element));
        this.api = api;
        this.current = 0;
        this.infiniteSlide = this.rootElement.dataset.infinite;
        this.autoplay = this.rootElement.dataset.autoplay;
        this.interval = this.rootElement.dataset.interval;
        this.showDots = this.rootElement.dataset.bullets;
        this.slideEffect = this.rootElement.dataset.animationType;
    }
    // main init function -------------
    Data.prototype.init = function () {
        this.selectors = {
            ctx: "slider",
            button: ["button-left", "button-right"],
            navigationDotWrapper: "navigation-dots__wrapper",
            navigationDot: "navigation-dot"
        };
        this.fetchJsonFile();
        this.checkLocalStorage();
    };
    // check and get current slide from local storage -------------
    Data.prototype.checkLocalStorage = function () {
        var locStorageCurrent = localStorage.getItem("value");
        if (locStorageCurrent) {
            this.current = parseInt(JSON.parse(locStorageCurrent));
        }
        else
            this.current = 0;
        console.log('check from local storage');
    };
    // save current slide to local storage -------------
    Data.prototype.saveToLocalStorage = function () {
        localStorage.setItem('value', JSON.stringify(this.current));
    };
    // set slider autoplay ------------------
    Data.prototype.autoPlayFunc = function (leftBtn, rightBtn) {
        var _this = this;
        var intervalFunc = setInterval(function () {
            _this.fadeToRight(leftBtn, rightBtn);
            if (_this.infiniteSlide === "false" && _this.current === _this.data.length - 1) {
                clearInterval(intervalFunc);
            }
        }, this.interval);
    };
    // disable buttons depending on infinite dataset -----------
    Data.prototype.handleButtons = function (leftBtn, rightBtn) {
        if (this.current === 0 && this.infiniteSlide === "false") {
            leftBtn.setAttribute('disabled', '');
        }
        else if (this.current > 0) {
            leftBtn.removeAttribute('disabled');
        }
        else if (this.infiniteSlide === "true") {
            leftBtn.removeAttribute('disabled');
        }
        if (this.infiniteSlide === "false" && this.current === this.data.length - 1) {
            rightBtn.setAttribute('disabled', '');
        }
        if (this.current < this.data.length - 1) {
            rightBtn.removeAttribute('disabled');
        }
    };
    // next slide by fade effect -----------------
    Data.prototype.fadeToRight = function (leftBtn, rightBtn) {
        var _this = this;
        this.current++;
        if (this.infiniteSlide === "true") {
            if (this.current > this.data.length - 1) {
                this.current = 0;
            }
        }
        this.rootElement.querySelectorAll(".slide").forEach(function (element) {
            if (_this.current === parseInt(element.getAttribute('data-id'))) {
                console.log(parseInt((element.getAttribute('data-id'))));
                element.style.opacity = "1";
            }
            else
                element.style.opacity = "0";
        });
        var allSelectedDots = document.querySelectorAll(".navigation-dot");
        allSelectedDots.forEach(function (element) {
            var elementDataSet = element.dataset.set;
            if (elementDataSet) {
                if (_this.current === parseInt(elementDataSet)) {
                    element.classList.add('active-dot');
                }
                else {
                    element.classList.remove('active-dot');
                }
            }
        });
        this.changingDotsActivity(leftBtn, rightBtn);
        this.handleButtons(leftBtn, rightBtn);
        this.saveToLocalStorage();
    };
    // previous slide by fade effect ---------------
    Data.prototype.fadeToLeft = function (leftBtn, rightBtn) {
        var _this = this;
        this.current--;
        if (this.infiniteSlide === "true") {
            if (this.current < 0) {
                this.current = this.data.length - 1;
            }
        }
        this.rootElement.querySelectorAll(".slide").forEach(function (element) {
            if (_this.current === parseInt(element.getAttribute('data-id'))) {
                console.log(parseInt((element.getAttribute('data-id'))));
                element.style.opacity = "1";
            }
            else
                element.style.opacity = "0";
        });
        this.handleButtons(leftBtn, rightBtn);
        this.changingDotsActivity(leftBtn, rightBtn);
        this.saveToLocalStorage();
    };
    // slide on click ----------------
    Data.prototype.slideOnClick = function () {
        var _this = this;
        this.rootElement.querySelectorAll(".slide").forEach(function (element) {
            element.style.opacity = 1;
            element.style.position = 'static';
            element.style.transform = "translateX(".concat(((-_this.current) * 100), "%)");
            console.log(element.style.transform = "translateX(".concat(((-_this.current) * 100), "%)"));
        });
    };
    // next slide by sliding effect -----------------
    Data.prototype.slideToRight = function (leftBtn, rightBtn) {
        this.current++;
        console.log(this.current, 'slide right');
        var placeHolderSlide;
        // if (this.infiniteSlide === "true") {
        //     if (this.current === this.data.length - 2) {
        //         this.rootElement.style.transform = `translateX(${(500)}%)`;
        //     }
        // }
        // this.rootElement.querySelectorAll(".slide").forEach((element) => {
        //     element.style.opacity = 1;
        //     element.style.position = 'static';
        //     element.style.transform = `translateX(${((this.current) / 100)}%)`;
        //     console.log(element.style.transform = `translateX(${((-this.current) * 100)}%)`)
        // });
        this.slideOnClick();
        this.handleButtons(leftBtn, rightBtn);
        this.changingDotsActivity(leftBtn, rightBtn);
        this.saveToLocalStorage();
    };
    // // // previous slide by sliding effect -----------------
    Data.prototype.slideToLeft = function (leftBtn, rightBtn) {
        this.current--;
        console.log(this.current, 'slide left');
        this.slideOnClick();
        this.handleButtons(leftBtn, rightBtn);
        this.changingDotsActivity(leftBtn, rightBtn);
        this.saveToLocalStorage();
    };
    // render navigation dots --------------
    Data.prototype.renderNavigationDots = function (dots) {
        if (this.showDots === 'false') {
            dots.style.display = "none";
        }
    };
    // navigate slade using dots ---------------
    Data.prototype.showSlidesByDots = function (index) {
        var allSelectedDots = document.querySelectorAll(".slide");
        allSelectedDots.forEach(function (element) {
            var elementDataSet = element.dataset.id;
            if (elementDataSet) {
                if (parseInt(elementDataSet) === index) {
                    element.style.opacity = '1';
                }
                else {
                    element.style.opacity = '0';
                }
            }
        });
        this.saveToLocalStorage();
    };
    // adding and removing classes from dots -------------
    Data.prototype.changingDotsActivity = function (leftBtn, rightBtn) {
        var _this = this;
        var allSelectedDots = document.querySelectorAll(".navigation-dot");
        allSelectedDots.forEach(function (element, index) {
            var elementDataSet = element.dataset.set;
            if (elementDataSet) {
                if (_this.current === parseInt(elementDataSet)) {
                    element.classList.add('active-dot');
                }
                else {
                    element.classList.remove("active-dot");
                }
            }
            element.addEventListener("click", function (event) {
                var eventTarget = event.target;
                if (eventTarget.dataset.set) {
                    _this.current = parseInt(eventTarget.dataset.set);
                    _this.handleButtons(leftBtn, rightBtn);
                    eventTarget.classList.add('active-dot');
                    _this.showSlidesByDots(index);
                    _this.rootElement.querySelectorAll('.active-dot').forEach(function (element) {
                        if (element !== event.target) {
                            element.classList.remove("active-dot");
                        }
                    });
                }
            });
        });
    };
    // creating page elements -------------------
    Data.prototype.createContent = function (data) {
        var _this = this;
        // update current slide from local storage -------------------
        // window.addEventListener("unload", function () {
        //     this.checkLocalStorage()
        //     console.log(this.current, 'test');
        // })
        // button wrapper -------------------
        var navigationDotWrapper = document.createElement("div");
        this.rootElement.appendChild(navigationDotWrapper);
        navigationDotWrapper.setAttribute('class', this.selectors.navigationDotWrapper);
        // create left button -------------------
        var prevButton = document.createElement("button");
        prevButton.setAttribute('class', 'left-button');
        prevButton.innerText = "Prev";
        // create right button -------------------
        var nextButton = document.createElement("button");
        nextButton.setAttribute('class', 'right-button');
        nextButton.innerText = "Next";
        this.rootElement.appendChild(prevButton);
        this.rootElement.appendChild(nextButton);
        // creating html elements from fetched data --------------
        data.forEach(function (element, index) {
            console.log("typescript test");
            // dots, and their wrapper ----------
            var navigationDot = document.createElement("div");
            navigationDot.setAttribute('class', _this.selectors.navigationDot);
            navigationDot.setAttribute('data-set', "".concat(index));
            navigationDotWrapper.appendChild(navigationDot);
            var slide = document.createElement("div");
            slide.style.backgroundImage = "url(".concat(element.img, ")");
            // navigation dots -------------------
            _this.changingDotsActivity(prevButton, nextButton);
            _this.renderNavigationDots(navigationDotWrapper);
            if (index === 0) {
                slide.style.opacity = '1';
            }
            else {
                slide.style.opacity = '0';
            }
            // heading -------------
            var heading = document.createElement("h1");
            heading.innerText = element.title;
            _this.rootElement.appendChild(slide);
            slide.setAttribute('class', 'slide');
            slide.setAttribute('data-id', "".concat(index));
            slide.appendChild(heading);
        });
        // buttons slide and disable depending on infinite data attribute ---------
        this.handleButtons(prevButton, nextButton);
        // next slide -------------------
        nextButton.addEventListener('click', function () {
            if (_this.slideEffect === "fade") {
                _this.fadeToRight(prevButton, nextButton);
            }
            else {
                _this.slideToRight(prevButton, nextButton);
            }
            _this.handleButtons(prevButton, nextButton);
        });
        // previous slide -------------------
        if (this.infiniteSlide === "true") {
            prevButton.removeAttribute('disabled');
        }
        prevButton.addEventListener('click', function () {
            if (_this.slideEffect === "fade") {
                _this.fadeToLeft(prevButton, nextButton);
            }
            else if (_this.slideEffect === "slide") {
                _this.slideToLeft(prevButton, nextButton);
            }
            _this.handleButtons(prevButton, nextButton);
        });
        // autoplay -------------------
        if (this.autoplay === 'true') {
            this.autoPlayFunc(prevButton, nextButton);
        }
    };
    // fetching data -----------
    Data.prototype.fetchJsonFile = function () {
        var _this = this;
        fetch(this.api).then(function (response) { return response.json(); }).then(function (data) {
            _this.data = data;
            _this.createContent(data);
        });
    };
    return Data;
}());
// create a slider instance ----------
var slider1 = new Data(".slider", 'http://localhost:3000/data');
slider1.init();
