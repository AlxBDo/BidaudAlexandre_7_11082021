function searchIngredient(searched_value, ingredients){
    for(let ing of ingredients){
      if(search(ing.ingredient.toLowerCase(), searched_value)){ return true; }
    }
    return false ;
}

function searchUstencils(searched_value, ustencils){
    for(let ust of ustencils){
      if(search(ust.toLowerCase(), searched_value)){ return true; }
    }
    return false ;
}

function searchRecipes(searched_value, mode = false){
    let rjct_r = []; // rejected recipes
    let slct_r = []; // selected recipes
    if(mode === "indexOf"){ searched_value = searched_value.toLowerCase(); }
    recipes.forEach(r => {
        let found = true ;
        if(!searchIngredient(searched_value, r.ingredients)){ 
            if(!search(r.description, searched_value)){
                if(!search(r.name, searched_value)){
                    if(!search(r.appliance, searched_value)){
                        if(!searchUstencils(searched_value, r.ustensils)){
                            found = false;
                        }
                    } 
                } 
            } 
        }
        if(found){ slct_r.push(r.id);
        } else {  rjct_r.push(r.id); }
    });
    console.log("- Found recipes -");
    console.log(slct_r);
    console.log("- Rejected recipes -");
    console.log(rjct_r);
}