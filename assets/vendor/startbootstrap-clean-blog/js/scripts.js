(function ($) {
    "use strict";

    var MQL = 992; // Large screen breakpoint

    function toggleDropdown() {
        if ($(window).width() >= MQL) {
            // Enable hover effect
            $(".dropdown").hover(
                function () {
                    $(this).find(".dropdown-menu").stop(true, true).fadeIn(200);
                },
                function () {
                    $(this).find(".dropdown-menu").stop(true, true).fadeOut(200);
                }
            );
        } else {
            // Disable hover effect and keep default click behavior
            $(".dropdown").off("mouseenter mouseleave");
        }
    }

    // Run on page load
    toggleDropdown();

    // Run on window resize
    $(window).resize(function () {
        toggleDropdown();
    });

})(jQuery);
