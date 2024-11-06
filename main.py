import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import csv


def getResults(season):
    """
    Gets the results for a specific year from CHN.
    :param season: string of season in YYYYYYYY format. For example the 1901 - 1902 season should be
    entered as '19011902'
    :return: df: all games for a sepcific
    """
    # Fetch the webpage content
    url = 'https://www.collegehockeynews.com/schedules/?season=' + season
    response = requests.get(url)
    if response.status_code == 200:
        page_content = response.text
    else:
        raise Exception(f'Failed to retrieve content: {response.status_code}')

    # Parse the HTML content
    soup = BeautifulSoup(page_content, 'html.parser')

    # Locate the table
    table = soup.find('table', {'class': 'data schedule full'})
    if not table:
        raise Exception('Table with class "data schedule full" not found.')

    # Define headers
    headers = ['Date', 'Away', 'AwayScore', '', 'Home', 'HomeScore']  # Add 'Date' as the first column

    # Extract table rows
    rows = []
    current_date = None  # Variable to store the latest date encountered

    for tr in table.find('tbody').find_all('tr'):
        cells = tr.find_all(['td', 'th'])
        row = [cell.get_text(strip=True) for cell in cells]

        # Check if the row contains a date (assuming it's in the first column)
        if len(row) == 1:  # Single cell rows could indicate a date
            if "," in row[0]:  # Simple date check by comma presence
                try:
                    # Remove the day of the week if present
                    date_str = row[0].split(', ', 1)[1] if ', ' in row[0] else row[0]
                    # Convert date string to datetime object
                    current_date = datetime.strptime(date_str, "%B %d, %Y").date()
                except ValueError:
                    pass
            continue
        elif row[2] is None:  # Skip non-game info like "Non-Conference"
            continue
        elif current_date:  # Assign current date to game rows
            rows.append([current_date] + row[:5])  # Limit to 5 columns plus date

    # Create DataFrame
    return pd.DataFrame(rows, columns=headers)


def ResultsMatrix(df):
    """
    Turns the results into a listing of team, date, result, and the opposing team ("Against").
    Each game turns into two rows (one for each team).

    :param df: the DataFrame that has the season data
    :return: a DataFrame in the specified format
    """
    # Initialize a list to store the rows for the new DataFrame
    results_data = []

    # Iterate over each row in the input DataFrame
    for index, row in df.iterrows():
        date = row['Date']
        away_team = row['Away']
        away_score = row['AwayScore']
        home_team = row['Home']
        home_score = row['HomeScore']

        # Determine the result for each team
        if away_score > home_score:
            away_result = 'Win'
            home_result = 'Loss'
        elif away_score < home_score:
            away_result = 'Loss'
            home_result = 'Win'
        else:
            away_result = 'Tie'
            home_result = 'Tie'

        # Append the result for the away team, including the opposing team in "Against"
        results_data.append({
            'Date': date,
            'Team': away_team,
            'Result': away_result,
            'Against': home_team
        })

        # Append the result for the home team, including the opposing team in "Against"
        results_data.append({
            'Date': date,
            'Team': home_team,
            'Result': home_result,
            'Against': away_team
        })

    # Create a new DataFrame from the results_data
    results_df = pd.DataFrame(results_data, columns=['Date', 'Team', 'Result', 'Against'])

    return results_df


def MatrixYear(season):
    """
    Just does the above functions for a certain year to get a matrix for that year
    :param season:
    :return:
    """
    df = getResults(season)
    results = ResultsMatrix(df)

    return results


def HistoricResults(startYear, EndYear, output_file):
    """
    Pulling data from 100+ years is a lot of computing power and it is unlikely that the histroic data will change, so
    this allows users to export to csv the prev seasons data so that it does not have to be run every time
    the file runs.

    :param startYear: The starting year of the first season to collect
    :param EndYear: The starting year of the last season to collect
    :param output_file: the name of the csv file to output to
    :return:
    """
    historic_data = []
    for year in range(startYear, EndYear + 1):
        season = str(year) + str(year + 1)

        historic_data.append(MatrixYear(season))
        print("Completed " + season)

    final_historic_df = pd.concat(historic_data, ignore_index=True)

    final_historic_df.to_csv(output_file, index=False)
    print("Wrote to " + output_file)

    return final_historic_df


def CurrentResults(team_data, csvfile, season):
    """
    Combines the csv to the current data for the season and also filter it to only be current teams
    :param team_data: the csv with the teams
    :param csvfile:the file that has the historic data
    :param season:the new season to add
    :return:
    """
    # Read in the current valid teams from the team_data CSV
    valid_teams = pd.read_csv(team_data)['Team'].tolist()

    new = MatrixYear(season)

    historic = pd.read_csv(csvfile)

    all_results = pd.concat([historic, new], ignore_index=True)

    # Filter out rows where the team or opponent is not in valid_teams
    all_results_filtered = all_results[
        (all_results['Team'].isin(valid_teams)) &
        (all_results['Against'].isin(valid_teams))
        ]

    return all_results_filtered


