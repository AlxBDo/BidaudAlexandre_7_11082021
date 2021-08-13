class recipeDisplay extends display {

    recipe_id;

    constructor(){ super() ; }

    addItemToPtrn(item, name_attr_ptrn = "ptrn"){
        this[name_attr_ptrn].append(item);
    };

    addItemToIngredientList(content){
        this.current_method = "addItemToIngredientList";
        this.addItemToPtrn(this.addLiPtrn(content, false, false, false), "ing");
    };

    addItemToRecipePtrn(itm_typ, content =  false, class_hmlt = false){
        this.addItemToPtrn(
            this.ptrnCreation(
                itm_typ, 
                content, 
                class_hmlt ? {"class" : class_hmlt} : false,
                false
            ));
    };

    display(){
        this.addItemToPtrn(this.ing);
        let ctrn = this.ptrnCreation(
            "a", 
            false, 
            {
                "id": "recipe-"+this.recipe_id, 
                "class": ["l-evt-c", "l-pre-def", "prm"], 
                "href": "#"
            }, 
            false
        );
        ctrn.append(this.ptrn);
        this.ptrn = ctrn;
        this.addPtnToDA();
    }

    createRecipePtrn(recipe_obj){
        this.recipe_id = recipe_obj.id ;
        this.ptrnCreation("article");
        this.addItemToRecipePtrn("h1", recipe_obj.name, ["name-recip"]);
        this.addItemToRecipePtrn("p", recipe_obj.time, ["time-recip"]);
        this.addItemToRecipePtrn("p", recipe_obj.description, ["desc-recip"]);
        this.ptrnCreation("ul", false, false, "ing");
    };

    initDisplayArea(){ this.display_area = document.getElementById("recipes-found"); }

}