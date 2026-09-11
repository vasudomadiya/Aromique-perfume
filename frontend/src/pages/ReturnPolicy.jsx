
import React from "react";

const ReturnPolicy = () => {
    return (
        <main className="disclaimer-page">

            {/* Hero Section */}
            <section className="disclaimer-hero">
                <div className="disclaimer-container">

                    <span className="disclaimer-label">
                        CUSTOMER POLICY
                    </span>

                    <h1>Return & Refund Policy</h1>

                    <p>
                        We want you to have a smooth shopping experience.
                        Please review our return, replacement, cancellation,
                        and refund guidelines before placing your order.
                    </p>

                </div>
            </section>

            {/* Policy Content */}
            <section className="disclaimer-content">
                <div className="disclaimer-container">

                    {/* Introduction */}
                    <div className="disclaimer-notice">

                        <h3>Important Information</h3>

                        <p>
                            Please carefully review the product details,
                            specifications, size, color, and other information
                            before placing your order. Return and refund
                            eligibility may depend on the condition of the
                            product and the reason for the return.
                        </p>

                    </div>

                    {/* 1 */}
                    <div className="disclaimer-section">

                        <h2>1. Return Eligibility</h2>

                        <p>
                            Products may be eligible for return or replacement
                            if they are damaged, defective, incorrect, or
                            significantly different from the product
                            description.
                        </p>

                        <p>
                            To be eligible for a return, the product should
                            generally be unused and returned in its original
                            packaging with all applicable accessories,
                            tags, manuals, and other included items.
                        </p>

                    </div>

                    {/* 2 */}
                    <div className="disclaimer-section">

                        <h2>2. Return Request Period</h2>

                        <p>
                            Customers must contact us within the applicable
                            return period after receiving their order.
                        </p>

                        <p>
                            Return requests submitted after the applicable
                            return period may not be accepted.
                        </p>

                    </div>

                    {/* 3 */}
                    <div className="disclaimer-section">

                        <h2>3. Damaged or Defective Products</h2>

                        <p>
                            If you receive a damaged or defective product,
                            please contact our support team as soon as
                            possible after delivery.
                        </p>

                        <p>
                            We may request photographs, videos, order
                            information, or other details to verify the
                            issue and determine the appropriate resolution.
                        </p>

                    </div>

                    {/* 4 */}
                    <div className="disclaimer-section">

                        <h2>4. Wrong Product Received</h2>

                        <p>
                            If you receive a product that is different from
                            the product you ordered, please contact us
                            promptly.
                        </p>

                        <p>
                            After verification, we may arrange a replacement,
                            return, or other appropriate resolution depending
                            on the circumstances.
                        </p>

                    </div>

                    {/* 5 */}
                    <div className="disclaimer-section">

                        <h2>5. Non-Returnable Products</h2>

                        <p>
                            Certain products may not be eligible for return
                            due to their nature, hygiene requirements,
                            customization, usage, or other applicable
                            restrictions.
                        </p>

                        <p>
                            Products that have been used, damaged after
                            delivery, altered, or returned without their
                            original packaging may also be excluded from
                            return eligibility.
                        </p>

                    </div>

                    {/* 6 */}
                    <div className="disclaimer-section">

                        <h2>6. Refunds</h2>

                        <p>
                            Once a returned product has been received and
                            inspected, we will determine whether it qualifies
                            for a refund.
                        </p>

                        <p>
                            If approved, the refund will generally be
                            processed through the applicable payment method,
                            subject to payment-provider processing times.
                        </p>

                    </div>

                    {/* 7 */}
                    <div className="disclaimer-section">

                        <h2>7. Refund Processing Time</h2>

                        <p>
                            Refund processing times may vary depending on the
                            payment method, bank, payment gateway, or other
                            financial institution involved.
                        </p>

                        <p>
                            The time required for the refund to appear in the
                            customer's account may therefore differ from the
                            date on which we initiate the refund.
                        </p>

                    </div>

                    {/* 8 */}
                    <div className="disclaimer-section">

                        <h2>8. Shipping & Return Costs</h2>

                        <p>
                            Return shipping charges may vary depending on the
                            reason for the return and the applicable return
                            conditions.
                        </p>

                        <p>
                            Where a return is required because of a defective,
                            damaged, or incorrect product, we may provide
                            appropriate return-shipping assistance where
                            applicable.
                        </p>

                    </div>

                    {/* 9 */}
                    <div className="disclaimer-section">

                        <h2>9. Order Cancellation</h2>

                        <p>
                            Customers may request cancellation of an order
                            before it has been processed or shipped.
                        </p>

                        <p>
                            Once an order has been dispatched, cancellation
                            may no longer be possible and the customer may
                            need to follow the applicable return procedure.
                        </p>

                    </div>

                    {/* 10 */}
                    <div className="disclaimer-section">

                        <h2>10. Exchange or Replacement</h2>

                        <p>
                            Where applicable, eligible products may be
                            replaced with the correct or equivalent product
                            instead of issuing a refund.
                        </p>

                        <p>
                            Replacement availability depends on stock and
                            product availability at the time the request is
                            processed.
                        </p>

                    </div>

                    {/* 11 */}
                    <div className="disclaimer-section">

                        <h2>11. Return Inspection</h2>

                        <p>
                            All returned products may be inspected before a
                            return, replacement, or refund is approved.
                        </p>

                        <p>
                            If the returned product does not meet the
                            applicable return conditions, the request may be
                            rejected.
                        </p>

                    </div>

                    {/* Contact */}
                    <div className="disclaimer-contact">

                        <h2>Need Help With a Return?</h2>

                        <p>
                            If you have questions about a return, replacement,
                            cancellation, or refund, please contact our
                            customer support team.
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            <a href="mailto:vasudomadiya1@gmail.com">
                                vasudomadiya1@gmail.com
                            </a>
                        </p>

                        <button
                            onClick={() =>
                                (window.location.href =
                                    "mailto:vasudomadiya1@gmail.com")
                            }
                        >
                            Contact Support
                        </button>

                    </div>

                    {/* Last Updated */}
                    <div className="last-updated">
                        Last Updated: September 7, 2026
                    </div>

                </div>
            </section>

        </main>
    );
};

export default ReturnPolicy;
