import fs from 'fs';
export interface admin {
    username: string;
    password: string;
}

export interface plugin {
    plugins: string[];
    pluginSlugs: string[];
    dokanPro: string[];
    activeClass: string;
}

export interface woocommerce {
    saveSuccessMessage: string;
}

export interface adminDashboard {
    summary: {
        sales: { this_month: string };
        earning: { this_month: string };
        vendors: { this_month: string; inactive: string };
        products: { this_month: string };
        withdraw: { pending: string };
    };
}

export interface diagnosticNotice {
    paragraph1: string;
    paragraph2: string;
}

export interface bookings {
    startDate: Date;
    endDate: Date;
}

export interface bookingResource {
    resourceName: () => string;
    name: string;
    quantity: string;
}

// Product
export interface product {
    publishSuccessMessage: string;
    draftUpdateSuccessMessage: string;
    pendingProductUpdateSuccessMessage: string;
    createUpdateSaveSuccessMessage: string;

    status: {
        publish: string;
        draft: string;
        pending: string;
    };

    discount: {
        regularPrice: string;
        discountPrice: string;
        startDate?: string;
        endDate?: string;
    };

    stockStatus: {
        outOfStock: string;
    };

    tax: {
        status: string;
        taxClass: string;
    };

    type: {
        simple: string;
        variable: string;
        simpleSubscription: string;
        variableSubscription: string;
        external: string;
        vendorSubscription: string;
        booking: string;
        auction: string;
    };

    name: {
        simple: () => string;
        variable: () => string;
        external: () => string;
        grouped: () => string;
        simpleSubscription: () => string;
        variableSubscription: () => string;
        dokanSubscription: {
            nonRecurring: () => string;
            length: 5;
            casing: string;
        };
        booking: () => string;
        auction: () => string;
    };

    price: {
        price_int: () => string;
        price_random: () => string;
        price_frac: () => string;
        price_frac_comma: () => string;
        auctionPrice: () => string;
        price: () => string;
    };

    category: {
        unCategorized: string;
        clothings: string;
        randomCategory: () => string;
        categories: string[];
    };

    store: {
        adminStore: string;
        vendorStore1: string;
    };

    attribute: {
        attributeName: string;
        attributeTerms: string[];
    };

    simple: {
        productType: string;
        productName: () => string;
        category: string;
        regularPrice: () => string;
        storeName: string;
        status: string;
        stockStatus: boolean;
        editProduct: string;
        description: string;
        saveSuccessMessage: string;
    };

    downloadable: {
        productType: string;
        productName: () => string;
        category: string;
        regularPrice: () => string;
        storeName: string;
        status: string;
        stockStatus: boolean;
        editProduct: string;
        description: string;
        saveSuccessMessage: string;

        downloadableOptions: {
            fileName: string;
            fileUrl: string;
            downloadLimit: string;
            downloadExpiry: string;
        };
    };

    variable: {
        productType: string;
        productName: () => string;
        category: string;
        regularPrice: () => string;
        storeName: string;
        status: string;
        stockStatus: boolean;
        attribute: string;
        attributeTerms: string[];
        variationPrice: () => string;
        variations: {
            linkAllVariation: string;
            variableRegularPrice: string;
        };
        description: string;
        saveSuccessMessage: string;
    };

    external: {
        productType: string;
        productName: () => string;
        productUrl: string;
        buttonText: string;
        category: string;
        regularPrice: () => string;
        storeName: string;
        status: string;
        description: string;
        saveSuccessMessage: string;
    };

    grouped: {
        productType: string;
        productName: () => string;
        category: string;
        groupedProducts: string[];
        storeName: string;
        status: string;
        description: string;
        saveSuccessMessage: string;
    };

    simpleSubscription: {
        productType: string;
        productName: () => string;
        category: string;
        regularPrice: () => string;
        subscriptionPrice: () => string;
        subscriptionPeriodInterval: string;
        subscriptionPeriod: string;
        expireAfter: string;
        subscriptionTrialLength: string;
        subscriptionTrialPeriod: string;
        storeName: string;
        status: string;
        description: string;
        saveSuccessMessage: string;
    };

    variableSubscription: {
        productType: string;
        productName: () => string;
        category: string;
        regularPrice: () => string;
        subscriptionPrice: () => string;
        subscriptionPeriodInterval: string;
        subscriptionPeriod: string;
        expireAfter: string;
        subscriptionTrialLength: string;
        subscriptionTrialPeriod: string;
        storeName: string;
        status: string;
        attribute: string;
        attributeTerms: string[];
        variationPrice: () => string;
        variations: {
            linkAllVariation: string;
            variableRegularPrice: string;
        };
        description: string;
        saveSuccessMessage: string;
    };

    vendorSubscription: {
        productType: string;
        productName: () => string;
        category: string;
        regularPrice: () => string;
        numberOfProducts: string;
        packValidity: string;
        advertisementSlot: string;
        expireAfterDays: string;
        storeName: string;
        description: string;
        status: string;
    };

