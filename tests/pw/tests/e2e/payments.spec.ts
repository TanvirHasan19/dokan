import { test, request, Page } from '@playwright/test';
import { PaymentsPage } from '@pages/paymentsPage';
import { ApiUtils } from '@utils/apiUtils';
import { data } from '@utils/testData';
import { payloads } from '@utils/payloads';
import { dbUtils } from '@utils/dbUtils';
import { dbData } from '@utils/dbData';
import { helpers } from '@utils/helpers';

const { DOKAN_PRO, VENDOR_ID } = process.env;

test.describe('Payments test', () => {
    let admin: PaymentsPage;
    let vendor: PaymentsPage;
    let aPage: Page, vPage: Page;
    let apiUtils: ApiUtils;

    test.beforeAll(async ({ browser }) => {
        const adminContext = await browser.newContext(data.auth.adminAuth);
        aPage = await adminContext.newPage();
        admin = new PaymentsPage(aPage);

        const vendorContext = await browser.newContext(data.auth.vendorAuth);
        vPage = await vendorContext.newPage();
        vendor = new PaymentsPage(vPage);

        apiUtils = new ApiUtils(await request.newContext());
        // await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: [] });
        if (DOKAN_PRO) {
            await apiUtils.activateModules(payloads.moduleIds.mangopay, payloads.adminAuth);
            await apiUtils.activateModules(payloads.moduleIds.paypalMarketplace, payloads.adminAuth);
            await apiUtils.activateModules(payloads.moduleIds.razorpay, payloads.adminAuth);
            await apiUtils.activateModules(payloads.moduleIds.stripe, payloads.adminAuth);
            await apiUtils.activateModules(payloads.moduleIds.stripeExpress, payloads.adminAuth);
        }
    });

    test.afterAll(async () => {
        await apiUtils.updateBatchWcSettingsOptions('general', payloads.currency, payloads.adminAuth);
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', dbData.testData.dokan.paymentSettings);
        // await apiUtils.setStoreSettings(payloads.defaultStoreSettings, payloads.vendorAuth);
        if (DOKAN_PRO) {
            await apiUtils.activateModules(payloads.moduleIds.mangopay, payloads.adminAuth);
            await apiUtils.activateModules(payloads.moduleIds.paypalMarketplace, payloads.adminAuth);
            await apiUtils.activateModules(payloads.moduleIds.razorpay, payloads.adminAuth);
            await apiUtils.activateModules(payloads.moduleIds.stripe, payloads.adminAuth);
            await apiUtils.activateModules(payloads.moduleIds.stripeExpress, payloads.adminAuth);
        }
        await aPage.close();
        await vPage.close();
        await apiUtils.dispose();
    });

    //admin

    test('admin can change currency', { tag: ['@lite', '@admin'] }, async () => {
        await apiUtils.updateBatchWcSettingsOptions('general', { update: [{ id: 'woocommerce_currency', value: 'INR' }] }, payloads.adminAuth);
        await admin.setCurrency(data.payment.currency.dollar);
    });

    test('admin can add basic payment methods', { tag: ['@lite', '@admin'] }, async () => {
        await admin.setupBasicPaymentMethods(data.payment);
    });

    test('admin can enable MangoPay module', { tag: ['@pro', '@admin'] }, async () => {
        await admin.enableMangoPayModule();
    });

    test('admin can enable PayPal Marketplace module', { tag: ['@pro', '@admin'] }, async () => {
        await admin.enablePayPalMarketplaceModule();
    });

    test('admin can enable Razorpay module', { tag: ['@pro', '@admin'] }, async () => {
        await admin.enableRazorpayModule();
    });

    test('admin can enable Stripe Connect module', { tag: ['@pro', '@admin'] }, async () => {
        await admin.enableStripeConnectModule();
    });

    test('admin can enable Stripe Express module', { tag: ['@pro', '@admin'] }, async () => {
        await admin.enableStripeExpressModule();
    });

    test('admin can add stripe payment method', { tag: ['@pro', '@admin'] }, async () => {
        await apiUtils.updateBatchWcSettingsOptions('general', payloads.currency, payloads.adminAuth);
        await admin.setupStripeConnect(data.payment);
    });

    test('admin can add Paypal Marketplace payment method', { tag: ['@pro', '@admin'] }, async () => {
        await apiUtils.updateBatchWcSettingsOptions('general', payloads.currency, payloads.adminAuth);
        await admin.setupPaypalMarketPlace(data.payment);
    });

    test.skip('admin can add Mangopay payment method', { tag: ['@pro', '@admin'] }, async () => {
        test.slow();
        await apiUtils.updateBatchWcSettingsOptions('general', payloads.currency, payloads.adminAuth);
        await admin.setupMangoPay(data.payment);
    });

    test('admin can add Razorpay payment method', { tag: ['@pro', '@admin'] }, async () => {
        await apiUtils.updateBatchWcSettingsOptions('general', { update: [{ id: 'woocommerce_currency', value: 'INR' }] }, payloads.adminAuth);
        await admin.setupRazorpay(data.payment);
    });

    test('admin can add Strip Express payment method', { tag: ['@pro', '@admin'] }, async () => {
        await admin.setupStripeExpress(data.payment);
    });

    //vendor

    test('vendor can view payment settings menu page', { tag: ['@lite', '@exploratory', '@vendor'] }, async () => {
        await vendor.vendorPaymentSettingsRenderProperly();
    });

    test('vendor can add paypal payment method', { tag: ['@lite', '@vendor'] }, async () => {
        // await apiUtils.setStoreSettings({ payment: { paypal: { email: '' } } }, payloads.vendorAuth);
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { paypal: { email: '' } } });
        await vendor.addBasicPayment({ ...data.vendor.payment, methodName: 'paypal' });
    });

    test('vendor can update paypal payment method', { tag: ['@lite', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { paypal: { email: 'paypal@g.c' } } });
        await vendor.addBasicPayment({ ...data.vendor.payment, methodName: 'paypal' });
    });

    test('vendor can remove paypal payment method', { tag: ['@lite', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { paypal: { email: 'paypal@g.c' } } });
        await vendor.removeBasicPayment({ ...data.vendor.payment, methodName: 'paypal' });
    });

    test('vendor can add bank payment method', { tag: ['@lite', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', helpers.emptyObjectValues(dbData.testData.dokan.paymentSettings.bank));
        await vendor.addBankTransfer(data.vendor.payment);
    });

    test('vendor can update bank payment method', { tag: ['@lite', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', dbData.testData.dokan.paymentSettings.bank);
        await vendor.addBankTransfer(data.vendor.payment);
    });

    test('vendor can remove bank payment method', { tag: ['@lite', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', dbData.testData.dokan.paymentSettings.bank);
        await vendor.removeBasicPayment({ ...data.vendor.payment, methodName: 'bank' });
    });

    test('vendor can add skrill payment method', { tag: ['@pro', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { skrill: { email: '' } } });
        await vendor.addBasicPayment({ ...data.vendor.payment, methodName: 'skrill' });
    });

    test('vendor can update skrill payment method', { tag: ['@pro', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { skrill: { email: 'skrill@g.c' } } });
        await vendor.addBasicPayment({ ...data.vendor.payment, methodName: 'skrill' });
    });

    test('vendor can remove skrill payment method', { tag: ['@pro', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { skrill: { email: 'skrill@g.c' } } });
        await vendor.removeBasicPayment({ ...data.vendor.payment, methodName: 'skrill' });
    });

    test('vendor can add custom payment method', { tag: ['@pro', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { dokan_custom: { value: '' } } });
        await vendor.addBasicPayment({ ...data.vendor.payment, methodName: 'custom' });
    });

    test('vendor can update custom payment method', { tag: ['@pro', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { dokan_custom: { value: '0123456789' } } });
        await vendor.addBasicPayment({ ...data.vendor.payment, methodName: 'custom' });
    });

    test('vendor can remove custom payment method', { tag: ['@pro', '@vendor'] }, async () => {
        await dbUtils.updateUserMeta(VENDOR_ID, 'dokan_profile_settings', { payment: { dokan_custom: { value: '0123456789' } } });
        await vendor.removeBasicPayment({ ...data.vendor.payment, methodName: 'custom' });
    });

    // admin

    test('admin can disable MangoPay module', { tag: ['@pro', '@admin'] }, async () => {
        await apiUtils.deactivateModules(payloads.moduleIds.mangopay, payloads.adminAuth);
        await admin.disableMangoPayModule();
    });

    test('admin can disable PayPal Marketplace module', { tag: ['@pro', '@admin'] }, async () => {
        await apiUtils.deactivateModules(payloads.moduleIds.paypalMarketplace, payloads.adminAuth);
        await admin.disablePayPalMarketplaceModule();
    });

    test('admin can disable Razorpay module', { tag: ['@pro', '@admin'] }, async () => {
        await apiUtils.deactivateModules(payloads.moduleIds.razorpay, payloads.adminAuth);
        await admin.disableRazorpayModule();
    });

    test('admin can disable Stripe Connect module', { tag: ['@pro', '@admin'] }, async () => {
        await apiUtils.deactivateModules(payloads.moduleIds.stripe, payloads.adminAuth);
        await admin.disableStripeConnectModule();
    });

    test('admin can disable Stripe Express module', { tag: ['@pro', '@admin'] }, async () => {
        await apiUtils.deactivateModules(payloads.moduleIds.stripeExpress, payloads.adminAuth);
        await admin.disableStripeExpressModule();
    });
});
