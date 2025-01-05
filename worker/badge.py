# users = select all users
# for user in users:
#   badges = select * from gitbadges where user_id = user.id
#   repos = get_repo(user)
#   night_owl = has_night_owl_badge(user, repos)
#   ..all badge checks here for that user..
#   if doesn't have some badge:
#      insert gitbadges (id = random_uuid, user_id = user.id, badge_id = some badge id)
# 6 badges only 6 ids will exist per user maximum 
# random_uuid = below code 
      # >>> import uuid

      # >>> # Convert a UUID to a string of hex digits in standard form
      # >>> str(uuid.uuid4())
      # 'f50ec0b7-f960-400d-91f0-c42a6d44e3d0'

import psycopg2
from dotenv import load_dotenv
import uuid
import tokenVal as tokenVal
import requests
import os
from datetime import datetime

GITHUB_TOKEN = tokenVal.getToken()

###########################################################################

def fetchUsers():
    # Load environment variables from .env
    load_dotenv()

    # Fetch variables
    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")

    # Connect to the database
    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        
        # Create a cursor to execute SQL queries
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM public.user")
        result = (cursor.fetchall())
        users = []
        for user in result:
            users.append(user[5])

        cursor.close()
        connection.close()

    except Exception as e:
        print(f"Failed to connect: {e}")
        
    return users

###########################################################################



def getUserID(user_name):
  
    # Load environment variables from .env
    load_dotenv()

    # Fetch variables
    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")

    user_id = None

    # Connect to the database
    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        
        # Create a cursor to execute SQL queries
        cursor = connection.cursor()
        
        cursor.execute("SELECT id FROM public.user WHERE username= %s", (user_name,))
        result = (cursor.fetchall())
        if result:
            user_id = result[0]
        cursor.close()
        connection.close()

    except Exception as e:
        print(f"Failed to connect: {e}")
        
    return user_id

############################################################


def fetchBadges(user_id):
    # Load environment variables from .env
    load_dotenv()

    # Fetch variables
    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")

    # Connect to the database
    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        
        # Create a cursor to execute SQL queries
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM gitbadge WHERE user_id = %s", (user_id,))
        result = (cursor.fetchall())
        badges = []
        for entry in result:
            badges.append(entry[2])

        cursor.close()
        connection.close()

    except Exception as e:
        print(f"Failed to connect: {e}")
    return badges    

############################################################

def get_repos(user):

  GITHUB_TOKEN = tokenVal.getToken()
  USERNAME = user

  BASE_URL = "https://api.github.com"
  headers = {
      "Accept": "application/vnd.github+json",
      "Authorization": f"Bearer {GITHUB_TOKEN}",
      "X-GitHub-Api-Version": "2022-11-28",
  }

  url = f"{BASE_URL}/users/{USERNAME}/repos"

  repos = requests.get(url, headers=headers)

  return repos.json()

#############################################################

BASE_URL = "https://api.github.com"
NIGHT_START = 21
NIGHT_END = 6

# Helper function to check if a commit is made at night
def is_night_commit(date_str):
    """Returns True if the commit is made between 9 PM and 6 AM."""
    date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    hour = date.hour
    return hour >= NIGHT_START or hour < NIGHT_END

# Function to check night owl badge status
def check_night_owl_badge(USERNAME, repos):

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    night_owl = 0

    for repo in repos[:10]:
        repo_name = repo['name']
        commits_url = f"{BASE_URL}/repos/{USERNAME}/{repo_name}/commits"
        commits_response = requests.get(commits_url, headers=headers)

        if commits_response.status_code == 200:
            commits = commits_response.json()
            if commits:
                last_commit_date = commits[0]['commit']['author']['date']
                if is_night_commit(last_commit_date):
                    night_owl += 1
        else:
            print(f"Failed to fetch commits for {repo_name}: {commits_response.status_code}")

    if night_owl / 10 >= 0.6:
        # print("You are a certified night owl")
        return True
    # else:
        # print("You're not a night owl")
    return False

#####################################################

EARLY_BIRD_START = 6  
EARLY_BIRD_END = 11    

def is_early_bird_commit(date_str):
    date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    hour = date.hour
    return EARLY_BIRD_START <= hour <= EARLY_BIRD_END

def check_early_bird_badge(USERNAME, repos):

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    early_bird = 0

    for repo in repos[:10]:
        repo_name = repo['name']
        commits_url = f"{BASE_URL}/repos/{USERNAME}/{repo_name}/commits"
        commits_response = requests.get(commits_url, headers=headers)

        if commits_response.status_code == 200:
            commits = commits_response.json()
            if commits:
                last_commit_date = commits[0]['commit']['author']['date']
                if is_early_bird_commit(last_commit_date):
                    early_bird += 1
        else:
            print(f"Failed to fetch commits for {repo_name}: {commits_response.status_code}")

    if early_bird / 10 >= 0.6:
        # print("You are a certified early bird!")
        return True
    # else:
        # print("You're not an early bird.")
    return False


##################################################


