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
        if(
            this.test(item, "string", {"pos" : "item"}, "!empty") 
            && this.test(searchDisplay_obj, searchDisplay, {"pos" : "searchDisplay_obj"}) 
        ){
            if(recipeDisplay_obj){
                if(this.test(recipeDisplay_obj, recipeDisplay, {"pos" : "recipeDisplay_obj"})){
                    recipeDisplay_obj.addItemToIngredientList(item);
                }
            }
            if(this.list_of_search_item.has(list_type)){
                let item_array = this.list_of_search_item.get(list_type);
                if(!this.compareToList.isIdentical(this.armonizeWords(item), list_type)){
                    item_array.push(item.toLowerCase());
                    this.list_of_search_item.set(list_type, item_array);
                    return searchDisplay_obj.addItemList(item, list_type, num_id);
                }
            } else { this.setErrorMsg("list_type paramater isn't in list_of_search_item attribute") ; }
        }
        return this.issue();
    };

    /**
     * 
     * @param {string} list_type 
     * @returns {array}
     */
    getItemList(list_type){ return this.list_of_search_item.get(list_type) ; };

    /**
     * 
     * @param {string} str 
     * @returns {string} to lower case and without accented characters
     */
    armonizeWords(str){
        let rm = this.rpl_map;
        return str.toLowerCase().replace(/[^a-z]/g, function(x) { return rm[x] || x; });
    };

    collect(){
        let sd = new searchDisplay();
        let rd = new recipeDisplay();
        let num_id = [0, 0, 0] ;
        for(let recipe of recipes){
            if(typeof recipe === "object"){
                rd.createRecipePtrn(recipe);
                for(let ing of recipe.ingredients){
                    num_id[0] += this.addItemToSearchList(ing.ingredient, "i", sd, num_id[0], rd); 
                }
                num_id[1] += this.addItemToSearchList(recipe.appliance, "a", sd, num_id[1]);
                for(let ust of recipe.ustensils){ 
                    num_id[2] += this.addItemToSearchList(ust, "u", sd, num_id[2]); 
                }
                rd.display();
            }
        }
        
    }
}