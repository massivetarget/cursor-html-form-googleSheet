// स्प्रेडशीट ID को यहाँ रखें
const SPREADSHEET_ID = '1Uva4DQWR-7RF9qIsCfDe6wZgjYzr9nC7ZoMEoEo1_uA';
const SHEET_NAME = 'Entries';
const ACCOUNTS_SHEET_NAME = 'CharOfAccounts';

function doPost(e) {
  try {
    // JSON डेटा को पार्स करें
    const data = JSON.parse(e);

    console.log(data);
    
    // स्प्रेडशीट खोलें
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // यदि शीट मौजूद नहीं है तो नई बनाएं
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // हेडर रो जोड़ें
      sheet.getRange(1, 1, 1, 7).setValues([['Date', 'Debit Account', 'Debit Amount', 'Debit Description', 'Credit Account', 'Credit Amount', 'Credit Description']]);
    }
    
    // डेटा को एक पंक्ति में जोड़ें
    const newRow = [
      data.date,
      data.debitAccount,
      data.debitAmount,
      data.debitDescription,
      data.creditAccount,
      data.creditAmount,
      data.creditDescription
    ];
    
    // अंतिम पंक्ति में डेटा जोड़ें
    const lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);
    
    // सफल प्रतिक्रिया भेजें
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // त्रुटि प्रतिक्रिया भेजें
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('ડબલ એન્ટ્રી એકાઉન્ટિંગ ફોર્મ')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processForm(data) {
  try {
    // स्प्रेडशीट खोलें
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // यदि शीट मौजूद नहीं है तो नई बनाएं
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // हेडर रो जोड़ें
      sheet.getRange(1, 1, 1, 7).setValues([['Date', 'Debit Account', 'Debit Amount', 'Debit Description', 'Credit Account', 'Credit Amount', 'Credit Description']]);
    }
    
    // डेटा को एक पंक्ति में जोड़ें
    const newRow = [
      data.date,
      data.debitAccount,
      data.debitAmount,
      data.debitDescription,
      data.creditAccount,
      data.creditAmount,
      data.creditDescription
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

// Get all accounts from CharOfAccounts sheet
function getAccounts() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let accountsSheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!accountsSheet) {
      accountsSheet = spreadsheet.insertSheet(ACCOUNTS_SHEET_NAME);
      accountsSheet.getRange(1, 1, 1, 2).setValues([['Account Name', 'Account Type']]);
      return [];
    }
    
    // Get all account names
    const data = accountsSheet.getDataRange().getValues();
    const headers = data[0];
    const accounts = data.slice(1).map(row => row[0]); // Get first column (Account Name)
    
    return accounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
}

// Add new account to CharOfAccounts sheet
function addNewAccount(accountName, accountType) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let accountsSheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!accountsSheet) {
      accountsSheet = spreadsheet.insertSheet(ACCOUNTS_SHEET_NAME);
      accountsSheet.getRange(1, 1, 1, 2).setValues([['Account Name', 'Account Type']]);
    }
    
    // Add new account
    const lastRow = Math.max(accountsSheet.getLastRow(), 1);
    accountsSheet.getRange(lastRow + 1, 1, 1, 2).setValues([[accountName, accountType]]);
    
    return true;
  } catch (error) {
    console.error('Error adding new account:', error);
    throw new Error('Error adding new account: ' + error.toString());
  }
} 