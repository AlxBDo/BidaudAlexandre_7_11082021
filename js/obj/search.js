class search extends issue {

    dom_form = document.getElementById("recipes-search-form"); 

    found = false ;

    result = new Map();

    tag_search_historical = [];

    value_search_historical = 0;

    constructor(jsonDataCollector_obj){
        super();
        if(this.test(jsonDataCollector_obj, jsonDataCollector, {"pos" : "jsonDataCollector_obj"})){
            this.jdc = jsonDataCollector_obj;
            this.initResult();
        }
    };

    addListenner = function(listenner_obj){
        this.current_method = "addListenner";
        if(this.test(listenner_obj, listenner, {"pos": "first"})){ 
            listenner_obj.addDomElementListen(this.dom_form, "keyup");
            listenner_obj.addEventToListen("keyup", "l-evt-ku");
            listenner_obj.addCallObject(this, "se");
            //listenner_obj.addListenner(this.dom_form, "keyup");
        }
    };

    addToMap(value_to_push, map_index = "wait_display"){
        let value_array = this.result.get(map_index);
        value_array.push(value_to_push);
        this.result.set(map_index, value_array);
    }

    clear(display = false){
        let wait_display = [];
        if(display){
            // display hidden recipes
            for(let e of this.result.get("h")){ this.jdc.getSearchDisplObj().annimRecipe(e); }
        } else {
            wait_display = this.result.get("wait_display").concat(this.result.get("h"));
        }
        this.result.clear();
        this.initResult(wait_display);
    }

    getDifference(arr1, arr2){ return arr1.filter(x => !arr2.includes(x)); }

    getWhatByLi(dom_li){
        let id = dom_li.getAttribute("id").split("-")[1];
        id += id === "i" ? "ng" : id === "a" ? "pp" : "st";
        return id;
    };

    getSearchedMapKey(text){ return this.jdc.armonizeWords(text.split(" ").join("")) ; };

    globalSearch = function(dom_input){
        if(this.test(dom_input, "object", {"pos" : "first"})){
            let vs = dom_input.value;
            let vsl = vs.length ;
            if(vsl < this.value_search_historical){ this.clear(true); }
            if(vsl > 2 ){
                this.value_search_historical = vsl;
                this.searchRecipes(vs, "all");
            }
        }
    }

    /**
     * 
     * @param {object} dom_li 
     */
    goBack(dom_li){
        // display all items of search lists
        this.jdc.getSearchDisplObj().clearSearchList();
        // transform nodelist to array
        let st_array = Array.from(document.getElementById("tags-selected").childNodes) ;
        if(st_array.length > 1){
            if(st_array[st_array.length - 1] === dom_li){
                let searched_value = this.getSearchedMapKey(dom_li.textContent) ;
                let what = this.getWhatByLi(dom_li) ;
                this.result.get("h"+ what + searched_value).forEach(e =>{
                    this.jdc.getSearchDisplObj().annimRecipe(e);
                    this.updateResult(e);
                });        
                this.result.delete("h"+ what + searched_value);
            } else {
                let i = st_array.indexOf(dom_li);
                st_array.splice(i, 1);
                if(i === 0){ this.clear() 
                } else {
                    // recovery of recipes hidden in the history
                    let hr = this.result.get(
                        "h"+this.getWhatByLi(st_array[(i-1)])+this.getSearchedMapKey(st_array[(i-1)].textContent)
                        );
                    // stand by display of recipes currently hidden but visible during the previous search
                    this.result.set("wait_display", this.getDifference(this.result.get("h"), hr).sort());
                    // add recipes waiting display to actives recipe array
                    this.result.set("a", this.result.get("a").concat(this.result.get("wait_display")).sort());
                    this.result.set("h", hr.sort());                     
                }
                let display = false ;
                for(i ; i < st_array.length ; i++){
                    if(i === (st_array.length - 1)){ display = true ; }
                    this.searchRecipes(st_array[i].textContent.toLowerCase(), this.getWhatByLi(st_array[i]), display);
                }
            }
        } else { this.clear(true) ;  }
    };


    initResult(recipes_waiting_display = []){
        this.result.set("a", this.jdc.list_of_recipe_id);
        this.result.set("wait_display", recipes_waiting_display);
        this.result.set("h", []);
    };

    openDomList = function(dom_list){ 
        this.jdc.getSearchDisplObj().annimTagsList(dom_list); 
    };

    removeTagSelected = function(dom_li){
        this.goBack(dom_li);
        this.jdc.getSearchDisplObj().removeSelectedTag(dom_li);
    };

    search(txt, searched_value){
        if(txt.toLowerCase().indexOf(searched_value) >= 0){
            this.found = true;
            return true;
        } else { 
            this.found = false; 
            return false ; 
        }
    };

    searchIngredient(searched_value, id_recipe){
        let childs = document.getElementById("ing-" + id_recipe).childNodes;
        for(let i = 0; i < childs.length; i++){
            if(this.search(childs[i].textContent, searched_value)){ i = 99; }
        }
    };

    searchInput(searched_value, id_element){
        this.search(document.getElementById(id_element).value, searched_value);
    };

    searchTag = function(dom_input){
        if(this.test(dom_input, "object", {"pos": "first"})){
            let parent = dom_input.parentNode;
            let value_searched = dom_input.value;
            this.jdc.getSearchDisplObj().startTagSearch(parent);
            // Check that the user has entered at least 3 characters
            if(value_searched.length > 2){
                if(parent.classList.contains("closed")){ this.jdc.getSearchDisplObj().annimTagsList(parent); }
                let id_cplmt = dom_input.getAttribute("id").split("-")[0];
                let id_fl = id_cplmt.substring(0, 1);
                let items_array = this.jdc.list_of_search_item.get(id_fl);
                let items_found = [];
                let items_to_change = [];
                for(let i = 0; i < items_array.length ; i++){
                    if(this.search(items_array[i], value_searched)){ items_found.push(i);}
                }
                if(items_found.length > 0) { 
                    this.jdc.getSearchDisplObj().tagFound(id_fl+"sl-empty") ;
                    if(this.tag_search_historical.length > 0){
                            items_to_change = this.getDifference(items_found, this.tag_search_historical).concat(
                                this.getDifference(this.tag_search_historical, items_found)
                        );
                    } else { items_to_change = items_found ; }
                } else {
                    this.jdc.getSearchDisplObj().noTagFound(id_fl+"sl-empty") ;
                    if(this.tag_search_historical.length > 0) { items_to_change = this.tag_search_historical ; }
                }
                if(items_to_change.length > 0){  
                    for(let e of items_to_change){ this.jdc.getSearchDisplObj().liTagSearched(id_fl+"sl-"+e) ;}
                }
                this.tag_search_historical = items_found;
                items_found = [];
                items_to_change = [];
            }
        }
    }

    searchTxt(searched_value, id_element){
        this.search(document.getElementById(id_element).textContent, searched_value);
    };

    /**
     * 
     * @param {string} searched_value 
     * @param {string} what 
     */
    searchRecipes(searched_value, what, display = true){
        let availabl_app = []; // available appliances of selected recipes
        let availabl_ing = []; // available ingredients of selected recipes
        let availabl_ust = []; // available ustencils of selected recipes
        let rjct_r = []; // rejected recipes
        let slct_r = []; // selected recipes
        searched_value = searched_value.toLowerCase();
        this.result.get("a").forEach(id => {
            let id_recipe = id.split("-")[1] ;
            if(what === "ing" || what === "all"){ this.searchIngredient(searched_value, id_recipe); }
            if(what === "desc" || (what === "all" && !this.found)){ 
                this.searchTxt(searched_value, "desc-"+id_recipe); }
            if(what === "titl" || (what === "all" && !this.found)){ 
                this.searchTxt(searched_value, "titl-"+id_recipe); }
            if(what === "app" || (what === "all" && !this.found)){ 
                this.searchInput(searched_value, "app-"+id_recipe); }
            if(what === "ust" || (what === "all" && !this.found)){ 
                this.searchInput(searched_value, "ust-"+id_recipe); }
            if(this.found){ 
                this.found = false ; 
                slct_r.push(id);
                let app = this.jdc.list_of_recipe_appliances.get(parseInt(id_recipe));
                if(!availabl_app.includes(app)){ availabl_app.push(app); }
                if(availabl_ing.length > 0){ 
                    availabl_ing = availabl_ing.concat(this.jdc.list_of_recipe_ingredients.get(parseInt(id_recipe))); 
                } else { availabl_ing = this.jdc.list_of_recipe_ingredients.get(parseInt(id_recipe)) ; }
                if(availabl_ust.length > 0){ 
                    availabl_ust = availabl_ust.concat(this.jdc.list_of_recipe_ustencils.get(parseInt(id_recipe))); 
                } else { availabl_ust = this.jdc.list_of_recipe_ustencils.get(parseInt(id_recipe)) ; }
                if(display && this.result.get("wait_display").includes(id)){ 
                    this.jdc.getSearchDisplObj().annimRecipe(id); }
            } else { 
                rjct_r.push(id);
                if(this.result.get("wait_display").includes(id)){
                    let wda = this.result.get("wait_display");
                    wda.splice(wda.indexOf(id), 1);
                    this.result.set("wait_display", wda);
                } else if(display && !this.result.get("h").includes(id)){
                    this.jdc.getSearchDisplObj().annimRecipe(id);
                }
            }
        });
        // save search
        this.result.set("h"+what+this.getSearchedMapKey(searched_value), rjct_r);
        this.result.set("a", slct_r.sort());
        this.result.set("h", rjct_r.concat(this.result.get("h")).sort());
        // hide search list items not available
        this.jdc.getSearchDisplObj().updateSearchList(availabl_app, availabl_ing, availabl_ust);
        // if display -> delete recipes waiting display
        if(display){ this.result.set("wait_display", []) ; }
        // if the result of the global search is empty, try a new search word by word
        if(slct_r.length === 0){
            if(searched_value.includes(" ") && what === "all"){
                let svs = searched_value.split(" ");
                this.clear();
                for(let i = 0; i < svs.length ; i++){
                    if(!this.result.get("h"+what+this.getSearchedMapKey(svs[i]))){ this.searchRecipes(svs[i], what); }
                }
            } else { this.jdc.getSearchDisplObj().noRecipeFound() ; }
        } else { this.jdc.getSearchDisplObj().recipeFound() ; }
    };

    selectTag = function(dom_li){ 
        this.jdc.getSearchDisplObj().tagSelection(dom_li);
        let id_split = dom_li.getAttribute("id").split("-")[0];
        let list_type = id_split === "isl" ? "ingredients" : id_split === "asl" ? "appliance" : "ustencils"; 
        let search_container = dom_li.parentNode.parentNode;
        if(search_container.classList.contains("search-mode")){
            this.stopSearchTag(document.getElementById(list_type+"-search-close"));
        }
        this.searchRecipes(dom_li.textContent.toLowerCase(), list_type.substring(0, 3)); 
    };
    
    stopSearchTag = function(dom_element){
        if(this.test(dom_element, "object", {"pos": "first"})){
            this.tag_search_historical = [];
            this.jdc.getSearchDisplObj().endTagSearch(dom_element);
        }
    }

    /**
     * 
     * @param {any} value_to_upadte 
     */
    updateResult(value_to_update){
        let a_array = this.result.get("a");
        let h_array = this.result.get("h");
        if(a_array.includes(value_to_update)){
            a_array.splice(a_array.indexOf(value_to_update), 1);
            h_array.push(value_to_update);
        } else {
            h_array.splice(h_array.indexOf(value_to_update), 1);
            a_array.push(value_to_update);
        }
        this.result.set("a", a_array);
        this.result.set("h", h_array);
    };

}