/**
 * browse the json data to retrieve informations and execute objects 
 * allowing them to be exploited
 */
class jsonDataCollector extends issue {

    /**
     * object verifying that an entry in the list is unique
     */
    compareToList = {
        "i": [],
        "a": [],
        "u": [],
        isIdentical : function(str, list_type){
            if(this[list_type].includes(str)){ return true ; 
            } else {
                this[list_type].push(str);
                return false;
            }
        }
    };

    list_of_recipe_appliances = new Map();

    list_of_recipe_id = [];

    list_of_recipe_ingredients = new Map();

    list_of_recipe_ustencils = new Map();

    list_of_search_item = new Map();
    
    rpl_map = { 
        "à" : "a", 
        "â" : "a",
        "é" : "e", 
        "è" : "e", 
        "ê" : "e",
        "i" : "î",
        "i" : "ï",
        "o" : "ô",
        "o" : "ö",
        "u" : "û"
    };

    searchDisplay_obj = new searchDisplay();

    constructor(){
        super();
        // ingredients list creation
        this.list_of_search_item.set("i", []);
        // appliances list creation
        this.list_of_search_item.set("a", []);
        // ustencils list creation
        this.list_of_search_item.set("u", []);
    };

    /**
     * 
     * @param {string} item 
     * @param {string} list_type 
     * @param {object} searchDisplay_obj object instance of searchDisplay 
     * @param {number} num_id identifiant number
     * @param {object || boolean} searchDisplay_obj object instance of recipeDisplay 
     * @returns {boolean}
     */
    addItemToSearchList(item, list_type, searchDisplay_obj, num_id, recipeDisplay_obj = false){
        this.current_method = "addItemToSearchList";
        this.process_state = false;
        if(
            (
                (list_type === "i" && this.test(item, "object", {"pos" : "item"}))
                || ((list_type !== "i" && this.test(item, "string", {"pos" : "item"}, "!empty")))
            ) 
            && this.test(searchDisplay_obj, searchDisplay, {"pos" : "searchDisplay_obj"}) 
        ){
            if(recipeDisplay_obj){
                if(this.test(recipeDisplay_obj, recipeDisplay, {"pos" : "recipeDisplay_obj"})){
                    recipeDisplay_obj.addItemToIngredientList(item);
                }
            }
            if(this.list_of_search_item.has(list_type)){
                let item_array = this.list_of_search_item.get(list_type);
                if(list_type === "i"){ item = item.ingredient ; }
                if(!this.compareToList.isIdentical(this.armonizeWords(item), list_type)){
                    item_array.push(item.toLowerCase());
                    this.list_of_search_item.set(list_type, item_array);
                    return searchDisplay_obj.addItemList(item, list_type, num_id, "available");
                } else { return false ;}
            } else { this.setErrorMsg("list_type paramater isn't in list_of_search_item attribute") ; }
        }
        return this.issue();
    };

    /**
     * 
     * @param {string} str 
     * @returns {string} to lower case and without accented characters
     */
    armonizeWords(str){
        let rm = this.rpl_map;
        return str.toLowerCase().replace(/[^a-z]/g, function(x) { return rm[x] || x; });
    };

    /**
     * collects data and instantiates objects to display them 
     */
    collect(){
        let rd = new recipeDisplay();
        let num_id = [0, 0, 0] ;
        for(let recipe of recipes){
            if(typeof recipe === "object"){
                // save in recipes list
                this.list_of_recipe_id.push("recipe-"+recipe.id);
                rd.createRecipePtrn(recipe);
                let ri = []; // recipe's ingredients list
                let ru = []; // recipe's ustencils list
                // saves the ingredients in the summary list and displays them 
                for(let ing of recipe.ingredients){
                    if(this.addItemToSearchList(ing, "i", this.searchDisplay_obj, num_id[0], rd)){ 
                        num_id[0]++ ;
                    }
                    let id_ing = this.list_of_search_item.get("i").indexOf(ing.ingredient.toLowerCase());
                    if(id_ing >= 0){ ri.push(id_ing); }  
                }
                // saves the appliances in the summary list and displays them
                num_id[1] += this.addItemToSearchList(recipe.appliance, "a", this.searchDisplay_obj, num_id[1]);
                // saves the ustencils in the summary list and displays them
                for(let ust of recipe.ustensils){ 
                    num_id[2] += this.addItemToSearchList(ust, "u", this.searchDisplay_obj, num_id[2]); 
                    ru.push(num_id[2]);
                }
                // save recipe list
                this.list_of_recipe_appliances.set(recipe.id, num_id[1]); 
                this.list_of_recipe_ingredients.set(recipe.id, ri);
                this.list_of_recipe_ustencils.set(recipe.id, ru);
                // display recipe
                rd.display();
            }
        }
    };

    /**
     * 
     * @param {string} list_type 
     * @returns {array}
     */
    getItemList(list_type){ return this.list_of_search_item.get(list_type) ; };

    getSearchDisplObj(){ return this.searchDisplay_obj; }

}