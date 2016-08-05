

Mapthing CSS
============

Mapthing has a number of CSS classes for styling and adding functionality to your plugins' GUI.
Many of these classes are provided by 3rd party libraries.



Select Picker
-------------

Style and add functionality to drop down select boxes by adding `selectpicker` as the CSS class
in the `select` element. 

This functionality is provided by https://silviomoreto.github.io/bootstrap-select/examples/ and
further usage examples can be found there. 

Below is an example of its' use in a handlebars template for the `Elect` plugin::

    <div id="elect-main-form">
        <form>
            <div class="form-group">
                <label for="event-set-select">Event Set</label>
                <select class="selectpicker form-control" id="event-set-select">
                    {{#each eventsets}}
                        <option>{{this}}</option>
                    {{/each}}
                </select>
            </div>
        </form>
    </div>
