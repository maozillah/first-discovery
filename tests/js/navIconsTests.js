/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    gpii.tests.verifyActiveState = function (that, iconState) {
        gpii.tests.utils.hasClass("The active icon", that.container, that.options.styles.active, iconState);
    };

    jqUnit.test("Nav Icon", function () {
        jqUnit.expect(5);

        var that = gpii.firstDiscovery.icon(".gpiic-icon", {
            position: 1
        });

        that.applier.change("isActive", true);
        gpii.tests.verifyActiveState(that, true);

        that.applier.change("isActive", false);
        gpii.tests.verifyActiveState(that, false);

        var confirmedIndicator = that.locate("confirmedIndicator"),
            showCss = that.options.styles.show;

        gpii.tests.utils.hasClass("The confirmed indicator is not shown", confirmedIndicator, showCss, false);
        that.applier.change("isConfirmed", true);
        gpii.tests.utils.hasClass("The confirmed indicator is shown", confirmedIndicator, showCss, true);
        that.applier.change("isConfirmed", false);
        gpii.tests.utils.hasClass("The confirmed indicator is still shown", confirmedIndicator, showCss, true);
    });

    gpii.tests.verifyStates = function (that, currentPanelNum, prevPanelNums, pageNum) {
        jqUnit.assertEquals("The model value has been updated", currentPanelNum, that.model.currentPanelNum);
        jqUnit.assertEquals("The icon page index is correct", pageNum, that.model.pageNum);

        var icons = that.locate("icon");
        fluid.each(icons, function (icon, index) {
            var iconComponent = that[index === 0 ? "icon" : "icon-" + index],
                activeCss = iconComponent.options.styles.active,
                showCss = iconComponent.options.styles.show,
                position = iconComponent.options.position,
                confirmedIndicator = iconComponent.locate("confirmedIndicator");

            if (currentPanelNum === index + 1) {
                jqUnit.assertTrue("The model value for isActive has been set to true", iconComponent.model.isActive);
                gpii.tests.utils.hasClass("The active icon", iconComponent.container, activeCss, true);
            } else {
                jqUnit.assertFalse("The model value for isActive has been set to false", iconComponent.model.isActive);
                gpii.tests.utils.hasClass("The inactive icon", iconComponent.container, activeCss, false);
            }

            if (prevPanelNums.indexOf(position) === -1) {
                gpii.tests.utils.hasClass("The confirmed indicator for a not-yet-visited panel", confirmedIndicator, showCss, false);
            } else {
                gpii.tests.utils.hasClass("The confirmed indicator for a visited panel", confirmedIndicator, showCss, true);
            }
        });
    };

    jqUnit.test("Nav Icons", function () {
        jqUnit.expect(180);

        var that = gpii.firstDiscovery.navIcons(".gpiic-nav", {
            holes: [4]
        }), icons = that.locate("icon");

        fluid.each(icons, function (icon, index) {
            var subcomponentName = index === 0 ? "icon" : "icon-" + index;
            jqUnit.assertNotUndefined("The subcomponent " + subcomponentName + " has been instantiated", that[subcomponentName]);
            jqUnit.assertEquals("The container for the subcomponent " + subcomponentName + " is correct", icon, that[subcomponentName].container[0]);
            jqUnit.assertEquals("The position option for the subcomponent " + subcomponentName + " has been set properly", index + 1, that[subcomponentName].options.position);
        });

        that.applier.change("currentPanelNum", 1);
        gpii.tests.verifyStates(that, 1, [], 0);

        that.applier.change("currentPanelNum", 3);
        gpii.tests.verifyStates(that, 3, [1], 0);

        // going back doesn't trigger the confirmed indicator to show for the previous panel
        that.applier.change("currentPanelNum", 2);
        gpii.tests.verifyStates(that, 2, [1], 0);

        that.applier.change("currentPanelNum", 4);
        gpii.tests.verifyStates(that, 4, [1, 2], 0);
        
        that.applier.change("currentPanelNum", 6);
        gpii.tests.verifyStates(that, 6, [1, 2], 0); // Still page 1 because of "hole", 4 not visited because of "hole"
        
        that.applier.change("currentPanelNum", 7);
        gpii.tests.verifyStates(that, 7, [1, 2, 6], 1);
    });

})(jQuery, fluid);
