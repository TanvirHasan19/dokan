import { expect, Page } from '@playwright/test';
import { AdminPage } from '@pages/adminPage';
import { selector } from '@pages/selectors';
import { data } from '@utils/testData';
import { dokanSettings } from '@utils/interfaces';

const { DOKAN_PRO } = process.env;

// selectors
const settingsAdmin = selector.admin.dokan.settings;

export class SettingsPage extends AdminPage {
    constructor(page: Page) {
        super(page);
    }

    // navigation

    async goToSingleDokanSettings(settingMenu: string, settingTitle: string) {
        await this.toPass(async () => {
            await this.goto(data.subUrls.backend.dokan.settings);
            await this.reload(); //todo: need to resolve: page doesn't reload for having # (fragment identifier) in the url
            await this.click(settingMenu);
            await this.toContainText(settingsAdmin.settingTitle, settingTitle, { timeout: 3000 });
        });
    }

    // settings

    // dokan settings render properly
    async dokanSettingsRenderProperly() {
        await this.goIfNotThere(data.subUrls.backend.dokan.settings);

        // settings text is visible
        await this.toBeVisible(settingsAdmin.settingsText);

        // settings section elements are visible
        await this.multipleElementVisible(settingsAdmin.sections);

        // settings header elements are visible
        await this.multipleElementVisible(settingsAdmin.header);

        // settings field is visible
        await this.toBeVisible(settingsAdmin.fields);

        // settings save changes is visible
        await this.toBeVisible(settingsAdmin.saveChanges);
    }

    // search settings
    async searchSettings(settings: string) {
        await this.goIfNotThere(data.subUrls.backend.dokan.settings);

        await this.clearAndType(settingsAdmin.search.input, settings);
        await this.toBeVisible(settingsAdmin.fields);
        await this.click(settingsAdmin.search.close);
    }

    // scroll to top settings
    async scrollToTopSettings() {
        await this.goto(data.subUrls.backend.dokan.settings);
        // toPass is used to avoid flakiness
        await this.toPass(async () => {
            await this.scrollToBottom();
            const isBackToTopVisible = await this.isVisible(settingsAdmin.backToTop, 1);
            if (!isBackToTopVisible) {
                await this.scrollToTop();
            }
            // eslint-disable-next-line playwright/prefer-web-first-assertions
            expect(isBackToTopVisible).toBeTruthy();
        });

        await this.click(settingsAdmin.backToTop);
        await this.toBeVisible(settingsAdmin.search.searchBox);
    }

    // dokan settings

    // admin set dokan general settings
    async setDokanGeneralSettings(general: dokanSettings['general']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.general);

        // site options
        await this.enableSwitcher(settingsAdmin.general.adminAreaAccess);
        await this.clearAndType(settingsAdmin.general.vendorStoreUrl, general.vendorStoreUrl);
        await this.typeFrameSelector(settingsAdmin.general.setupWizardMessageIframe, settingsAdmin.general.setupWizardMessageHtmlBody, general.setupWizardMessage);
        if (DOKAN_PRO) {
            await this.click(settingsAdmin.general.sellingProductTypes(general.sellingProductTypes));
        }

        // vendor store options
        await this.enableSwitcher(settingsAdmin.general.storeTermsAndConditions);
        await this.clearAndType(settingsAdmin.general.storeProductPerPage, general.storeProductPerPage);
        if (DOKAN_PRO) {
            await this.enableSwitcher(settingsAdmin.general.enableTermsAndCondition);
            await this.click(settingsAdmin.general.storCategory(general.storCategory));
        }

