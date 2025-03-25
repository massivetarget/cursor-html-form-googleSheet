// स्प्रेडशीट ID को यहाँ रखें
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'Entries';
const ACCOUNTS_SHEET_NAME = 'CharOfAccounts';

/**
 * POST रिक्वेस्टने हैंडल करें
 * फॉर्म डेटाको स्प्रेडशीटमें सेव करें
 */
function doPost(e) {
  try {
    // Parse JSON data
    const data = JSON.parse(e);
    console.log(data);
    
    // Open spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add header row with new column structure
      sheet.getRange(1, 1, 1, 6).setValues([['ID', 'Date', 'Account', 'Description', 'Debit', 'Credit']]);
    }
    
    // Create rows for both debit and credit entries
    const rows = [
      // Debit entry
      [
        Utilities.getUuid(), // Generate unique ID
        data.date,
        data.debitAccount,
        data.debitDescription,
        data.debitAmount,
        '' // Empty credit amount
      ],
      // Credit entry
      [
        Utilities.getUuid(), // Generate unique ID
        data.date,
        data.creditAccount,
        data.creditDescription,
        '', // Empty debit amount
        data.creditAmount
      ]
    ];
    
    // Add data to the last row
    const lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.getRange(lastRow + 1, 1, rows.length, 6).setValues(rows);
    
    // Return success message
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error message
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET रिक्वेस्टने हैंडल करें
 * HTML फॉर्म वापस भेजें
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('डेबिट क्रेडिट एंट्री फॉर्म')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * फॉर्म डेटाको प्रोसेस करें और स्प्रेडशीटमें सेव करें
 * @param {Object} data - फॉर्म डेटा
 * @return {boolean} - सफलता स्थिति
 */
function processForm(data) {
  try {
    // स्प्रेडशीट खोलें
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // यदि शीट मौजूद नहीं है तो नई बनाएं
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // हेडर रो जोड़ें
      sheet.getRange(1, 1, 1, 4).setValues([['Date', 'Type', 'Amount', 'Description']]);
    }
    
    // डेटा को एक पंक्ति में जोड़ें
    const newRow = [
      data.date,
      data.type,
      data.amount,
      data.description
    ];
    
    // अंतिम पंक्ति में डेटा जोड़ें
    const lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);
    
    return true; // सफलता का संकेत
    
  } catch (error) {
    console.error('Error in processForm:', error);
    throw new Error('डेटा सेव करने में त्रुटि: ' + error.toString());
  }
}

/**
 * CharOfAccounts शीटसे सभी खाते प्राप्त करें
 * @return {Array} - खाता नामोंकी सूची
 */
function getAccounts() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let accountsSheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    
    // यदि शीट मौजूद नहीं है तो नई बनाएं
    if (!accountsSheet) {
      accountsSheet = spreadsheet.insertSheet(ACCOUNTS_SHEET_NAME);
      accountsSheet.getRange(1, 1, 1, 2).setValues([['Account Name', 'Account Type']]);
      return [];
    }
    
    // सभी खाता नाम प्राप्त करें
    const data = accountsSheet.getDataRange().getValues();
    const headers = data[0];
    const accounts = data.slice(1).map(row => row[0]); // पहला कॉलम (खाता नाम) प्राप्त करें
    
    return accounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
}

/**
 * CharOfAccounts शीटमें नया खाता जोड़ें
 * @param {string} accountName - खाताका नाम
 * @param {string} accountType - खाताका प्रकार
 * @return {boolean} - सफलता स्थिति
 */
function addNewAccount(accountName, accountType) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let accountsSheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    
    // यदि शीट मौजूद नहीं है तो नई बनाएं
    if (!accountsSheet) {
      accountsSheet = spreadsheet.insertSheet(ACCOUNTS_SHEET_NAME);
      accountsSheet.getRange(1, 1, 1, 2).setValues([['Account Name', 'Account Type']]);
    }
    
    // नया खाता जोड़ें
    const lastRow = Math.max(accountsSheet.getLastRow(), 1);
    accountsSheet.getRange(lastRow + 1, 1, 1, 2).setValues([[accountName, accountType]]);
    
    return true;
  } catch (error) {
    console.error('Error adding new account:', error);
    throw new Error('नया खाता जोड़ने में त्रुटि: ' + error.toString());
  }
}

function getSubAccounts() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    
    if (!sheet) {
      console.error('CharOfAccounts sheet not found');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const subAccounts = [];
    
    // Find the index of "Sub Accounts" column
    const subAccountsIndex = headers.findIndex(header => header === 'Sub Accounts');
    if (subAccountsIndex === -1) {
      console.error('Sub Accounts column not found');
      return [];
    }
    
    // Get unique values from Sub Accounts column
    for (let i = 1; i < data.length; i++) {
      const subAccount = data[i][subAccountsIndex];
      if (subAccount && !subAccounts.includes(subAccount)) {
        subAccounts.push(subAccount);
      }
    }
    
    return subAccounts;
  } catch (error) {
    console.error('Error in getSubAccounts:', error);
    return [];
  }
}