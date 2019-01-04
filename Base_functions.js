var waitingDialog = waitingDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
       '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
        '<div class="modal-body">' +
        '<div id="loader"></div>' +
        //'</div>' +
        '</div></div></div>');

    return {
        show: function (message) {
            // Assigning defaults
            if (typeof message === 'undefined') {
                message = 'Loading';
            }

            $dialog.find('h3').text(message);
            $dialog.modal('show');
        },
        hide: function () {
            $dialog.modal('hide');
        }
    };

})(jQuery);