    booking: {
        productName: () => string;
        name: string;
        productType: string;
        category: string;
        accommodationBookingOptions: {
            minimumNumberOfNightsAllowed: string;
            maximumNumberOfNightsAllowed: string;
            checkInTime: string;
            checkOutTime: string;
        };
        duration: {
            bookingDurationType: string;
            bookingDuration: string;
            bookingDurationUnit: string;
            bookingDurationMin: string;
            bookingDurationMax: string;
        };

        calendarDisplayMode: string;

        availability: {
            maxBookingsPerBlock: string;
            minimumBookingWindowIntoTheFutureDate: string;
            minimumBookingWindowIntoTheFutureDateUnit: string;
            maximumBookingWindowIntoTheFutureDate: string;
            maximumBookingWindowIntoTheFutureDateUnit: string;
            requireABufferPeriodOfMonthsBetweenBookings: string;
            allDatesAvailability: string;
            checkRulesAgainst: string;
        };
        costs: {
            baseCost: string;
            blockCost: string;
            displayCost: string;
        };

        extraOptions: {
            minPersons: string;
            maxPersons: string;
            person: {
                typeName: string;
                baseCost: string;
                blockCost: string;
                description: string;
                min: string;
                max: string;
            };

            label: string;
            resourcesAllocation: string;
            addResourceId: string;
            resource: {
                baseCost: string;
                blockCost: string;
            };
        };

        storeName: string;
        saveSuccessMessage: string;
    };

    bookingResource: {
        name: string;
        quantity: string;
    };

    // Auction
    auction: {
        productName: () => string;
        name: string;
        productType: string;
        category: string;
        itemCondition: string;
        auctionType: string;
        regularPrice: () => string;
        bidIncrement: () => string;
        reservedPrice: () => string;
        buyItNowPrice: () => string;
        startDate: string;
        endDate: string;
        storeName: string;
        relistIfFailAfterNHours: string;
        relistIfNotPaidAfterNHours: string;
        relistAuctionDurationInH: string;
        saveSuccessMessage: string;
    };

    // Review
    review: {
        rating: string;
        reviewMessage: () => string;
    };

    // Report
    report: {
        reportReason: string;
        reportReasonDescription: string;
        reportSubmitSuccessMessage: string;

        username: string;
        password: string;

        guestName: () => string;
        guestEmail: () => string;
    };

    // Enquiry
    enquiry: {
        enquiryDetails: string;
        enquirySubmitSuccessMessage: string;

        guestName: () => string;
        guestEmail: () => string;
    };

    productInfo: {
        downloadableOptions: {
            fileName: string;
            fileUrl: string;
            downloadLimit: string;
            downloadExpiry: string;
        };

        inventory: {
            sku: string;
            stockStatus: string;
            stockManagement: boolean;
            stockQuantity: string;
            lowStockThreshold: string;
            backorders: string;
            oneQuantity: boolean;
        };

        shipping: {
            weight: string;
            length: string;
            width: string;
            height: string;
            shippingClass: string;
        };

        tax: {
            status: string;
            class: string;
        };

        linkedProducts: {
            upSells: string[];
            crossSells: string[];
        };

        attribute: {
            attributeName: string;
            attributeTerm: string;
        };

        euCompliance: {
            saleLabel: string;
            saleRegularLabel: string;
            unit: string;
            minimumAge: string;
            productUnits: string;
            basePriceUnits: string;
            deliveryTime: string;
            freeShipping: boolean;
            regularUnitPrice: string;
            saleUnitPrice: string;
            optionalMiniDescription: string;
        };

        addon: {
            type: string;
            displayAs: string;
            title: string;
            formatTitle: string;
            addDescription: string;
            enterAnOption: string;
            optionPriceType: string;
            optionPriceInput: string;
        };

        amountDiscount: {
            minimumOrderAmount: string;
            discountPercentage: string;
        };

        quantityDiscount: {
            minimumQuantity: string;
            discountPercentage: string;
        };

        wholesaleOption: {
            wholesalePrice: string;
            minimumQuantity: string;
        };

        minMax: {
            minimumProductQuantity: string;
            maximumProductQuantity: string;
        };

        otherOptions: {
            status: string;
            visibility: string;
            purchaseNote: string;
            enableReview: boolean;
        };

        commission: commission;
    };
}

// order
export interface order {
    orderStatus: {
        pending: string;
        processing: string;
        onhold: string;
        completed: string;
        cancelled: string;
        refunded: string;
        failed: string;
    };

    // Refund
    requestWarranty: {
        itemQuantity: string;
        refundRequestType: string;
        refundRequestReasons: string;
        refundRequestDetails: string;
        refundSubmitSuccessMessage: string;
    };
}

export interface orderNote {
    note: string;
    noteType: string;
}

export interface orderTrackingDetails {
    shippingProvider: string;
    trackingNumber: string;
    dateShipped: string;
}

export interface orderShipmentDetails {
    shipmentOrderItem: string;
    shipmentOrderItemQty: string;
    shippingStatus: string;
    shippingProvider: string;
    dateShipped: string;
    trackingNumber: string;
    comments: string;
}

// payment details
export interface paymentDetails {
    strip: {
        striptNon3D: string;
        stript3D: string;
        cardNumber: string;
        expiryMonth: string;
        expiryYear: string;
        number: string;
        expiryDate: string;
        cvc: string;
    };

    mangopay: {
        creditCard: string;
        expiryMonth: string;
        expiryYear: string;
        cvc: string;
    };

    stripExpress: {
        paymentMethod: string;
        cardInfo: {
            cardNumber: string;
            expiryMonth: string;
            expiryYear: string;
            expiryDate: string;
            cvc: string;
        };
    };
}

// coupon
export interface coupon {
    couponTitle: () => string;
    title: string;
    amount: () => string;
    discountType: string;
    description: string;
    existingCouponErrorMessage: string;
    editCoupon: string;
}

