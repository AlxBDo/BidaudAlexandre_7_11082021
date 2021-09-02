class searchDisplay extends display {

    html_hide_class = "hide";

    constructor(){ super() ; }

    /**
     * 
     * @param {string} item_content 
     * @param {string} list_id 
     * @param {integer} id_number 
     * @returns {boolean}
     */
    addItemList(item_content, list_id, id_number, html_class = false){
        this.current_method = "addItemList";
        this.process_state = 0 ;
        if(list_id === "st"){ html_class = this.getListennerHtmlClass("removeTagSelected", html_class) ; 
        } else { html_class = this.getListennerHtmlClass("selectTag", html_class) ; }
        if(this.addLiPtrn(
            item_content, 
            list_id + (list_id!="st"?"sl-":"-") + id_number, 
            html_class
        )){
            if(this.addPtnToDA( 
                list_id === "i" ? "0" : list_id === "a" ? "1" : list_id === "u" ? "2" : "3"
            )){ this.process_state = 1 ; }
        }
        return this.issue();
    };

    annimRecipe(id_html){ document.getElementById(id_html).classList.toggle("active"); };

    /**
     * open and close tags list
     * @param {object} dom_list dom object 
     */
    annimTagsList(dom_list){
        if(dom_list.classList.contains("closed")) {
            let close_open = document.querySelector(".opened");
            if(close_open){ close_open.classList.replace("opened", "closed");}
            dom_list.classList.replace("closed", "opened");
        } else {
            dom_list.classList.replace("opened", "closed");
        }
    };

    /**
     * ends the search by tags mode
     * @param {object} dom_element 
     */
    endTagSearch(dom_element){
        let parent = dom_element.parentNode;
        parent.classList.remove("search-mode");
        let list_type = dom_element.getAttribute("id").split("-")[0];
        let li_array = Array.from(document.getElementById(list_type+"-list").childNodes);
        document.getElementById(list_type+"-search").value = "";
        if(this.test(li_array, "object", {"pos" : "second"})){
            for(let i = 0; i < li_array.length ; i++){ 
                if(li_array[i].nodeName === "LI"){ this.clearLiSearchMode(li_array[i]) ; }
            }
        }
    };

    /**
     * 
     * @param {string} called_method 
     * @param {string} other_class 
     * @param {string} called_object 
     * @param {string} event 
     * @param {boolean} param 
     * @returns {string} return necessary html class for the operation of listenner object
     */
    getListennerHtmlClass(called_method, other_class = false, called_object = "se", event = "c", param = true){ 
        return ["l-met-"+called_method, "l-obj-"+called_object, "l-evt-"+event, param ? "prm" : false, other_class];
    };

    /**
     * delete html class necessary for the search by tags
     * @param {object} li_obj : li dom element
     */
    clearLiSearchMode(li_obj){ 
        if(li_obj.classList.contains("found")){ li_obj.classList.remove("found"); }
    };

    /**
     * display all items tags
     */
    clearSearchList(){
        document.querySelectorAll(".not-available").forEach(e => {
            e.classList.replace("not-available", "available");
        });
    }

    hideRecipes(recipes){ 
        recipes.forEach(r => { 
            document.getElementById(r).classList.replace("active", "hide"); 
        }); 
    };

    /**
     * indicates which display areas are
     */
    initDisplayArea(){
        this.display_area = [
            document.getElementById("ingredients-list"), 
            document.getElementById("appliance-list"), 
            document.getElementById("ustencils-list"), 
            document.getElementById("tags-selected")
        ];
    };

    /**
     * displays tags corresponding to the search
     * @param {object} li : li dom element 
     */
    liTagSearched(li){ 
        if(typeof li === "object"){ li.classList.toggle("found") ;
        } else { document.getElementById(li).classList.toggle("found") ; }
    };

    noTagFound(id_html){ document.getElementById(id_html).classList.replace("hide", "found") ; };

    noRecipeFound(){ document.getElementById("no-recipe-found").classList.replace("hide", "active") ; };

    recipeFound(){ document.getElementById("no-recipe-found").classList.replace("active", "hide") ; };

    /**
     * show hidden tags from previous searches
     * @param {object} dom_li dom object 
     */
    removeSelectedTag(dom_li){
        let prt = dom_li.parentNode;
        let id_split = dom_li.getAttribute("id").split("-");
        document.getElementById(id_split[1]+"sl-"+id_split[2]).classList.remove(this.html_hide_class);
        prt.removeChild(dom_li);
    };

    startTagSearch(search_container){ search_container.classList.add("search-mode"); };

    tagFound(id_html){ document.getElementById(id_html).classList.replace("found" ,"hide") ; };

    /**
     * display selected tag and clears it from the list of available items
     * @param {object} dom_li dom object 
     */
    tagSelection(dom_li){
        let id_li = dom_li.getAttribute("id").split("-");
        this.addItemList(
            dom_li.textContent, 
            "st", 
            id_li[0].substring(0, 1)+"-"+id_li[1], 
            dom_li.parentNode.getAttribute("id").split("-")[0]
        );
        dom_li.classList.remove("available");
    }; 

    /**
     * show or hide the available items in lists
     * @param {array} app_list 
     * @param {array} ing_list 
     * @param {array} ust_list 
     */
    updateSearchList(app_list, ing_list, ust_list){
        document.querySelectorAll(".available").forEach(e => {
            let id_split = e.getAttribute("id").split("-");
            if(id_split[0] === "asl"){
                if(!app_list.includes(parseInt(id_split[1]))){ e.classList.replace("available", "not-available"); }
            } else if(id_split[0] === "isl"){
                if(!ing_list.includes(parseInt(id_split[1]))){ e.classList.replace("available", "not-available"); }
            } else if(id_split[0] === "usl"){
                if(!ust_list.includes(parseInt(id_split[1]))){ e.classList.replace("available", "not-available"); }
            }
        });
    }

}