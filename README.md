//Password Vault Web Application Setup
// IT21301018 | IT21204784

Follow these steps to set up and run the Password Vault web application on your local machine.

//Prerequisites
Ensure you have the following installed:
- Node.js (version 12 or higher)
- NPM (Node Package Manager, usually comes with Node.js)

//Setup Instructions

Step 1: Clone the Repository
1. Open Windows PowerShell.
2. Run the following command to clone the repository:
 
    git clone <repository_url>
   
3. Navigate to the project folder:
   
    cd <repository_folder>
  

Step 2: Install Dependencies
1. In the project folder, install the necessary dependencies by running:
    
    npm install
  

Step 3: Start the Application
1. Start the application by running the following command:
    
    node .\passwordmanager.js
    
2. You will see an HTTP address displayed in the PowerShell window, typically `http://localhost:3000`.

Step 4: Access the Web Application
1. Open your preferred web browser.
2. Enter the provided HTTP address (`http://localhost:3000`) in the browser's address bar.
3. The user interface for the Password Vault web application will be displayed.


//Run & test
- To create a new account - select the option of creating a new wallet by providing a username and the password which would prompt you to enter a master key for the vault ensuring the password policy implemented.
- To add a password - After creating the account , you can add the passwords and the usernames to the relevant site which would then store such added passwords in an encrypted file.
- To view the added passwords - You can view the added passwords by entering the relevant username and masterkey
- If the entered master key is wrong it would just create another vault with that password.





