// ==UserScript==
// @name         Rozbordila-Bypass
// @namespace    https://duchy12.github.io/
// @version      0.1
// @description  Umožňuje kopírování z rozborudíla
// @match        https://rozbor-dila.cz/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    var resourcesToBlock = [
        'https://rozbor-dila.cz/wp-content/plugins/wp-content-copy-protection/assets/css/style.min.css?ver=1637532843',
        'https://rozbor-dila.cz/wp-content/plugins/wp-content-copy-protection/assets/js/script.min.js?ver=1637532843'
    ];

    // Block specific resources from loading
    function blockResources(event) {
        var url = event.target.src || event.target.href;
        if (resourcesToBlock.includes(url)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    // Add event listeners to block resource loading
    window.addEventListener('beforescriptexecute', blockResources, true);
    window.addEventListener('beforeload', blockResources, true);

    // Enable text selection
    var style = document.createElement('style');
    style.innerHTML = '* { user-select: auto !important; pointer-events: auto !important; cursor: auto !important }';
    document.head.appendChild(style);

    // MutationObserver, needed since they added the DRM to the page's html itself
    function observeAndDisableScript(scriptId) {
        const observer = new MutationObserver(() => {
            const script = document.getElementById(scriptId);
            if (script) {
                script.type = "text/plain";
                console.warn(`Script with id "${scriptId}" has been disabled.`);
                observer.disconnect();
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    observeAndDisableScript("wpcp_disable_selection");
    observeAndDisableScript("wpcp_disable_Right_Click");


})();

