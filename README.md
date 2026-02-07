Selenium Automation Testing Project using JavaScript
Project Summary

This project demonstrates hands-on experience in end-to-end automation testing using Selenium WebDriver with JavaScript and Node.js. The automation suite validates a real-world e-commerce user journey on the SauceDemo application, covering login, product handling, checkout flow, order confirmation, application reset, and secure logout.

The execution is intentionally slowed down to improve test stability, visibility, and debugging clarity.

Key Skills Demonstrated

Selenium WebDriver with JavaScript

Node.js based test execution

End-to-end test automation

Explicit wait and synchronization handling

UI interaction stability techniques

Assertion-driven validation

Reusable helper methods

Automation debugging and error handling

Application Under Test

SauceDemo E-commerce Application
Website: https://www.saucedemo.com

Test User: performance_glitch_user
Password: secret_sauce

Test Scenario Coverage

Automated User Journey

Launch the web application

Login using a performance glitch user account

Reset the application state using the menu

Sort products by name from Z to A

Select and add the first product to the cart

Verify selected product in cart

Navigate through checkout process

Enter customer details

Validate product name and total price on final checkout page

Complete the purchase

Verify successful order confirmation

Reset application state again

Log out securely

Validation Points

Successful navigation after login

Product consistency across inventory, cart, and checkout pages

Total price visibility and accuracy

Order completion success message

Logout confirmation via login screen visibility

Technical Stack

Programming Language: JavaScript

Automation Tool: Selenium WebDriver

Runtime Environment: Node.js

Browser: Google Chrome

Execution Strategy

The test execution is intentionally slowed using a reusable delay function to ensure UI stability, visibility, and reliable synchronization. Explicit waits are used instead of implicit waits to handle dynamic page behavior effectively.

Project Structure
automation-selenium
├── automationTest.js
├── package.json
├── package-lock.json
└── README.md

How to Run the Project
Prerequisites

Node.js version 18 or higher

Google Chrome browser

Installation
git clone https://github.com/your-username/automation-selenium.git
cd automation-selenium
npm install

Execution
node automationTest.js

Quality Engineering Practices

Clear and readable automation flow

Stable element interaction using explicit waits

JavaScript-based click handling for animations

Reusable helper functions for maintainability

Structured error handling and logging

Recruiter Notes

This project reflects practical exposure to automation testing workflows commonly used in software quality assurance roles. It demonstrates the ability to convert manual test scenarios into reliable automation scripts while maintaining readability, stability, and scalability.

Author

Refat Tamanna Ringky
Software Quality Assurance Trainee
Skilled in manual testing, Selenium automation, JavaScript, and performance testing

Career Objective

Seeking an entry-level or junior SQA role where I can contribute to quality-driven development, improve automation coverage, and grow professionally within a collaborative engineering environment.

License

This repository is created for learning, portfolio presentation, and technical evaluation purposes.