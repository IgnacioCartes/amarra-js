/*
 * amarra.js
 * 
 * Simple data-binding between HTML and js
 * 
 * 
 * 
 * Changing object data when DOM element changes: OK!
 * Changing DOM element when object data changes: on it......
 *
 */
(function (window) {


    /* Data tag */
    var DATATAG = "data-amarra";


    /**
     * Creates a new set of amarras
     * @param   {object} elementId The id of the parent element that contains all other elements to be bound
     * @returns {object} An object with all bound variables
     */
    var amarra = function (elementId) {

        // Get DOM element
        var _el = document.getElementById(elementId);
        if (!_el) return null;

        // Create scope
        var scope = {};

        // Attach amarra object to the scope object as non-enumerable
        // this is used to find the element that is bound to each prop
        Object.defineProperty(scope, '__amarra__', {
            value: {
                propsToElements: {}
            },
            enumerable: false
        });

        // Get all elements to be bound
        var binds = _el.querySelectorAll("[" + DATATAG + "]");
        var props = {};

        // Sort all props
        binds.forEach(function (element) {
            var prop = element.getAttribute(DATATAG);

            if (element.type === "radio") {
                // for radio buttons, an array is created in propsToElements
                console.log(element, prop);
                if (!props[prop])  {
                    // if undefined, create a single element array
                    props[prop] = [element];
                } else {
                    // else, push to the existing array
                    props[prop].push(element);
                }

                // add name to radio element
                element.setAttribute("name", prop);

            } else {
                // for other elements, no array is needed
                props[prop] = element;
            }
        });

        // pass props to scope
        scope.__amarra__.propsToElements = props;

        // Create a property with a custom setter in the scope for each prop
        Object.keys(props).forEach(function (key) {

            // get elements and scope prop
            var element = props[key],
                prop;

            if (Array.isArray(element))
                prop = element[0].getAttribute(DATATAG);
            else
                prop = element.getAttribute(DATATAG);

            var value = getElementValue(element);
            if (!scope[prop]) {
                Object.defineProperty(scope, prop, {
                    get: function () {
                        return value;
                    },
                    set: function (newValue) {
                        value = newValue;
                        if (scope.__amarra__.propsToElements[prop])
                            setElementValue(scope.__amarra__.propsToElements[prop], newValue);
                    },
                    enumerable: true
                });
            } else {
                console.log(prop + " is already defined!", element);
            }

        });

        // Add event listener to the parent element
        _el.addEventListener('change',
            (function () {
                return amarraListener.bind(scope);
            })()
        );

        // Freeze properties that won't be modified anymore
        Object.freeze(scope.__amarra__);

        // All done! return the object with all the bound variables
        console.log("amarra.js is set! " + binds.length.toString() + " bind(s) were created!");
        return scope;

    };



    /**
     * Takes the updated value from the element and updates the scope object with it
     * @param {object} evt EventValue object
     */
    function amarraListener(evt) {
        var target = evt.target;
        var prop = evt.target.getAttribute("data-amarra");

        if (prop) this[prop] = getElementValue(target, prop);
    }



    /**
     * Gets the value from an element depending on its type
     * @param {el} el Element to get a value from
     */
    function getElementValue(el, prop) {

        switch (el.type) {
            case "number":
                return parseFloat(el.value);
            case "checkbox":
                return el.checked;
            case "radio":
                var checked = document.querySelector('input[name = "' + prop + '"]:checked');
                if (checked)
                    return checked.value;
                else
                    return null;
                break;
            default:
                return el.value;
        }

    }



    /**
     * Sets a value to an element depending on its type
     * @param {object} el    Element (or array of elements) to set a new value to
     * @param {object} value The value to set to
     */
    function setElementValue(el, value) {

        var eltype = el.type;
        // detect radio
        if (Array.isArray(el) && el[0].type === "radio")
            eltype = "radio";

        switch (eltype) {
            case "number":
                el.value = parseFloat(value);
                break;
            case "checkbox":
                el.checked = value;
                break;
            case "radio":
                el.forEach(function (radio) {
                    if (radio.value === value)
                        radio.checked = true;
                    else
                        radio.checked = false;
                });

                break;
            default:
                el.value = value.toString();
                break;
        }

    }



    window.amarra = amarra;

})(window);
