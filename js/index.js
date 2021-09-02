const FOUND_RECIPES = document.getElementById("recipes-found");

// collect and display json data
let jdc = new jsonDataCollector();
jdc.collect();

// object containing search methods
let srch = new search(jdc);

// manages the events to listen to
let lstr = new listenner(
    srch.dom_form, 
    "click", 
    "l-evt-c", 
    srch, 
    "se"
);
lstr.listen();
