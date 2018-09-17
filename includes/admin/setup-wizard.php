<?php
/**
 * Setup wizard class
 *
 * Walkthrough to the basic setup upon installation
 */

/**
 * The class
 */
class Dokan_Setup_Wizard {
    /** @var string Currenct Step */
    protected $step   = '';

    /** @var array Steps for the setup wizard */
    protected $steps  = array();

    /**
     * Hook in tabs.
     */
    public function __construct() {
        if ( current_user_can( 'manage_options' ) ) {
            add_action( 'admin_menu', array( $this, 'admin_menus' ) );
            add_action( 'admin_init', array( $this, 'setup_wizard' ), 99 );
        }
    }

    /**
     * Enqueue scripts & styles from woocommerce plugin.
     *
     * @return void
     */
    public function enqueue_scripts() {
        $suffix     = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        wp_register_script( 'jquery-blockui', WC()->plugin_url() . '/assets/js/jquery-blockui/jquery.blockUI' . $suffix . '.js', array( 'jquery' ), '2.70', true );
        wp_register_script( 'selectWoo', WC()->plugin_url() . '/assets/js/selectWoo/selectWoo.full' . $suffix . '.js', array( 'jquery' ), '1.0.1' );
        wp_register_script( 'wc-enhanced-select', WC()->plugin_url() . '/assets/js/admin/wc-enhanced-select' . $suffix . '.js', array( 'jquery', 'selectWoo' ), WC_VERSION );
        wp_localize_script( 'wc-enhanced-select', 'wc_enhanced_select_params', array(
            'i18n_matches_1'            => _x( 'One result is available, press enter to select it.', 'enhanced select', 'dokan-lite' ),
            'i18n_matches_n'            => _x( '%qty% results are available, use up and down arrow keys to navigate.', 'enhanced select', 'dokan-lite' ),
            'i18n_no_matches'           => _x( 'No matches found', 'enhanced select', 'dokan-lite' ),
            'i18n_ajax_error'           => _x( 'Loading failed', 'enhanced select', 'dokan-lite' ),
            'i18n_input_too_short_1'    => _x( 'Please enter 1 or more characters', 'enhanced select', 'dokan-lite' ),
            'i18n_input_too_short_n'    => _x( 'Please enter %qty% or more characters', 'enhanced select', 'dokan-lite' ),
            'i18n_input_too_long_1'     => _x( 'Please delete 1 character', 'enhanced select', 'dokan-lite' ),
            'i18n_input_too_long_n'     => _x( 'Please delete %qty% characters', 'enhanced select', 'dokan-lite' ),
            'i18n_selection_too_long_1' => _x( 'You can only select 1 item', 'enhanced select', 'dokan-lite' ),
            'i18n_selection_too_long_n' => _x( 'You can only select %qty% items', 'enhanced select', 'dokan-lite' ),
            'i18n_load_more'            => _x( 'Loading more results&hellip;', 'enhanced select', 'dokan-lite' ),
            'i18n_searching'            => _x( 'Searching&hellip;', 'enhanced select', 'dokan-lite' ),
            'ajax_url'                  => admin_url( 'admin-ajax.php' ),
        ) );

        wp_enqueue_style( 'woocommerce_admin_styles', WC()->plugin_url() . '/assets/css/admin.css', array(), WC_VERSION );
        wp_enqueue_style( 'wc-setup', WC()->plugin_url() . '/assets/css/wc-setup.css', array( 'dashicons', 'install' ), WC_VERSION );
        wp_enqueue_style( 'dokan-setup', DOKAN_PLUGIN_ASSEST . '/css/setup.css', array( 'wc-setup' ), DOKAN_PLUGIN_VERSION );

        wp_register_script( 'wc-setup', WC()->plugin_url() . '/assets/js/admin/wc-setup.min.js', array( 'jquery', 'wc-enhanced-select', 'jquery-blockui' ), WC_VERSION );
        wp_localize_script( 'wc-setup', 'wc_setup_params', array() );
    }

    /**
     * Add admin menus/screens.
     */
    public function admin_menus() {
        add_submenu_page( null, '', '', 'manage_options', 'dokan-setup', '' );
    }

