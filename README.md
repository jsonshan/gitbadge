# gitbadge

## Running

### Frontend

1. Install dependencies with `npm install`

2. Copy the `env.sample` file and rename it to `.env`. You will need to fill in all of the variables:
   ```
   DATABASE_URL="Supabase postgresql database url"
   AUTH_DRIZZLE_URL="Drizzle auth url"
   AUTH_SECRET="Authjs secret string"
   AUTH_GITHUB_ID="Github Oauth app id"
   AUTH_GITHUB_SECRET="Github Oauth app secret"
   ```
3. Then run the app using `npm run dev`

### Worker

1. Install dependencies with pip install -r requirements.txt
2. Copy the `env.sample` file and rename it to `.env`. You will need to fill in all of the variables:
   ```
   GITHUB_TOKEN="Github Oauth app secret"
   USER="Postgresql DB user"
   PASSWORD="Postgresql password to DB"
   HOST="Postgresql host url"
   PORT="Postgrsql port"
   DBNAME="POstgresql db name"
   ```
3. Then run the worker using `python main.py`

