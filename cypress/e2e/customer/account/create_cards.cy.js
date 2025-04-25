import { login, logout, createCard } from '../../../support/customer/commands';

describe('Account Details Flow', () => {
    beforeEach(() => {
      
      cy.clearCookies();
      cy.clearLocalStorage();
    });
  
    it('should log in and log out successfully', () => {
      // Use your custom login command
      cy.login('marko.markovic@banka.com', 'M@rko12345');
  
      // Verify dashboard content is visible
      cy.verifyLoggedIn();
  
    
      cy.createCard();
        
        
      // Use your custom logout command
      cy.logout();
  
      // Confirm we're back on the login page
      cy.contains('Login').should('be.visible');
    });
  });
  