    /**
     * Show the setup wizard.
     */
    public function setup_wizard() {
        if ( empty( $_GET['page'] ) || 'dokan-setup' !== $_GET['page'] ) {
            return;
        }
        $this->steps = array(
            'introduction' => array(
                'name'    =>  __( 'Introduction', 'dokan-lite' ),
                'view'    => array( $this, 'dokan_setup_introduction' ),
                'handler' => ''
            ),
            'store' => array(
                'name'    =>  __( 'Store', 'dokan-lite' ),
                'view'    => array( $this, 'dokan_setup_store' ),
                'handler' => array( $this, 'dokan_setup_store_save' ),
            ),
            'selling' => array(
                'name'    =>  __( 'Selling', 'dokan-lite' ),
                'view'    => array( $this, 'dokan_setup_selling' ),
                'handler' => array( $this, 'dokan_setup_selling_save' ),
            ),
            'withdraw' => array(
                'name'    =>  __( 'Withdraw', 'dokan-lite' ),
                'view'    => array( $this, 'dokan_setup_withdraw' ),
                'handler' => array( $this, 'dokan_setup_withdraw_save' ),
            ),
            'next_steps' => array(
                'name'    =>  __( 'Ready!', 'dokan-lite' ),
                'view'    => array( $this, 'dokan_setup_ready' ),
                'handler' => ''
            )
        );
        $this->step = isset( $_GET['step'] ) ? sanitize_key( $_GET['step'] ) : current( array_keys( $this->steps ) );

        $this->enqueue_scripts();

        if ( ! empty( $_POST['save_step'] ) && isset( $this->steps[ $this->step ]['handler'] ) ) { // WPCS: CSRF ok.
            call_user_func( $this->steps[ $this->step ]['handler'] );
        }

        ob_start();
        $this->setup_wizard_header();
        $this->setup_wizard_steps();
        $this->setup_wizard_content();
        $this->setup_wizard_footer();
        exit;
    }

    public function get_next_step_link() {
        $keys = array_keys( $this->steps );

        return add_query_arg( 'step', $keys[ array_search( $this->step, array_keys( $this->steps ) ) + 1 ] );
    }

    /**
     * Setup Wizard Header.
     */
    public function setup_wizard_header() {
        ?>
        <!DOCTYPE html>
        <html <?php language_attributes(); ?>>
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title><?php _e( 'Dokan &rsaquo; Setup Wizard', 'dokan-lite' ); ?></title>
            <?php wp_print_scripts( 'wc-setup' ); ?>
            <?php do_action( 'admin_print_styles' ); ?>
            <?php do_action( 'admin_head' ); ?>
            <?php do_action( 'dokan_setup_wizard_styles' ); ?>
            <style type="text/css">

            </style>
        </head>
        <body class="wc-setup wp-core-ui">
            <?php
                $logo_url = ( ! empty( $this->custom_logo ) ) ? $this->custom_logo : plugins_url( 'assets/images/dokan-logo.png', DOKAN_FILE );
            ?>
            <h1 id="wc-logo"><a href="https://wedevs.com/products/plugins/dokan/"><img src="<?php echo $logo_url; ?>" alt="Dokan" /></a></h1>
        <?php
    }

    /**
     * Setup Wizard Footer.
     */
    public function setup_wizard_footer() {
        ?>
            <?php if ( 'next_steps' === $this->step ) : ?>
                <a class="wc-return-to-dashboard" href="<?php echo esc_url( admin_url() ); ?>"><?php _e( 'Return to the WordPress Dashboard', 'dokan-lite' ); ?></a>
            <?php endif; ?>
            </body>
        </html>
        <?php
    }

    /**
     * Output the steps.
     */
    public function setup_wizard_steps() {
        $ouput_steps = $this->steps;
        array_shift( $ouput_steps );
        ?>
        <ol class="wc-setup-steps">
            <?php foreach ( $ouput_steps as $step_key => $step ) : ?>
                <li class="<?php
                    if ( $step_key === $this->step ) {
                        echo 'active';
                    } elseif ( array_search( $this->step, array_keys( $this->steps ) ) > array_search( $step_key, array_keys( $this->steps ) ) ) {
                        echo 'done';
                    }
                ?>"><?php echo esc_html( $step['name'] ); ?></li>
            <?php endforeach; ?>
        </ol>
        <?php
    }

