export const MoneyRecord = [
        {           
            id:1,
            title:"Introduction",
            description:"\"MoneyRecord\" is a personal finance management app that allows you to record and analyze your daily expenses by month. \n\nIt helps you manage your personal finances by visualizing your spending through charts. \n\nIn addition, travel expenses can be recorded separately. Beyond tracking your own spending, you can also record and analyze your friends' expenses by the end of the trip. \n\nIt is convenience to split and calculate travel expenses with your friends.",
            image:"moneyicon.png"
        },
        {
            id:2,
            title:"Tech Used",
            description:"1. Flutter\nThe foundation programming code of the application which constructs the UI/UX. \n\n2. Hive\nThe database constructs on the local device which provides the NoSql storing environment. \nBesides, JSON is used to import and export the data if the data is required to be transported between devices. \n\n3. Netlify\nThe service provides the hosting environment for the application.",
            image:"flutterNhiveNnetlify.png"
        },
        {
            id:3,
            title:"Daily Home Page",
            description:"This is the Home page of daily records. \n\n1. Drawer which provides access the Daily records, Travel records and Data settings. \n\n2. Pressable title which shows and allows to change the month and year of the charts shows below. \n\n3. Charts analyze the expenses in the chosen date. \n\n4. \"+\" button navigates to a page of creating a new daily expense record. \n\n5. The navigation bar provides navigation between home page and detail page.",
            image:"DailyHome.jpg"
        },
        {
            id:4,
            title:"Record Creating Page",
            description:"A new record can be created by filling out the form. \n\n1. The dropdown menu provides access to 5 expense categories. \n\n2. The text field accepts a record name of up to 20 characters. \n\n3. The text field only accepts numbers and one decimal point for the record amount. \n\n4. The date picker pops up to select the date of the record. \n\n5. The buttons are for saving and canceling the record.",
            image:"DailyCreate.jpg"
        },
        {
            id:5,
            title:"Record Page",
            description:"Record Page lists out the records of the selected date range by the categories of expenses. \n\n 1. The pressable button shows and allows to change the date range of the records. \n\n2. The pressable button deletes all records in the selected date range. \n\n3. The swipeable info card shows the analyzed information of the selected categories of records \n\n4. The info cards shows information of records. \n\n5. The pressable button provides access to the edit windown of the selected record.",
            image:"DailyRecord.jpg"
        },
        {
            id:6,
            title:"Selected Records",
            description:"By pressing the info card for half second, selected mode shows up. \n\n1. The circle buttton provides access to the selected record. \n\n2. The pressable button deletes the selected record.",
            image:"DailySelects.jpg"
        },
        {
            id:7,
            title:"Edit Window",
            description:"The edit window shows the detail of the record. \n\n1. The editable text fields shows the original information of the record and can be changed. \n\n2. The buttons are for saving and canceling the changes of the record.",
            image:"DailyEdit.jpg"
        },
        {
            id:8,
            title:"Drawer",
            description:"The drawer provides navigations to pages. \n\n1. The pressable title provides a route to daily expense page. \n\n2. The pressable title provides a route to travel expense page. \n\n3. The pressable title provides a route to data settings page.",
            image:"DailyDrawer.jpg"
        },
        {
            id:9,
            title:"Travel Home Page",
            description:"The travel home page lists out all the trips and information as cards. \n\n1. The pressable button navigates to a window of creating a new trip. \n\n2. The pressable button shows the trip information and navigates to the record page of the trip.",
            image:"TravelHome.jpg"
        },
        {
            id:10,
            title:"Create Trip Window",
            description:"The pop-up window provides access to create a new trip record. \n\n1. The text fields takes the information of the trip. \n\n2. The pressable button adds partners of the trip by entering their names in the appended text field. \n\n3. The buttons are for saving and canceling the trip record.",
            image:"TravelCreateTrip.jpg"
        },
        {
            id:11,
            title:"Travel Record Page",
            description:"The record page is similar to the daily record page. Besides, it shows the information of the trip. \n\n1. The information card shows the details of the trip and the total expenses of the trip. \n\n2. The button provides access to edit the trip record. \n\n3. The swipeable text can be used to switch to personal expense and group expense. \n\n4. The information cards are similar to the daily record page which shows the expense records. \n\n5. The navigation bar provides navigation between home page and detail page. \n\n6. The pressable button provides access to the expense record creation window.",
            image:"TravelRecord.jpg"
        },
        {
            id:12,
            title:"Create Expense Record Window",
            description:"The pop-up window provides access to create a new expense record. \n\n1. The text fields takes the information of the expense record as daily record. \n\n2. The expense sharing field provides access to input the amount of each person, the one who paid whole amount of the expense and who pay back. \n\n3. The buttons are for saving and canceling the expense record.",
            image:"TravelCreateExpense.jpg"
        },
        {
            id:13,
            title:"Travel Trip Edit Window",
            description:"The pop-up window provides access to edit the trip record. \n\n1. The text fields takes the information of the trip record. \n\n2. The partner field provides access to edit and add the names of the trip partners. \n\n3. The buttons are for saving and canceling the trip record.",
            image:"TravelEditTrip.jpg"
        },
        {
            id:14,
            title:"Travel Expense Edit Window",
            description:"The pop-up window provides access to edit the expense record. \n\n1. The text fields takes and edit the information of the expense record. \n\n2. The expense sharing field provides access to edit the amount of each person, the one who paid whole amount of the expense and who pay back. \n\n3. The buttons are for saving and canceling the expense record.",
            image:"TravelEditExpense.jpg"
        },
        {
            id:15,
            title:"Selected Records",
            description:"By pressing the info card for half second, selected mode shows up. It is same to the selected mode in daily record page.",
            image:"TravelSelect.jpg"
        },
        {
            id:16,
            title:"Data Setting Page",
            description:"The data setting page provides data exporting, importing and deleting features. \n\n1. The pressable buttons are used to export and import data to and from file on the owners' device. \n\n2. The pressable buttons deletes all data from the local device.",
            image:"DataSettings.jpg"
        },
        

    ];

    export const Projects = [
        {
            id:1,
            name:"MoneyRecord",
            demo:"https://mymoneyrecord.netlify.app/",
            github:"",
            records: MoneyRecord
        }
    ];