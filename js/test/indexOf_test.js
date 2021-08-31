function search(txt, searched_value){
    if(txt.toLowerCase().indexOf(searched_value) >= 0){ return true; } else { return false ; }
}

searchRecipes("sucre", recipes);