    /**
     * Output the content for the current step.
     */
    public function setup_wizard_content() {
        echo '<div class="wc-setup-content">';
        call_user_func( $this->steps[ $this->step ]['view'] );
        echo '</div>';
    }

    /**
     * Introduction step.
     */
    public function dokan_setup_introduction() {
        ?>
        <h1><?php _e( 'Welcome to the world of Dokan!', 'dokan-lite' ); ?></h1>
        <p><?php _e( 'Thank you for choosing Dokan to power your online marketplace! This quick setup wizard will help you configure the basic settings. <strong>It’s completely optional and shouldn’t take longer than three minutes.</strong>', 'dokan-lite' ); ?></p>
        <p><?php _e( 'No time right now? If you don’t want to go through the wizard, you can skip and return to the WordPress dashboard. Come back anytime if you change your mind!', 'dokan-lite' ); ?></p>
        <p class="wc-setup-actions step">
            <a href="<?php echo esc_url( $this->get_next_step_link() ); ?>" class="button-primary button button-large button-next"><?php _e( 'Let\'s Go!', 'dokan-lite' ); ?></a>
            <a href="<?php echo esc_url( admin_url() ); ?>" class="button button-large"><?php _e( 'Not right now', 'dokan-lite' ); ?></a>
        </p>
        <?php
    }

