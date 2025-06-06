-- The Users table with userid as primary key holds the userinformation
--use expense_tracker_with_charts;
--select * from users;
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

--use expense_tracker_with_charts;
--alter table users add column role varchar(50) not null default 'ROLE_USER';
--alter table users rename column role to ROLE;
--select * from users;
--ALTER TABLE users MODIFY password VARCHAR(255);

-- Expense table where all the information about expense is added user_id is used as foreign key to this table 
CREATE TABLE IF NOT EXISTS EXPENSE(
		EXPENSE_ID INT NOT NULL auto_increment,
        USER_ID INT NOT NULL,
        AMOUNT DECIMAL(10,3) NOT NULL,
        CATEGORY_ID INT NOT NULL,
        EXPENSE_DESCRIPTION text,
		EXPENSE_RECORDTIME TIMESTAMP DEFAULT current_timestamp,
        PRIMARY KEY (EXPENSE_ID),
        FOREIGN KEY (USER_ID) references USERS(USER_ID) ON DELETE cascade,
        FOREIGN KEY (CATEGORY_ID) references CATEGORY(CATEGORY_ID) ON DELETE cascade
        );

-- Category table:- It list downs the categories based on the type income and expense
CREATE TABLE IF NOT EXISTS CATEGORY (
    CATEGORY_ID INT NOT NULL AUTO_INCREMENT,
    CATEGORY_NAME VARCHAR(100) NOT NULL,
    USER_ID INT NULL, -- Null for predefined categories, set for user-defined ones
    PRIMARY KEY (CATEGORY_ID),
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE
);

-- select firstname,lastname,category_name from users u join category c on u.user_id = c.user_id where c.user_id=1;


CREATE TABLE IF NOT EXISTS SPRING_SESSION (
    PRIMARY_ID CHAR(36) NOT NULL,
    SESSION_ID CHAR(36) NOT NULL,
    CREATION_TIME BIGINT NOT NULL,
    LAST_ACCESS_TIME BIGINT NOT NULL,
    MAX_INACTIVE_INTERVAL INT NOT NULL,
    EXPIRY_TIME BIGINT NOT NULL,
    PRINCIPAL_NAME VARCHAR(100),
    CONSTRAINT SPRING_SESSION_PK PRIMARY KEY (PRIMARY_ID)
) ENGINE=InnoDB;


--select * from category;
--select * from expense;

-- CREATE INDEX IF NOT EXISTS SPRING_SESSION_IX1 ON SPRING_SESSION (EXPIRY_TIME);
-- CREATE INDEX IF NOT EXISTS SPRING_SESSION_IX2 ON SPRING_SESSION (SESSION_ID);
-- CREATE INDEX IF NOT EXISTS SPRING_SESSION_IX3 ON SPRING_SESSION (PRINCIPAL_NAME);
        