def check_polyglot_coder_badge(username, repos):
    
    headers = {
      "Accept": "application/vnd.github+json",
      "Authorization": f"Bearer {GITHUB_TOKEN}",
      "X-GitHub-Api-Version": "2022-11-28",
    }

    polyglot_count = 0

    for repo in repos:
      languages = set()

      lang_url = repo.get("languages_url")
      if not lang_url:
          continue
      lang_response = requests.get(lang_url, headers=headers)
      lang = lang_response.json()
      languages.update(lang.keys())

      if len(languages) >= 3:
        polyglot_count += 1  

    if polyglot_count / len(repo) >= 0.6:
      return True
    return False




##################################################################

from datetime import datetime, timedelta

def check_season_badge(username, repos):
    
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    base_url = "https://api.github.com"
    repos_url = f"{base_url}/users/{username}/repos"

    one_year_ago = datetime.now() - timedelta(days=365)

    seasons = {"Spring": 0, "Summer": 0, "Autumn": 0, "Winter": 0}

    for repo in repos:
        repo_name = repo.get("name")
        if not repo_name:
            continue

        commits_url = f"{base_url}/repos/{username}/{repo_name}/commits"
        params = {"since": one_year_ago.isoformat()}
        commits_response = requests.get(commits_url, headers=headers, params=params)

        if commits_response.status_code != 200:
            print(f"Failed to fetch commits for {repo_name}: {commits_response.status_code}")
            continue

        commits = commits_response.json()

        for commit in commits:
            commit_date = commit["commit"]["author"]["date"]
            commit_month = datetime.fromisoformat(commit_date[:-1]).month

            if commit_month in [3, 4, 5]:
                seasons["Spring"] += 1
            elif commit_month in [6, 7, 8]:
                seasons["Summer"] += 1
            elif commit_month in [9, 10, 11]:
                seasons["Autumn"] += 1
            else:  # December, January, February
                seasons["Winter"] += 1

    # Determine the season with the most commits
    most_active_season = max(seasons, key=seasons.get)
    return most_active_season

####################################################################

def get_contribution_years(username):

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    base_url = "https://api.github.com"
    repos_url = f"{base_url}/users/{username}/repos"

    response = requests.get(repos_url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch repositories for {username}: {response.status_code}")
        return None, None

    repos = response.json()
    earliest_commit = None
    latest_commit = None

    for repo in repos:
        commits_url = repo.get("commits_url", "").replace("{/sha}", "")
        commits_response = requests.get(commits_url, headers=headers)
        if commits_response.status_code == 200:
            commits = commits_response.json()
            if commits:
                commit_dates = [
                    datetime.strptime(commit["commit"]["author"]["date"], "%Y-%m-%dT%H:%M:%SZ")
                    for commit in commits
                ]
                repo_earliest = min(commit_dates)
                repo_latest = max(commit_dates)

                if earliest_commit is None or repo_earliest < earliest_commit:
                    earliest_commit = repo_earliest
                if latest_commit is None or repo_latest > latest_commit:
                    latest_commit = repo_latest

    return earliest_commit, latest_commit

def check_year_badges(username):
    """
    Checks if the user qualifies for the 1-year or 5-year badge.
    """
    earliest_commit, latest_commit = get_contribution_years(username)

    if not earliest_commit or not latest_commit:
        return {"1_year_badge": False, "5_year_badge": False}

    contribution_span = (latest_commit - earliest_commit).days / 365
    return {
        "1_year_badge": contribution_span >= 1,
        "5_year_badge": contribution_span >= 5,
    }

####################################################################

def insertBadge(user_id, badge_id):
    # Generate a random UUID for the `id` column
    random_uuid = str(uuid.uuid4())

    # Load environment variables from .env
    load_dotenv()

    # Fetch variables
    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")

    try:
    
        # Connect to the database
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )

        # Create a cursor to execute SQL queries
        cursor = connection.cursor()

        # Parameterized query to insert into `gitbadge`
        query = """
        INSERT INTO gitbadge (id, user_id, badge_id)
        VALUES (%s, %s, %s)
        """
        cursor.execute(query, (random_uuid, user_id, badge_id))
        
        # Commit the transaction
        connection.commit()
        
        cursor.close()
        connection.close()

    except Exception as e:
        print(f"Failed to insert into gitbadge: {e}")

#############################################

def assign_badges(users):
  for user in users:
    repos = get_repos(user)
    user_id = getUserID(user)
    badges = fetchBadges(user_id)

    season_badge = check_season_badge(user, repos)

    if check_night_owl_badge(user, repos) and 'night-owl' not in badges:
      insertBadge(user_id, 'night-owl')
    if check_early_bird_badge(user, repos) and 'early-bird' not in badges:
      insertBadge(user_id, 'early_bird')
    if check_polyglot_coder_badge(user, repos) and 'polyglot' not in badges:
      insertBadge(user_id, 'polyglot')
    if season_badge == 'Summer' and 'summer' not in badges:
      insertBadge(user_id, 'summer')
    elif season_badge == 'Winter' and 'winter' not in badges:
      insertBadge(user_id, 'winter')
    elif season_badge == 'Spring' and 'spring' not in badges:
      insertBadge(user_id, 'spring')
    elif season_badge == 'Autumn' and 'autumn' not in badges:
      insertBadge(user_id, 'autumn')
    years = check_year_badges(user) 
    if years['1_year_badge']:
        insertBadge(user_id, 'one_year')
        if years['5_year_badge']:
            insertBadge(user_id, 'five_years')
    
    