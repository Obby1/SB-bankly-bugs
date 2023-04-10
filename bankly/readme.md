# To set up the app:
> createdb bankly
 createdb bankly_test
 psql bankly
    \i data.sql 
 \c bankly_test
    \i data.sql 
 node server.js

# To create an admin, create regular user first with auth/register route.
> {
        "username": "new_user",
        "password": "new_password",
        "first_name": "new_first",
        "last_name": "new_last",
        "email": "new@newuser.com",
        "phone": "1233211221"
      }

## In PSQL, update user (username 'new_user') to admin:
> PSQL Bankly
    UPDATE users
    SET admin = true
    WHERE username = 'new_user';

## Once you login with admin, be sure to list admin token in JSON body as "_token":
> {
	"_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld191c2VyIiwiYWRtaW4iOnRydWUsImlhdCI6MTY4MTE0NDY0OX0.exbFdCgZ8epJ9bzPHhXZTAA01SG6kL5-y7EfEp_dmKw"
}

