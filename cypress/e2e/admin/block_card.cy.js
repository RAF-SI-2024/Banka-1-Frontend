import { login, logout,blockCard } from '../../support/admin/commands';

describe('Block Employee flow', () => {
    beforeEach(() => {
        // Start clean
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('should log in and log out successfully', () => {
        // Use your custom login command
        cy.login('admin@admin.com', 'admin123');

        // Verify dashboard content is visible
        cy.verifyLoggedIn();

        cy.blockCard();
        // Use your custom logout command
        cy.logout();

        // Confirm we're back on the login page
        cy.contains('Login').should('be.visible');
    });
});