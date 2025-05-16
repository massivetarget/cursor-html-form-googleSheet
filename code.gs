// स्प्रेडशीट कॉन्फ़िगरेशन
const SPREADSHEET_ID = '1Srh4YWV7preBHJaFzO0L32iseTeJzEQ9u9lNfiHEXDE';
const SHEET_NAME = 'Entries';
const ACCOUNTS_SHEET_NAME = 'CharOfAccounts';

/**
 * GET रिक्वेस्ट हैंडलर
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('ડબલ એન્ટ્રી એકાઉન્ટિંગ ફોર્મ')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * फॉर्म डेटा प्रोसेस करें
 */
function processForm(data) {
  try {
    console.log('Received form data:', JSON.stringify(data)); // Log the entire data object
    if (!data || !data.entries || !Array.isArray(data.entries)) {
      throw new Error('Invalid data format. Expected an object with an "entries" array.');
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.warn(`Sheet "${SHEET_NAME}" not found. Creating a new sheet.`);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 6).setValues([['ID', 'Date', 'Account', 'Description', 'Debit', 'Credit']]);
    }

    const entries = data.entries;
    console.log('Processing entries:', JSON.stringify(entries));
// डेबिट और क्रेडिट अमाउंट की मैचिंग चेक करें

// डेबिट और क्रेडिट अमाउंट की मैचिंग चेक करें
    let totalDebit = 0;
    let totalCredit = 0;

    entries.forEach(entry => {
      const debitAmount = parseFloat(entry.debitAmount) || 0;
      const creditAmount = parseFloat(entry.creditAmount) || 0;

      if (isNaN(debitAmount) || isNaN(creditAmount)) {
        throw new Error(`Invalid amount in entry: ${JSON.stringify(entry)}`);
      }

      totalDebit += debitAmount;
      totalCredit += creditAmount;
    });

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error(`Debit and Credit amounts do not match. Debit: ${totalDebit}, Credit: ${totalCredit}`);
    }

    const rows = [];
    entries.forEach((entry, index) => {
      const entryId = `ENT${Date.now()}_${index + 1}`;
      rows.push([
        entryId,
        entry.date,
        entry.debitAccount,
        entry.debitDescription,
        entry.debitAmount,
        ''
      ]);
      rows.push([
        entryId,
        entry.date,
        entry.creditAccount,
        entry.creditDescription,
        '',
        entry.creditAmount
      ]);
    });

    console.log('Prepared rows for insertion:', JSON.stringify(rows));

    const lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.getRange(lastRow + 1, 1, rows.length, 6).setValues(rows);

    console.log('Data written successfully to the sheet.');
    return true;
  } catch (error) {
    console.error('Error in processForm:', error.message, error.stack);
    throw new Error('Error processing form data: ' + error.message);
  }
}

/**
 * सभी अकाउंट्स प्राप्त करें
 */
function getAccounts() {
  try {
    console.log('Starting getAccounts function');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet opened successfully');
    
    const sheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    if (!sheet) {
      console.error('CharOfAccounts sheet not found');
      return [];
    }
    console.log('Sheet found successfully');
    
    const data = sheet.getDataRange().getValues();
    console.log('Data retrieved:', data);
    
    const accounts = data.slice(1)
      .map(row => row[0])
      .filter(account => account && account.trim() !== '');
    
    console.log('Filtered accounts:', accounts);
    return accounts;
  } catch (error) {
    console.error('Error in getAccounts:', error);
    return [];
  }
}

/**
 * सब अकाउंट्स प्राप्त करें
 */
function getSubAccounts() {
  try {
    console.log('Starting getSubAccounts function');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet opened successfully');
    
    const sheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    if (!sheet) {
      console.error('CharOfAccounts sheet not found');
      return [];
    }
    console.log('Sheet found successfully');
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    console.log('All column headers:', headers);
    
    // सभी कॉलम नेम्स को लॉग करें
    headers.forEach((header, index) => {
      console.log(`Column ${index}: ${header}`);
    });
    
    // "Sub Accounts" कॉलम को खोजें
    const subAccountsIndex = headers.findIndex(header => 
      header.toLowerCase().includes('sub') && 
      header.toLowerCase().includes('account')
    );
    
    console.log('Found sub accounts column index:', subAccountsIndex);
    
    if (subAccountsIndex === -1) {
      console.error('Sub Accounts column not found. Available columns:', headers);
      return [];
    }
    
    // सभी सब-अकाउंट्स को एकत्रित करें
    const subAccounts = new Set();
    data.slice(1).forEach(row => {
      const subAccount = row[subAccountsIndex];
      if (subAccount && subAccount.trim() !== '') {
        subAccounts.add(subAccount.trim());
      }
    });
    
    const uniqueSubAccounts = Array.from(subAccounts);
    console.log('Found unique sub accounts:', uniqueSubAccounts);
    return uniqueSubAccounts;
  } catch (error) {
    console.error('Error in getSubAccounts:', error);
    return [];
  }
}

/**
 * नया अकाउंट जोड़ें
 */
function addAccount(name, type) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(ACCOUNTS_SHEET_NAME);
      sheet.getRange(1, 1, 1, 2).setValues([['Account Name', 'Account Type']]);
    }
    
    // चेक करें कि अकाउंट पहले से मौजूद तो नहीं है
    const data = sheet.getDataRange().getValues();
    const existingAccounts = data.slice(1).map(row => row[0]);
    
    if (existingAccounts.includes(name)) {
      throw new Error('આ એકાઉન્ટ પહેલાથી જ અસ્તિત્વ ધરાવે છે');
    }
    
    const lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.getRange(lastRow + 1, 1, 1, 2).setValues([[name, type]]);
    
    return true;
  } catch (error) {
    console.error('Error adding new account:', error);
    throw error;
  }
}