// address
export interface address {
    street1: string;
    street2: string;
    country: string;
    countrySelectValue: string;
    stateSelectValue: string;
    city: string;
    zipCode: string;
    state: string;
}

export interface wpSettings {
    saveSuccessMessage: string;
    general: {
        timezone: string;
        saveSuccessMessage: string;
    };

    permalink: {
        customBaseInput: string;
        saveSuccessMessage: string;
    };
}

export interface tax {
    taxRate: string;
    priority: string;
    enableTax: boolean;
    saveSuccessMessage: string;
}

export interface shippingZone {
    zoneName: string;
    zoneRegion: string;
    saveSuccessMessage: string;
}
export interface shipping {
    selectMethodName: string;
    methodName: string;
    taxStatus?: string;
    shippingCost?: string;
    freeShippingRequires?: string;
    freeShippingMinimumOrderAmount?: string;
}

export interface deliveryTime {
    date: string;
}

export interface payment {
    saveSuccessMessage: string;

    currency: {
        dollar: string;
        euro: string;
        rupee: string;

        currencyOptions: {
            thousandSeparator: string;
            decimalSeparator: string;
            numberOfDecimals: string;
        };

        saveSuccessMessage: string;
    };

    basicPayment: {
        toggleEnabledClass: string;
        toggleDisabledClass: string;
    };

    stripeConnect: {
        title: string;
        description: string;
        displayNoticeInterval: string;
        testPublishableKey: string;
        testSecretKey: string;
        testClientId: string;
    };

    paypalMarketPlace: {
        title: string;
        description: string;
        payPalMerchantId: string;
        sandboxClientId: string;
        sandBoxClientSecret: string;
        payPalPartnerAttributionId: string;
        disbursementMode: string;
        paymentButtonType: string;
        marketplaceLogoPath: string;
        announcementInterval: string;
    };

    mangoPay: {
        title: string;
        description: string;
        sandboxClientId: string;
        sandBoxApiKey: string;
        availableCreditCards: string;
        availableDirectPaymentServices: string;
        transferFunds: string;
        typeOfVendors: string;
        businessRequirement: string;
        announcementInterval: string;
    };

    razorPay: {
        title: string;
        description: string;
        testKeyId: string;
        testKeySecret: string;
        disbursementMode: string;
        announcementInterval: string;
    };

    stripeExpress: {
        title: string;
        description: string;
        testPublishableKey: string;
        testSecretKey: string;
        testWebhookSecret: string;
        paymentMethods: {
            card: string;
            ideal: string;
        };
        iDealBanks: string[];
        disbursementMode: string;
        customerBankStatement: string;
        paymentRequestButtonType: string;
        paymentRequestButtonTheme: string;
        paymentRequestButtonLocation: {
            product: string;
            cart: string;
        };
        announcementInterval: string;
    };
}

// Dokan Setup Wizard
export interface dokanSetupWizard {
    vendorStoreURL: string;
    shippingFeeRecipient: string;
    taxFeeRecipient: string;
    mapApiSource: string;
    googleMapApiKey: string;
    sellingProductTypes: string;
    commission: commission;
    minimumWithdrawLimit: string;
}

// Vendor Setup Wizard
export interface vendorSetupWizard {
    choice: boolean;
    setupWizardEnabled: boolean;
    storeProductsPerPage: string;
    street1: string;
    street2: string;
    country: string;
    city: string;
    zipCode: string;
    state: string;
    storeCategory: string;
    mapLocation: string;
    paypal: () => string;
    bankAccountName: string;
    bankAccountType: string;
    bankAccountNumber: string;
    bankName: string;
    bankAddress: string;
    bankRoutingNumber: string;
    bankIban: string;
    bankSwiftCode: string;
    customPayment: string;
    skrill: string;
    file: string;
}

// user
export interface user {
    username: () => string;
    password: string;

    userDetails: {
        emailDomain: string;
        name: () => string;
        firstName: () => string;
        lastName: () => string;
        email: () => string;
        role: string;
    };
}

// vendor
export interface vendor {
    username: string;
    password: string;
    lastname: string;
    storeName: string;

    vendor2: {
        username: string;
        password: string;
    };

    vendorInfo: {
        email: () => string;
        emailDomain: string;
        password: string;
        password1: string;
        firstName: () => string;
        lastName: () => string;
        userName: string;
        shopName: () => string;
        shopUrl: () => string;
        companyName: string;
        companyId: string;
        vatNumber: string;
        bankIban: string;
        phoneNumber: string;
        phone: string;
        street1: string;
        street2: string;
        country: string;
        countrySelectValue: string;
        stateSelectValue: string;
        city: string;
        zipCode: string;
        state: string;
        accountName: string;
        accountNumber: string;
        accountType: string;
        bankName: string;
        bankAddress: string;
        routingNumber: string;
        swiftCode: string;
        iban: string;
        role: string;
        nanoid: string;

        // shop details
        banner: string;
        profilePicture: string;
        storeName: string;
        productsPerPage: string;
        mapLocation: string;
        termsAndConditions: string;
        biography: string;
        supportButtonText: string;

        addressFieldsEnabled: boolean;

        commission: commission;

        vendorSubscriptionPack: string;

        openingClosingTime: {
            days: string[];
            statusLite: string;
            openingTime: string;
            closingTime: string;
            storeOpenNotice: string;
            storeCloseNotice: string;
        };

        vacation: {
            closingStyle: string;

            instantly: {
                closingStyle: string;
                vacationMessage: string;
            };

            datewise: {
                vacationDayFrom: () => string;
                vacationDayTo: (arg0: string) => string;
                closingStyle: string;
                vacationMessage: string;
            };
        };

        storeSettingsSaveSuccessMessage: string;

        socialProfileUrls: {
            facebook: string;
            twitter: string;
            pinterest: string;
            linkedin: string;
            youtube: string;
            instagram: string;
            flickr: string;
        };

        payment: {
            email: () => string;
            bankAccountName: string;
            bankAccountType: string;
            bankAccountNumber: string;
            bankName: string;
            bankAddress: string;
            bankRoutingNumber: string;
            bankIban: string;
            bankSwiftCode: string;
        };

        sendEmail: {
            subject: string;
            message: string;
        };

        amountDiscount: {
            minimumOrderAmount: string;
            discountPercentage: string;
        };

        liveChat: {
            pageId: string;
        };

        minMax: {
            minimumProductQuantity: string;
            maximumProductQuantity: string;
            minimumAmount: string;
            maximumAmount: string;
            category: string;
        };
    };

