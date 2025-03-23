// स्प्रेडशीट ID को यहाँ रखें
const SPREADSHEET_ID = '1Uva4DQWR-7RF9qIsCfDe6wZgjYzr9nC7ZoMEoEo1_uA';
const SHEET_NAME = 'Entries';

function doPost(e) {
  try {
    // JSON डेटा को पार्स करें
    const data = JSON.parse(e.postData.contents);

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
      .setTitle('डबल एंट्री अकाउंटिंग फॉर्म')
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

//============================OLD code===================


// // स्प्रेडशीट ID को यहाँ रखें
// const SPREADSHEET_ID = '1Uva4DQWR-7RF9qIsCfDe6wZgjYzr9nC7ZoMEoEo1_uA';
// const SHEET_NAME = 'Entries';

// function doPost(e) {

//     // var messages = ("this is log")
//     var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
//     var sheet = spreadsheet.getSheetByName(SHEET_NAME);

//     const spreadsheetID = spreadsheet.getId();
//     const allSheet = spreadsheet.getSheets().map((sheet) => sheet.getName());
//     const allSheetID = spreadsheet.getSheets().map((sheet) => sheet.getSheetId());    //    .getSheets().map((sheet) => sheet.getName());
//     const allSheetName = spreadsheet.getSheets().map((sheet) => sheet.getSheetName());   // SheetId());
//     const cellvalue = sheet.getDataRange().getValues();
//     var data = JSON.parse(e);

//     var sheetValues = {
//       sheetname: sheet.getSheetName(),
//       // sheets: spreadsheet.getSheets(),
//       //sheetValue: sheet.getRange().getValues(),   //.getDataRange().getValues(),
//       // sheetID: sheet.getSheetId()
//     };
    
//     console.log({
//       // // messages,
//       // spreadsheetID,
//       // allSheet,
//       // allSheetID,
//       // allSheetName
//       // sheetValues
//       // ssSts
//       cellvalue,
//       data
//     });

//           // हेडर रो जोड़ें
//     sheet.getRange(1, 1, 1, 4).setValues([['Date', 'Type', 'Amount', 'Description']]);

//   try {
//     // JSON डेटा को पार्स करें
//     var data = JSON.parse(e);
//     // var data = JSON.parse(e.postData.contents);   old 

//     var messages = ("this is log")

    
//     // स्प्रेडशीट खोलें

    


//     // यदि शीट मौजूद नहीं है तो नई बनाएं
//     if (!sheet) {
//       sheet = spreadsheet.insertSheet(SHEET_NAME);
//       // हेडर रो जोड़ें
//       sheet.getRange(1, 1, 1, 4).setValues([['Date', 'Type', 'Amount', 'Description']]);
//     }
    
//     // डेटा को एक पंक्ति में जोड़ें
//     const newRow = [
//       data.date,
//       data.type,
//       data.amount,
//       data.description
//     ];
    
//     // अंतिम पंक्ति में डेटा जोड़ें
//     const lastRow = Math.max(sheet.getLastRow(), 1);
//     sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);
    
//     // सफल प्रतिक्रिया भेजें
//     return ContentService.createTextOutput(JSON.stringify({
//       'status': 'success',
//       'message': 'Data saved successfully'
//     })).setMimeType(ContentService.MimeType.JSON);
    
//   } catch (error) {
//     // त्रुटि प्रतिक्रिया भेजें
//     return ContentService.createTextOutput(JSON.stringify({
//       'status': 'error',
//       'message': error.toString()
//     })).setMimeType(ContentService.MimeType.JSON);
//   }
// }

// function doGet() {
//   return HtmlService.createHtmlOutputFromFile('index')
//       .setTitle('डेबिट क्रेडिट एंट्री फॉर्म')
//       .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
// } 