        // product page settings
        await this.enableSwitcher(settingsAdmin.general.showVendorInfo);
        await this.enableSwitcher(settingsAdmin.general.enableMoreProductsTab);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, general.saveSuccessMessage);
    }

    // admin set dokan selling settings
    async setDokanSellingSettings(selling: dokanSettings['selling']) {
        await this.goToSingleDokanSettings(settingsAdmin.menus.sellingOptions, selling.settingTitle);

        // commission settings
        await this.selectByValue(settingsAdmin.selling.commissionType, selling.commission.commissionType);
        await this.clearAndType(settingsAdmin.selling.percentage, selling.commission.commissionPercentage);
        await this.clearAndType(settingsAdmin.selling.fixed, selling.commission.commissionFixed);
        await this.click(settingsAdmin.selling.shippingFeeRecipient(selling.shippingFeeRecipient));
        await this.click(settingsAdmin.selling.productTaxFeeRecipient(selling.productTaxFeeRecipient));
        await this.click(settingsAdmin.selling.shippingTaxFeeRecipient(selling.shippingTaxFeeRecipient));

        // vendor capabilities
        await this.enableSwitcher(settingsAdmin.selling.enableSelling);
        await this.enableSwitcher(settingsAdmin.selling.onePageProductCreate);
        await this.enableSwitcher(settingsAdmin.selling.orderStatusChange);
        await this.enableSwitcher(settingsAdmin.selling.selectAnyCategory);
        if (DOKAN_PRO) {
            await this.click(settingsAdmin.selling.newProductStatus(selling.newProductStatus));
            await this.enableSwitcher(settingsAdmin.selling.duplicateProduct);
            await this.click(settingsAdmin.selling.productCategorySelection(selling.productCategorySelection));
            await this.enableSwitcher(settingsAdmin.selling.vendorsCanCreateTags);
            await this.enableSwitcher(settingsAdmin.selling.orderDiscount);
            await this.enableSwitcher(settingsAdmin.selling.productDiscount);
            await this.enableSwitcher(settingsAdmin.selling.vendorProductReviewStatusChange);
            await this.enableSwitcher(settingsAdmin.selling.guestProductEnquiry);
            await this.enableSwitcher(settingsAdmin.selling.newVendorEnableAuction); // todo: add condition for simple auction plugin enabled
        }

        // catalog mode
        await this.enableSwitcher(settingsAdmin.selling.removeAddToCartButton);
        await this.enableSwitcher(settingsAdmin.selling.hideProductPrice);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toHaveValue(settingsAdmin.selling.percentage, selling.commission.commissionPercentage);
        await this.toHaveValue(settingsAdmin.selling.fixed, selling.commission.commissionFixed);
    }

    // Admin Set Dokan Withdraw Settings
    async setDokanWithdrawSettings(withdraw: dokanSettings['withdraw']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.withdrawOptions);

        // Withdraw Options
        await this.enableSwitcher(settingsAdmin.withdraw.withdrawMethodsPaypal);
        await this.enableSwitcher(settingsAdmin.withdraw.withdrawMethodsBankTransfer);
        if (DOKAN_PRO) {
            await this.enableSwitcher(settingsAdmin.withdraw.withdrawMethodsDokanCustom);
            await this.enableSwitcher(settingsAdmin.withdraw.withdrawMethodsSkrill);
            await this.clearAndType(settingsAdmin.withdraw.customMethodName, withdraw.customMethodName);
            await this.clearAndType(settingsAdmin.withdraw.customMethodType, withdraw.customMethodType);
        }
        // Withdraw Charge
        await this.clearAndType(settingsAdmin.withdraw.payPalChargePercentage, withdraw.charge.paypal);
        await this.clearAndType(settingsAdmin.withdraw.bankTransferChargeFixed, withdraw.charge.bank);
        if (DOKAN_PRO) {
            await this.clearAndType(settingsAdmin.withdraw.skrillChargePercentage, withdraw.charge.skrill);
            await this.clearAndType(settingsAdmin.withdraw.customChargePercentage, withdraw.charge.custom);
        }

        await this.clearAndType(settingsAdmin.withdraw.minimumWithdrawAmount, withdraw.minimumWithdrawAmount);
        await this.enableSwitcher(settingsAdmin.withdraw.orderStatusForWithdrawCompleted);
        await this.enableSwitcher(settingsAdmin.withdraw.orderStatusForWithdrawProcessing);

        // Withdraw Charge

        if (DOKAN_PRO) {
            await this.clearAndType(settingsAdmin.withdraw.withdrawThreshold, withdraw.withdrawThreshold);

            // Disbursement Schedule Settings
            await this.enableSwitcher(settingsAdmin.withdraw.withdrawDisbursementManual);
            await this.enableSwitcher(settingsAdmin.withdraw.withdrawDisbursementAuto);

            // Disbursement Schedule
            await this.enableSwitcher(settingsAdmin.withdraw.disburseMentQuarterlySchedule);
            await this.enableSwitcher(settingsAdmin.withdraw.disburseMentMonthlySchedule);
            await this.enableSwitcher(settingsAdmin.withdraw.disburseMentBiweeklySchedule);
            await this.enableSwitcher(settingsAdmin.withdraw.disburseMentWeeklySchedule);

            // Quarterly Schedule
            await this.selectByValue(settingsAdmin.withdraw.quarterlyScheduleMonth, withdraw.quarterlyScheduleMonth);
            await this.selectByValue(settingsAdmin.withdraw.quarterlyScheduleWeek, withdraw.quarterlyScheduleWeek);
            await this.selectByValue(settingsAdmin.withdraw.quarterlyScheduleDay, withdraw.quarterlyScheduleDay);
            // Monthly Schedule
            await this.selectByValue(settingsAdmin.withdraw.monthlyScheduleWeek, withdraw.monthlyScheduleWeek);
            await this.selectByValue(settingsAdmin.withdraw.monthlyScheduleDay, withdraw.monthlyScheduleDay);
            // Biweekly Schedule
            await this.selectByValue(settingsAdmin.withdraw.biweeklyScheduleWeek, withdraw.biweeklyScheduleWeek);
            await this.selectByValue(settingsAdmin.withdraw.biweeklyScheduleDay, withdraw.biweeklyScheduleDay);
            // Weekly Schedule
            await this.selectByValue(settingsAdmin.withdraw.weeklyScheduleDay, withdraw.weeklyScheduleDay);
        }

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toHaveValue(settingsAdmin.withdraw.minimumWithdrawAmount, withdraw.minimumWithdrawAmount);
    }

    // Admin Set Dokan Reverse Withdraw Settings
    async setDokanReverseWithdrawSettings(reverseWithdraw: dokanSettings['reverseWithdraw']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.reverseWithdrawal);

        // reverse withdraw options
        await this.enableSwitcher(settingsAdmin.reverseWithdraw.enableReverseWithdrawal);
        await this.enableSwitcher(settingsAdmin.reverseWithdraw.enableReverseWithdrawalForThisGateway);

        await this.selectByValue(settingsAdmin.reverseWithdraw.billingType, reverseWithdraw.billingType);
        await this.clearAndType(settingsAdmin.reverseWithdraw.reverseBalanceThreshold, reverseWithdraw.reverseBalanceThreshold);
        await this.clearAndType(settingsAdmin.reverseWithdraw.gracePeriod, reverseWithdraw.gracePeriod);

        await this.enableSwitcher(settingsAdmin.reverseWithdraw.disableAddToCartButton);
        await this.enableSwitcher(settingsAdmin.reverseWithdraw.hideWithdrawMenu);
        await this.enableSwitcher(settingsAdmin.reverseWithdraw.MakeVendorStatusInactive);

        await this.enableSwitcher(settingsAdmin.reverseWithdraw.displayNoticeDuringGracePeriod);
        if (DOKAN_PRO) {
            await this.enableSwitcher(settingsAdmin.reverseWithdraw.sendAnnouncement);
        }

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toHaveValue(settingsAdmin.reverseWithdraw.reverseBalanceThreshold, reverseWithdraw.reverseBalanceThreshold);
    }

    // Admin Set Dokan Page Settings
    async setPageSettings(page: dokanSettings['page']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.pageSettings);

        await this.selectByLabel(settingsAdmin.page.dashboard, page.dashboard);
        await this.selectByLabel(settingsAdmin.page.myOrders, page.myOrders);
        await this.selectByLabel(settingsAdmin.page.storeListing, page.storeListing);
        await this.selectByLabel(settingsAdmin.page.termsAndConditions, page.termsAndConditions);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, page.saveSuccessMessage);
    }

    // Admin Set Dokan Appearance Settings
    async setDokanAppearanceSettings(appearance: dokanSettings['appearance']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.appearance);

        // Appearance Settings
        await this.enableSwitcher(settingsAdmin.appearance.showMapOnStorePage);
        await this.click(settingsAdmin.appearance.mapApiSource(appearance.mapApiSource));
        await this.clearAndType(settingsAdmin.appearance.googleMapApiKey, appearance.googleMapApiKey);
        await this.enableSwitcher(settingsAdmin.appearance.showContactFormOnStorePage);
        await this.click(settingsAdmin.appearance.storeHeaderTemplate2);
        await this.click(settingsAdmin.appearance.storeHeaderTemplate1);
        if (DOKAN_PRO) {
            await this.clearAndType(settingsAdmin.appearance.storeBannerWidth, appearance.storeBannerWidth);
            await this.clearAndType(settingsAdmin.appearance.storeBannerHeight, appearance.storeBannerHeight);
            await this.enableSwitcher(settingsAdmin.appearance.storeOpeningClosingTimeWidget);
        }

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toHaveValue(settingsAdmin.appearance.googleMapApiKey, appearance.googleMapApiKey);
    }

    // Admin Set Dokan MenuManager Settings
    async setDokanMenuManagerSettings(menus: string[]) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.menuManager);

        // menuManager Settings
        for (const menu of menus) {
            await this.enableSwitcher(settingsAdmin.menuManager.menuSwitcher(menu));
        }

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);

        for (const menu of menus) {
            await this.toHaveBackgroundColor(settingsAdmin.menuManager.menuSwitcher(menu) + '//span', 'rgb(0, 144, 255)');
        }
    }

    // Admin Set Dokan Privacy Policy Settings
    async setDokanPrivacyPolicySettings(privacyPolicy: dokanSettings['privacyPolicy']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.privacyPolicy);

        // Privacy Policy Settings
        await this.enableSwitcher(settingsAdmin.privacyPolicy.enablePrivacyPolicy);
        await this.selectByValue(settingsAdmin.privacyPolicy.privacyPage, privacyPolicy.privacyPage);
        await this.typeFrameSelector(settingsAdmin.privacyPolicy.privacyPolicyIframe, settingsAdmin.privacyPolicy.privacyPolicyHtmlBody, privacyPolicy.privacyPolicyContent);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, privacyPolicy.saveSuccessMessage);
    }

    // Admin Set Dokan Color Settings
    async setDokanColorSettings(paletteName: string) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.colors);

        // Colors Settings
        await this.click(settingsAdmin.colors.predefineColorPalette);
        await this.click(settingsAdmin.colors.predefinedPalette(paletteName));

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, data.dokanSettings.colors.saveSuccessMessage);
    }

    // Admin Set Dokan Live Search Settings
    async setDokanLiveSearchSettings(liveSearch: dokanSettings['liveSearch']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.liveSearch);

        // Live Search Settings
        await this.selectByValue(settingsAdmin.liveSearch.liveSearchOptions, liveSearch.liveSearchOption);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, liveSearch.saveSuccessMessage);
    }

    // Admin Set Dokan Store Support Settings
    async setDokanStoreSupportSettings(storeSupport: dokanSettings['storeSupport']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.storeSupport);

        // Store Support Settings
        await this.enableSwitcher(settingsAdmin.storeSupport.displayOnOrderDetails);
        await this.selectByValue(settingsAdmin.storeSupport.displayOnSingleProductPage, storeSupport.displayOnSingleProductPage);
        await this.clearAndType(settingsAdmin.storeSupport.supportButtonLabel, storeSupport.supportButtonLabel);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, storeSupport.saveSuccessMessage);
    }

    // Admin Set Dokan Vendor Verification Settings
    async setDokanVendorVerificationSettings(vendorVerification: Pick<dokanSettings['vendorVerification'], 'verifiedIcons' | 'verificationMethods' | 'saveSuccessMessage'>) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.vendorVerification);

        await this.click(settingsAdmin.vendorVerification.verifiedIcon(vendorVerification.verifiedIcons.userCheckSolid));
        const response = await this.enableSwitcherAndWaitForResponse(data.subUrls.api.dokan.verificationMethods, settingsAdmin.vendorVerification.enableVerificationMethod(vendorVerification.verificationMethods.nationalId));
        if (response) {
            await this.toBeVisible(settingsAdmin.vendorVerification.methodUpdateSuccessMessage);
        }

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, vendorVerification.saveSuccessMessage);
    }

    // Admin Set Dokan SMS Verification Gateways Settings
    async setDokanSMSVerificationGatewaysSettings(verificationSmsGateways: dokanSettings['verificationSmsGateway']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.verificationSmsGateways);

        await this.clearAndType(settingsAdmin.verificationSmsGateway.senderName, verificationSmsGateways.senderName);
        await this.clearAndType(settingsAdmin.verificationSmsGateway.smsText, verificationSmsGateways.smsText);
        await this.clearAndType(settingsAdmin.verificationSmsGateway.smsSentSuccess, verificationSmsGateways.smsSentSuccess);
        await this.clearAndType(settingsAdmin.verificationSmsGateway.smsSentError, verificationSmsGateways.smsSentError);
        await this.click(settingsAdmin.verificationSmsGateway.activeGateway(verificationSmsGateways.activeGateway));
        await this.enableSwitcher(settingsAdmin.verificationSmsGateway.enableGateway(verificationSmsGateways.activeGateway));
        await this.click(settingsAdmin.verificationSmsGateway.expandButton);

        // vonage
        await this.toBeVisible(settingsAdmin.verificationSmsGateway.vonage.apiKey);
        await this.clearAndType(settingsAdmin.verificationSmsGateway.vonage.apiKey, verificationSmsGateways.vonage.apiKey);
        await this.clearAndType(settingsAdmin.verificationSmsGateway.vonage.apiSecret, verificationSmsGateways.vonage.apiSecret);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, verificationSmsGateways.saveSuccessMessage);

        await this.toHaveValue(settingsAdmin.verificationSmsGateway.senderName, verificationSmsGateways.senderName);
        await this.toHaveValue(settingsAdmin.verificationSmsGateway.smsText, verificationSmsGateways.smsText);
        await this.toHaveValue(settingsAdmin.verificationSmsGateway.smsSentSuccess, verificationSmsGateways.smsSentSuccess);
        await this.toHaveValue(settingsAdmin.verificationSmsGateway.smsSentError, verificationSmsGateways.smsSentError);
        await this.toHaveClass(settingsAdmin.verificationSmsGateway.activeGateway(verificationSmsGateways.activeGateway), 'checked');
        await this.toHaveBackgroundColor(settingsAdmin.verificationSmsGateway.enableGateway(verificationSmsGateways.activeGateway) + '//span', 'rgb(0, 144, 255)');
        await this.toHaveValue(settingsAdmin.verificationSmsGateway.vonage.apiKey, verificationSmsGateways.vonage.apiKey);
        await this.toHaveValue(settingsAdmin.verificationSmsGateway.vonage.apiSecret, verificationSmsGateways.vonage.apiSecret);
    }

    // Admin Set Dokan Email Verification Settings
    async setDokanEmailVerificationSettings(emailVerification: dokanSettings['emailVerification']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.emailVerification);

        // Email Verification Settings
        await this.enableSwitcher(settingsAdmin.emailVerification.enableEmailVerification);
        await this.clearAndType(settingsAdmin.emailVerification.registrationNotice, emailVerification.registrationNotice);
        await this.clearAndType(settingsAdmin.emailVerification.loginNotice, emailVerification.loginNotice);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, emailVerification.saveSuccessMessage);
    }

    // Admin Set Dokan Social Api Settings
    async setDokanSocialApiSettings(socialApi: dokanSettings['socialApi']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.socialApi);

        // Social Api Settings
        await this.enableSwitcher(settingsAdmin.socialApi.enableSocialLogin);

        // Facebook
        await this.enableSwitcher(settingsAdmin.socialApi.enableSocialApi(socialApi.platform));
        await this.click(settingsAdmin.socialApi.expandButton(socialApi.platform));
        await this.clearAndType(settingsAdmin.socialApi.facebook.appId, socialApi.facebook.appId);
        await this.clearAndType(settingsAdmin.socialApi.facebook.appSecret, socialApi.facebook.appSecret);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, socialApi.saveSuccessMessage);
    }

    // Admin Set Dokan Shipping Status Settings
    async setDokanShippingStatusSettings(shippingStatus: dokanSettings['shippingStatus']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.shippingStatus);

        // Shipping Status Settings
        await this.enableSwitcher(settingsAdmin.shippingStatus.allowShipmentTracking);

        // shipping status
        await this.enableSwitcher(settingsAdmin.shippingStatus.shippingProviders.australiaPost);
        await this.enableSwitcher(settingsAdmin.shippingStatus.shippingProviders.canadaPost);
        await this.enableSwitcher(settingsAdmin.shippingStatus.shippingProviders.cityLink);

        await this.clearAndType(settingsAdmin.shippingStatus.customShippingStatusInput, shippingStatus.customShippingStatus);
        await this.click(settingsAdmin.shippingStatus.customShippingStatusAdd);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, shippingStatus.saveSuccessMessage);
    }

    // Admin Set Dokan Quote Settings
    async setDokanQuoteSettings(quote: dokanSettings['quote']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.quote);

        // quote Settings
        await this.enableSwitcher(settingsAdmin.quote.enableQuoteForOutOfStockProducts);
        await this.enableSwitcher(settingsAdmin.quote.enableAjaxAddToQuote);
        await this.enableSwitcher(settingsAdmin.quote.redirectToQuotePage);

        await this.clearAndType(settingsAdmin.quote.decreaseOfferedPrice, quote.decreaseOfferedPrice);
        // await this.enableSwitcher(settingsAdmin.quote.enableConvertToOrder);
        // await this.enableSwitcher(settingsAdmin.quote.enableQuoteConverterDisplay);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, quote.saveSuccessMessage);
    }

    // Admin Set Dokan live chat Settings
    async setDokanLiveChatSettings(liveChat: dokanSettings['liveChat']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.liveChat);

        // liveChat Settings
        await this.enableSwitcher(settingsAdmin.liveChat.enableLiveChat);
        await this.click(settingsAdmin.liveChat.chatProvider(liveChat.chatProvider));
        await this.clearAndType(settingsAdmin.liveChat.talkJsAppId, liveChat.talkJsAppId);
        await this.clearAndType(settingsAdmin.liveChat.talkJsAppSecret, liveChat.talkJsAppSecret);
        await this.enableSwitcher(settingsAdmin.liveChat.chatButtonOnVendorPage);
        await this.selectByValue(settingsAdmin.liveChat.chatButtonOnProductPage, liveChat.chatButtonPosition);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);

        await this.toHaveBackgroundColor(settingsAdmin.liveChat.enableLiveChat + '//span', 'rgb(0, 144, 255)');
        await this.toHaveClass(settingsAdmin.liveChat.chatProvider(liveChat.chatProvider), 'checked');
        await this.toHaveValue(settingsAdmin.liveChat.talkJsAppId, liveChat.talkJsAppId);
        await this.toHaveValue(settingsAdmin.liveChat.talkJsAppSecret, liveChat.talkJsAppSecret);
        await this.toHaveBackgroundColor(settingsAdmin.liveChat.chatButtonOnVendorPage + '//span', 'rgb(0, 144, 255)');
        await this.toHaveSelectedValue(settingsAdmin.liveChat.chatButtonOnProductPage, liveChat.chatButtonPosition);
    }

    // Admin Set Dokan Rma Settings
    async setDokanRmaSettings(rma: dokanSettings['rma']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.rma);

        // Rma Settings
        await this.selectByValue(settingsAdmin.rma.orderStatus, rma.orderStatus);
        await this.enableSwitcher(settingsAdmin.rma.enableRefundRequests);
        await this.enableSwitcher(settingsAdmin.rma.enableCouponRequests);

        for (const rmaReason of rma.rmaReasons) {
            await this.clickIfVisible(settingsAdmin.rma.reasonsForRmaSingle(rmaReason));
            await this.clearAndType(settingsAdmin.rma.reasonsForRmaInput, rmaReason);
            await this.click(settingsAdmin.rma.reasonsForRmaAdd);
        }

        await this.typeFrameSelector(settingsAdmin.rma.refundPolicyIframe, settingsAdmin.rma.refundPolicyHtmlBody, rma.refundPolicyHtmlBody);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, rma.saveSuccessMessage);
    }

    // Admin Set Dokan Wholesale Settings
    async setDokanWholesaleSettings(wholesale: dokanSettings['wholesale']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.wholesale);

        // Wholesale Settings
        await this.click(settingsAdmin.wholesale.whoCanSeeWholesalePrice(wholesale.whoCanSeeWholesalePrice));
        await this.enableSwitcher(settingsAdmin.wholesale.showWholesalePriceOnShopArchive);
        await this.disableSwitcher(settingsAdmin.wholesale.needApprovalForCustomer);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, wholesale.saveSuccessMessage);
    }

    // Admin Set Dokan Eu Compliance Settings
    async setDokanEuComplianceSettings(euCompliance: dokanSettings['euCompliance']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.euComplianceFields);

        // Eu Compliance Settings
        await this.enableSwitcher(settingsAdmin.euCompliance.vendorExtraFieldsCompanyName);
        await this.enableSwitcher(settingsAdmin.euCompliance.vendorExtraFieldsCompanyIdOrEuidNumber);
        await this.enableSwitcher(settingsAdmin.euCompliance.vendorExtraFieldsVatOrTaxNumber);
        await this.enableSwitcher(settingsAdmin.euCompliance.vendorExtraFieldsNameOfBank);
        await this.enableSwitcher(settingsAdmin.euCompliance.vendorExtraFieldsBankIban);
        await this.enableSwitcher(settingsAdmin.euCompliance.displayInVendorRegistrationForm);
        await this.enableSwitcher(settingsAdmin.euCompliance.customerExtraFieldsCompanyIdOrEuidNumber);
        await this.enableSwitcher(settingsAdmin.euCompliance.customerExtraFieldsVatOrTaxNumber);
        await this.enableSwitcher(settingsAdmin.euCompliance.customerExtraFieldsNameOfBank);
        await this.enableSwitcher(settingsAdmin.euCompliance.customerExtraFieldsBankIban);
        await this.enableSwitcher(settingsAdmin.euCompliance.enableGermanizedSupportForVendors);
        await this.enableSwitcher(settingsAdmin.euCompliance.vendorsWillBeAbleToOverrideInvoiceNumber);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, euCompliance.saveSuccessMessage);
    }

    // Admin Set Dokan Delivery Time Settings
    async setDokanDeliveryTimeSettings(deliveryTime: dokanSettings['deliveryTime']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.deliveryTime);

        // Delivery Time Settings
        await this.enableSwitcher(settingsAdmin.deliveryTime.allowVendorSettings);
        await this.enableSwitcher(settingsAdmin.deliveryTime.homeDelivery);
        await this.enableSwitcher(settingsAdmin.deliveryTime.storePickup);
        await this.clearAndType(settingsAdmin.deliveryTime.deliveryDateLabel, deliveryTime.deliveryDateLabel);
        await this.clearAndType(settingsAdmin.deliveryTime.deliveryBlockedBuffer, deliveryTime.deliveryBlockedBuffer);
        await this.clearAndType(settingsAdmin.deliveryTime.timeSlot, deliveryTime.timeSlot);
        await this.clearAndType(settingsAdmin.deliveryTime.orderPerSlot, deliveryTime.orderPerSlot);
        await this.clearAndType(settingsAdmin.deliveryTime.deliveryBoxInfo, deliveryTime.deliveryBoxInfo);
        await this.disableSwitcher(settingsAdmin.deliveryTime.requireDeliveryDateAndTime);
        for (const day of deliveryTime.days) {
            await this.enableSwitcher(settingsAdmin.deliveryTime.deliveryDay(day));
            if (deliveryTime.choice === 'full-day') {
                await this.click(settingsAdmin.deliveryTime.openingTime(day));
                await this.page.getByRole('listitem').filter({ hasText: 'Full day' }).click();
            } else {
                await this.page.getByRole('listitem').filter({ hasText: deliveryTime.openingTime }).click();
                await this.click(settingsAdmin.deliveryTime.closingTime(day));
                await this.page.getByRole('listitem').filter({ hasText: deliveryTime.closingTime }).click();
            }
        }

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, deliveryTime.saveSuccessMessage);
    }

    // Admin Set Dokan Product Advertising Settings
    async setDokanProductAdvertisingSettings(productAdvertising: dokanSettings['productAdvertising']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.productAdvertising);

        // Product Advertising Settings
        await this.clearAndType(settingsAdmin.productAdvertising.noOfAvailableSlot, productAdvertising.noOfAvailableSlot);
        await this.clearAndType(settingsAdmin.productAdvertising.expireAfterDays, productAdvertising.expireAfterDays);
        await this.enableSwitcher(settingsAdmin.productAdvertising.vendorCanPurchaseAdvertisement);
        await this.clearAndType(settingsAdmin.productAdvertising.advertisementCost, productAdvertising.advertisementCost);
        await this.enableSwitcher(settingsAdmin.productAdvertising.enableAdvertisementInSubscription);
        await this.enableSwitcher(settingsAdmin.productAdvertising.markAdvertisedProductAsFeatured);
        await this.enableSwitcher(settingsAdmin.productAdvertising.displayAdvertisedProductOnTop);
        await this.enableSwitcher(settingsAdmin.productAdvertising.outOfStockVisibility);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, productAdvertising.saveSuccessMessage);
    }

    // Admin Set Dokan Geolocation Settings
    async setDokanGeolocationSettings(geolocation: dokanSettings['geolocation']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.geolocation);

        // Geolocation Settings
        await this.click(settingsAdmin.geolocation.locationMapPosition(geolocation.locationMapPosition));
        await this.click(settingsAdmin.geolocation.showMap(geolocation.showMap));
        await this.enableSwitcher(settingsAdmin.geolocation.showFiltersBeforeLocationMap);
        await this.enableSwitcher(settingsAdmin.geolocation.productLocationTab);
        await this.click(settingsAdmin.geolocation.radiusSearchUnit(geolocation.radiusSearchUnit));
        await this.clearAndType(settingsAdmin.geolocation.radiusSearchMinimumDistance, geolocation.radiusSearchMinimumDistance);
        await this.clearAndType(settingsAdmin.geolocation.radiusSearchMaximumDistance, geolocation.radiusSearchMaximumDistance);
        await this.clearAndType(settingsAdmin.geolocation.mapZoomLevel, geolocation.mapZoomLevel);
        await this.focus(settingsAdmin.geolocation.defaultLocation);
        await this.typeAndWaitForResponse(data.subUrls.gmap, settingsAdmin.geolocation.defaultLocation, geolocation.defaultLocation);
        // await this.press(data.key.arrowDown);
        // await this.press(data.key.enter);
        await this.click(settingsAdmin.geolocation.mapResultFirst);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, geolocation.saveSuccessMessage);
    }

    // Admin Set Dokan Product Report Abuse Settings
    async setDokanProductReportAbuseSettings(productReportAbuse: dokanSettings['productReportAbuse']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.productReportAbuse);

        // Product Report Abuse Settings
        await this.clickIfVisible(settingsAdmin.productReportAbuse.reasonsForAbuseReportSingle(productReportAbuse.reasonsForAbuseReport));
        await this.clearAndType(settingsAdmin.productReportAbuse.reasonsForAbuseReportInput, productReportAbuse.reasonsForAbuseReport);
        await this.click(settingsAdmin.productReportAbuse.reasonsForAbuseReportAdd);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, productReportAbuse.saveSuccessMessage);
    }

    // Admin Set Dokan Spmv Settings
    async setDokanSpmvSettings(spmv: dokanSettings['spmv']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.singleProductMultiVendor);

        await this.enableSwitcher(settingsAdmin.spmv.enableSingleProductMultipleVendor);
        await this.clearAndType(settingsAdmin.spmv.sellItemButtonText, spmv.sellItemButtonText);
        await this.clearAndType(settingsAdmin.spmv.availableVendorDisplayAreaTitle, spmv.availableVendorDisplayAreaTitle);
        await this.selectByValue(settingsAdmin.spmv.availableVendorSectionDisplayPosition, spmv.availableVendorSectionDisplayPosition);
        await this.selectByValue(settingsAdmin.spmv.showSpmvProducts, spmv.showSpmvProducts);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, spmv.saveSuccessMessage);
    }

    // Admin Set Dokan printful Settings
    async setDokanPrintfulSettings(printful: dokanSettings['printful']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.printful);

        // connect to printful
        await this.click(settingsAdmin.printful.expandButton);
        await this.clearAndType(settingsAdmin.printful.clientId, printful.clientId);
        await this.clearAndType(settingsAdmin.printful.secretKey, printful.secretKey);

        // size guide settings
        await this.clearAndType(settingsAdmin.printful.sizeGuidePopupTitle, printful.popupTitle);
        await this.clearAndType(settingsAdmin.printful.sizeGuideButtonText, printful.sizeGuideButtonText);
        await this.selectByValue(settingsAdmin.printful.primaryMeasurementUnit, printful.primaryMeasurementUnit);

        // set color values
        for (let i = 0; i < printful.optionNames.length; i++) {
            await this.click(settingsAdmin.printful.openColorPicker(printful.optionNames[i] as string));
            await this.clearAndType(settingsAdmin.printful.colorInput, printful.optionValues[i] as string);
            await this.click(settingsAdmin.printful.saveColor);
        }

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, printful.saveSuccessMessage);
    }

    // Admin Set Dokan Vendor Subscription Settings
    async setDokanVendorSubscriptionSettings(subscription: dokanSettings['vendorSubscription']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.vendorSubscription);

        // Vendor Subscription Settings
        await this.selectByLabel(settingsAdmin.vendorSubscriptions.subscription, subscription.displayPage);
        await this.enableSwitcher(settingsAdmin.vendorSubscriptions.enableProductSubscription);
        await this.enableSwitcher(settingsAdmin.vendorSubscriptions.enableSubscriptionInRegistrationForm);
        await this.enableSwitcher(settingsAdmin.vendorSubscriptions.enableEmailNotification);
        await this.clearAndType(settingsAdmin.vendorSubscriptions.noOfDays, subscription.noOfDays);
        await this.selectByValue(settingsAdmin.vendorSubscriptions.productStatus, subscription.productStatus);
        await this.clearAndType(settingsAdmin.vendorSubscriptions.cancellingEmailSubject, subscription.cancellingEmailSubject);
        await this.clearAndType(settingsAdmin.vendorSubscriptions.cancellingEmailBody, subscription.cancellingEmailBody);
        await this.clearAndType(settingsAdmin.vendorSubscriptions.alertEmailSubject, subscription.alertEmailSubject);
        await this.clearAndType(settingsAdmin.vendorSubscriptions.alertEmailBody, subscription.alertEmailBody);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, subscription.saveSuccessMessage);
    }

    // disable dokan vendor subscription
    async disableDokanVendorSubscription(subscription: dokanSettings['vendorSubscription']) {
        await this.goToDokanSettings();
        await this.click(settingsAdmin.menus.vendorSubscription);

        // Disabling Vendor Subscription
        await this.disableSwitcher(settingsAdmin.vendorSubscriptions.enableProductSubscription);

        // save settings
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, subscription.saveSuccessMessage);
    }
}
