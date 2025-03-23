# Double Entry Accounting Form

A web-based double-entry accounting form application built with HTML, JavaScript, and Google Apps Script. The application allows users to create and manage accounting entries with debit and credit transactions.

## Features

- **Double Entry System**: Create accounting entries with matching debit and credit transactions
- **Dynamic Entry Management**: Add and remove multiple entries as needed
- **Account Management**: Create and manage different types of accounts
- **Real-time Validation**: Automatic validation of debit and credit totals
- **Gujarati Interface**: User interface in Gujarati language
- **Responsive Design**: Works on both desktop and mobile devices

## Account Types

The system supports the following account types:
- Assets (સંપત્તિ)
- Liabilities (દેવું)
- Equity (ઇક્વિટી)
- Revenue (આવક)
- Expense (ખર્ચ)

## Technical Details

### Frontend
- Pure HTML and JavaScript implementation
- No external CSS frameworks
- Responsive design using viewport meta tags
- Form validation and dynamic content management

### Backend Integration
- Uses Google Apps Script for server-side operations
- Handles account management and data storage
- Provides API endpoints for:
  - Loading accounts
  - Adding new accounts
  - Submitting entries

### Key Functions

1. **Account Management**
   - `loadAccounts()`: Fetches existing accounts from server
   - `addNewAccount()`: Creates new accounts with validation
   - `updateAccountDropdowns()`: Updates all account selection dropdowns

2. **Entry Management**
   - `addEntry()`: Adds new entry sections dynamically
   - `removeEntry()`: Removes existing entries
   - `validateTotalAmounts()`: Ensures debit and credit totals match

3. **Form Handling**
   - `handleFormSubmit()`: Processes form submission
   - `setTodayDate()`: Sets current date in date field
   - `handleAccountSelect()`: Manages account selection events

## Usage

1. **Creating Entries**
   - Select a date for the entry
   - Choose debit and credit accounts
   - Enter amounts and descriptions
   - Add more entries if needed

2. **Managing Accounts**
   - Select "+ નવું એકાઉન્ટ" to create new accounts
   - Choose account type from predefined categories
   - Enter account name and save

3. **Submitting Data**
   - Verify that debit and credit totals match
   - Click "સબમિટ કરો" to submit entries
   - System validates and saves the data

## Error Handling

- Validates required fields
- Ensures debit and credit totals match
- Prevents duplicate account creation
- Shows error messages in Gujarati

## Dependencies

- Google Apps Script backend
- No external JavaScript libraries required

## Browser Support

- Works on modern web browsers
- Mobile-responsive design
- Touch-friendly interface

## Future Enhancements

- Add data export functionality
- Implement user authentication
- Add transaction history view
- Include data backup features
- Add multi-language support

## Contributing

Feel free to submit issues and enhancement requests!

## સિસ્ટમ ઓવરવ્યુ

આ સિસ્ટમ ડબલ એન્ટ્રી એકાઉન્ટિંગના મૂળભૂત સિદ્ધાંતો પર આધારિત છે:

- દરેક વ્યવહાર માટે ઓછામાં ઓછી એક ડેબિટ અને એક ક્રેડિટ એન્ટ્રી હોવી જરૂરી છે
- ડેબિટ અને ક્રેડિટની કુલ રકમ હંમેશા સમાન હોવી જોઈએ
- દરેક એન્ટ્રી માટે તારીખ અને વર્ણન જરૂરી છે
- એકાઉન્ટ્સ ચાર્ટ ઓફ એકાઉન્ટ્સમાં વ્યવસ્થિત રીતે જાળવવામાં આવે છે

સિસ્ટમ Google Apps Script અને Google Sheets નો ઉપયોગ કરે છે:

- ફ્રન્ટએન્ડ: HTML ફોર્મ અને JavaScript
- બેકએન્ડ: Google Apps Script
- ડેટાબેઝ: Google Sheets

## વિશેષતાઓ

- મલ્ટિપલ ડેબિટ અને ક્રેડિટ એન્ટ્રીઓનો સપોર્ટ
- ડેબિટ અને ક્રેડિટ એન્ટ્રીઓની સિંક્રનાઇઝેશન
- એકાઉન્ટ્સનું ડાયનેમિક મેનેજમેન્ટ 
- Google શીટ્સમાં ડેટા સ્ટોરેજ
- સરળ અને સહજ UI
- આજની તારીખ ડિફોલ્ટ સેટિંગ
- વેલિડેશન ચેક્સ (ડેબિટ = ક્રેડિટ)

## સેટઅપ

1. નવી Google શીટ બનાવો
2. Tools > Script editor પર જાઓ
3. code.gs અને index.html ફાઇલો કૉપી કરો
4. SPREADSHEET_ID ને તમારી શીટના ID સાથે અપડેટ કરો
5. Deploy > New deployment પર ક્લિક કરો
6. વેબ એપ્લિકેશન તરીકે ડિપ્લોય કરો

## ઉપયોગ

- ફોર્મમાં તારીખ, એકાઉન્ટ્સ અને રકમ દાખલ કરો
- નવા એકાઉન્ટ્સ ઉમેરવા માટે "નવું એકાઉન્ટ" ઓપ્શન વાપરો
- મલ્ટિપલ એન્ટ્રીઓ માટે "+ નવી ડેબિટ એન્ટ્રી" અથવા "+ નવી ક્રેડિટ એન્ટ્રી" બટન વાપરો
- દરેક એન્ટ્રીને દૂર કરવા માટે "×" બટન વાપરો
- ડેબિટ અને ક્રેડિટની કુલ રકમ સમાન હોવી જોઈએ
- એન્ટ્રીઓ Google શીટમાં સેવ થશે

## કોન્ટ્રિબ્યુશન

તમારા સૂચનો અને સુધારાઓનું સ્વાગત છે. કૃપા કરીને પુલ રિક્વેસ્ટ મોકલો અથવા ઇશ્યુ રિપોર્ટ કરો.

## ટેક્નિકલ વિગતો

### API એન્ડપોઇન્ટ્સ

- `doGet()`: HTML ફોર્મ રેન્ડર કરે છે
- `doPost()`: ફોર્મ ડેટા સબમિશન હેન્ડલ કરે છે
- `processForm()`: એન્ટ્રી ડેટા વેલિડેટ અને સેવ કરે છે
- `getAccounts()`: એકાઉન્ટ્સની લિસ્ટ મેળવે છે
- `addNewAccount()`: નવું એકાઉન્ટ ઉમેરે છે

### ડેટા સ્ટ્રક્ચર

સ્પ્રેડશીટમાં બે શીટ્સ છે:

1. Entries શીટ:
   - Date
   - Debit Account
   - Debit Amount 
   - Debit Description
   - [Blank Column]
   - Credit Account
   - Credit Amount
   - Credit Description

2. CharOfAccounts શીટ:
   - Account Name
   - Account Type

