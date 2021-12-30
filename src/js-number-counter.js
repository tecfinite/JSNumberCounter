/**
 * --------------------------------------------------------------------------
 * JSNumberCounter (v1.0.0): index.esm.js
 * Developed by Abdurrahman Salem | https://ahussalem.me
 * Tecfinite Co. https://tecfinite.com
 * Licensed under MIT (https://github.com/
 * --------------------------------------------------------------------------
 * 
 */
class JSNumberCounter {

    constructor(
        options = {}
    ) {
        this.options = options;

        this.sectionId = null;
        this.countersClassName = 'counter';
        this.duration = 3000;

        this.section = null;
        this.counters = null;

        this.recountable = false;
        this.viewport = 30;

        this.counting = false;
        this.counted = false;
        this.countedTimes = 0;

        try {
            this.checkRequiredOptions();
            this.initOptions();
            this.initSection();
            this.initCounters();
            this.start();
        } catch (e) {
            console.error(e);
            return;
        }
    }


    checkRequiredOptions() {
        if (!this.options.sectionId) {
            throw 'Make sure to ininialize ( sectionId )'
        }
        return true;
    }

    initOptions() {
        if (this.options.sectionId) {
            this.sectionId = this.options.sectionId;
        }
        if (this.options.countersClassName) {
            this.countersClassName = this.options.countersClassName;
        }
        if (this.options.recountable) {
            this.recountable = this.options.recountable;
        }
        if (this.options.viewport) {
            this.viewport = this.options.viewport;
        }
        if (this.options.duration) {
            this.duration = this.options.duration;
        }
    }

    initSection() {
        let section = document.getElementById(this.sectionId);
        if (!section) {
            throw 'Section #' + this.sectionId + ' not found!';
        }
        this.section = section;
    }

    initCounters() {
        let counters = this.section.getElementsByClassName(this.countersClassName);
        if (!counters) {
            throw 'Section #' + this.sectionId + ' has no counters!';
        }
        this.counters = counters;
    }

    start() {
        if (this.isPartialyViewport()) {
            document.addEventListener('scroll', this.countPartialy.bind(this));
        } else {
            document.addEventListener('scroll', this.count.bind(this));
        }
    }

    startListining() {
        document.addEventListener('scroll', this.count());
    }
    stopListining() {
        document.removeEventListener('scroll', this.count());
    }

    isPartialyViewport() {
        return (typeof this.viewport === 'number');
    }

    isInViewport() {
        const rect = this.section.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    isInViewportPartialy() {
        let rect = this.section.getBoundingClientRect();
        let windowHeight = (window.innerHeight || document.documentElement.clientHeight);

        return !(
            Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < this.viewport ||
            Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < this.viewport
        )
    }

    withCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    animateValue(obj, start, end, duration) {
        this.counting = true;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = this.withCommas(Math.floor(progress * (end - start) + start));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
            if (progress === 1) {
                this.counting = false;
            }
        };
        window.requestAnimationFrame(step);
    }

    canNotCount() {
        return this.counting || (!this.recountable && this.counted);
    }

    countPartialy() {
        if (this.canNotCount()) {
            return false;
        }

        if (this.isInViewportPartialy()) {
            for (const counter of this.counters) {
                this.animateValue(counter, counter.dataset.from, counter.dataset.to, this.duration);
            }
            this.counted = true;
            this.countedTimes++;
        }
    }


    count() {
        if (this.canNotCount()) {
            return false;
        }

        if (this.isInViewport()) {
            for (const counter of this.counters) {
                this.animateValue(counter, counter.dataset.from, counter.dataset.to, this.duration);
            }
            this.counted = true;
            this.countedTimes++;
        }
    }

}