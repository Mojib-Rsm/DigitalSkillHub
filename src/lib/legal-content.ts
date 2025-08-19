
type LegalContent = {
    title: string;
    lastUpdated: string;
    htmlContent: string;
};

const legalData: Record<string, LegalContent> = {
    "privacy-policy": {
        title: "Privacy Policy",
        lastUpdated: "July 25, 2024",
        htmlContent: `
            <h2>1. Introduction</h2>
            <p>Welcome to TotthoAi. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>
            
            <h2>2. Information We Collect</h2>
            <p>We may collect personal information such as your name, email address, phone number, and payment information when you register for an account or use our services.</p>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Provide, operate, and maintain our services.</li>
                <li>Improve, personalize, and expand our services.</li>
                <li>Process your transactions.</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
            </ul>

            <h2>4. Sharing Your Information</h2>
            <p>We do not share your personal information with third parties except as described in this Privacy Policy.</p>
        `,
    },
    "terms-of-service": {
        title: "Terms of Service",
        lastUpdated: "July 25, 2024",
        htmlContent: `
            <h2>1. Agreement to Terms</h2>
            <p>By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the services.</p>
            
            <h2>2. User Accounts</h2>
            <p>You are responsible for safeguarding your account and for any activities or actions under your account. You agree to provide accurate and complete information when you create an account.</p>

            <h2>3. Prohibited Activities</h2>
            <p>You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or disclosing any part of the service in any medium; (ii) using any automated system to access the service; (iii) interfering with the proper working of the service.</p>

            <h2>4. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
        `,
    },
    "refund-policy": {
        title: "Refund Policy",
        lastUpdated: "July 25, 2024",
        htmlContent: `
            <h2>1. General Policy</h2>
            <p>We offer a 7-day money-back guarantee on all our subscription plans. If you are not satisfied with our service, you can request a full refund within 7 days of your purchase.</p>

            <h2>2. How to Request a Refund</h2>
            <p>To request a refund, please contact our support team at support@totthoai.com with your purchase details. Refunds will be processed within 5-7 business days.</p>

            <h2>3. Exceptions</h2>
            <p>No refunds will be issued after 7 days from the date of purchase. Refunds are not applicable for any custom services or one-time credit pack purchases.</p>
        `,
    },
    "cookie-policy": {
        title: "Cookie Policy",
        lastUpdated: "July 25, 2024",
        htmlContent: `
            <h2>1. What Are Cookies?</h2>
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>

            <h2>2. How We Use Cookies</h2>
            <p>We use cookies to:</p>
            <ul>
                <li>Understand and save your preferences for future visits.</li>
                <li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future.</li>
                <li>Keep you logged in to our service.</li>
            </ul>

            <h2>3. Your Choices Regarding Cookies</h2>
            <p>You can choose to disable cookies through your individual browser options. However, this may affect your ability to use some features of our service.</p>
        `,
    },
};

export function getLegalContent(slug: string): LegalContent | undefined {
    return legalData[slug];
}
