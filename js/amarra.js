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

        // get element
        var _el = document.getElementById(elementId);
        if (!_el) return null;

        var scope = {};
        // attach _propsToElements to the scope object as non-enumerable
        // this is used to find the element that is bound to each prop
        Object.defineProperty(scope, '__amarra__', {
            value: {
                propsToElements: {}
            },
            enumerable: false
        });

        // get all elements to be bound
        var binds = _el.querySelectorAll("[" + DATATAG + "]");



        // create a property with a custom setter in the scope for each element
        binds.forEach(function (element) {
            var prop = element.getAttribute(DATATAG);
            scope.__amarra__.propsToElements[prop] = element;
            //console.log(element.type);
            var value = getElementValue(element);
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

        });

        // add event listener to the parent element
        _el.addEventListener('change',
            (function () {
                return amarraListener.bind(scope);
            })()
        );

        // freeze properamarras that won't be modified anymore
        Object.freeze(scope.__amarra__);

        // all done! return the object with all the bound variables
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

        if (prop) this[prop] = getElementValue(target);
    }



    /**
     * Gets the value from an element depending on its type
     * @param {el} el Element to get a value from
     */
    function getElementValue(el) {

        switch (el.type) {
            case "number":
                return parseFloat(el.value);
            case "checkbox":
                return el.checked;
            default:
                return el.value;
        }

    }



    /**
     * Sets a value to an element depending on its type
     * @param {object} el    Element to set a new value to
     * @param {object} value The value to set to
     */
    function setElementValue(el, value) {

        switch (el.type) {
            case "number":
                el.value = parseFloat(value);
                break;
            case "checkbox":
                el.checked = value;
                break;
            default:
                el.value = value.toString();
                break;
        }

    }



    window.amarra = amarra;

})(window);
