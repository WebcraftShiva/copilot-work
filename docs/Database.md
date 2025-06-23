### To create user in database:  ###

# 1.Currently creating user in bf_users table: (To check auth related things)

mysql -u root testingdb -e "
INSERT INTO bf_users (
    username, 
    password, 
    user_email, 
    user_fname, 
    user_lname, 
    user_phone, 
    user_phone_verified,
    status, 
    is_active,
    user_email_verified,
    date_added,
    date_added_date
) VALUES 
('testuser', '482c811da5d5b4bc6d497ffa98491e38', 'test@example.com', 'Test', 'User', '1234567890', 'y', 'a', 'y', 'y', NOW(), CURDATE()),
('apiuser', '482c811da5d5b4bc6d497ffa98491e38', 'api@example.com', 'API', 'User', '1234567891', 'y', 'a', 'y', 'y', NOW(), CURDATE()),
('admin', '482c811da5d5b4bc6d497ffa98491e38', 'admin@example.com', 'Admin', 'User', '1234567892', 'y', 'a', 'y', 'y', NOW(), CURDATE()),
('phoneuser', '482c811da5d5b4bc6d497ffa98491e38', 'phone@example.com', 'Phone', 'User', '9876543210', 'y', 'a', 'y', 'y', NOW(), CURDATE()),
('emailuser', '482c811da5d5b4bc6d497ffa98491e38', 'email@example.com', 'Email', 'User', '5555555555', 'y', 'a', 'y', 'y', NOW(), CURDATE()),
('inactiveuser', '482c811da5d5b4bc6d497ffa98491e38', 'inactive@example.com', 'Inactive', 'User', '1111111111', 'y', 'i', 'y', 'y', NOW(), CURDATE()),
('redflaguser', '482c811da5d5b4bc6d497ffa98491e38', 'redflag@example.com', 'RedFlag', 'User', '2222222222', 'y', 'a', 'y', 'e', NOW(), CURDATE()),
('claimeduser', '482c811da5d5b4bc6d497ffa98491e38', 'claimed@example.com', 'Claimed', 'User', '3333333333', 'y', 'a', 'y', 'c', NOW(), CURDATE());
"
"

# 2.Check User in bf_users if created or not:

mysql -u root testingdb -e "SELECT id, username, user_email, status, is_active FROM bf_users;"

# Endpoint: auth/login: 

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# md5 to bycrypt changing:

- creation of user with md5 password:

mysql -u root -D testingdb -e "INSERT INTO bf_users (username, password, user_email, user_fname, user_lname, user_phone, status, is_active) VALUES ('md5user', 'ea5e48a7d2c2cd8a29d5ab68cbe77037', 'md5user@example.com', 'MD5', 'User', '1234567999', 'a', 'y');"

mysql -u root -D testingdb -e "SELECT id, username, password, user_email FROM bf_users WHERE username = 'md5user';"

curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"username\":\"md5user\", \"password\":\"md5test123\"}"

