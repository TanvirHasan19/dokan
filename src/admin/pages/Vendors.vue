<template>
    <div>
        <div class="vendor-list">
            <h1 class="wp-heading-inline">{{ __( 'Vendors', 'dokan-lite') }}</h1>
            <button @click="addNew()" class="page-title-action">{{ __( 'Add New', 'dokan-lite' ) }}</button>

            <!-- Add other component here here -->
            <component v-for="(vendorHeaderArea, index) in dokanVendorHeaderArea"
                       :key="index"
                       :is="vendorHeaderArea"
            />

            <AdminNotice></AdminNotice>

<!--            <UpgradeBanner v-if="! hasPro"></UpgradeBanner>-->

            <hr class="wp-header-end">

            <ul class="subsubsub">
                <li><router-link :to="{ name: 'Vendors', query: { status: 'all' }}" active-class="current" exact >{{ __( 'All', 'dokan-lite' ) }} <span class="count">{{ counts.all }}</span></router-link> | </li>
                <li><router-link :to="{ name: 'Vendors', query: { status: 'approved' }}" active-class="current" exact >{{ __( 'Approved', 'dokan-lite' ) }} <span class="count">{{ counts.approved }}</span></router-link> | </li>
                <li><router-link :to="{ name: 'Vendors', query: { status: 'pending' }}" active-class="current" exact >{{ __( 'Pending', 'dokan-lite' ) }} <span class="count">{{ counts.pending }}</span></router-link> | </li>
            </ul>

            <search :title="__( 'Search Vendors', 'dokan-lite')" @searched="doSearch"></search>

            <list-table
                :columns="columns"
                :loading="loading"
                :rows="vendors"
                :actions="actions"
                actionColumn="store_name"
                :show-cb="showCb"
                :total-items="totalItems"
                :bulk-actions="bulkActions"
                :total-pages="totalPages"
                :per-page="perPage"
                :current-page="currentPage"
                :action-column="actionColumn"

                not-found="No vendors found."

                :sort-by="sortBy"
                :sort-order="sortOrder"
                :text="$root.listTableTexts()"
                @sort="sortCallback"

                @pagination="goToPage"
                @action:click="onActionClick"
                @bulk:click="onBulkAction"
                @searched="doSearch"
            >
                <template slot="store_name" slot-scope="data">
                    <img :src="data.row.gravatar" :alt="data.row.store_name" width="50">
                    <strong>
                        <router-link :to="'/vendors/' + data.row.id">{{ data.row.store_name ? data.row.store_name : __( '(no name)', 'dokan-lite' ) }}</router-link>
                    </strong>
                </template>

                <template slot="email" slot-scope="data">
                    <a :href="'mailto:' + data.row.email">{{ data.row.email }}</a>
                </template>

                <template slot="categories" slot-scope="{ row }">
                      <span v-for="(category, key) in row.categories" :key="key" v-html="`${category.name}${key < row.categories.length - 1 ? ', ' : ''}`"></span>
                </template>

                <template slot="registered" slot-scope="data">
                    {{ moment(data.row.registered).format('MMM D, YYYY') }}
                </template>

                <template slot="enabled" slot-scope="data">
                    <switches :enabled="data.row.enabled" :value="data.row.id" @input="onSwitch"></switches>
                </template>

                <template slot="row-actions" slot-scope="data">
                <span v-for="(action, index) in actions" :class="action.key">
                    <router-link v-if="action.key == 'edit'" :to="{ path: 'vendors/' + data.row.id, query:{edit:'true'} }">{{ action.label }}</router-link>
                    <a v-else-if="action.key == 'products'" :href="productUrl(data.row.id)">{{ action.label }}</a>
                    <a v-else-if="action.key == 'orders'" :href="ordersUrl(data.row.id)">{{ action.label }}</a>
                    <a v-else-if="action.key == 'switch_to'" :href="switchToUrl(data.row)">{{ action.label }}</a>
                    <a v-else href="#">{{ action.label }}</a>
                    <template v-if="index !== (actions.length - 1)"> | </template>
                </span>
                </template>
                <template slot="filters" slot-scope="data">
                    <component v-for="(dokanVendorFilterSection, index) in dokanVendorFilterSectionStart"
                               :key="index"
                               :is="dokanVendorFilterSection"
                               @updateVendorComponent="updateVendorComponent"
                    />
                </template>
            </list-table>

            <add-vendor :vendor-id="vendorId" v-if="loadAddVendor" />

        </div>
    </div>
