class recipeDisplay extends display {

    recipe_id;

    constructor(){ super() ; }

    addItemToPtrn(item, name_attr_ptrn = "ptrn"){
        this[name_attr_ptrn].append(item);
    };

    addItemToIngredientList(content){
        this.current_method = "addItemToIngredientList";
        let content_li = content.ingredient;
        if(content.quantity){ 
            content_li += " : <span>"+content.quantity;
            if(content.unit){ 
                if(content.unit.length > 2){ content_li += " " ;}
                content_li += content.unit; 
            }
            content_li += "</span>";
        }
        this.addItemToPtrn(this.addLiPtrn(content_li, false, false, false), "ing");
    };

    addItemToRecipePtrn(itm_typ, content =  false, attr_obj = false){
        this.addItemToPtrn(
            this.ptrnCreation(
                itm_typ, 
                content, 
                attr_obj,
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
                "class": ["l-evt-c", "l-pre-def", "prm", "active"], 
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
        this.addItemToRecipePtrn("h1", recipe_obj.name, {"class" : ["name-recip"], "id" : "titl-"+this.recipe_id});
        this.addItemToRecipePtrn("p", recipe_obj.time, {"class" : ["time-recip"]});
        this.addItemToRecipePtrn("p", recipe_obj.description, {"class" : ["desc-recip"], "id" : "desc-"+this.recipe_id});
        this.addItemToRecipePtrn("input", false, {"id" : "app-"+this.recipe_id, "type" : "hidden", "value" : recipe_obj.appliance});
        this.addItemToRecipePtrn("input", false, {"id" : "ust-"+this.recipe_id, "type" : "hidden", "value" : recipe_obj.ustensils.join(",")});
        this.ptrnCreation("ul", false, {"id" : "ing-"+this.recipe_id}, "ing");
    };

    initDisplayArea(){ this.display_area = FOUND_RECIPES; }

}