def fetch_team_conference_data(output_csv):
    """
    Gets the team data from CHN
    :param output_csv: the file name of where the data should live
    :return: csv with all teams and their conferences
    """
    # Static URL for the team and conference data
    url = 'https://www.collegehockeynews.com/reports/team/'

    # Send a GET request to the URL
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for HTTP errors

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the first table on the page
    table = soup.find('table')

    if not table:
        raise ValueError("Could not find a table on the page.")

    # Initialize variables
    data = []
    current_conference = None

    # Iterate through the table rows
    for row in table.find_all('tr'):
        cells = row.find_all('td')
        if len(cells) == 1:
            # This row is a conference header
            current_conference = cells[0].get_text(strip=True)
        elif len(cells) > 1 and current_conference:
            # This row is a team entry
            team_name = cells[0].get_text(strip=True)
            data.append([team_name, current_conference])

    # Write data to CSV
    with open(output_csv, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Write header
        writer.writerow(['Team', 'Conference'])
        # Write team and conference data
        writer.writerows(data)

    print(f"Data successfully written to {output_csv}")


def macguffin(data_df, outfile):
    """
    Inputs all the data and returns back both a list of the Macguffin over time and prints the current one out
    :param data_df: the data to use
    :param outfile: where to put the historic csv
    :return:
    """

    data_df['Date'] = pd.to_datetime(data_df['Date']).dt.date
    entries = [["Date", "Team"]]

    # Find the first row where the Result is "Win"
    first_win = data_df.loc[data_df['Result'] == 'Win'].iloc[0]
    currentteam = first_win['Team']
    currentdate = first_win['Date']

    # Add first entry
    entries.append([currentdate, currentteam])

    # Keeps going into there are now takers of the macguffin
    while True:

        # Find the next loss for the current team after the current date
        next_winner = data_df.loc[
            (data_df['Team'] == currentteam) &
            (data_df['Date'] > currentdate) &
            (data_df['Result'] == "Loss")
            ]

        # Check if next_winner has any rows; if not, exit the loop
        if next_winner.empty:
            break

        # Get the earliest entry from next_winner
        earliest_entry = next_winner.sort_values(by='Date').iloc[0]

        # Update current team and date to continue the sequence
        currentteam = earliest_entry['Against']
        currentdate = earliest_entry['Date']

        # Append the date and team to entries
        entries.append([currentdate, currentteam])

    print("As of", currentdate, "the current MacGuffin holder is", currentteam)
    with open(outfile, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(entries)
    return [currentteam, str(currentdate)]


def ReverseMacguffin(data_df, outfile):
    """
    Inputs all the data and returns back both a list of the reverse Macguffin over time and prints the current one out
    :param data_df: the data to use
    :param outfile: where to put the historic csv
    :return:
    """

    data_df['Date'] = pd.to_datetime(data_df['Date']).dt.date
    entries = [["Date", "Team"]]

    # Find the first row where the Result is "Win"
    first_win = data_df.loc[data_df['Result'] == 'Loss'].iloc[0]
    currentteam = first_win['Team']
    currentdate = first_win['Date']

    # Add first entry
    entries.append([currentdate, currentteam])

    # Keeps going into there are now takers of the macguffin
    while True:

        # Find the next loss for the current team after the current date
        next_winner = data_df.loc[
            (data_df['Team'] == currentteam) &
            (data_df['Date'] > currentdate) &
            (data_df['Result'] == "Win")
            ]

        # Check if next_winner has any rows; if not, exit the loop
        if next_winner.empty:
            break

        # Get the earliest entry from next_winner
        earliest_entry = next_winner.sort_values(by='Date').iloc[0]

        # Update current team and date to continue the sequence
        currentteam = earliest_entry['Against']
        currentdate = earliest_entry['Date']

        # Append the date and team to entries
        entries.append([currentdate, currentteam])

    print("As of", currentdate, "the current Reverse MacGuffin holder is", currentteam)
    with open(outfile, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(entries)
    return [currentteam, str(currentdate)]


def Conf_Macguffins(data_df, teams_csv, target_conference):
    """
    Gets and writes the reverse and macguffin for a specific confernce
    :param data_df: the full data of games matrix
    :param teams_csv: the csv that hodls teams
    :param target_conference: the confernce to target for this
    :return:
    """

    teams_df = pd.read_csv(teams_csv)
    # Filter for the target conference and return a list of team names
    team_list = teams_df[teams_df['Conference'] == target_conference]['Team'].tolist()

    # Returns only the data of the in-conference teams
    filtered_df = data_df[
        data_df['Team'].isin(team_list) & data_df['Against'].isin(team_list)
        ].copy()

    # returns [[macguffteam, year],[reverseteam, year]]
    macguff = macguffin(filtered_df, "data/conf/" + target_conference + "macguffin.csv")

    RevMacguff = ReverseMacguffin(filtered_df, "data/conf/" + target_conference + "reverse-macguffin.csv")

    return [macguff, RevMacguff]


def all_conf(data_df, teams_csv,outfile):
    csv_lines = [['Conference','MacGuffin: As of','Reverse MacGuffin: As of']]
    confs = pd.read_csv(teams_csv)['Conference'].unique().tolist()

    for each in confs:
        data = Conf_Macguffins(data_df, teams_csv, each)
        csv_lines.append([each,data[0][0]+": "+data[0][1],data[1][0]+": "+data[1][1]])

    with open(outfile, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(csv_lines)


hist_csv_name = "historic.csv"
teams_csv_name = 'teams.csv'

# Setup functions
# fetch_team_conference_data(teams_csv_name)
# HistoricResults(1900,2023,hist_csv_name)

all_data = CurrentResults(teams_csv_name, hist_csv_name, "20242025")


macguffin(all_data,"data/macguffin.csv")
ReverseMacguffin(all_data,"data/reverse-macguffin.csv")
all_conf(all_data, teams_csv_name,"data/ConfMcguffins.csv")

