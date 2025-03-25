// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Login command to authenticate a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
Cypress.Commands.add('login', (email = 'admin@admin.com', password = 'admin123') => {
  cy.visit('/login');
  cy.get('input[name="email"]').should('be.visible').clear().type(email);
  cy.get('input[name="password"]').should('be.visible').clear().type(password);
  cy.get('button[type="submit"]').should('be.visible').click();
  
  // Wait for redirection to dashboard or home after login
  cy.url().should('not.include', '/login');
});

/**
 * Logout command to sign out the current user
 */
Cypress.Commands.add('logout', () => {
  // Then click logout option
  cy.contains('Logout').should('be.visible').click();
  cy.contains('Continue').should('be.visible').click();
  
  // Verify we're redirected to login page
  cy.url().should('include', '/');
});

/**
 * Verify that the user is logged in by checking elements on the dashboard
 */
Cypress.Commands.add('verifyLoggedIn', () => {
  // Check for elements that should only be visible when logged in
  cy.contains('Welcome to the Admin Dashboard').should('be.visible');
});

/**
 * Add a new employee
 */
Cypress.Commands.add('addEmployee', () => {
  cy.get('button[aria-label="open drawer"]').should('be.visible').click();
  cy.contains('Employees').should('be.visible').click();
  cy.contains('Add Employee').should('be.visible').click();

  const randomString = () => Math.random().toString(36).substring(2, 8);
  const randomEmail = () => `${randomString()}@test.com`;
  const randomNumber = () => Math.floor(Math.random() * 10);

  cy.get('input[name="firstName"]').should('be.visible').type(`Ime${randomString()}`);
  cy.get('input[name="lastName"]').should('be.visible').type(`Prezime${randomString()}`);
  cy.get('input[name="username"]').should('be.visible').type(`user_${randomString()}`);
  cy.get('input[name="email"]').should('be.visible').type(randomEmail());

  cy.get('input[name="phoneNumber"]').should('be.visible').type(`0${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`);
  cy.get('input[name="address"]').should('be.visible').type('Georgi Dimitrova 12');
  cy.get('input[name="birthDate"]').should('be.visible').type('1995-01-01');

  cy.contains('Save').should('be.visible').click();
});

/**
 * Block an employee
 */
Cypress.Commands.add('blockEmployee', () => {
  cy.get('button[aria-label="open drawer"]').should('be.visible').click();
  cy.contains('Employees').should('be.visible').click();

  cy.get('[data-rowindex="3"]').should('be.visible').within(() => {
    // Find the switch input inside the "active" cell
    cy.get('[data-field="active"] input[type="checkbox"]').should('exist').click({ force: true });
  });
});

/**
 * Change customer details
 */
Cypress.Commands.add('changeCustomerDetails', () => {
  cy.get('button[aria-label="open drawer"]').should('be.visible').click();
  cy.contains('Customers').should('be.visible').click();

  cy.get('[data-rowindex="3"]').should('be.visible').click();
  cy.get('input[name="firstName"]').should('be.visible').clear().type('Joca');
  cy.contains('Save').should('be.visible').click();
});

/**
 * Add a new account
 */
Cypress.Commands.add('CreateAccount', () => {
  cy.get('button[aria-label="open drawer"]').should('be.visible').click();
  cy.contains('Employee Bank Accounts').should('be.visible').click();

  cy.contains('Add').should('be.visible').click();

  cy.contains('Choose the account you want to create') 
    .parent()
    .find('[role="combobox"]')
    .should('be.visible')
    .click();

  // Select the first option from the list
  cy.get('[role="listbox"] [role="option"]').eq(1).should('be.visible').click();

  cy.contains('Choose the type of account you want to create') 
    .parent()
    .find('[role="combobox"]')
    .should('be.visible')
    .click();

  // Select the first option from the list
  cy.get('[role="listbox"] [role="option"]').eq(1).should('be.visible').click();
  
  cy.contains('Continue').should('be.visible').click();

  cy.contains('Choose a customer') 
    .parent()
    .find('[role="combobox"]')
    .should('be.visible')
    .click();

  // Select the first option from the list
  cy.get('[role="listbox"] [role="option"]').eq(1).should('be.visible').click();

  cy.contains('Make a card').should('be.visible').click();
  cy.get('input[type="number"]').first().should('be.visible').clear().type('99999');
  cy.contains('Confirm').should('be.visible').click();
});

Cypress.Commands.add('denyLoan', () => {
  cy.get('button[aria-label="open drawer"]').should('be.visible').click();
  cy.contains('Loans').should('be.visible').click();
  cy.contains('Pending Loans').should('be.visible').click();

  cy.get('[data-rowindex="0"]').should('be.visible').within(() => {
    cy.contains('Deny').should('be.visible').click();
  });
});

Cypress.Commands.add('blockCard', () => {
  cy.get('button[aria-label="open drawer"]').should('be.visible').click();
  cy.contains('Employee Bank Accounts').should('be.visible').click();
  cy.get('.MuiDataGrid-row--firstVisible > [data-field="accountNumber"]').click();
  cy.get(':nth-child(1) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
  });