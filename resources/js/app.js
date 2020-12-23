const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {
  counter.innerText = "0";

  const updateCounter = () => {
    const target = +counter.getAttribute("data-target");
    const counter_number = +counter.innerText;
    const increment_counter = target / 250;

    if(counter_number < target){
        counter.innerText = `${ Math.ceil(counter_number + increment_counter) }`
        setTimeout(updateCounter, 1);
    }
    else {
        counter.innerText = target;
    };
  };

  updateCounter();
});