    shipping: {
        shippingPolicy: {
            processingTime: string;
            shippingPolicy: string;
            refundPolicy: string;
            saveSuccessMessage: string;
        };

        shippingZone: string;
        shippingCountry: string;
        methods: string;

        // shippingMethod: {
        //     shippingZone: string;
        //     shippingCountry: string;
        //     selectShippingMethod: string;
        //     shippingMethod: string;
        //     taxStatus: string;
        //     shippingCost: string;
        //     description: string;
        //     calculationType: string;
        //     shippingMethodSaveSuccessMessage: string;
        //     zoneSaveSuccessMessage: string;
        //     saveSuccessMessage: string;

        //     freeShippingRequires: string;
        //     freeShippingMinimumOrderAmount: string;

        //     taxIncludedInShippingCosts: string;
        //     handlingFee: string;
        //     maximumShippingCost: string;

        //     handlingFeePerOrder: string;
        //     minimumCostPerOrder: string;
        //     maximumCostPerOrder: string;

        //     tableRateSaveSuccessMessage: string;

        //     transportationMode: string;
        //     avoid: string;
        //     distanceUnit: string;
        //     street1: string;
        //     street2: string;
        //     city: string;
        //     zipCode: string;
        //     state: string;
        //     country: string;

        //     distanceRateSaveSuccessMessage: string;
        // };

        shippingMethods: {
            flatRate: {
                shippingZone: string;
                shippingCountry: string;
                selectShippingMethod: string;
                shippingMethod: string;
                taxStatus: string;
                shippingCost: string;
                description: string;
                calculationType: string;
                shippingMethodSaveSuccessMessage: string;
                zoneSaveSuccessMessage: string;
                saveSuccessMessage: string;
            };

            freeShipping: {
                shippingZone: string;
                shippingCountry: string;
                selectShippingMethod: string;
                shippingMethod: string;
                freeShippingRequires: string;
                freeShippingMinimumOrderAmount: string;
                shippingMethodSaveSuccessMessage: string;
                zoneSaveSuccessMessage: string;
                saveSuccessMessage: string;
            };

            localPickup: {
                shippingZone: string;
                shippingCountry: string;
                selectShippingMethod: string;
                shippingMethod: string;
                taxStatus: string;
                shippingCost: string;
                description: string;
                shippingMethodSaveSuccessMessage: string;
                zoneSaveSuccessMessage: string;
                saveSuccessMessage: string;
            };

            tableRateShipping: {
                shippingZone: string;
                shippingCountry: string;
                selectShippingMethod: string;
                shippingMethod: string;
                taxStatus: string;
                taxIncludedInShippingCosts: string;
                handlingFee: string;
                maximumShippingCost: string;
                calculationType: string;
                handlingFeePerOrder: string;
                minimumCostPerOrder: string;
                maximumCostPerOrder: string;
                shippingMethodSaveSuccessMessage: string;
                zoneSaveSuccessMessage: string;
                saveSuccessMessage: string;
                tableRateSaveSuccessMessage: string;
            };

            distanceRateShipping: {
                shippingZone: string;
                shippingCountry: string;
                selectShippingMethod: string;
                shippingMethod: string;
                taxStatus: string;
                transportationMode: string;
                avoid: string;
                distanceUnit: string;
                street1: string;
                street2: string;
                city: string;
                zipCode: string;
                state: string;
                country: string;
                shippingMethodSaveSuccessMessage: string;
                zoneSaveSuccessMessage: string;
                saveSuccessMessage: string;
                distanceRateSaveSuccessMessage: string;
            };

            vendorShipping: {
                shippingZone: string;
                shippingCountry: string;
                selectShippingMethod: string;
                shippingMethod: string;
                taxStatus: string;
            };
        };

        shippingTaxStatus: string;
        saveSuccessMessage: string;
    };

    payment: {
        methodName: string;
        email: () => string;
        bankAccountName: string;
        bankAccountType: string;
        bankAccountNumber: string;
        bankName: string;
        bankAddress: string;
        bankRoutingNumber: string;
        bankIban: string;
        bankSwiftCode: string;
        saveSuccessMessage: string;
    };

    verification: {
        method: string;
        file: string;
    };

