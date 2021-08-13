class display extends issue {

    display_area = false ;
    ptrn;

    constructor(){
        super();
        this.initDisplayArea();
        if(!this.display_area){ 
            this.setErrorMsg("display area isn't defined.", false, false, 2);
            this.errorDisplay();
        }
    };
    
    addLiPtrn(content, id, html_class = false, name_attr_ptrn = "ptrn"){
        this.current_method = "addLiPtrn";
        let attr = false;
        if(id) { attr = {"id": id} ; }
        if(html_class){ attr.class = Array.isArray(html_class) ? html_class : [html_class] ; } 
        return this.ptrnCreation(
                "li", 
                content, 
                attr,
                name_attr_ptrn
            );
    };

    addPtnToDA(da_index = false, name_attr_ptrn = "ptrn"){
        if(this.test(this[name_attr_ptrn], "object", {"pos" : "this."+ name_attr_ptrn})){
            let da = da_index ? this.display_area[da_index] : this.display_area ;
            da.append(this[name_attr_ptrn]);
            this.process_state = true;
        }
        return this.issue();
    };

    initDisplayArea(){ return false ; };

    ptrnCreation(itm_typ, content =  false, attr_obj = false, name_attr_ptrn = "ptrn"){
        if(this.test(itm_typ, "string", {"pos" : "first"}, "!empty")){
            let p = document.createElement(itm_typ);
            if(content){ p.innerHTML = content; }
            if(attr_obj && this.test(attr_obj, "object", {"pos" : "attributes object"})){
                for(let attr in attr_obj){
                    if(this.test(attr, "string", false)){ 
                        if(attr !== "class"){ p.setAttribute(attr, attr_obj[attr]) ; 
                        } else { 
                            if(this.test(attr_obj[attr], "array", false, "!empty")){
                                for(let c of attr_obj[attr]){
                                    if(this.test(c, "string", false, "!empty")){ p.classList.add(c) ; }
                                }
                            }
                        }
                    }
                }
            }
            if(name_attr_ptrn){ this[name_attr_ptrn] = p ;}
            return p;
        }
        return this.issue();
    }

}