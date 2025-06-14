-- Use the correct database
USE expense_tracker_with_charts;

-- Clean tables (for repeatable tests)
DELETE FROM EXPENSE;
DELETE FROM CATEGORY;
DELETE FROM USERS;

-- Insert a test user
INSERT INTO USERS (FIRSTNAME, LASTNAME, EMAIL, PHONE, PASSWORD)
VALUES ('John', 'Doe', 'john.doe@example.com', '1234567890', 'password123');

-- Confirm user is inserted
SELECT * FROM USERS;

-- Get the inserted user_id
SET @USER_ID = LAST_INSERT_ID();

-- Insert predefined categories (null user_id)
INSERT INTO CATEGORY (CATEGORY_NAME, USER_ID)
VALUES 
('Food', NULL),
('Transport', NULL),
('Entertainment', NULL);

-- Insert a custom user-defined category
INSERT INTO CATEGORY (CATEGORY_NAME, USER_ID)
VALUES ('Custom Category', @USER_ID);

-- Confirm categories
SELECT * FROM CATEGORY;

-- Get category IDs
SELECT @PREDEFINED_CAT := CATEGORY_ID FROM CATEGORY WHERE CATEGORY_NAME = 'Food' LIMIT 1;
SELECT @CUSTOM_CAT := CATEGORY_ID FROM CATEGORY WHERE CATEGORY_NAME = 'Custom Category' LIMIT 1;

-- Insert expenses using both predefined and user-defined category
INSERT INTO EXPENSE (USER_ID, AMOUNT, CATEGORY_ID, EXPENSE_DESCRIPTION)
VALUES 
(@USER_ID, 150.75, @PREDEFINED_CAT, 'Groceries at Walmart'),
(@USER_ID, 50.00, @CUSTOM_CAT, 'Bought some tools');

-- Confirm expense entries
SELECT * FROM EXPENSE;

-- Validation
SELECT 
    E.EXPENSE_ID,
    U.FIRSTNAME,
    C.CATEGORY_NAME,
    E.AMOUNT,
    E.EXPENSE_DESCRIPTION,
    E.EXPENSE_RECORDTIME
FROM EXPENSE E
JOIN USERS U ON E.USER_ID = U.USER_ID
JOIN CATEGORY C ON E.CATEGORY_ID = C.CATEGORY_ID;

--  Cascading Delete 
DELETE FROM USERS WHERE USER_ID = @USER_ID;

-- Confirm cascading deletion
SELECT * FROM USERS;       
SELECT * FROM EXPENSE;     
SELECT * FROM CATEGORY;    