    deliveryTime: {
        deliveryBlockedBuffer: string;
        timeSlot: string;
        orderPerSlot: string;
        days: string[];
        choice: string;
        openingTime: string;
        closingTime: string;
        fullDay: string;
        saveSuccessMessage: string;
    };

    shipStation: {
        status: string;
    };

    socialProfileUrls: {
        facebook: string;
        twitter: string;
        pinterest: string;
        linkedin: string;
        youtube: string;
        instagram: string;
        flickr: string;
        saveSuccessMessage: string;
    };

    // Rma Settings
    rma: {
        label: string;
        type: string;
        length: string;
        lengthValue: string;
        lengthDuration: string;
        addon: {
            cost: string;
            durationLength: string;
            durationType: string;
        };
        refundPolicy: string;
        saveSuccessMessage: string;
    };

    seo: {
        seoTitle: string;
        metaDescription: string;
        metaKeywords: string;
        facebookTitle: string;
        facebookDescription: string;
        facebookImage: string;
        twitterTitle: string;
        twitterDescription: string;
        twitterImage: string;
    };

    withdraw: {
        withdrawMethod: {
            default: string;
            paypal: string;
            skrill: string;
            custom: string;
        };

        defaultWithdrawMethod: {
            paypal: string;
            skrill: string;
            bankTransfer: string;
        };
        preferredPaymentMethod: string;
        preferredSchedule: string;
        currentBalance: string;
        minimumWithdrawAmount: string;
        reservedBalance: string;
        scheduleMessageInitial: string;
    };

    // addon
    addon: () => addon;
    registrationErrorMessage: string;
}

// addon
export interface addon {
    name: string;
    priority: string;
    category: string;
    type: string;
    displayAs: string;
    title: string;
    formatTitle: string;
    addDescription: string;
    enterAnOption: string;
    optionPriceType: string;
    optionPriceInput: string;
    saveSuccessMessage: string;
    deleteSuccessMessage: string;
}

// staff
export interface staff {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

// customer
export interface customer {
    username: string;
    password: string;
    lastname: string;

    customerInfo: {
        emailDomain: string;
        email: () => string;
        password: string;
        password1: string;
        firstName: () => string;
        lastName: () => string;
        role: string;
        username: () => string;
        shopName: () => string;
        companyName: string;
        companyId: string;
        vatNumber: string;
        bankIban: string;
        phone: string;
        street1: string;
        street2: string;
        country: string;
        countrySelectValue: string;
        stateSelectValue: string;
        city: string;
        zipCode: string;
        state: string;
        accountName: string;
        accountNumber: string;
        bankName: string;
        bankAddress: string;
        routingNumber: string;
        swiftCode: string;
        iban: string;
        biography: string;
        billing: {
            firstName: string;
            lastName: string;
            companyName: string;
            companyId: string;
            vatNumber: string;
            bankName: string;
            bankIban: string;
            street1: string;
            street2: string;
            city: string;
            zipCode: string;
            country: string;
            state: string;
            email: string;
            phone: string;
        };

        shipping: {
            email: string;
            firstName: string;
            lastName: string;
            companyName: string;
            street1: string;
            street2: string;
            city: string;
            zipCode: string;
            country: string;
            state: string;
            phone: string;
        };

        vendorSubscriptionPack: string;
    };

    getSupport: {
        subject: string;
        message: string;
        orderId: string;
        supportSubmitSuccessMessage: string;
        username: string;
        userPassword: string;
    };

    supportTicket: {
        message: () => string;
    };

    rma: {
        sendMessage: string;
    };

    account: {
        updateSuccessMessage: string;
    };

    follow: {
        following: string;
    };

    address: {
        addressChangeSuccessMessage: string;
    };

    registration: {
        registrationErrorMessage: string;
    };
}

// date
export interface date {
    previousDate: string;
    currentDate: string;
    nextDay: string;

    dateRange: {
        startDate: string;
        endDate: string;
    };

    dateRangeFull: {
        startDate: string;
        endDate: string;
    };
}

// store category
export interface storeCategory {
    name: string;
    description: string;
}

// store review
export interface storeReview {
    review: {
        rating: string;
        ratingByWidth: string;
        title: string;
        content: string;
    };
    filter: {
        byVendor: string;
    };
}

export interface reverseWithdraw {
    store: string;
    transactionType: string;
    product: string;
    withdrawalBalanceType: string;
    amount: string;
    note: string;
}

// // store support
// export interface storeSupport {

// 	title: string;
// 	filter: {
// 		byCustomer: string;
// 		byVendor: string;
// 	}
// 	chatReply: {
// 		asAdmin: string;
// 		asVendor: string;
// 	}

// }

// request for quotation
export interface requestForQuotation {
    userRole: {
        administrator: string;
        editor: string;
        author: string;
        contributor: string;
        subscriber: string;
        customer: string;
        shopManager: string;
        vendor: string;
        vendorStaff: string;
        wholesaleCustomer: string;
        guest: string;
    };

    quoteRule: {
        title: string;
        userRole: string;
        applyOnAllProducts: boolean;
        specificProducts?: boolean;
        includeProducts?: string;
        excludeProducts?: string;
        specificCategories?: boolean;
        categories: string[];
        specificVendors?: boolean;
        includeVendors?: string;
        excludeVendors?: string;
        expireLimit?: string;
        hidePrice: boolean;
        hidePriceText: string;
        hideAddToCartButton?: boolean;
        keepBothCartQuoteButton?: boolean;
        customButtonLabel: string;
        order: string;
    };

