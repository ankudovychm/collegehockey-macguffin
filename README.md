# CollegeHockey-macguffin
 what if college hockey had a Macguffin?

This is a python script that tracks a hypothetical Macguffin for college hockey. The output for todays date (11.06.2024) is in the /data folder. 

In the script, the calls to 
* fetch_team_conference_data(teams_csv_name)
* HistoricResults(1900,2023,hist_csv_name)

are commented out because they are unlikely to change throughout time. Espechially HistoricResults which is also cosntly in terms of calling to the CHN site for data. They create teams.csv and historic.csv respectively so you likely do not need to run these either. 

Running this file will give you the most up to data info based on results as they post to CHNs site. 
