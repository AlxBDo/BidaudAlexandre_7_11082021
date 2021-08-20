class issue {

    /**
     * class css to apply to the error message container
     */
    css_class = "err";
    error_level = 0;
    process_state = true;

    constructor(){
        this.error = false ;
    };

    /**
     * 
     * @param {object} dom_element_object 
     */
    errorDisplay(dom_element_object = null){
        if(!this.error){ this.error = "errorDiplay method - no errors were found." ; }
        if(dom_element_object !== null){ 
            this.error = "\"" + dom_element_object.localName 
                + " (id=" + dom_element_object.id + ")\"" +  " element "+ this.error ; 
        }
        if(this.error_level > 1){
            throw new Error("[object : "+this.constructor.name+", method : "+this.current_method + "]"+this.error);
        } else {
            console.log("-- ERROR --");
            console.log("[object : "+this.constructor.name+", method : "+this.current_method + "]");
            console.log(this.error);
        }
    };

    /**
     * 
     * @param {object} dom_element_object 
     * @returns {boolean} process_state attribute 
     */
    issue(dom_element_object = null){ 
        if(this.error){
            this.errorDisplay(dom_element_object);
        }
        let rtn = this.process_state ;
        this.process_state = true;
        return rtn ;
    };

    /**
     * 
     * @param {string} parameter_position 
     * @param {boolean || string} parameter_type_wanted 
     * @param {boolean || string} method_must_use name of method to resolve error or false 
     * @param {integer} error_level 
     * 0 = minor (console.log display)
     * 1 = process failure (display of the problem encountered by the Internet user)
     * 2 = fatal error
     */
    setErrorMsg(parameter_position, parameter_type_wanted = false, method_must_use = false, error_level = 0){
        this.error = parameter_position ;
        if(parameter_type_wanted) { this.error += " parameter must be " + parameter_type_wanted ; }
        this.error +=  ".";
        if(method_must_use){ this.error += " -!- Use " + method_must_use + " method -!-"}
        if(error_level > 0){ 
            this.error_level = error_level;
            this.errorDisplay() ; 
        }
    };

    /**
     * 
     * @param {any} item_test 
     * @param {string || class} typ_expect 
     * @param {object} error_infos 
     * @param {boolean || string} condition_typ 
     * @param {number || string} condition_value 
     * @returns {boolean}
     */
    test(item_test, typ_expect, error_infos, condition_typ = false, condition_value = false){
        this.process_state = false ;
        if(item_test && item_test !== "false"){
            if(typ_expect === "string" || typ_expect === "object" || typ_expect === "number"){ 
                if(typeof item_test === typ_expect){ this.process_state = true ; }
            } else if(typ_expect === "array" && Array.isArray(item_test)){ this.process_state = true; 
            } else if(item_test instanceof typ_expect){ this.process_state = true; }
            if(condition_typ){ 
                if(condition_typ === "!empty"){
                    condition_typ = ">";
                    condition_value = 0 ;
                }
                let vt = typ_expect === "number" ? item_test : item_test.lenght ;
                switch(condition_typ){
                    case ">" : 
                        if(vt > condition_value){ this.process_state = true ; }; 
                        break;
                    case ">=" : 
                        if(vt >= condition_value){ this.process_state = true ; }; 
                        break;
                    case "<" : 
                        if(vt <= condition_value){ this.process_state = true ; }; 
                        break;
                    case "<=" : 
                        if(vt <= condition_value){ this.process_state = true ; }; 
                        break;
                    case "=" : 
                        if(vt === condition_value){ this.process_state = true ; }; 
                        break; 
                    case "!=" : 
                        if(vt !== condition_value){ this.process_state = true ; }; 
                        break; 
                    default : break; 
                } 
            }
            if(!this.process_state && error_infos){
                this.setErrorMsg(
                    error_infos["msg"] ? error_infos["msg"] : error_infos["pos"],
                    typ_expect,
                    error_infos["mu"] ? error_infos["mu"] : false,
                    error_infos["el"] ? error_infos["el"] : 0

                );
            }
        }
        return this.issue();
    }

}