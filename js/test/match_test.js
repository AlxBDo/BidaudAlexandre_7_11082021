function search(txt, searched_value){
    let sv = new RegExp(searched_value, "i");
    if(txt.match(sv) !== null){ return true; } else { return false ; }
}

searchRecipes("sucre", recipes);