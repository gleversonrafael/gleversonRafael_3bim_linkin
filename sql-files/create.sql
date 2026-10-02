DROP TABLE IF EXISTS POST, APP_ADMIN, ACCOUNT;

CREATE TABLE IF NOT EXISTS ACCOUNT(
	unique_username TEXT PRIMARY KEY,
	
	account_name VARCHAR(100) NOT NULL,
	account_email TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS APP_ADMIN(
	admin_id TEXT PRIMARY KEY,
	CONSTRAINT fk_admin_id 
	FOREIGN KEY(admin_id) REFERENCES ACCOUNT(unique_username),
	UNIQUE(admin_id),
	
	admin_canManageUsers BOOL DEFAULT FALSE,
	admin_canManagePosts BOOL DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS POST(
	post_id INTEGER PRIMARY KEY,
	creator_id TEXT,
	CONSTRAINT fk_creator_id 
	FOREIGN KEY(creator_id) REFERENCES ACCOUNT(unique_username),
	
	img_id SERIAL NOT NULL,
	UNIQUE(img_id),
	
	caption TEXT NOT NULL
);
