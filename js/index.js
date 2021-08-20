const FOUND_RECIPES = document.getElementById("recipes-found");

let jdc = new jsonDataCollector();
jdc.collect();
let srch = new search(jdc);
let lstr = new listenner(
    srch.dom_form, 
    "click", 
    "l-evt-c", 
    srch, 
    "se"
);
//srch.addListenner(lstr);
lstr.listen();
