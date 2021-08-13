/**
 * add listenner and associate functions
 */
 class listenner extends issue {

    call_objects = new Map();
    dom_elements_to_listen = new Map();
    events_to_listen = new Map();

    /**
     * 
     * @param {object} dom_element_to_listen 
     * @param {string} event_to_listen 
     * @param {string} event_identification_class 
     * @param {object} objet_to_call 
     * @param {string} object_id_class 
     */
    constructor(
        dom_element_to_listen, 
        event_to_listen, 
        event_identification_class, 
        objet_to_call  = false, 
        object_id_class = false
    ){
        super();
        this.addDomElementListen(dom_element_to_listen, event_to_listen);
        this.addEventToListen(event_to_listen, event_identification_class);
        if(objet_to_call && object_id_class){ this.addCallObject(objet_to_call, object_id_class); }
    }

    /**
     * 
     * @param {string} object_name : name integrated into the html class to identify the object to call
     * @param {object} object_to_call 
     */
    addCallObject(object_to_call, object_name = false){ 
        this.setMap(
            "call_objects", 
            object_name, 
            {typ: "object", val: object_to_call}
        );
    }

    /**
     * 
     * @param {object} dom_element_to_listen 
     * @param {string} event_to_listen 
     */
    addDomElementListen(dom_element_to_listen, event_to_listen){
        this.setMap(
            "dom_elements_to_listen", 
            event_to_listen, 
            {typ: "object", val: dom_element_to_listen}
        );
    }

    /**
     * 
     * @param {object} dom_element 
     * @param {string} method to call
     * @param {string} object identificator
     * @param {string} event to listen
     * @param {boolean} parameter method have parameter ? 
     * @param {boolean} prevent_default 
     * @param {boolean} stop_propagation 
     */
    addIdentificationClass(
        dom_element, 
        method, 
        object, 
        event, 
        parameter = false, 
        prevent_default = false, 
        stop_propagation = false
    ) {
        this.current_method = "addIdentificationClass";
        if(typeof dom_element === "object"){
            if(typeof method === "string" && method.length > 1){ this.setErrorMsg("method", "string") ; }
            if( this.call_objects.has(object)){ this.setErrorMsg("object", "object", "AddCallObject") ; }
            if(this.call_objects.has(event)){ 
                this.setErrorMsg("event paramater must be declare in events_to_listen", false, "AddEventToListen") ; 
            }
            if(!this.error){
                dom_element.classList.add("l-met-"+method, "l-obj-"+object, this.events_to_listen.get(event));
                if(parameter){ dom_element.classList.add("prm") ; }
                if(prevent_default){ dom_element.classList.add("l-pre-def") ; }
                if(stop_propagation){ dom_element.classList.add("l-stp-pro") ; }
            }
        } else { this.setErrorMsg("first", "object") ; }
        return this.issue();
    }
    
    /**
     * 
     * @param {string} event_name : click, mouseover, ...
     * @param {string} identification_class : html class used to identify an element to listen to
     */
    addEventToListen(event_name, identification_class){
        this.setMap(
            "events_to_listen", 
            event_name, 
            {typ: "string", val: identification_class}
        );
    }

    /**
     * 
     * @param {object} dom_element_to_listen 
     * @param {string} event_to_listen 
     */
    addListenner(dom_element_to_listen, event_to_listen){
        this.current_method = "addListenner";
        if(typeof dom_element_to_listen !== "object"){ this.setErrorMsg("first", "object") ; }
        if(!this.events_to_listen.has(event_to_listen)){ 
            this.setErrorMsg(
                "2nd parameter don't exist in events_to_listen attribute", 
                false, 
                "addEventToListen"
            ) ;
        }
        let targetElement = false;
        if(!this.error){
            let error = false;
            let tl = this;
            dom_element_to_listen.addEventListener(event_to_listen, function(event){
                targetElement = event.target || event.srcElement;
                var tecl = targetElement.classList ;
                if(tecl.contains(tl.events_to_listen.get(event_to_listen))) {
                    let call_obj = tecl[1].split("-")[2];
                    if(tl.call_objects.has(call_obj)){
                        call_obj = tl.call_objects.get(tecl[1].split("-")[2]);
                        let method_to_call = tecl[0].split("-")[2];
                        if(call_obj.hasOwnProperty(method_to_call)){
                            if(tecl.contains("prm")) { call_obj[method_to_call](targetElement) ;
                            } else { call_obj[method_to_call]() ; }
                            if(tecl.contains("l-pre-def")){ event.preventDefault(); }
                            if(tecl.contains("l-stp-pro")){ event.stopPropagation(); }
                        } else { error = method_to_call + " method isn't defined in called object" ; }
                    } else { error = "stipulates an object missing from the \"call_objects\" attribute" ; }
                }
            });
            if(error){ this.error = error; }
        }
        return this.issue(); 
    }

    /**
     * browse the array of elements of the Dom and add listenner
     */
    listen(){
        this.current_method = "listen";
        if(this.dom_elements_to_listen.size > 0){
            for(let [k, v] of this.dom_elements_to_listen){
                this.addListenner(v, k);
            };
        } else { this.setErrorMsg("dom_elements_to_listen is empty", false, "addDomElementListen") ; }
        return this.issue();
    }

    /**
     * 
     * @param {string} map_name 
     * @param {string || array} key : array.prototype[key, value_object]
     * @param {object} value_object : object.prototype{typ: typeof value test (string), val: value}
     */
    setMap(map_name, key = false, value_object = false){
        this.current_method = "setMap"; 
        if(typeof map_name === "string"){
            if(!value_object){
                if(typeof key === "object" && key.length > 0){
                    for(let k of key){ this.setMap(map_name, k[0], k[1]); }
                } else { this.error = "if third parameter is false, second parameter must be array." }
            } else {
                key = typeof key === "string" ? key 
                    :  map_name.substr(0,1) + (this[map_name].size + 1) ;
                if(typeof value_object !== "object") { this.setErrorMsg("third", "object") ;
                } else if(typeof value_object.val !== value_object.typ) {
                    this.setErrorMsg("value must be : "+value_object.typ) ;
                }
                if(!this.error){ 
                    let v;
                    if(this[map_name].has(key)){
                        if(this[map_name].get(key) !== value_object.val){
                            v = [this[map_name].get(key), value_object.val];
                        }
                    } else { this[map_name].set(key, value_object.val) ; } 
                }
            }
        } else { this.setErrorMsg("first", "string") ; }
        if(this.error){ this.current_method += " (map : "+map_name +")" ; }
        return this.issue();
    }

}