<?php
/**
 * Theme header: dynamic header for WordPress
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header>
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                <?php if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) :
                    the_custom_logo();
                else : ?>
                    <img class="logo_img" src="<?php echo esc_url( get_template_directory_uri() . '/images/Logo.png' ); ?>" alt="<?php bloginfo( 'name' ); ?>" />
                <?php endif; ?>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle navigation', 'textdomain' ); ?>">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'navbar-nav me-auto mb-2 mb-lg-0',
                    'fallback_cb'    => false,
                ) );
                ?>
                <ul class="nav_top"></ul>
            </div>

            <div class="account_icon">
                <i class="fa-solid fa-magnifying-glass"></i>
                <i class="fa-solid fa-user"></i>
                <i class="fa-solid fa-cart-plus"></i>
            </div>
        </div>
    </nav>
</header>

<?php
// header.php ends here; the rest of the template (content/footer) goes in other theme files
?>