    updateQuoteRule: {
        title: string;
        userRole: string;
        product: string;
        category: string;
        hidePrice: string;
        hidePriceText: string;
        hideAddToCartButton: string;
        customButtonLabel: string;
        order: string;
    };

    trashedQuoteRule: {
        title: string;
        status: string;
    };

    quote: {
        id: string;
        title: string;
        user: string;
        fullName: string;
        email: string;
        companyName: string;
        phoneNumber: string;
        vendor: string;
        product: string;
        quantity: string;
        offerPrice: string;
        offerProductQuantity: string;
        shippingCost: string;
    };

    updateQuote: {
        title: string;
        user: string;
        fullName: string;
        email: string;
        companyName: string;
        phoneNumber: string;
        product: string;
        offerPrice: string;
        offerProductQuantity: string;
    };

    trashedQuote: {
        title: string;
        status: string;
    };

    convertedQuote: {
        title: string;
    };

    vendorQuote: {
        productName: string;
        offeredPrice: string;
        shippingCost: string;
        reply: string;
    };

    userQuote: {
        productName: string;
        offeredPrice: string;
        shippingCost: string;
        quantity: string;
        expectedDelivery: string;
        additionalMessage: string;
    };

    guest: {
        fullName: string;
        email: string;
        phoneNumber: string;

        address: {
            country: string;
            countrySelectValue: string;
            stateSelectValue: string;
            city: string;
            postCode: string;
            addressLine1: string;
            addressLine2: string;
        };
    };
}

// seller badge
export interface sellerBadge {
    eventName: {
        // product related badges
        productsPublished: string;
        numberOfItemsSold: string;
        featuredProducts: string;
        trendingProduct: string;

        // seller related badges
        featuredSeller: string;
        exclusiveToPlatform: string;
        verifiedSeller: string;
        yearsActive: string;

        // Order Related Badges
        numberOfOrders: string;
        // Sale Amount Related Badges
        saleAmount: string;

        // Customer Related Badges
        customerReview: string;
        storeSupportCount: string;
    };

    badgeName: string;
    verificationMethod: string;
    trendingProductPeriod: string;
    trendingProductTopBestSellingProduct: string;

    startingLevelValue: string;
    maxLevel: number;

    verifiedSellerMethod: {
        idVerification: string;
        companyVerification: string;
        addressVerification: string;
        phoneVerification: string;
        socialProfiles: string;
    };

    badgeStatus: string; // published, draft
}

// announcement
export interface announcement {
    randomTitle: () => string;
    title: string;
    content: string;
    receiver: string;
    publishType: string;
    scheduleDate: Date;
}

export interface modules {
    noModuleMessage: string;
    modules: string[];

    moduleStats: {
        totalModules: number;
        modulesVideoLink: number;
        productManagement: number;
        integration: number;
        uiUx: number;
        shipping: number;
        storeManagement: number;
        payment: number;
        orderManagement: number;
        vendorManagement: number;
    };

    modulesName: {
        auctionIntegration: string;
        colorSchemeCustomizer: string;
        deliveryTime: string;
        elementor: string;
        eUComplianceFields: string;
        followStore: string;
    };

    moduleCategory: {
        productManagement: string;
        integration: string;
        uiUx: string;
        shipping: string;
        storeManagement: string;
        payment: string;
        orderManagement: string;
        vendorManagement: string;
    };

    layout: {
        grid: string;
        list: string;
    };
}

// tools
export interface tools {
    distanceMatrixApi: {
        address1: string;
        address2: string;
        address3: string;
        address4: string;
    };
}

// product advertisement
export interface productAdvertisement {
    advertisedProductStore: string;
    advertisedProduct: string;

    filter: {
        byStore: string;
        createVia: {
            admin: string;
            order: string;
            subscription: string;
            freePurchase: string;
        };
    };
}

// product form manager

export interface block {
    currentLabel: string;
    label: string;
    description: string;
    productType: string;
    productCategory: string;
}
export interface field {
    block: any;
    currentLabel: any;
    label: any;
    type: any;
    placeholder: any;
    helpContent: any;
}

// wholesale customers
export interface wholesale {
    wholesaleRequestSendMessage: string;
    becomeWholesaleCustomerSuccessMessage: string;
    wholesaleCapabilityActivate: string;
}

// dokan settings
export interface dokanSettings {
    // General Settings
    general: {
        settingTitle: string;
        vendorStoreUrl: string;
        setupWizardMessage: string;
        sellingProductTypes: string;
        storeProductPerPage: string;
        storCategory: string;
        saveSuccessMessage: string;
    };

    // Selling Options Settings
    selling: {
        settingTitle: string;
        commission: commission;
        shippingFeeRecipient: string;
        productTaxFeeRecipient: string;
        shippingTaxFeeRecipient: string;
        newProductStatus: string;
        productCategorySelection: string;
        saveSuccessMessage: string;
    };

    // Withdraw
    withdraw: {
        settingTitle: string;
        customMethodName: string;
        customMethodType: string;
        charge: {
            paypal: string;
            bank: string;
            skrill: string;
            custom: string;
        };
        minimumWithdrawAmount: string;
        withdrawThreshold: string;
        quarterlyScheduleMonth: string;
        quarterlyScheduleWeek: string;
        quarterlyScheduleDay: string;
        monthlyScheduleWeek: string;
        monthlyScheduleDay: string;
        biweeklyScheduleWeek: string;
        biweeklyScheduleDay: string;
        weeklyScheduleDay: string;
        saveSuccessMessage: string;
    };