</template>

<script>
import AddVendor from './AddVendor.vue'
// import UpgradeBanner from "admin/components/UpgradeBanner.vue";

let ListTable   = dokan_get_lib('ListTable');
let Switches    = dokan_get_lib('Switches');
let Search      = dokan_get_lib('Search');
let AdminNotice = dokan_get_lib('AdminNotice');

export default {

    name: 'Vendors',

    components: {
        ListTable,
        Switches,
        Search,
        AddVendor,
        // UpgradeBanner,
        AdminNotice,
    },

    data () {
        return {
            showCb: true,
            hasPro: dokan.hasPro,
            counts: {
                pending: 0,
                approved: 0,
                all: 0
            },
            vendorId:0,
            totalItems: 0,
            perPage: 20,
            totalPages: 1,
            loading: false,

            columns: {
                'store_name': {
                    label: this.__( 'Store', 'dokan-lite' ),
                    sortable: true
                },
                'email': {
                    label: this.__( 'E-mail', 'dokan-lite' )
                },
                'phone': {
                    label: this.__( 'Phone', 'dokan-lite' )
                },
                'registered': {
                    label: this.__( 'Registered', 'dokan-lite' ),
                    sortable: true
                },
                'enabled': {
                    label: this.__( 'Status', 'dokan-lite' )
                }
            },
            actionColumn: 'title',
            actions: [
                {
                    key: 'edit',
                    label: this.__( 'Edit', 'dokan-lite' )
                },
                {
                    key: 'products',
                    label: this.__( 'Products', 'dokan-lite' )
                },
                {
                    key: 'orders',
                    label: this.__( 'Orders', 'dokan-lite' )
                },
            ],
            bulkActions: [
                {
                    key: 'approved',
                    label: this.__( 'Approve Vendors', 'dokan-lite' )
                },
                {
                    key: 'pending',
                    label: this.__( 'Disable Selling', 'dokan-lite' )
                }
            ],
            vendors: [],
            loadAddVendor: false,
            dokanVendorHeaderArea: dokan.hooks.applyFilters( 'getDokanVendorHeaderArea', [] ),
            isVendorSwitchingEnabled: false,
            dokanVendorFilterSectionStart: dokan.hooks.applyFilters( 'dokanVendorFilterSectionStart', [] ),
        }
    },

    watch: {
        '$route.query.status'() {
            this.fetchVendors();
        },

        '$route.query.page'() {
            this.fetchVendors();
        },

        '$route.query.orderby'() {
            this.fetchVendors();
        },

        '$route.query.order'() {
            this.fetchVendors();
        },
    },

    computed: {
        currentStatus() {
            return this.$route.query.status || 'all';
        },

        currentPage() {
            let page = this.$route.query.page || 1;

            return parseInt( page );
        },

        sortBy() {
            return this.$route.query.orderby || 'ID';
        },

        sortOrder() {
            return this.$route.query.order || 'desc';
        },

        storeCategory() {
            return this.$route.query.store_categories || null;
        }
    },

    created() {
        this.$root.$on('modalClosed', () => {
            this.loadAddVendor = false;
            this.vendorId = 0;
        });

        this.fetchVendors();

        this.$root.$on( 'vendorAdded', ( payload ) => {
            this.vendors.unshift( payload );
        } );

        this.$root.$on( 'addAnotherVendor', () => {
            this.loadAddVendor = true;
        } );

        this.$root.$on( 'categoryFetched', ( payload ) => {
            this.categories = payload.categories;
            this.isCategoryMultiple = payload.isCategoryMultiple;
            this.columns = payload.columns;
        });

        this.isVendorSwitchingEnabled = dokan.is_vendor_switching_enabled ? true : false;

        if ( this.isVendorSwitchingEnabled ) {
            this.actions.push({
                key: 'switch_to',
                label: this.__( 'Switch To', 'dokan-lite' )
            });
        }
    },

    methods: {
        addNew() {
            this.loadAddVendor = true;
        },
        updateVendorComponent (rerender=false) {
            if (rerender) {
                this.fetchVendors()
            }
        },
        doSearch(payload) {
            let self     = this;
            self.loading = true;

            dokan.api.get(`/stores`, {
                search: payload,
                page: this.currentPage,
                orderby: this.sortBy,
                order: this.sortOrder
            })
            .done((response, status, xhr) => {
                self.vendors = response;
                self.loading = false;

                this.updatedCounts(xhr);
                this.updatePagination(xhr);
            });
        },

        updatedCounts(xhr) {
            this.counts.pending  = parseInt( xhr.getResponseHeader('X-Status-Pending') );
            this.counts.approved = parseInt( xhr.getResponseHeader('X-Status-Approved') );
            this.counts.all      = parseInt( xhr.getResponseHeader('X-Status-All') );
        },

        updatePagination(xhr) {
            this.totalPages = parseInt( xhr.getResponseHeader('X-WP-TotalPages') );
            this.totalItems = parseInt( xhr.getResponseHeader('X-WP-Total') );
        },

        fetchVendors() {

            let self = this;

            self.loading = true;

            let data = {
                per_page: self.perPage,
                page: self.currentPage,
                status: self.currentStatus,
                orderby: self.sortBy,
                order: self.sortOrder,
                store_categories: self.storeCategory
            };

            data = dokan.hooks.applyFilters( 'DokanGetVendorArgs', data, this.$route.query );
            dokan.api.get('/stores', data)
                .done((response, status, xhr) => {
                    self.vendors = response;
                    self.loading = false;

                    self.updatedCounts(xhr);
                    self.updatePagination(xhr);
                });
        },

        onActionClick(action, row) {
            if ( 'trash' === action ) {
                if ( confirm('Are you sure to delete?') ) {
                    alert('deleted: ' + row.title);
                }
            }
        },

        onSwitch(status, vendor_id) {

            let message = ( status === false ) ? this.__( 'The vendor has been disabled.', 'dokan-lite' ) : this.__( 'Selling has been enabled', 'dokan-lite' );

            dokan.api.put('/stores/' + vendor_id + '/status', {
                status: ( status === false ) ? 'inactive' : 'active'
            })
            .done(response => {
                this.$notify({
                    title: this.__( 'Success!', 'dokan-lite' ),
                    type: 'success',
                    text: message,
                });

                if ( 'all' === this.currentStatus || 'pending' === this.currentStatus || 'approved' === this.currentStatus ) {
                    this.fetchVendors();
                }
            });
        },

        moment(date) {
            return moment(date);
        },

        goToPage(page) {
            this.$router.push({
                name: 'Vendors',
                query: {
                    status: this.currentStatus,
                    page: page
                }
            });
        },

        onBulkAction(action, items) {
            let jsonData = {};
            jsonData[action] = items;

            this.loading = true;

            dokan.api.put('/stores/batch', jsonData)
            .done(response => {
                this.loading = false;
                this.fetchVendors();
            });
        },

        sortCallback(column, order) {
            this.$router.push({
                name: 'Vendors',
                query: {
                    status: this.currentStatus,
                    page: 1,
                    orderby: column,
                    order: order
                }
            });
        },

        productUrl(id) {
            return dokan.urls.adminRoot + 'edit.php?post_type=product&author=' + id;
        },

        ordersUrl(id) {
            return dokan.urls.adminOrderListUrl + '&vendor_id=' + id;
        },

        editUrl(id) {
            return dokan.urls.adminRoot + 'user-edit.php?user_id=' + id;
        },

        switchToUrl(row) {
            return row.switch_url;
        }
    }
};
</script>

<style lang="less">
.vendor-list {
    .dokan-btn {
        padding: 5px 10px;
        font-size: 15px;
        border-radius: 3px;
        color: #2873aa;
    }

    .image {
        width: 10%;
    }

    .store_name {
        width: 30%;
    }

    td.store_name img {
        float: left;
        margin-right: 10px;
        margin-top: 1px;
        width: 24px;
        height: auto;
    }

    td.store_name strong {
        display: block;
        margin-bottom: .2em;
        font-size: 14px;
    }
}

@media only screen and (max-width: 600px) {
    .vendor-list {
        table {
            td.store_name, td.enabled {
                display: table-cell !important;
            }

            th:not(.check-column):not(.store_name):not(.enabled) {
                display: none;
            }

            td:not(.check-column):not(.store_name):not(.enabled) {
                display: none;
            }

            th.column, table td.column {
                width: auto;
            }

            td.manage-column.column-cb.check-column {
                padding-right: 15px;
            }

            th.column.enabled {
                width: 25% !important;
            }
        }
    }
}

@media only screen and (max-width:320px) {
    .vendor-list {
        table {
            .row-actions span {
                font-size: 11px;
            }
        }
    }
}
</style>