    /**
     * Store step.
     */
    public function dokan_setup_store() {
        $options                = get_option( 'dokan_general', array() );
        $custom_store_url       = ! empty( $options['custom_store_url'] ) ? $options['custom_store_url'] : 'store';
        $shipping_fee_recipient = ! empty( $options['shipping_fee_recipient'] ) ? $options['shipping_fee_recipient'] : 'seller';
        $tax_fee_recipient      = ! empty( $options['tax_fee_recipient'] ) ? $options['tax_fee_recipient'] : 'seller';

        $recipients = array(
            'seller' => __( 'Vendor', 'dokan-lite' ),
            'admin'  => __( 'Admin', 'dokan-lite' ),
        );
        ?>
        <h1><?php _e( 'Store Setup', 'dokan-lite' ); ?></h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="custom_store_url"><?php _e( 'Vendor Store URL', 'dokan-lite' ); ?></label></th>
                    <td>
                        <input type="text" id="custom_store_url" name="custom_store_url" value="<?php echo $custom_store_url; ?>" />
                        <p class="description"><?php _e( 'Define vendor store URL', 'dokan-lite' ); ?> (<?php echo site_url(); ?>/[this-text]/[seller-name])</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="shipping_fee_recipient"><?php _e( 'Shipping Fee Recipient', 'dokan-lite' ); ?></label></th>
                    <td>
                        <select class="wc-enhanced-select" id="shipping_fee_recipient" name="shipping_fee_recipient">
                            <?php
                                foreach ( $recipients as $key => $value ) {
                                    $selected = ( $shipping_fee_recipient == $key ) ? ' selected="true"' : '';
                                    echo '<option value="' . $key . '" ' . $selected . '>' . $value . '</option>';
                                }
                            ?>
                        </select>
                        <p class="description"><?php _e( 'Shipping fees will go to', 'dokan-lite' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="tax_fee_recipient"><?php _e( 'Rax Fee Recipient', 'dokan-lite' ); ?></label></th>
                    <td>
                        <select class="wc-enhanced-select" id="tax_fee_recipient" name="tax_fee_recipient">
                            <?php
                                foreach ( $recipients as $key => $value ) {
                                    $selected = ( $tax_fee_recipient == $key ) ? ' selected="true"' : '';
                                    echo '<option value="' . $key . '" ' . $selected . '>' . $value . '</option>';
                                }
                            ?>
                        </select>
                        <p class="description"><?php _e( 'Tax fees will go to', 'dokan-lite' ); ?></p>
                    </td>
                </tr>
            </table>
            <p class="wc-setup-actions step">
                <input type="submit" class="button-primary button button-large button-next" value="<?php esc_attr_e( 'Continue', 'dokan-lite' ); ?>" name="save_step" />
                <a href="<?php echo esc_url( $this->get_next_step_link() ); ?>" class="button button-large button-next"><?php _e( 'Skip this step', 'dokan-lite' ); ?></a>
                <?php wp_nonce_field( 'dokan-setup' ); ?>
            </p>
        </form>
        <?php
    }

    /**
     * Save store options.
     */
    public function dokan_setup_store_save() {
        check_admin_referer( 'dokan-setup' );

        $options = get_option( 'dokan_general', array() );

        $options['custom_store_url']       = ! empty( $_POST['custom_store_url'] ) ? sanitize_text_field( $_POST['custom_store_url'] ) : '';
        $options['tax_fee_recipient']      = ! empty( $_POST['tax_fee_recipient'] ) ? sanitize_text_field( $_POST['tax_fee_recipient'] ) : '';
        $options['shipping_fee_recipient'] = ! empty( $_POST['shipping_fee_recipient'] ) ? sanitize_text_field( $_POST['shipping_fee_recipient'] ) : '';

        update_option( 'dokan_general', $options );

        wp_redirect( esc_url_raw( $this->get_next_step_link() ) );
        exit;
    }

    /**
     * Selling step.
     */
    public function dokan_setup_selling() {
        $options = get_option( 'dokan_selling', array() );
        $new_seller_enable_selling = ! empty( $options['new_seller_enable_selling'] ) ? $options['new_seller_enable_selling'] : '';
        $commission_type           = ! empty( $options['commission_type'] ) ? $options['commission_type'] : 'percentage';
        $admin_percentage          = ! empty( $options['admin_percentage'] ) ? $options['admin_percentage'] : '';
        $order_status_change       = ! empty( $options['order_status_change'] ) ? $options['order_status_change'] : '';

        ?>
        <h1><?php _e( 'Selling Setup', 'dokan-lite' ); ?></h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="new_seller_enable_selling"><?php _e( 'New Vendor Enable Selling', 'dokan-lite' ); ?></label></th>
                    <td>
                        <input type="checkbox" name="new_seller_enable_selling" id="new_seller_enable_selling" class="switch-input" <?php echo ( $new_seller_enable_selling == 'on' ) ? 'checked="checked"' : ''; ?>>
                        <label for="new_seller_enable_selling" class="switch-label">
                            <span class="toggle--on"><?php _e( 'On', 'dokan-lite' ); ?></span>
                            <span class="toggle--off"><?php _e( 'Off', 'dokan-lite' ); ?></span>
                        </label>
                        <span class="description">
                            <?php _e( 'Make selling status enable for new registred vendor', 'dokan-lite' ); ?>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="admin_percentage"><?php _e( 'Commission Type', 'dokan-lite' ); ?></label></th>
                    <td>
                        <select class="commission_type wc-enhanced-select" name="commission_type">
                            <option value="percentage">Percentage(%)</option>
                            <option value="flat">Flat</option>
                        </select>
                        <p class="description"><?php _e( 'Set your commission type', 'dokan-lite' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="admin_percentage"><?php _e( 'Admin Commission %', 'dokan-lite' ); ?></label></th>
                    <td>
                        <input type="text" id="admin_percentage" name="admin_percentage" value="<?php echo $admin_percentage; ?>" />
                        <p class="description"><?php _e( 'How much amount (%) you will get from each order', 'dokan-lite' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="order_status_change"><?php _e( 'Order Status Change', 'dokan-lite' ); ?></label></th>
                    <td>
                        <input type="checkbox" name="order_status_change" id="order_status_change" class="switch-input" <?php echo ( $order_status_change == 'on' ) ? 'checked="checked"' : ''; ?>>
                        <label for="order_status_change" class="switch-label">
                            <span class="toggle--on"><?php _e( 'On', 'dokan-lite' ); ?></span>
                            <span class="toggle--off"><?php _e( 'Off', 'dokan-lite' ); ?></span>
                        </label>
                        <span class="description">
                            <?php _e( 'Vendor can change order status', 'dokan-lite' ); ?>
                        </span>
                    </td>
                </tr>
            </table>
            <p class="wc-setup-actions step">
                <input type="submit" class="button-primary button button-large button-next" value="<?php esc_attr_e( 'Continue', 'dokan-lite' ); ?>" name="save_step" />
                <a href="<?php echo esc_url( $this->get_next_step_link() ); ?>" class="button button-large button-next"><?php _e( 'Skip this step', 'dokan-lite' ); ?></a>
                <?php wp_nonce_field( 'dokan-setup' ); ?>
            </p>
        </form>
        <?php
    }

    /**
     * Save selling options.
     */
    public function dokan_setup_selling_save() {
        check_admin_referer( 'dokan-setup' );

        $options = get_option( 'dokan_selling', array() );
        $options['new_seller_enable_selling'] = isset( $_POST['new_seller_enable_selling'] ) ? 'on' : 'off';
        $options['commission_type']           = $_POST['commission_type'];
        $options['admin_percentage']          = is_int( $_POST['admin_percentage'] ) ? intval( $_POST['admin_percentage'] ) : floatval( $_POST['admin_percentage'] );
        $options['order_status_change']       = isset( $_POST['order_status_change'] ) ? 'on' : 'off';

        update_option( 'dokan_selling', $options );

        wp_redirect( esc_url_raw( $this->get_next_step_link() ) );
        exit;
    }

    /**
     * Withdraw Step.
     */
    public function dokan_setup_withdraw() {
        $options = get_option( 'dokan_withdraw', array() );

        $withdraw_methods      = ! empty( $options['withdraw_methods'] ) ? $options['withdraw_methods'] : array();
        $withdraw_limit        = ! empty( $options['withdraw_limit'] ) ? $options['withdraw_limit'] : 0;
        $withdraw_order_status = ! empty( $options['withdraw_order_status'] ) ? $options['withdraw_order_status'] : array();
        ?>
        <h1><?php _e( 'Withdraw Setup', 'dokan-lite' ); ?></h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="withdraw_methods"><?php _e( 'Withdraw Methods', 'dokan-lite' ); ?></label></th>
                </tr>
                <tr>
                    <td colspan="2">
                        <ul class="wc-wizard-payment-gateways wc-wizard-services">
                            <li class="wc-wizard-service-item">
                                <div class="wc-wizard-service-name">
                                    <p><?php _e( 'Paypal', 'dokan-lite' ); ?></p>
                                </div>
                                <div class="wc-wizard-service-description">
                                    <?php _e( 'Enable paypal for your vendor as a withdraw method', 'dokan-lite' ); ?>
                                </div>
                                <div class="dokan-wizard-service-enable">
                                    <input type="checkbox" name="withdraw_methods[paypal]" id="withdraw_methods[paypal]" class="switch-input" checked>
                                    <label for="withdraw_methods[paypal]" class="switch-label"></label>
                                </div>
                            </li>

                            <li class="wc-wizard-service-item <?php echo ( array_key_exists( 'paypal', $withdraw_methods ) ) ? 'checked="checked"' : ''; ?>">
                                <div class="wc-wizard-service-name">
                                    <p><?php _e( 'Bank', 'dokan-lite' ); ?></p>
                                </div>
                                <div class="wc-wizard-service-description">
                                    <?php _e( 'Enable bank transfer for your vendor as a withdraw method', 'dokan-lite' ); ?>
                                </div>
                                <div class="dokan-wizard-service-enable">
                                    <input type="checkbox" name="withdraw_methods[bank]" id="withdraw_methods[bank]" class="switch-input" checked>
                                    <label for="withdraw_methods[bank]" class="switch-label"></label>
                                </div>
                            </li>

                            <li class="wc-wizard-service-item <?php echo ( array_key_exists( 'paypal', $withdraw_methods ) ) ? 'checked="checked"' : ''; ?>">
                                <div class="wc-wizard-service-name">
                                    <p><?php _e( 'Skrill', 'dokan-lite' ); ?></p>
                                </div>
                                <div class="wc-wizard-service-description">
                                    <?php _e( 'Enable skrill for your vendor as a withdraw method', 'dokan-lite' ); ?>
                                </div>
                                <div class="dokan-wizard-service-enable">
                                    <input type="checkbox" name="withdraw_methods[skrill]" id="withdraw_methods[skrill]" class="switch-input" checked>
                                    <label for="withdraw_methods[skrill]" class="switch-label"></label>
                                </div>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="withdraw_limit"><?php _e( 'Minimum Withdraw Limit', 'dokan-lite' ); ?></label></th>
                    <td>
                        <input type="text" id="withdraw_limit" name="withdraw_limit" value="<?php echo $withdraw_limit; ?>" />
                        <p class="description"><?php _e( 'Minimum balance required to make a withdraw request ( Leave it blank to set no limits )', 'dokan-lite' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="withdraw_order_status"><?php _e( 'Order Status for Withdraw', 'dokan-lite' ); ?></label></th>
                    <td>
                        <input type="checkbox" name="withdraw_order_status[wc-completed]" id="withdraw_order_status[wc-completed]" class="switch-input" value="wc-completed" <?php echo ( array_key_exists( 'wc-completed', $withdraw_order_status ) ) ? 'checked="true"' : ''; ?>>
                        <label for="withdraw_order_status[wc-completed]" class="switch-label">
                            <?php _e( 'Completed', 'dokan-lite' ); ?>
                        </label><br>

                        <input type="checkbox" name="withdraw_order_status[wc-processing]" id="withdraw_order_status[wc-processing]" class="switch-input" value="wc-processing" <?php echo ( array_key_exists( 'wc-processing', $withdraw_order_status ) ) ? 'checked="true"' : ''; ?>>
                        <label for="withdraw_order_status[wc-processing]" class="switch-label">
                            <?php _e( 'Processing', 'dokan-lite' ); ?>
                        </label><br>

                        <input type="checkbox" name="withdraw_order_status[wc-on-hold]" id="withdraw_order_status[wc-on-hold]" class="switch-input" value="wc-on-hold" <?php echo ( array_key_exists( 'wc-on-hold', $withdraw_order_status ) ) ? 'checked="true"' : ''; ?>>
                        <label for="withdraw_order_status[wc-on-hold]" class="switch-label">
                            <?php _e( 'On-hold', 'dokan-lite' ); ?>
                        </label><br>

                        <p class="description"><?php _e( 'Order status for which vendor can make a withdraw request.', 'dokan-lite' ); ?></p>
                    </td>
                </tr>
            </table>
            <p class="wc-setup-actions step">
                <input type="submit" class="button-primary button button-large button-next" value="<?php esc_attr_e( 'Continue', 'dokan-lite' ); ?>" name="save_step" />
                <a href="<?php echo esc_url( $this->get_next_step_link() ); ?>" class="button button-large button-next"><?php _e( 'Skip this step', 'dokan-lite' ); ?></a>
                <?php wp_nonce_field( 'dokan-setup' ); ?>
            </p>
        </form>
        <?php
    }

    /**
     * Save withdraw options.
     */
    public function dokan_setup_withdraw_save() {
        check_admin_referer( 'dokan-setup' );

        $options = array();

        $options['withdraw_methods']      = ! empty( $_POST['withdraw_methods'] ) ? $_POST['withdraw_methods'] : array();
        $options['withdraw_limit']        = ! empty( $_POST['withdraw_limit'] ) ? sanitize_text_field( $_POST['withdraw_limit'] ) : 0;
        $options['withdraw_order_status'] = ! empty( $_POST['withdraw_order_status'] ) ? $_POST['withdraw_order_status'] : array();

        update_option( 'dokan_withdraw', $options );

        wp_redirect( esc_url_raw( $this->get_next_step_link() ) );
        exit;
    }

    /**
     * Final step.
     */
    public function dokan_setup_ready() {
        ?>
        <div class="dokan-setup-done">
            <img src="<?php echo plugins_url( 'assets/images/dokan-checked.png', DOKAN_FILE ); ?>" alt="dokan setup">
            <h1><?php _e( 'Your Marketplace is Ready!', 'dokan-lite' ); ?></h1>
        </div>

        <div class="dokan-setup-done-content">
            <p class="wc-setup-actions step">
                <a class="button button-primary" href="<?php echo esc_url( admin_url( 'admin.php?page=dokan#/settings' ) ); ?>"><?php _e( 'Setup Your Dokan!', 'dokan-lite' ); ?></a>
                <a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=dokan#/help' ) ); ?>"><?php _e( 'Learn More', 'dokan-lite' ); ?></a>
            </p>
        </div>
        <?php
    }
}