    // Reverse withdraw
    reverseWithdraw: {
        settingTitle: string;
        billingType: string;
        reverseBalanceThreshold: string;
        gracePeriod: string;
        saveSuccessMessage: string;
    };

    // Pages
    page: {
        settingTitle: string;
        dashboard: string;
        myOrders: string;
        storeListing: string;
        termsAndConditions: string;
        saveSuccessMessage: string;
    };

    // Appearance
    appearance: {
        settingTitle: string;
        mapApiSource: string;
        googleMapApiKey: string;
        mapBoxApiKey: string;
        storeBannerWidth: string;
        storeBannerHeight: string;
        saveSuccessMessage: string;
    };

    // MenuManager
    menuManager: {
        settingTitle: string;
        saveSuccessMessage: string;
    };

    // privacy policy
    privacyPolicy: {
        settingTitle: string;
        privacyPage: string;
        privacyPolicyContent: string;
        saveSuccessMessage: string;
    };

    // colors
    colors: {
        settingTitle: string;
        paletteChoice: string;
        colorPalette: string;
        saveSuccessMessage: string;
    };

    // social api
    socialApi: {
        settingTitle: string;
        platform: string;

        facebook: {
            appId: string;
            appSecret: string;
        };

        saveSuccessMessage: string;
    };

    // shipping status
    shippingStatus: {
        settingTitle: string;
        customShippingStatus: string;
        saveSuccessMessage: string;
    };

    // quote
    quote: {
        settingTitle: string;
        decreaseOfferedPrice: string;
        saveSuccessMessage: string;
    };

    // live search
    liveSearch: {
        settingTitle: string;
        liveSearchOption: string;
        saveSuccessMessage: string;
    };

    // Store support
    storeSupport: {
        settingTitle: string;
        displayOnSingleProductPage: string;
        supportButtonLabel: string;
        saveSuccessMessage: string;
    };

    // Vendor Verification
    vendorVerification: {
        settingTitle: string;
        verifiedIcons: {
            circleSolid: string;
            circleRegular: string;
            solid: string;
            doubleSolid: string;
            squireRegular: string;
            userCheckSolid: string;
            certificateSolid: string;

            byIcon: {
                circleSolid: string;
                circleRegular: string;
                solid: string;
                doubleSolid: string;
                squireRegular: string;
                userCheckSolid: string;
                certificateSolid: string;
            };
        };

        verificationMethods: {
            nationalId: string;
            drivingLicense: string;
            address: string;
            company: string;
        };

        verificationMethodDetails: {
            title: string;
            help_text: string;
            required: boolean;
        };

        saveSuccessMessage: string;
    };

    // Verification Sms Gateways
    verificationSmsGateway: {
        settingTitle: string;
        senderName: string;
        smsText: string;
        smsSentSuccess: string;
        smsSentError: string;
        activeGateway: string;
        saveSuccessMessage: string;

        vonage: {
            apiKey: string;
            apiSecret: string;
        };
    };

    // Email verification
    emailVerification: {
        settingTitle: string;
        registrationNotice: string;
        loginNotice: string;
        saveSuccessMessage: string;
    };

    // Rma Settings
    liveChat: {
        settingTitle: string;
        chatProvider: string;
        talkJsAppId: string;
        talkJsAppSecret: string;
        chatButtonPosition: string;
        saveSuccessMessage: string;
    };

    // Rma Settings
    rma: {
        settingTitle: string;
        orderStatus: string;
        rmaReasons: string[];
        refundPolicyHtmlBody: string;
        saveSuccessMessage: string;
    };

    // Wholesale
    wholesale: {
        settingTitle: string;
        whoCanSeeWholesalePrice: string;
        saveSuccessMessage: string;
    };

    // EuCompliance
    euCompliance: {
        settingTitle: string;
        saveSuccessMessage: string;
    };

    // delivery time
    deliveryTime: {
        settingTitle: string;
        deliveryDateLabel: string;
        deliveryBlockedBuffer: string;
        deliveryBoxInfo: string;
        days: string[];
        choice: string;
        openingTime: string;
        closingTime: string;
        timeSlot: string;
        orderPerSlot: string;
        saveSuccessMessage: string;
    };

    // Product advertising
    productAdvertising: {
        settingTitle: string;
        noOfAvailableSlot: string;
        expireAfterDays: string;
        advertisementCost: string;
        saveSuccessMessage: string;
    };

    // Geolocation Settings
    geolocation: {
        settingTitle: string;
        locationMapPosition: string;
        showMap: string;
        radiusSearchUnit: string;
        radiusSearchMinimumDistance: string;
        radiusSearchMaximumDistance: string;
        mapZoomLevel: string;
        defaultLocation: string;
        saveSuccessMessage: string;
    };

    // Product report abuse
    productReportAbuse: {
        settingTitle: string;
        reasonsForAbuseReport: string;
        saveSuccessMessage: string;
    };

    // Spmv Settings
    spmv: {
        settingTitle: string;
        sellItemButtonText: string;
        availableVendorDisplayAreaTitle: string;
        availableVendorSectionDisplayPosition: string;
        showSpmvProducts: string;
        saveSuccessMessage: string;
    };

