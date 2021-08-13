class searchDisplay extends display {

    constructor(){ super() ; }

    /**
     * 
     * @param {string} item_content 
     * @param {string} list_id 
     * @param {integer} id_number 
     * @returns {boolean}
     */
    addItemList(item_content, list_id, id_number){
        this.current_method = "addItemList";
        if(this.addLiPtrn(item_content, list_id+"sl-"+id_number)){
            if(this.addPtnToDA( list_id === "i" ? "0" : list_id === "a" ? "1" : "2"
            )){ this.process_state = 1 ; }
        }
        return this.issue();
    };

    initDisplayArea(){
        this.display_area = [
            document.getElementById("ingredients-list"), 
            document.getElementById("appliance-list"), 
            document.getElementById("ustencils-list")
        ];
    }

}