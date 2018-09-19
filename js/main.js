/*
 * main js
 *
 */
(function (window) {

    window.onload = function () {

        // Create a form
        var form;

        // Create amarra data-binding object
        // Amarra will automatically look at all of the 
        if (window.amarra) form = window.amarra('amarra-app');

        // expose form to windows (for testing)
        window.form = form;

        /*
         * [ Set default values ] button
         * 
         * Sets some values to the amarra object, that will automatically be reflected on the form elements
         */
        document.getElementById('btn-reset').addEventListener('click', function () {

            // just set values normally
            form.name = "Celes";
            form.level = parseInt(Math.random() * 99) + 1;
            form.isMain = false;
            form.esper = "Kirin";
            form.world = "ruin";
            form.email = "cchere@empire.wob";
            form.notes = "Hello!";

        });

        /*
         * [ Log all values] button
         * 
         * Grabs all values and logs them
         */
        document.getElementById('btn-log').addEventListener('click', function () {
            var results = "";
            var keys = Object.keys(form);

            // Iterate through all keys
            keys.forEach(function (key) {
                results += key + ": " + form[key] + " [" + typeof form[key] + "]\n";
            });
            document.getElementById('pre-res').innerHTML = results;

            // Log a JSON stringified object
            document.getElementById('pre-json').innerHTML = JSON.stringify(form);

            // Log to console
            console.log(form);

        });

    };

})(window);
