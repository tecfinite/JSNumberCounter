
var counted = false;

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isInViewportPartialy(el, percentVisible) {
  let rect = el.getBoundingClientRect();
  let windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  
  return !(
    Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < percentVisible ||
    Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
  )
};

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function getCounters(element, className) {
  console.log("getting counters!");
  return element.getElementsByClassName(className);

}

function count(element){

  if (counted) {return;}

  if (isInViewportPartialy(element, 20)){

    console.log("In viewport!");

    let counters = getCounters(element, 'counter')

    for (const counter of counters) {
      animateValue(counter, 0, counter.dataset.to, 3000)
    }

  }
  else {
    console.log('false')
  }
  // counted = true;

}


// window.onload = getCounters(achievements, 'counter');
// window.onscroll = count(achievements);

const achievements = document.getElementById("achievements");
document.addEventListener('scroll', () => {
count(achievements);
});

// const obj = document.getElementById("value");
// animateValue(obj, 100, 0, 5000);


// get section
// check if in viewport
// get counters
// start count