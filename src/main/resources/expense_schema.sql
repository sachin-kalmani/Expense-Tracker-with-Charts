
-- this checks for the database if it exists or not if it is not then the database gets created
create database if not exists expense_tracker_with_charts;



-- this is for using the current desired database
use expense_tracker_with_charts; 




-- The Users table with userid as primary key holds the userinformation
CREATE TABLE if not exists USERS(
	USER_ID INT NOT NULL AUTO_INCREMENT,
    FIRSTNAME VARCHAR(155) NOT NULL,
    LASTNAME VARCHAR(155) NOT NULL,
    EMAIL VARCHAR(150) UNIQUE NOT NULL,
    PHONE VARCHAR(15) UNIQUE NOT NULL,
    PASSWORD VARCHAR(50) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(USER_ID)
    );
    
    


-- Expense table where all the information about expense is added user_id is used as foreign key to this table 
CREATE TABLE IF NOT EXISTS EXPENSE(
		EXPENSE_ID BIGINT NOT NULL auto_increment,
        USER_ID INT NOT NULL,
        AMOUNT FLOAT NOT NULL,
        CATEGORY VARCHAR(100) NOT NULL,
        EXPENSE_DESCRIPTION text,
		EXPENSE_RECORDTIME TIMESTAMP DEFAULT current_timestamp,
        PRIMARY KEY (EXPENSE_ID),
        FOREIGN KEY (USER_ID) references USERS(USER_ID) ON DELETE cascade);




-- Category table:- It list downs the categories based on the type income and expense
CREATE TABLE IF NOT EXISTS CATEGORY(
		CATEGORY_ID INT NOT NULL AUTO_INCREMENT,
		CATEGORY_NAME VARCHAR(100) NOT NULL,
        CATEGORY_TYPE ENUM('Income','Expense') NOT NULL, -- Differentiate the income and expense category
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(CATEGORY_ID));



-- alter the expense table adding the category-id as foreign key
ALTER TABLE EXPENSE modify COLUMN CATEGORY_ID INT NULL;
ALTER TABLE EXPENSE ADD CONSTRAINT FK_CATEGORY foreign key (CATEGORY_ID) references CATEGORY(CATEGORY_ID) ON DELETE cascade;


-- alter the expense table to add the user-category into the table
ALTER TABLE EXPENSE ADD COLUMN USER_CATEGORY_ID INT NULL;
ALTER TABLE EXPENSE ADD CONSTRAINT FK_USER_CATEGORY FOREIGN KEY (USER_CATEGORY_ID) references USER_CATEGORY(USER_CATEGORY_ID) ON DELETE SET NULL;

ALTER TABLE EXPENSE 
ADD CONSTRAINT chk_category_selection 
CHECK (CATEGORY_ID IS NULL OR USER_CATEGORY_ID IS NULL);


-- INCOME TABLE TO STORE THE INCOME OF USER SAME AS EXPENSE
CREATE TABLE IF NOT EXISTS INCOME(
		INCOME_ID BIGINT NOT NULL auto_increment,
        USER_ID INT NOT NULL,
        CATEGORY_ID INT NOT NULL,
        AMOUNT FLOAT NOT NULL,
        CATEGORY VARCHAR(100) NOT NULL,
        INCOME_DESCRIPTION text,
		INCOME_RECORDTIME TIMESTAMP DEFAULT current_timestamp,
        PRIMARY KEY (INCOME_ID),
        FOREIGN KEY (USER_ID) references USERS(USER_ID) ON DELETE cascade,
        FOREIGN KEY (CATEGORY_ID) references CATEGORY(CATEGORY_ID) ON DELETE CASCADE
        );
        
        
-- alter the expense table adding the category-id as foreign key
ALTER TABLE INCOME modify COLUMN CATEGORY_ID INT NULL;


ALTER TABLE INCOME ADD COLUMN USER_CATEGORY_ID INT NULL;
ALTER TABLE INCOME ADD CONSTRAINT FK_USER_CATEGORY_INCOME FOREIGN KEY (USER_CATEGORY_ID) references USER_CATEGORY(USER_CATEGORY_ID) ON DELETE SET NULL;



-- INSERTING SOME PREDEFINED CATEGORY INTO THE CATEGORY TABLE
INSERT ignore into CATEGORY (CATEGORY_NAME, CATEGORY_TYPE) VALUES
('Salary', 'Income'),
('Freelance Income', 'Income'),
('Investment Returns', 'Income'),
('Business Profits', 'Income'),
('Rental Income', 'Income'),
('Gifts', 'Income'),
('Bonuses', 'Income'),
('Interest Income', 'Income'),
('Pension', 'Income'),
('Scholarships & Grants', 'Income'),
('Rent/Mortgage', 'Expense'),
('Groceries', 'Expense'),
('Transport', 'Expense'),
('Insurance', 'Expense'),
('Loan Payments', 'Expense'),
('Medical Expenses', 'Expense'),
('Dining Out', 'Expense'),
('Entertainment', 'Expense'),
('Shopping', 'Expense'),
('Gym & Fitness', 'Expense'),
('Travel', 'Expense'),
('Hobbies', 'Expense'),
('Emergency Fund', 'Expense'),
('Investments', 'Expense');

-- user defined category
CREATE TABLE IF NOT EXISTS USER_CATEGORY(
		CATEGORY_ID INT NOT NULL AUTO_INCREMENT,
        USER_ID INT NOT NULL,
		CATEGORY_NAME VARCHAR(100) NOT NULL,
        CATEGORY_TYPE ENUM('Income','Expense') NOT NULL, -- Differentiate the income and expense category
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(CATEGORY_ID),
        foreign key (USER_ID) references USERS(USER_ID) ON DELETE CASCADE
        );


        