    // printful Settings
    printful: {
        settingTitle: string;
        clientId: string;
        secretKey: string;
        popupTitle: string;
        popupTextColor: string;
        popupBackgroundColor: string;
        tabBackgroundColor: string;
        activeTabBackgroundColor: string;
        sizeGuideButtonText: string;
        buttonTextColor: string;
        primaryMeasurementUnit: string;
        optionNames: string[];
        optionValues: string[];
        saveSuccessMessage: string;
    };

    // Vendor Subscription Settings
    vendorSubscription: {
        settingTitle: string;
        displayPage: string;
        noOfDays: string;
        productStatus: string;
        cancellingEmailSubject: string;
        cancellingEmailBody: string;
        alertEmailSubject: string;
        alertEmailBody: string;
        saveSuccessMessage: string;
    };
}

// dokan license
export interface dokanLicense {
    correctKey: string;
    incorrectKey: string;
}

// predefined  test data
export interface predefined {
    simpleProduct: {
        product1: {
            name: string;
            productName: () => string;
        };
        product2: string;
        productFrac1: string;
        productFrac2: string;
    };

    variableProduct: {
        product1: string;
    };

    simpleSubscription: {
        product1: string;
    };

    variableSubscription: {
        product1: string;
    };

    externalProduct: {
        product1: string;
    };

    auctionProduct: {
        product1: string;
    };

    bookingProduct: {
        product1: string;
    };

    saleProduct: {
        product1: string;
    };

    vendorSubscription: {
        nonRecurring: string;
    };

    coupon: {
        couponCode: string;
    };

    vendorInfo: {
        firstName: () => string;
        lastName: () => string;
        username: string;
        shopName: string;
    };

    vendorStores: {
        followFromShopPage: string;
        followFromStorePage: string;
        vendor1: string;
        shopUrl: string;
    };

    customerInfo: {
        firstName: () => string;
        lastName: () => string;
        username: () => string;
        username1: string;
    };
}

export interface storeShare {
    name: string;
    url: string;
}

// install wordpress
export interface installWp {
    // db info
    dbInfo: {
        dbHost: string;
        dbName: string;
        dbUserName: string;
        dbPassword: string;
        dbTablePrefix: string;
    };

    // site info
    siteInfo: {
        language: string;
        url: string;
        title: string;
        admin: string;
        password: string;
        email: string;
    };
}

// api interfaces

export interface auth {
    [key: string]: string;
    Authorization: string;
}

export interface user_api {
    username: string;
    password: string;
}

export interface taxRate {
    // [key: string]: string | number | boolean | string [];
    country: string;
    state: string;
    postcode: string;
    city: string;
    rate: string;
    name: string;
    priority: number;
    compound: boolean;
    shipping: boolean;
    order: number;
    class: string;
    postcodes: string[];
    cities: string[];
}

export interface coupon_api {
    code: string;
    amount: string;
    discount_type: string;
    product_ids: number[];
    individual_use?: boolean;
    meta_data?: { key: string; value: string }[];
}

export interface marketPlaceCoupon {
    code: string;
    amount: string;
    discount_type: string;
    individual_use?: boolean;
    meta_data?: { key: string; value: string }[];
}

export interface reqOptions {
    data?: any;
    failOnStatusCode?: boolean | undefined;
    form?: Record<string, string | number | boolean> | undefined;
    headers?: Record<string, string> | undefined;
    ignoreHTTPSErrors?: boolean | undefined;
    maxRedirects?: number | undefined;
    multipart?: Record<string, string | number | boolean | fs.ReadStream | { name: string; mimeType: string; buffer: Buffer }> | undefined;
    params?: Record<string, string | number | boolean> | undefined;
    timeout?: number | undefined;
}

export type params = Record<string, string | number | boolean> | undefined;

export type headers = Record<string, string>;

export interface storageState {
    cookies: {
        name: string;
        value: string;
        domain: string;
        path: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'Strict' | 'Lax' | 'None';
    }[];
    origins: {
        origin: string;
        localStorage: {
            name: string;
            value: string;
        }[];
    }[];
}

export type responseBody<T = any> = T;

export interface commission {
    commissionType: string;
    commissionPercentage: string;
    commissionFixed: string;
    commissionCategory: {
        allCategory: boolean;
        category: string;
    };
}

export interface feeRecipient {
    shippingFeeRecipient: string;
    taxFeeRecipient: string;
    shippingTaxFeeRecipient: string;
}

export interface storeContactData {
    name: string;
    email: string;
    message: string;
}

export interface questionsAnswers {
    question: string;
    editQuestion: string;
    answer: string;
    editAnswer: string;
    guest: {
        username: string;
        password: string;
    };
}

export interface dashboardMenu {
    menu_key: string;
    is_sortable: string;
    previous_title: string;
    menu_manager_title: string;
    edit_now: string;
    editable: string;
    temporary_disable_edit: string;
    switchable: string;
    is_switched_on: string;
    menu_manager_position: string;
    title: string;
    icon: string;
    url: string;
    pos: string;
    permission: string;
}

export interface paletteValues {
    buttonText: string;
    buttonBackground: string;
    buttonBorder: string;

    buttonHoverText: string;
    buttonHoverBackground: string;
    buttonHoverBorder: string;

    dashboardSidebarMenuText: string;
    dashboardSidebarBackground: string;
    dashboardSidebarActiveMenuText: string;
    dashboardSidebarActiveMenuBackground: string;
}

export interface eUComplianceData {
    companyName?: string;
    companyId: string;
    vatNumber: string;
    bankName: string;
    bankIban: string;
}
