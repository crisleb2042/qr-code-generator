/* 
 CRISPEN LEBLANC | 20240724

This script demonstrates the integration of various npm packages and native Node.js modules to create a practical application:
1. Uses the inquirer npm package to get user input.
2. Uses the qr-image npm package to turn the user-entered URL into a QR code image.
3. Creates a txt file to save the user input using the native fs node module.

Principles learned from this project:
1. Modular Design: Separation of concerns between input handling, validation, and QR code generation.
2. Asynchronous Programming: Utilization of async/await for handling user input and file operations.
3. Input Validation: Implementation of a custom validator function for URL input with comprehensive checks.
4. Error Handling: Use of try-catch blocks for graceful error management in both validation and main execution.
5. Security Considerations: Validation to prevent potential injection attacks and ensure proper URL format.
6. External Library Integration: Utilization of npm packages (@inquirer/prompts, qr-image) for extended functionality.
7. File I/O Operations: Demonstration of both synchronous and asynchronous file writing using Node.js fs module.
8. User Interaction: Implementation of a command-line interface for user input.
9. Modern JavaScript Practices: Use of ES6+ syntax and module-based imports.
10. Single Responsibility Principle: Each function (validation, main execution) has a single, well-defined purpose.

*/

import {input} from '@inquirer/prompts';
import { URL } from 'url';
// Module based import; could select 'type:CommonJS' in package.json
// but modern syntax is 'type:module' based import
import qr from 'qr-image';
import fs from 'fs';

const confirmAnswerValidator = async (input) => {

    try {
        // Attempt to create URL object
        const url = new URL(input);

        // Check for allowed protocols
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return "Only http and https protocols are allowed.";
        }

        // Check for allowed characters to prevent injection attack
        const disallowed = /[<>'"{}()|\\^`]/;
        if (disallowed.test(url.hostname)) {
            return "URL contains disallowed characters."
        } return true;
    } catch (error) {
        // If URL parse fails, not a valid URL
        return "Invalid URL Format."
    }
}

const main = async () => {
    try {
const answer = await input({
    message: 'Type the URL you want to convert to QR Code:',
    validate: confirmAnswerValidator,
    });

    // Generates QR code image from node module 'qr-image'
    const qr_png = qr.image(answer);
    //Uses file system (fs) node module to write data to the specified file.
    qr_png.pipe(fs.createWriteStream('url.png'));
    // Asynchronously write data to the file
    fs.writeFile('url.txt', answer, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        });

    } catch (error){
        console.log("An error occurred.");
    }
}

main();

