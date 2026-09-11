import React from "react";

const Disclaimer = () => {
    return (
        <div className="disclaimer-page">

            {/* Hero Section */}
            <section className="disclaimer-hero">
                <div className="disclaimer-container">
                    <span className="disclaimer-label">
                        SHOPERS
                    </span>

                    <h1>Disclaimer</h1>

                    <p>
                        Please read the following information carefully before
                        using our website and purchasing our products.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="disclaimer-content">
                <div className="disclaimer-container">

                    {/* Introduction */}
                    <div className="disclaimer-section">
                        <h2>1. General Disclaimer</h2>

                        <p>
                            The information provided on the Shopers website is
                            intended for general informational and shopping
                            purposes. While we make reasonable efforts to ensure
                            that the information displayed on our website is
                            accurate and up to date, we do not guarantee that
                            all information will always be complete, accurate,
                            reliable, or error-free.
                        </p>

                        <p>
                            Product descriptions, images, specifications,
                            prices, availability, offers, and other website
                            content may be updated or changed from time to time
                            without prior notice.
                        </p>
                    </div>

                    {/* Product Information */}
                    <div className="disclaimer-section">
                        <h2>2. Product Information</h2>

                        <p>
                            We make every reasonable effort to display product
                            images, descriptions, colors, sizes, specifications,
                            and other product details as accurately as possible.
                        </p>

                        <p>
                            However, the actual appearance, color, texture,
                            packaging, or specifications of a product may vary
                            slightly from the images or information displayed on
                            the website due to screen settings, photography,
                            manufacturer updates, or other factors.
                        </p>
                    </div>

                    {/* Pricing */}
                    <div className="disclaimer-section">
                        <h2>3. Pricing and Availability</h2>

                        <p>
                            Product prices, discounts, promotions, and
                            availability are subject to change without prior
                            notice.
                        </p>

                        <p>
                            Although we take reasonable steps to maintain
                            accurate pricing information, errors may
                            occasionally occur. In such cases, Shopers reserves
                            the right to correct pricing or product information
                            and, where applicable, cancel or modify an order in
                            accordance with applicable laws and our policies.
                        </p>
                    </div>

                    {/* Orders */}
                    <div className="disclaimer-section">
                        <h2>4. Orders and Payments</h2>

                        <p>
                            All orders placed through the website are subject to
                            product availability, order verification, and
                            acceptance.
                        </p>

                        <p>
                            Payments may be processed through third-party
                            payment service providers. Shopers does not
                            directly control the systems, availability, or
                            policies of third-party payment providers.
                        </p>
                    </div>

                    {/* Website Availability */}
                    <div className="disclaimer-section">
                        <h2>5. Website Availability</h2>

                        <p>
                            We make reasonable efforts to keep the Shopers
                            website available and functioning properly.
                            However, we do not guarantee that the website will
                            always be available, uninterrupted, secure, or free
                            from errors.
                        </p>

                        <p>
                            Temporary interruptions may occur because of
                            maintenance, technical problems, server issues,
                            internet connectivity, security incidents, or
                            circumstances beyond our reasonable control.
                        </p>
                    </div>

                    {/* Third Party */}
                    <div className="disclaimer-section">
                        <h2>6. Third-Party Services and Links</h2>

                        <p>
                            Our website may use or integrate with third-party
                            services such as payment gateways, delivery
                            providers, analytics services, cloud platforms,
                            authentication services, or other external
                            providers.
                        </p>

                        <p>
                            We are not responsible for the availability,
                            functionality, content, privacy practices, or
                            policies of third-party websites and services.
                        </p>
                    </div>

                    {/* Security */}
                    <div className="disclaimer-section">
                        <h2>7. Security and Technical Issues</h2>

                        <p>
                            We take reasonable measures to protect our website
                            and customer information. However, no online
                            platform or electronic transmission can be
                            guaranteed to be completely secure.
                        </p>

                        <p>
                            Users should ensure that they use appropriate
                            security practices when accessing their accounts,
                            including keeping passwords and account information
                            confidential.
                        </p>
                    </div>

                    {/* Intellectual Property */}
                    <div className="disclaimer-section">
                        <h2>8. Intellectual Property</h2>

                        <p>
                            Unless otherwise stated, the content available on
                            the Shopers website, including logos, graphics,
                            images, text, designs, layouts, product information,
                            and other materials, may be protected by applicable
                            intellectual property laws.
                        </p>

                        <p>
                            Content should not be copied, reproduced,
                            distributed, modified, or used for commercial
                            purposes without appropriate authorization.
                        </p>
                    </div>

                    {/* Limitation */}
                    <div className="disclaimer-section">
                        <h2>9. Limitation of Responsibility</h2>

                        <p>
                            To the extent permitted by applicable law, Shopers
                            shall not be responsible for losses or damages
                            arising from temporary website interruptions,
                            inaccurate third-party information, technical
                            failures, or circumstances outside our reasonable
                            control.
                        </p>

                        <p>
                            Nothing in this disclaimer is intended to exclude or
                            limit any rights or protections that cannot legally
                            be excluded or limited under applicable law.
                        </p>
                    </div>

                    {/* Changes */}
                    <div className="disclaimer-section">
                        <h2>10. Changes to This Disclaimer</h2>

                        <p>
                            We may update or modify this Disclaimer from time to
                            time to reflect changes to our website, services,
                            business practices, or applicable requirements.
                        </p>

                        <p>
                            Any updated version will be published on this page
                            with the revised effective date where appropriate.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="disclaimer-contact">
                        <h2>Questions or Concerns?</h2>

                        <p>
                            If you have any questions regarding this Disclaimer
                            or the information provided on our website, please
                            contact our customer support team.
                        </p>

                        <button
                            onClick={() => {
                                window.location.href = "/contact";
                            }}
                        >
                            Contact Us
                        </button>
                    </div>

                    {/* Last Updated */}
                    <p className="last-updated">
                        Last Updated: September 2026
                    </p>

                </div>
            </section>
        </div>
    );
};

export default Disclaimer;