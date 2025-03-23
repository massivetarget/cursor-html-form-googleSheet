// સ્પ્રેડશીટ ID અને શીટ નેમ્સની વ્યાખ્યા
const SPREADSHEET_ID = '1Uva4DQWR-7RF9qIsCfDe6wZgjYzr9nC7ZoMEoEo1_uA';
const SHEET_NAME = 'Entries';
const ACCOUNTS_SHEET_NAME = 'CharOfAccounts';

/**
 * POST રિક્વેસ્ટને હેન્ડલ કરે છે
 * ફોર્મ ડેટાને સ્પ્રેડશીટમાં સેવ કરે છે
 */
function doPost(e) {
  try {
    // JSON ડેટાને પાર્સ કરો
    const data = JSON.parse(e);
    console.log(data);
    
    // સ્પ્રેડશીટ ખોલો
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // જો શીટ અસ્તિત્વમાં નથી તો નવી બનાવો
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // હેડર રો ઉમેરો
      sheet.getRange(1, 1, 1, 7).setValues([['Date', 'Debit Account', 'Debit Amount', 'Debit Description', 'Credit Account', 'Credit Amount', 'Credit Description']]);
    }
    
    // ડેટાને એક પંક્તિમાં ઉમેરો
    const newRow = [
      data.date,
      data.debitAccount,
      data.debitAmount,
      data.debitDescription,
      data.creditAccount,
      data.creditAmount,
      data.creditDescription
    ];
    
    // છેલ્લી પંક્તિમાં ડેટા ઉમેરો
    const lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);
    
    // સફળતા સંદેશ પાછો મોકલો
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // ભૂલ સંદેશ પાછો મોકલો
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET રિક્વેસ્ટને હેન્ડલ કરે છે
 * HTML ફોર્મ પાછું મોકલે છે
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('ડબલ એન્ટ્રી એકાઉન્ટિંગ ફોર્મ')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ફોર્મ ડેટાને પ્રોસેસ કરે છે અને સ્પ્રેડશીટમાં સેવ કરે છે
 * @param {Object} data - ફોર્મ ડેટા
 * @return {boolean} - સફળતા સ્થિતિ
 */
function processForm(data) {
  try {
    // સ્પ્રેડશીટ ખોલો
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // જો શીટ અસ્તિત્વમાં નથી તો નવી બનાવો
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // હેડર રો ઉમેરો
      sheet.getRange(1, 1, 1, 7).setValues([['Date', 'Debit Account', 'Debit Amount', 'Debit Description', 'Credit Account', 'Credit Amount', 'Credit Description']]);
    }
    
    // ડેટાને એક પંક્તિમાં ઉમેરો
    const newRow = [
      data.date,
      data.debitAccount,
      data.debitAmount,
      data.debitDescription,
      data.creditAccount,
      data.creditAmount,
      data.creditDescription
    ];
    
    // છેલ્લી પંક્તિમાં ડેટા ઉમેરો
    const lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);
    
    return true; // સફળતા સ્થિતિ
    
  } catch (error) {
    console.error('Error in processForm:', error);
    throw new Error('ડેટા સેવ કરવામાં ભૂલ: ' + error.toString());
  }
} 

/**
 * CharOfAccounts શીટમાંથી બધા એકાઉન્ટ્સ મેળવે છે
 * @return {Array} - એકાઉન્ટ નેમ્સની લિસ્ટ
 */
function getAccounts() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let accountsSheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    
    // જો શીટ અસ્તિત્વમાં નથી તો નવી બનાવો
    if (!accountsSheet) {
      accountsSheet = spreadsheet.insertSheet(ACCOUNTS_SHEET_NAME);
      accountsSheet.getRange(1, 1, 1, 2).setValues([['Account Name', 'Account Type']]);
      return [];
    }
    
    // બધા એકાઉન્ટ નેમ્સ મેળવો
    const data = accountsSheet.getDataRange().getValues();
    const headers = data[0];
    const accounts = data.slice(1).map(row => row[0]); // પહેલો કૉલમ (એકાઉન્ટ નામ) મેળવો
    
    return accounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
}

/**
 * CharOfAccounts શીટમાં નવું એકાઉન્ટ ઉમેરે છે
 * @param {string} accountName - એકાઉન્ટનું નામ
 * @param {string} accountType - એકાઉન્ટનો પ્રકાર
 * @return {boolean} - સફળતા સ્થિતિ
 */
function addNewAccount(accountName, accountType) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let accountsSheet = spreadsheet.getSheetByName(ACCOUNTS_SHEET_NAME);
    
    // જો શીટ અસ્તિત્વમાં નથી તો નવી બનાવો
    if (!accountsSheet) {
      accountsSheet = spreadsheet.insertSheet(ACCOUNTS_SHEET_NAME);
      accountsSheet.getRange(1, 1, 1, 2).setValues([['Account Name', 'Account Type']]);
    }
    
    // નવું એકાઉન્ટ ઉમેરો
    const lastRow = Math.max(accountsSheet.getLastRow(), 1);
    accountsSheet.getRange(lastRow + 1, 1, 1, 2).setValues([[accountName, accountType]]);
    
    return true;
  } catch (error) {
    console.error('Error adding new account:', error);
    throw new Error('નવું એકાઉન્ટ ઉમેરવામાં ભૂલ: ' + error.toString());
  }
} 